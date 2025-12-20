/**
 * Authentication Components
 * Admin login, User login/register, Protected routes
 */

import { useState, useEffect, createContext, useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound
} from 'lucide-react'
import {
  adminLogin,
  adminLogout,
  isAdminLoggedIn,
  isAdminSetupComplete,
  setupAdminPassword,
  changeAdminPassword,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserLoggedIn
} from '../services/authService'

// ============================================
// AUTH CONTEXT
// ============================================

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [adminAuthenticated, setAdminAuthenticated] = useState(isAdminLoggedIn())
  const [user, setUser] = useState(getCurrentUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check auth state on mount
    setAdminAuthenticated(isAdminLoggedIn())
    setUser(getCurrentUser())
    setLoading(false)
  }, [])

  const handleAdminLogin = async (password) => {
    const session = await adminLogin(password)
    setAdminAuthenticated(true)
    return session
  }

  const handleAdminLogout = () => {
    adminLogout()
    setAdminAuthenticated(false)
  }

  const handleUserLogin = async (email, password) => {
    const result = await loginUser(email, password)
    setUser(result)
    return result
  }

  const handleUserRegister = async (email, password, name) => {
    const result = await registerUser(email, password, name)
    setUser(result)
    return result
  }

  const handleUserLogout = () => {
    logoutUser()
    setUser(null)
  }

  const refreshUser = () => {
    setUser(getCurrentUser())
  }

  return (
    <AuthContext.Provider
      value={{
        adminAuthenticated,
        user,
        loading,
        adminLogin: handleAdminLogin,
        adminLogout: handleAdminLogout,
        userLogin: handleUserLogin,
        userRegister: handleUserRegister,
        userLogout: handleUserLogout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// ============================================
// PROTECTED ROUTES
// ============================================

/**
 * Protected route for admin pages
 */
export function AdminRoute({ children }) {
  const { adminAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-aegis-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-shield-400 animate-spin" />
      </div>
    )
  }

  if (!adminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

/**
 * Protected route for user pages
 */
export function UserRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-aegis-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-shield-400 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// ============================================
// ADMIN LOGIN PAGE
// ============================================

export function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(!isAdminSetupComplete())

  const { adminLogin: login, adminAuthenticated } = useAuth()
  const location = useLocation()

  // Redirect if already logged in
  if (adminAuthenticated) {
    const from = location.state?.from?.pathname || '/admin'
    return <Navigate to={from} replace />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(password)
      // Redirect handled by Navigate above
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSetup = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await setupAdminPassword(newPassword)
      await login(newPassword)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-aegis-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-shield-500/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-shield-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">
            Admin Access
          </h1>
          <p className="text-gray-400 mt-2">
            {needsSetup ? 'Set up your admin password' : 'Enter your password to continue'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-aegis-800 border border-white/10 rounded-2xl p-6 md:p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-critical-500/10 border border-critical-500/20 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-critical-400 flex-shrink-0" />
              <p className="text-sm text-critical-400">{error}</p>
            </div>
          )}

          {needsSetup ? (
            <form onSubmit={handleSetup} className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">
                This is your first time accessing admin. Please set a secure password.
              </p>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    Set Password & Login
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Access Admin
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Default password: <code className="text-gray-400">TzuShield2024!</code>
          <br />
          <span className="text-gray-600">(Change this after first login)</span>
        </p>
      </div>
    </div>
  )
}

// ============================================
// USER LOGIN/REGISTER PAGE
// ============================================

export function UserLoginPage() {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { userLogin, userRegister, user } = useAuth()
  const location = useLocation()

  // Redirect if already logged in
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await userLogin(email, password)
      } else {
        await userRegister(email, password, name)
      }
      // Redirect handled by Navigate above
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-aegis-900 flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-shield-500/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-shield-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-400 mt-2">
            {mode === 'login'
              ? 'Sign in to access your dashboard'
              : 'Start protecting your website today'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-aegis-800 border border-white/10 rounded-2xl p-6 md:p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-critical-500/10 border border-critical-500/20 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-critical-400 flex-shrink-0" />
              <p className="text-sm text-critical-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Create a password (8+ chars)' : 'Enter your password'}
                  className="w-full pl-11 pr-12 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
                  required
                  minLength={mode === 'register' ? 8 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('register')
                      setError('')
                    }}
                    className="text-shield-400 hover:text-shield-300 font-medium"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('login')
                      setError('')
                    }}
                    className="text-shield-400 hover:text-shield-300 font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Benefits */}
        {mode === 'register' && (
          <div className="mt-8 grid gap-4 text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              <CheckCircle2 className="w-5 h-5 text-secure-400" />
              <span>5 free security scans per month</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <CheckCircle2 className="w-5 h-5 text-secure-400" />
              <span>Downloadable PDF reports</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <CheckCircle2 className="w-5 h-5 text-secure-400" />
              <span>Security improvement tips</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// USER HEADER COMPONENT
// ============================================

export function UserHeader() {
  const { user, userLogout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-aegis-800 hover:bg-aegis-700 border border-white/10 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-shield-500/20 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-shield-400">
            {user.user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-white hidden sm:block">
          {user.user.name}
        </span>
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-aegis-800 border border-white/10 rounded-xl shadow-xl z-50 py-2">
            <div className="px-4 py-2 border-b border-white/10">
              <p className="text-sm text-white font-medium">{user.user.name}</p>
              <p className="text-xs text-gray-500">{user.user.email}</p>
              <p className="text-xs text-shield-400 mt-1 capitalize">{user.user.plan} Plan</p>
            </div>
            <a
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-aegis-700/50"
            >
              Dashboard
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-aegis-700/50"
            >
              Settings
            </a>
            <button
              onClick={() => {
                userLogout()
                setDropdownOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-aegis-700/50"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
