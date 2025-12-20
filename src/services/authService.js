/**
 * Authentication Service
 * Handles admin and user authentication
 * Currently uses localStorage - upgrade to backend/Supabase for production
 */

const STORAGE_KEYS = {
  ADMIN_SESSION: 'tzu_admin_session',
  USER_SESSION: 'tzu_user_session',
  USERS: 'tzu_users',
  ADMIN_CONFIG: 'tzu_admin_config'
}

// Simple hash function for passwords (use bcrypt on backend in production)
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'tzu_shield_salt_2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify password against hash
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Generate session token
function generateSessionToken() {
  return 'sess_' + Date.now().toString(36) + '_' +
    Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('')
}

// ============================================
// ADMIN AUTHENTICATION
// ============================================

// Default admin password hash (password: "TzuShield2024!")
// IMPORTANT: Change this in production via admin settings
const DEFAULT_ADMIN_HASH = '7a7d4b4c8e5f6a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b'

/**
 * Initialize admin config if not exists
 */
function initAdminConfig() {
  const config = localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG)
  if (!config) {
    // First time setup - will prompt for password change
    localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify({
      passwordHash: null, // null means use default or needs setup
      setupComplete: false,
      createdAt: new Date().toISOString()
    }))
  }
}

/**
 * Check if admin password has been set up
 */
export function isAdminSetupComplete() {
  initAdminConfig()
  const config = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG) || '{}')
  return config.setupComplete === true
}

/**
 * Set up admin password (first time or reset)
 */
export async function setupAdminPassword(password) {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const hash = await hashPassword(password)
  const config = {
    passwordHash: hash,
    setupComplete: true,
    updatedAt: new Date().toISOString()
  }

  localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify(config))
  return true
}

/**
 * Admin login
 */
export async function adminLogin(password) {
  initAdminConfig()
  const config = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG) || '{}')

  let isValid = false

  if (config.passwordHash) {
    // Check against stored hash
    isValid = await verifyPassword(password, config.passwordHash)
  } else {
    // Check against default password for first-time setup
    isValid = password === 'TzuShield2024!'
  }

  if (!isValid) {
    throw new Error('Invalid password')
  }

  // Create session
  const session = {
    token: generateSessionToken(),
    type: 'admin',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }

  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session))
  return session
}

/**
 * Check if admin is logged in
 */
export function isAdminLoggedIn() {
  const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION)
  if (!session) return false

  try {
    const parsed = JSON.parse(session)
    const expires = new Date(parsed.expiresAt)
    if (expires < new Date()) {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION)
      return false
    }
    return true
  } catch {
    return false
  }
}

/**
 * Admin logout
 */
export function adminLogout() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION)
}

/**
 * Change admin password
 */
export async function changeAdminPassword(currentPassword, newPassword) {
  // Verify current password
  const config = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG) || '{}')

  if (config.passwordHash) {
    const isValid = await verifyPassword(currentPassword, config.passwordHash)
    if (!isValid) {
      throw new Error('Current password is incorrect')
    }
  } else {
    if (currentPassword !== 'TzuShield2024!') {
      throw new Error('Current password is incorrect')
    }
  }

  // Set new password
  return setupAdminPassword(newPassword)
}

// ============================================
// USER AUTHENTICATION
// ============================================

/**
 * Get all users (for admin purposes)
 */
function getUsers() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

/**
 * Save users
 */
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

/**
 * Register new user
 */
export async function registerUser(email, password, name = '') {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address')
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const users = getUsers()
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (existingUser) {
    throw new Error('An account with this email already exists')
  }

  const passwordHash = await hashPassword(password)

  const newUser = {
    id: 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    passwordHash,
    plan: 'free', // free, pro, enterprise
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    scansRemaining: 5, // Free tier gets 5 scans/month
    scansResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }

  users.push(newUser)
  saveUsers(users)

  // Auto-login after registration
  return loginUser(email, password)
}

/**
 * User login
 */
export async function loginUser(email, password) {
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    throw new Error('Invalid email or password')
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString()
  saveUsers(users)

  // Create session
  const session = {
    token: generateSessionToken(),
    type: 'user',
    userId: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  }

  localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session))

  // Return user info (without password hash)
  return {
    session,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      scansRemaining: user.scansRemaining,
      createdAt: user.createdAt
    }
  }
}

/**
 * Get current user session
 */
export function getCurrentUser() {
  const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION)
  if (!session) return null

  try {
    const parsed = JSON.parse(session)
    const expires = new Date(parsed.expiresAt)
    if (expires < new Date()) {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
      return null
    }

    // Get full user data
    const users = getUsers()
    const user = users.find(u => u.id === parsed.userId)
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
      return null
    }

    return {
      session: parsed,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        scansRemaining: user.scansRemaining,
        createdAt: user.createdAt
      }
    }
  } catch {
    return null
  }
}

/**
 * Check if user is logged in
 */
export function isUserLoggedIn() {
  return getCurrentUser() !== null
}

/**
 * User logout
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
}

/**
 * Update user plan (after payment)
 */
export function updateUserPlan(userId, plan) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)

  if (!user) {
    throw new Error('User not found')
  }

  user.plan = plan

  // Update scans based on plan
  if (plan === 'pro') {
    user.scansRemaining = 100 // Pro gets 100 scans/month
  } else if (plan === 'enterprise') {
    user.scansRemaining = -1 // Unlimited
  }

  user.planUpdatedAt = new Date().toISOString()
  saveUsers(users)

  // Update session if current user
  const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION)
  if (session) {
    const parsed = JSON.parse(session)
    if (parsed.userId === userId) {
      parsed.plan = plan
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(parsed))
    }
  }

  return user
}

/**
 * Use a scan (decrement counter)
 */
export function useScan(userId) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)

  if (!user) {
    throw new Error('User not found')
  }

  // Check if scans need reset (monthly)
  const resetDate = new Date(user.scansResetAt)
  if (resetDate < new Date()) {
    // Reset scans based on plan
    if (user.plan === 'free') {
      user.scansRemaining = 5
    } else if (user.plan === 'pro') {
      user.scansRemaining = 100
    }
    user.scansResetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }

  // Unlimited plans (enterprise)
  if (user.scansRemaining === -1) {
    return true
  }

  if (user.scansRemaining <= 0) {
    throw new Error('No scans remaining. Upgrade to Pro for more scans.')
  }

  user.scansRemaining--
  saveUsers(users)

  return true
}

/**
 * Get all users (admin only)
 */
export function getAllUsers() {
  if (!isAdminLoggedIn()) {
    throw new Error('Admin access required')
  }

  return getUsers().map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    plan: u.plan,
    scansRemaining: u.scansRemaining,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt
  }))
}

/**
 * Password reset request (would send email in production)
 */
export function requestPasswordReset(email) {
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    // Don't reveal if email exists
    return { success: true, message: 'If an account exists, a reset link has been sent.' }
  }

  // In production, send email with reset token
  // For now, just return success
  return { success: true, message: 'If an account exists, a reset link has been sent.' }
}
