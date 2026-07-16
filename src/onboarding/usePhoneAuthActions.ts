import { useNavigate } from 'react-router-dom'
import { useOnboarding } from './OnboardingContext'
import {
  confirmPhoneCode,
  resendPhoneCode,
  sendPhoneCode,
  toE164,
} from '../auth/phoneAuth'
import { friendlyAuthError } from '../auth/authErrors'
import { useAuth } from '../auth'

export function usePhoneAuthActions() {
  const { data, patch, setBusy, setError, busy } = useOnboarding()
  const { refreshProfile } = useAuth()
  const navigate = useNavigate()

  async function sendCode() {
    setError(null)
    setBusy(true)
    try {
      const e164 = toE164(data.countryCode, data.phone)
      patch({ phone: data.phone })
      await sendPhoneCode(e164)
      navigate('/onboarding/verify-code')
    } catch (err) {
      setError(friendlyAuthError(err))
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(code: string) {
    setError(null)
    setBusy(true)
    try {
      await confirmPhoneCode(code)
      await refreshProfile()
      navigate('/onboarding/personal-info')
    } catch (err) {
      setError(friendlyAuthError(err))
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  async function resend() {
    setError(null)
    setBusy(true)
    try {
      const e164 = toE164(data.countryCode, data.phone)
      await resendPhoneCode(e164)
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  return { sendCode, verifyCode, resend, busy }
}
