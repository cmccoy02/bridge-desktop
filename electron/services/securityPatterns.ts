import fs from 'fs/promises'
import path from 'path'

export interface SecurityPatternFinding {
  file: string
  line: number
  column?: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  cwe?: string
  owasp?: string
  title: string
  description: string
  suggestion: string
  snippet: string
}

interface SecurityPatternDefinition {
  id: string
  severity: SecurityPatternFinding['severity']
  category: string
  cwe: string
  owasp: string
  title: string
  description: string
  suggestion: string
  regex: RegExp
  appliesTo: string[]
}

const DEFAULT_EXCLUDES = [
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.bridge'
]

const LANGUAGE_EXTENSIONS: Record<string, string[]> = {
  javascript: ['.js', '.jsx', '.mjs', '.cjs'],
  typescript: ['.ts', '.tsx'],
  node: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'],
  python: ['.py'],
  ruby: ['.rb']
}

const PATTERNS: SecurityPatternDefinition[] = [
  {
    id: 'critical-eval',
    severity: 'critical',
    category: 'eval',
    cwe: 'CWE-94',
    owasp: 'A03:2021',
    title: 'Dynamic Code Execution',
    description: 'Use of eval/new Function can execute untrusted code.',
    suggestion: 'Remove dynamic execution. Use safe parser or explicit map of allowed operations.',
    regex: /\b(eval\s*\(|new\s+Function\s*\()/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'critical-exec-concat',
    severity: 'critical',
    category: 'exec-concat',
    cwe: 'CWE-78',
    owasp: 'A03:2021',
    title: 'Command Injection Risk',
    description: 'child_process.exec with concatenated input may allow command injection.',
    suggestion: 'Use execFile/spawn with explicit args; never concatenate user input into shell command strings.',
    regex: /child_process\.exec\s*\(([^)]*[+`$][^)]*)\)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'critical-hardcoded-secret',
    severity: 'critical',
    category: 'hardcoded-secret',
    cwe: 'CWE-798',
    owasp: 'A07:2021',
    title: 'Hardcoded Secret',
    description: 'Potential API key, token, or credential literal detected in code.',
    suggestion: 'Move secret to secure environment variable or secret manager and rotate the credential.',
    regex: /(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36,}|sk_(live|test)_[A-Za-z0-9]{16,}|-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----|api[_-]?key\s*[:=]\s*['\"][^'\"]{8,}['\"]|secret\s*[:=]\s*['\"][^'\"]{8,}['\"]|token\s*[:=]\s*['\"][^'\"]{8,}['\"])/,
    appliesTo: ['javascript', 'typescript', 'python', 'ruby']
  },
  {
    id: 'high-innerhtml',
    severity: 'high',
    category: 'innerhtml',
    cwe: 'CWE-79',
    owasp: 'A03:2021',
    title: 'Potential XSS Sink',
    description: 'innerHTML or dangerouslySetInnerHTML can introduce XSS when input is not sanitized.',
    suggestion: 'Use textContent or vetted sanitization library before rendering HTML.',
    regex: /(innerHTML\s*=|dangerouslySetInnerHTML)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'high-sql-concat',
    severity: 'high',
    category: 'sql-concat',
    cwe: 'CWE-89',
    owasp: 'A03:2021',
    title: 'Potential SQL Injection',
    description: 'SQL query appears built via string concatenation/interpolation.',
    suggestion: 'Use parameterized queries / prepared statements.',
    regex: /(SELECT|UPDATE|INSERT|DELETE)[\s\S]{0,80}(\+|`.*\$\{)/i,
    appliesTo: ['javascript', 'typescript', 'python', 'ruby']
  },
  {
    id: 'high-json-parse-user-input',
    severity: 'high',
    category: 'json-parse-user-input',
    cwe: 'CWE-20',
    owasp: 'A05:2021',
    title: 'Unsafe JSON.parse Input',
    description: 'JSON.parse appears to consume request/body/query input directly.',
    suggestion: 'Validate input and wrap JSON.parse in try/catch with strict schema validation.',
    regex: /JSON\.parse\s*\((req\.|request\.|ctx\.|event\.)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'high-disabled-ssl-verification',
    severity: 'high',
    category: 'disabled-ssl-verification',
    cwe: 'CWE-295',
    owasp: 'A02:2021',
    title: 'SSL Verification Disabled',
    description: 'TLS certificate verification appears disabled.',
    suggestion: 'Enable certificate verification and remove insecure TLS overrides.',
    regex: /(rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['\"]?0['\"]?)/,
    appliesTo: ['javascript', 'typescript', 'python']
  },
  {
    id: 'high-insecure-http',
    severity: 'high',
    category: 'insecure-http',
    cwe: 'CWE-319',
    owasp: 'A02:2021',
    title: 'Insecure HTTP Request',
    description: 'Non-localhost HTTP URL detected in network call.',
    suggestion: 'Use HTTPS endpoints for transport security.',
    regex: /(fetch|axios\.(get|post|put|delete)|request)\s*\(\s*['\"]http:\/\/(?!localhost|127\.0\.0\.1)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'medium-weak-random',
    severity: 'medium',
    category: 'weak-random',
    cwe: 'CWE-330',
    owasp: 'A02:2021',
    title: 'Weak Random Source',
    description: 'Math.random is not suitable for security-sensitive tokens.',
    suggestion: 'Use crypto.randomBytes / Web Crypto getRandomValues for security-sensitive values.',
    regex: /Math\.random\s*\(/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'medium-weak-hash',
    severity: 'medium',
    category: 'weak-hash',
    cwe: 'CWE-327',
    owasp: 'A02:2021',
    title: 'Weak Hash Algorithm',
    description: 'MD5/SHA1 usage detected.',
    suggestion: 'Prefer SHA-256/512 and modern password hashing (bcrypt/argon2/scrypt).',
    regex: /(md5\s*\(|sha1\s*\(|createHash\s*\(\s*['\"](md5|sha1)['\"])/i,
    appliesTo: ['javascript', 'typescript', 'python', 'ruby']
  },
  {
    id: 'medium-sensitive-console-log',
    severity: 'medium',
    category: 'sensitive-console-log',
    cwe: 'CWE-532',
    owasp: 'A09:2021',
    title: 'Sensitive Data Logging',
    description: 'console.log appears to log credential/token/password-like values.',
    suggestion: 'Remove sensitive logging or redact values before output.',
    regex: /console\.log\s*\([^)]*(password|secret|token|authorization|api[_-]?key)[^)]*\)/i,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'medium-open-redirect',
    severity: 'medium',
    category: 'open-redirect',
    cwe: 'CWE-601',
    owasp: 'A10:2021',
    title: 'Potential Open Redirect',
    description: 'Redirect target may come from user input without allowlisting.',
    suggestion: 'Validate redirect targets against an allowlist.',
    regex: /(res\.redirect|redirect\()\s*\((req\.|request\.|ctx\.)/,
    appliesTo: ['javascript', 'typescript']
  }
]

function getExtensions(languages?: string[]): string[] {
  if (!languages || languages.length === 0) {
    return Array.from(new Set(Object.values(LANGUAGE_EXTENSIONS).flat()))
  }

  const extensions = new Set<string>()
  for (const lang of languages) {
    for (const ext of LANGUAGE_EXTENSIONS[lang] || []) {
      extensions.add(ext)
    }
  }
  return Array.from(extensions)
}

function getLanguageFromExtension(ext: string): string {
  const entries = Object.entries(LANGUAGE_EXTENSIONS)
  for (const [language, extensions] of entries) {
    if (extensions.includes(ext)) {
      return language
    }
  }
  return 'unknown'
}

async function collectFiles(
  root: string,
  options: { exclude: string[]; extensions: string[] }
): Promise<string[]> {
  const files: string[] = []

  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (options.exclude.includes(entry.name)) continue
        await walk(path.join(dir, entry.name))
      } else {
        const ext = path.extname(entry.name).toLowerCase()
        if (options.extensions.includes(ext)) {
          files.push(path.join(dir, entry.name))
        }
      }
    }
  }

  await walk(root)
  return files
}

export async function scanRepoForSecurityPatterns(
  repoPath: string,
  options?: {
    exclude?: string[]
    languages?: string[]
    maxFindings?: number
  }
): Promise<SecurityPatternFinding[]> {
  const exclude = Array.from(new Set([...(options?.exclude || []), ...DEFAULT_EXCLUDES]))
  const extensions = getExtensions(options?.languages)
  const maxFindings = options?.maxFindings ?? 500

  const files = await collectFiles(repoPath, { exclude, extensions })
  const findings: SecurityPatternFinding[] = []

  for (const filePath of files) {
    if (findings.length >= maxFindings) break

    const content = await fs.readFile(filePath, 'utf-8').catch(() => '')
    if (!content) continue

    const lines = content.split(/\r?\n/)
    const relPath = path.relative(repoPath, filePath)
    const fileLanguage = getLanguageFromExtension(path.extname(filePath).toLowerCase())

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex]
      if (!line || line.trim().length === 0) continue

      for (const pattern of PATTERNS) {
        if (findings.length >= maxFindings) break
        if (!pattern.appliesTo.includes(fileLanguage) && !pattern.appliesTo.includes('node')) {
          continue
        }

        const match = line.match(pattern.regex)
        if (!match || match.index === undefined) continue

        findings.push({
          file: relPath,
          line: lineIndex + 1,
          column: match.index + 1,
          severity: pattern.severity,
          category: pattern.category,
          cwe: pattern.cwe,
          owasp: pattern.owasp,
          title: pattern.title,
          description: pattern.description,
          suggestion: pattern.suggestion,
          snippet: line.trim().slice(0, 400)
        })
      }
    }
  }

  return findings
}
