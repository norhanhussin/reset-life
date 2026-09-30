import AppRouter from './app/AppRouter.jsx'
import { AuthProvider } from './features/auth/AuthContext.jsx'
import { I18nProvider } from './i18n/I18nProvider.jsx'

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </I18nProvider>
  )
}

export default App