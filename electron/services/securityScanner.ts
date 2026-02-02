import { exec, spawn, ChildProcess } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export interface SecurityFinding {
  file: string
  line: number
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  code: string
  description: string
  cwe: string
  owasp: string
  solution?: string
  fixedCode?: string
}

export interface ScanResult {
  scanId: string
  repoPath: string
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  findings: SecurityFinding[]
  scannedAt: string
  duration: number
}

export interface ScanProgress {
  status: 'scanning' | 'analyzing' | 'generating-fixes' | 'complete' | 'error'
  progress: number
  message: string
  currentFile?: string
}

// Path to the agentic_fixer module
const AGENTIC_FIXER_PATH = path.join(__dirname, '../../agentic_fixer')

let pythonProcess: ChildProcess | null = null

export async function checkAgenticFixerAvailable(): Promise<boolean> {
  try {
    await fs.access(AGENTIC_FIXER_PATH)
    // Check if Python and required modules are available
    await execAsync('python3 -c "import flask"', { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

export async function runSecurityScan(
  repoPath: string,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const scanId = `scan-${Date.now()}`
  const startTime = Date.now()

  onProgress?.({
    status: 'scanning',
    progress: 0,
    message: 'Initializing security scan...'
  })

  try {
    // Check if agentic_fixer is available
    const available = await checkAgenticFixerAvailable()

    if (!available) {
      // Fall back to basic pattern detection
      return await runBasicSecurityScan(repoPath, scanId, onProgress)
    }

    // Run the Python security scanner
    return await runPythonSecurityScan(repoPath, scanId, startTime, onProgress)
  } catch (error) {
    console.error('Security scan failed:', error)
    throw error
  }
}

async function runPythonSecurityScan(
  repoPath: string,
  scanId: string,
  startTime: number,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = `
import sys
import json
sys.path.insert(0, '${AGENTIC_FIXER_PATH}')

from code_security_auto_fixer import repo_scanner, language_detector, pattern_detector

try:
    repo_path = '${repoPath.replace(/'/g, "\\'")}'

    # Detect languages
    languages = language_detector.detect(repo_path)
    print(json.dumps({'type': 'progress', 'status': 'scanning', 'progress': 20, 'message': f'Detected languages: {", ".join(languages)}'}))
    sys.stdout.flush()

    # Scan for patterns
    print(json.dumps({'type': 'progress', 'status': 'analyzing', 'progress': 40, 'message': 'Analyzing code patterns...'}))
    sys.stdout.flush()

    findings = pattern_detector.scan(repo_path, languages)

    print(json.dumps({'type': 'progress', 'status': 'complete', 'progress': 100, 'message': f'Found {len(findings)} security issues'}))
    sys.stdout.flush()

    # Output results
    result = {
        'type': 'result',
        'findings': findings
    }
    print(json.dumps(result))
    sys.stdout.flush()

except Exception as e:
    print(json.dumps({'type': 'error', 'message': str(e)}))
    sys.stdout.flush()
    sys.exit(1)
`

    const python = spawn('python3', ['-c', pythonScript], {
      cwd: AGENTIC_FIXER_PATH,
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    })

    let output = ''
    let findings: SecurityFinding[] = []

    python.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter((l: string) => l.trim())

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line)

          if (parsed.type === 'progress') {
            onProgress?.({
              status: parsed.status,
              progress: parsed.progress,
              message: parsed.message
            })
          } else if (parsed.type === 'result') {
            findings = parsed.findings.map((f: any) => ({
              file: f.file,
              line: f.line,
              issue: f.issue,
              severity: normalizeSeverity(f.severity),
              code: f.code,
              description: f.description || f.issue,
              cwe: f.cwe || 'CWE-Unknown',
              owasp: f.owasp || 'Unknown',
              solution: f.solution
            }))
          } else if (parsed.type === 'error') {
            reject(new Error(parsed.message))
          }
        } catch {
          output += line
        }
      }
    })

    python.stderr.on('data', (data) => {
      console.error('Python stderr:', data.toString())
    })

    python.on('close', (code) => {
      if (code === 0 || findings.length > 0) {
        const result: ScanResult = {
          scanId,
          repoPath,
          totalFindings: findings.length,
          criticalCount: findings.filter(f => f.severity === 'critical').length,
          highCount: findings.filter(f => f.severity === 'high').length,
          mediumCount: findings.filter(f => f.severity === 'medium').length,
          lowCount: findings.filter(f => f.severity === 'low').length,
          findings,
          scannedAt: new Date().toISOString(),
          duration: Date.now() - startTime
        }
        resolve(result)
      } else {
        reject(new Error('Security scan failed'))
      }
    })

    python.on('error', (error) => {
      reject(error)
    })
  })
}

