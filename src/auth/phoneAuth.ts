import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth'
import { getFirebaseAuth } from '../firebase'
import { initPhoneRecaptchaConfig } from '../firebase/appCheck'

let verifier: RecaptchaVerifier | null = null
let confirmation: ConfirmationResult | null = null

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

function ensureRecaptcha(containerId = 'recaptcha-container'): RecaptchaVerifier {
  const auth = getFirebaseAuth()
  if (verifier) return verifier
  // sitekey is provisioned by Firebase Auth — do not pass a custom sitekey here
  verifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' })
  return verifier
}

/** E.164 from country code + national digits. */
export function toE164(countryCode: string, phone: string): string {
  const cc = countryCode.replace(/\D/g, '')
  const national = phone.replace(/\D/g, '')
  return `+${cc}${national}`
}

export async function sendPhoneCode(
  e164: string,
  containerId = 'recaptcha-container',
): Promise<ConfirmationResult> {
  await initPhoneRecaptchaConfig()
  resetRecaptcha()
  const appVerifier = ensureRecaptcha(containerId)
  confirmation = await signInWithPhoneNumber(
    getFirebaseAuth(),
    e164,
    appVerifier,
  )
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
