/** Map Firebase Auth / network errors to short user-facing copy. */
export function friendlyAuthError(err: unknown): string {
  const code =
    err && typeof err === 'object' && 'code' in err
      ? String((err as { code?: string }).code || '')
      : ''
  const raw = err instanceof Error ? err.message : String(err || '')

  const fromMessage = raw.match(/auth\/([a-z0-9-]+)/i)?.[1]
  const key = (code.replace(/^auth\//, '') || fromMessage || '').toLowerCase()

  switch (key) {
    case 'invalid-phone-number':
      return 'That phone number looks invalid. Check the country code and try again.'
    case 'missing-phone-number':
      return 'Enter your phone number to continue.'
    case 'too-many-requests':
      return 'Too many attempts. Wait a minute, then try again.'
    case 'invalid-verification-code':
    case 'invalid-verification-id':
      return 'That code is incorrect or expired. Request a new one.'
    case 'code-expired':
      return 'That code expired. Tap resend for a new code.'
    case 'session-expired':
      return 'Your session expired. Request a new code.'
    case 'captcha-check-failed':
    case 'missing-recaptcha-token':
    case 'invalid-recaptcha-token':
      return 'Security check failed. Refresh, complete the captcha if shown, or use the US test number 5555550100 / 123456 in local DEV.'
    case 'network-request-failed':
      return 'Network error. Check your connection and try again.'
    case 'user-disabled':
      return 'This account has been disabled.'
    case 'quota-exceeded':
      return 'SMS quota exceeded. Try again later or use a test number.'
    case 'operation-not-allowed':
      if (/region|sms/i.test(raw)) {
        return 'SMS for this country is blocked in Firebase. Enable the region under Authentication → Settings → SMS region policy, or use a test phone (US +1 5555550100 / code 123456).'
      }
      return 'Phone sign-in is disabled for this project. Enable Phone in Firebase Authentication.'
    default:
      if (/region enabled|sms unable/i.test(raw)) {
        return 'SMS for this country is blocked in Firebase. Enable the region under Authentication → Settings → SMS region policy, or use a test phone (US +1 5555550100 / code 123456).'
      }
      if (/recaptcha|captcha/i.test(raw)) {
        return 'Security check failed. Refresh the page and try again.'
      }
      return 'Something went wrong. Please try again.'
  }
}
