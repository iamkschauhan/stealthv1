import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ApplicationVerifier,
  type ConfirmationResult,
} from 'firebase/auth'
import { getFirebaseAuth } from '../firebase'
import { initPhoneRecaptchaConfig } from '../firebase/appCheck'

let verifier: RecaptchaVerifier | null = null
let confirmation: ConfirmationResult | null = null

/** Registered under Authentication → Phone → Phone numbers for testing. */
const DEV_TEST_PHONES = new Set(['+15555550100', '+15555550101'])

export function getPhoneConfirmation(): ConfirmationResult | null {
  return confirmation
}

export function clearPhoneConfirmation(): void {
  confirmation = null
}

export function resetRecaptcha(): void {
  try {
    verifier?.clear()
  } catch {
    /* ignore */
  }
  verifier = null
}

/** E.164 from country code + national digits. */
export function toE164(countryCode: string, phone: string): string {
  const cc = countryCode.replace(/\D/g, '')
  const national = phone.replace(/\D/g, '')
  return `+${cc}${national}`
}

/** Any token works for Firebase test numbers; avoids broken Enterprise/v2 widgets in DEV. */
function testingVerifier(): ApplicationVerifier {
  return {
    type: 'recaptcha',
    verify: async () => 'test',
  }
}

function ensureRecaptcha(containerId = 'recaptcha-container'): RecaptchaVerifier {
  const auth = getFirebaseAuth()
  if (verifier) return verifier
  // Visible widget is more reliable than invisible when Enterprise config is missing.
  verifier = new RecaptchaVerifier(auth, containerId, { size: 'normal' })
  return verifier
}

function resolveVerifier(
  e164: string,
  containerId: string,
): ApplicationVerifier {
  const auth = getFirebaseAuth()
  if (import.meta.env.DEV) {
    auth.settings.appVerificationDisabledForTesting = true
  }
  if (import.meta.env.DEV && DEV_TEST_PHONES.has(e164)) {
    return testingVerifier()
  }
  return ensureRecaptcha(containerId)
}

export async function sendPhoneCode(
  e164: string,
  containerId = 'recaptcha-container',
): Promise<ConfirmationResult> {
  await initPhoneRecaptchaConfig()
  resetRecaptcha()
  const auth = getFirebaseAuth()
  const appVerifier = resolveVerifier(e164, containerId)
  confirmation = await signInWithPhoneNumber(auth, e164, appVerifier)
  return confirmation
}

export async function confirmPhoneCode(code: string): Promise<void> {
  if (!confirmation) {
    throw new Error('No verification in progress. Request a new code.')
  }
  await confirmation.confirm(code)
  clearPhoneConfirmation()
  resetRecaptcha()
}

export async function resendPhoneCode(
  e164: string,
  containerId = 'recaptcha-container',
): Promise<ConfirmationResult> {
  return sendPhoneCode(e164, containerId)
}
