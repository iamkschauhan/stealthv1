import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { initializeRecaptchaConfig } from 'firebase/auth'
import { getFirebaseApp, getFirebaseAuth } from './client'

let appCheckReady = false
let recaptchaConfigReady = false

/** Site key from Firebase / reCAPTCHA Enterprise (phone + App Check). */
export function getRecaptchaSiteKey(): string | undefined {
  const key = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY
  return key && key.length > 0 ? key : undefined
}

/**
 * App Check for production abuse protection.
 * Skipped in DEV by default — a bad/mismatched Enterprise key floods Auth with
 * `appCheck/recaptcha-error` and does not help local phone testing.
 * Set VITE_APP_CHECK_FORCE=true to exercise App Check locally.
 */
export function initAppCheck(): void {
  if (appCheckReady) return
  if (import.meta.env.DEV && import.meta.env.VITE_APP_CHECK_FORCE !== 'true') {
    return
  }

  const siteKey = getRecaptchaSiteKey()
  if (!siteKey) return

  // Typical Enterprise site keys look like 6L… — reject obvious placeholders
  if (siteKey.length < 20) {
    console.warn('App Check skipped: site key looks invalid')
    return
  }

  try {
    if (import.meta.env.DEV) {
      // Allows exchanging a debug token from the Console if App Check is enforced
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true
    }
    initializeAppCheck(getFirebaseApp(), {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })
    appCheckReady = true
  } catch (err) {
    console.warn('App Check init skipped:', err)
  }
}

/**
 * Prefetch Identity Platform reCAPTCHA Enterprise config for phone Auth.
 * In DEV we only enable test-mode verification and skip Enterprise prefetch —
 * `initializeRecaptchaConfig` often throws `recaptchaKey undefined` until
 * Console phone + rCE are fully linked.
 */
export async function initPhoneRecaptchaConfig(): Promise<void> {
  if (recaptchaConfigReady) return
  try {
    const auth = getFirebaseAuth()
    if (import.meta.env.DEV) {
      auth.settings.appVerificationDisabledForTesting = true
      recaptchaConfigReady = true
      return
    }
    await initializeRecaptchaConfig(auth)
    recaptchaConfigReady = true
  } catch (err) {
    console.warn('Phone reCAPTCHA config init skipped:', err)
  }
}
