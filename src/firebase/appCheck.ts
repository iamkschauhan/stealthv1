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
 * Wire reCAPTCHA Enterprise site key for App Check (abuse protection).
 * Safe to call multiple times; failures are non-fatal in dev.
 */
export function initAppCheck(): void {
  if (appCheckReady) return
  const siteKey = getRecaptchaSiteKey()
  if (!siteKey) return

  try {
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
 * Required when the project enforces rCE for phone providers.
 */
export async function initPhoneRecaptchaConfig(): Promise<void> {
  if (recaptchaConfigReady) return
  try {
    const auth = getFirebaseAuth()
    // Dev + test numbers: skip interactive reCAPTCHA challenge
    if (import.meta.env.DEV) {
      auth.settings.appVerificationDisabledForTesting = true
    }
    await initializeRecaptchaConfig(auth)
    recaptchaConfigReady = true
  } catch (err) {
    console.warn('Phone reCAPTCHA config init skipped:', err)
  }
}
