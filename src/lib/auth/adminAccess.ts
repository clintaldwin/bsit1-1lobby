import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export interface AdminVerificationResult {
  success: boolean
  error?: string
}

interface VerifyAdminAccessResponse {
  ok?: boolean
  reason?: string
  section_id?: string
  role?: string
}

const REASON_MESSAGES: Record<string, string> = {
  invalid_code: 'Invalid administrator access code.',
  missing_code: 'Please enter the administrator access code.',
  unauthenticated: 'Your session could not be verified. Please try again.',
  admin_access_not_configured: 'Administrator access is not configured yet.',
  section_not_configured: 'Section is not configured yet.',
}

const GENERIC_ERROR = 'Unable to verify administrator access. Please try again.'

/**
 * Makes sure the browser has an active Supabase Auth session,
 * creating an anonymous one when none exists.
 */
export async function ensureSession(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (!error && data.session) return true

    const { data: anon, error: anonError } = await supabase.auth.signInAnonymously()
    return !anonError && Boolean(anon.session)
  } catch (err) {
    console.warn('[AdminAuth] Unable to establish a Supabase session:', err)
    return false
  }
}

/**
 * Verifies the administrator access code with the server-side
 * `verify-admin-access` Edge Function. The code is never checked in the
 * browser. Success only when the function answers `{ ok: true }`.
 */
export async function verifyAdminAccess(accessCode: string): Promise<AdminVerificationResult> {
  const code = accessCode.trim()
  if (!code) {
    return { success: false, error: REASON_MESSAGES.missing_code }
  }

  if (!(await ensureSession())) {
    return { success: false, error: 'Unable to start a secure session. Check your connection and try again.' }
  }

  try {
    const { data, error } = await supabase.functions.invoke<VerifyAdminAccessResponse>(
      'verify-admin-access',
      { body: { access_code: code } },
    )

    if (error) {
      let reason: string | undefined
      if (error instanceof FunctionsHttpError) {
        const body: VerifyAdminAccessResponse | null = await error.context.json().catch(() => null)
        reason = body?.reason
      }
      return { success: false, error: (reason && REASON_MESSAGES[reason]) || GENERIC_ERROR }
    }

    if (data?.ok === true && data.role === 'admin') {
      return { success: true }
    }

    return { success: false, error: (data?.reason && REASON_MESSAGES[data.reason]) || GENERIC_ERROR }
  } catch (err) {
    console.warn('[AdminAuth] Verification request failed:', err)
    return { success: false, error: GENERIC_ERROR }
  }
}