// Basic pattern-based security scan (fallback when Python is not available)
async function runBasicSecurityScan(
  repoPath: string,
  scanId: string,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const startTime = Date.now()
  const findings: SecurityFinding[] = []

  // Security patterns to detect
  const patterns: { pattern: RegExp; issue: string; severity: 'critical' | 'high' | 'medium' | 'low'; cwe: string; owasp: string }[] = [
    // SQL Injection
    { pattern: /execute\s*\(\s*['"`].*\$|%s|{.*}.*['"`]/i, issue: 'sql-injection', severity: 'critical', cwe: 'CWE-89', owasp: 'A03:2021' },
    { pattern: /query\s*\(\s*['"`].*\+.*['"`]/i, issue: 'sql-injection', severity: 'critical', cwe: 'CWE-89', owasp: 'A03:2021' },

    // XSS
    { pattern: /innerHTML\s*=|document\.write\s*\(/i, issue: 'xss', severity: 'high', cwe: 'CWE-79', owasp: 'A03:2021' },
    { pattern: /dangerouslySetInnerHTML/i, issue: 'xss', severity: 'medium', cwe: 'CWE-79', owasp: 'A03:2021' },

    // Command Injection
    { pattern: /exec\s*\(|system\s*\(|shell_exec\s*\(/i, issue: 'command-injection', severity: 'critical', cwe: 'CWE-78', owasp: 'A03:2021' },
    { pattern: /subprocess\.call.*shell\s*=\s*True/i, issue: 'command-injection', severity: 'critical', cwe: 'CWE-78', owasp: 'A03:2021' },

    // Hardcoded Secrets
    { pattern: /password\s*=\s*['"][^'"]+['"]/i, issue: 'hardcoded-secret', severity: 'high', cwe: 'CWE-798', owasp: 'A07:2021' },
    { pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/i, issue: 'hardcoded-secret', severity: 'high', cwe: 'CWE-798', owasp: 'A07:2021' },
    { pattern: /secret\s*=\s*['"][^'"]+['"]/i, issue: 'hardcoded-secret', severity: 'high', cwe: 'CWE-798', owasp: 'A07:2021' },

    // Path Traversal
    { pattern: /\.\.\/|\.\.\\|path\.join.*\.\./i, issue: 'path-traversal', severity: 'high', cwe: 'CWE-22', owasp: 'A01:2021' },

    // Insecure Deserialization
    { pattern: /pickle\.loads|yaml\.load\s*\([^,)]+\)/i, issue: 'insecure-deserialization', severity: 'critical', cwe: 'CWE-502', owasp: 'A08:2021' },
    { pattern: /eval\s*\(|Function\s*\(/i, issue: 'code-injection', severity: 'critical', cwe: 'CWE-94', owasp: 'A03:2021' },

    // Weak Crypto
    { pattern: /md5\s*\(|sha1\s*\(/i, issue: 'weak-crypto', severity: 'medium', cwe: 'CWE-327', owasp: 'A02:2021' },

    // SSRF
    { pattern: /requests\.get\s*\(.*request\.|fetch\s*\(.*req\./i, issue: 'ssrf', severity: 'high', cwe: 'CWE-918', owasp: 'A10:2021' }
  ]

  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.php', '.java', '.go', '.rs', '.c', '.cpp']

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        if (['node_modules', '.git', 'vendor', 'deps', '_build', '__pycache__', 'venv', '.venv'].includes(entry.name)) {
          continue
        }

        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          const ext = path.extname(entry.name).toLowerCase()
          if (codeExtensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8')
              const lines = content.split('\n')
              const relPath = path.relative(repoPath, fullPath)

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]

                for (const { pattern, issue, severity, cwe, owasp } of patterns) {
                  if (pattern.test(line)) {
                    findings.push({
                      file: relPath,
                      line: i + 1,
                      issue,
                      severity,
                      code: line.trim(),
                      description: `Potential ${issue.replace(/-/g, ' ')} vulnerability detected`,
                      cwe,
                      owasp
                    })
                  }
                }
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  onProgress?.({ status: 'scanning', progress: 10, message: 'Scanning files...' })
  await scanDir(repoPath)

  onProgress?.({ status: 'complete', progress: 100, message: `Found ${findings.length} security issues` })

  return {
    scanId,
    repoPath,
    totalFindings: findings.length,
    criticalCount: findings.filter(f => f.severity === 'critical').length,
    highCount: findings.filter(f => f.severity === 'high').length,
    mediumCount: findings.filter(f => f.severity === 'medium').length,
    lowCount: findings.filter(f => f.severity === 'low').length,
    findings,
    scannedAt: new Date().toISOString(),
    duration: Date.now() - startTime
  }
}

function normalizeSeverity(severity: string): 'critical' | 'high' | 'medium' | 'low' {
  const s = severity.toLowerCase()
  if (s === 'critical' || s === 'error') return 'critical'
  if (s === 'high' || s === 'warning') return 'high'
  if (s === 'medium' || s === 'info') return 'medium'
  return 'low'
}

export async function generateSecurityFix(finding: SecurityFinding): Promise<string | null> {
  // Try to use the AI fixer from agentic_fixer if available
  const available = await checkAgenticFixerAvailable()

  if (!available) {
    return null
  }

  return new Promise((resolve) => {
    const pythonScript = `
import sys
import json
sys.path.insert(0, '${AGENTIC_FIXER_PATH}')

try:
    from code_security_auto_fixer.ai_fixer import AIFixer
    from code_security_auto_fixer.config import (
        GEMINI_API_BASE_URL, GEMINI_MODEL_NAME, GEMINI_API_KEY,
        GEMINI_ACCESS_TOKEN, GEMINI_TEMPERATURE, GEMINI_MAX_OUTPUT_TOKENS, GEMINI_CANDIDATE_COUNT
    )

    fixer = AIFixer(
        api_base_url=GEMINI_API_BASE_URL,
        model_name=GEMINI_MODEL_NAME,
        api_key=GEMINI_API_KEY,
        access_token=GEMINI_ACCESS_TOKEN,
        temperature=GEMINI_TEMPERATURE,
        max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
        candidate_count=GEMINI_CANDIDATE_COUNT
    )

    issue_data = ${JSON.stringify(finding)}
    result = fixer.generate_secure_solution(issue_data)
    print(json.dumps({'success': True, 'fix': result.get('fixed_code', '')}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`

    const python = spawn('python3', ['-c', pythonScript], {
      cwd: AGENTIC_FIXER_PATH
    })

    let output = ''

    python.stdout.on('data', (data) => {
      output += data.toString()
    })

    python.on('close', () => {
      try {
        const result = JSON.parse(output.trim())
        if (result.success) {
          resolve(result.fix)
        } else {
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    })

    python.on('error', () => {
      resolve(null)
    })
  })
}
