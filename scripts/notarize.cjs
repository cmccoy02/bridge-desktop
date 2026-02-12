const fs = require('fs')
const path = require('path')
const { notarize } = require('@electron/notarize')

/**
 * Electron Builder afterSign hook.
 * Skips gracefully when signing/notarization credentials are not configured.
 */
module.exports = async function notarizeApp(context) {
  const { electronPlatformName, appOutDir, packager } = context

  if (electronPlatformName !== 'darwin') {
    return
  }

  const appleId = process.env.APPLE_ID
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID

  if (!appleId || !appleIdPassword || !teamId) {
    console.log('[notarize] Skipping notarization (missing APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD / APPLE_TEAM_ID).')
    return
  }

  const appName = packager.appInfo.productFilename
  const appPath = path.join(appOutDir, `${appName}.app`)

  if (!fs.existsSync(appPath)) {
    console.log(`[notarize] Skipping notarization, app not found at ${appPath}`)
    return
  }

  console.log(`[notarize] Submitting ${appName} for notarization...`)
  await notarize({
    appBundleId: packager.appInfo.id,
    appPath,
    appleId,
    appleIdPassword,
    teamId
  })
  console.log('[notarize] Notarization complete.')
}
