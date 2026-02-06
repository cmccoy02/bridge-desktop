import Store from 'electron-store'

export interface BridgeConsoleSettings {
  consoleUrl: string
  apiToken: string
  githubUsername: string
  autoUpload: boolean
}

export interface ConsoleUploadResult {
  success: boolean
  tdScore?: number
  tdDelta?: number
  error?: string
}

const store = new Store()
const SETTINGS_KEY = 'bridge-console-settings'

export function getBridgeConsoleSettings(): BridgeConsoleSettings {
  return store.get(SETTINGS_KEY, {
    consoleUrl: 'http://localhost:3000',
    apiToken: '',
    githubUsername: '',
    autoUpload: true
  }) as BridgeConsoleSettings
}

export function saveBridgeConsoleSettings(settings: BridgeConsoleSettings): BridgeConsoleSettings {
  store.set(SETTINGS_KEY, settings)
  return settings
}

export async function testBridgeConsoleConnection(settings: BridgeConsoleSettings): Promise<{ ok: boolean; message?: string }> {
  const baseUrl = (settings.consoleUrl || 'http://localhost:3000').replace(/\/$/, '')
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${baseUrl}/api/health`, {
      signal: controller.signal,
      headers: settings.apiToken ? { Authorization: `Bearer ${settings.apiToken}` } : undefined
    })

    clearTimeout(timeout)

    if (response.ok) {
      return { ok: true }
    }

    return { ok: false, message: `Status ${response.status}` }
  } catch (error: any) {
    return { ok: false, message: error?.message || 'Connection failed' }
  }
}

export async function sendScanToConsole(scanResults: any, settings: BridgeConsoleSettings): Promise<ConsoleUploadResult> {
  const baseUrl = (settings.consoleUrl || 'http://localhost:3000').replace(/\/$/, '')
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(`${baseUrl}/api/scans`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiToken}`
      },
      body: JSON.stringify({
        repository_url: scanResults.repositoryUrl || scanResults.repository,
        scan_date: scanResults.scanDate,
        metrics: {
          dependencies: {
            outdated_count: scanResults.dependencies?.outdated?.length || 0,
            critical_security_vulnerabilities: scanResults.dependencies?.vulnerabilities?.critical || 0,
            circular_dependencies: scanResults.circularDependencies?.count || 0
          },
          code_quality: {
            dead_code_files: scanResults.deadCode?.deadFiles?.length || 0,
            duplicate_code_percentage: 0,
            average_complexity: 0
          },
          testing: {
            coverage_percentage: scanResults.testCoverage?.coveragePercentage || 0,
            uncovered_critical_files: scanResults.testCoverage?.uncoveredCriticalFiles?.map((f: any) => f.file) || []
          },
          documentation: {
            missing_readme_sections: scanResults.documentation?.missingReadmeSections || [],
            undocumented_functions: scanResults.documentation?.undocumentedFunctions || 0
          }
        },
        engineer_github_username: settings.githubUsername
      })
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return { success: false, error: `Console responded with ${response.status}` }
    }

    const data = await response.json().catch(() => ({}))
    return {
      success: true,
      tdScore: data?.td_score,
      tdDelta: data?.td_delta
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send scan to Bridge-Console'
    }
  }
}
