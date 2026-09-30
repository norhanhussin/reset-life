export function translateError(error, t, fallbackKey) {
  const message = String(error?.message || error || '').toLowerCase()

  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return t('auth.invalidCredentials')
  }
  if (message.includes('email not confirmed')) {
    return t('auth.emailNotConfirmed')
  }
  if (message.includes('user already registered') || message.includes('already been registered')) {
    return t('auth.alreadyRegistered')
  }
  if (message.includes('password should be at least') || message.includes('password is too short')) {
    return t('auth.passwordRequirements')
  }
  if (message.includes('failed to fetch') || message.includes('fetch failed') || message.includes('network')) {
    return t('common.networkError')
  }
  if (message.includes('row-level security') || message.includes('permission denied')) {
    return t('common.permissionError')
  }

  return t(fallbackKey)
}