/**
 * Scanner Types and Constants
 * Defines all check types, statuses, and scoring weights
 */

// Check status types
export const CheckStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  PASS: 'pass',
  WARNING: 'warning',
  FAIL: 'fail',
  ERROR: 'error',
  SKIPPED: 'skipped'
}

// Check categories
export const CheckCategory = {
  SSL: 'ssl',
  HEADERS: 'headers',
  CMS: 'cms',
  EXPOSED_FILES: 'exposed_files',
  PLUGINS: 'plugins',
  MALWARE: 'malware',
  PERFORMANCE: 'performance'
}

// Category metadata with weights and descriptions
export const CategoryConfig = {
  [CheckCategory.SSL]: {
    name: 'SSL/HTTPS',
    description: 'Certificate validity and configuration',
    weight: 20,
    icon: 'Lock',
    requiresBackend: true
  },
  [CheckCategory.HEADERS]: {
    name: 'Security Headers',
    description: 'HTTP security header configuration',
    weight: 20,
    icon: 'Shield',
    requiresBackend: true
  },
  [CheckCategory.CMS]: {
    name: 'CMS Detection',
    description: 'Content management system and version',
    weight: 15,
    icon: 'Code',
    requiresBackend: true
  },
  [CheckCategory.EXPOSED_FILES]: {
    name: 'Exposed Files',
    description: 'Sensitive files and directories',
    weight: 20,
    icon: 'FileWarning',
    requiresBackend: true
  },
  [CheckCategory.PLUGINS]: {
    name: 'Plugins & Themes',
    description: 'Third-party component security',
    weight: 10,
    icon: 'Puzzle',
    requiresBackend: true
  },
  [CheckCategory.MALWARE]: {
    name: 'Malware Check',
    description: 'Known threats and suspicious code',
    weight: 10,
    icon: 'Bug',
    requiresBackend: true
  },
  [CheckCategory.PERFORMANCE]: {
    name: 'Tech Stack Age',
    description: 'Outdated libraries and frameworks',
    weight: 5,
    icon: 'Clock',
    requiresBackend: true
  }
}

// Security headers to check
export const SecurityHeaders = {
  'Strict-Transport-Security': {
    name: 'HSTS',
    description: 'Forces HTTPS connections',
    severity: 'high',
    recommendation: 'Add Strict-Transport-Security header with max-age of at least 1 year'
  },
  'Content-Security-Policy': {
    name: 'CSP',
    description: 'Prevents XSS and injection attacks',
    severity: 'high',
    recommendation: 'Implement a Content-Security-Policy to control resource loading'
  },
  'X-Frame-Options': {
    name: 'X-Frame-Options',
    description: 'Prevents clickjacking attacks',
    severity: 'medium',
    recommendation: 'Set X-Frame-Options to DENY or SAMEORIGIN'
  },
  'X-Content-Type-Options': {
    name: 'X-Content-Type-Options',
    description: 'Prevents MIME type sniffing',
    severity: 'medium',
    recommendation: 'Set X-Content-Type-Options to nosniff'
  },
  'X-XSS-Protection': {
    name: 'X-XSS-Protection',
    description: 'Legacy XSS filter (deprecated but still useful)',
    severity: 'low',
    recommendation: 'Set X-XSS-Protection to 1; mode=block'
  },
  'Referrer-Policy': {
    name: 'Referrer-Policy',
    description: 'Controls referrer information leakage',
    severity: 'low',
    recommendation: 'Set Referrer-Policy to strict-origin-when-cross-origin'
  },
  'Permissions-Policy': {
    name: 'Permissions-Policy',
    description: 'Controls browser feature access',
    severity: 'low',
    recommendation: 'Implement Permissions-Policy to restrict unnecessary browser features'
  }
}

// Common exposed files to check
export const ExposedFiles = [
  { path: '/.env', severity: 'critical', description: 'Environment variables with secrets' },
  { path: '/.git/config', severity: 'critical', description: 'Git repository configuration' },
  { path: '/wp-config.php.bak', severity: 'critical', description: 'WordPress config backup' },
  { path: '/wp-config.php~', severity: 'critical', description: 'WordPress config backup' },
  { path: '/.htaccess', severity: 'high', description: 'Apache configuration file' },
  { path: '/phpinfo.php', severity: 'high', description: 'PHP information disclosure' },
  { path: '/readme.html', severity: 'low', description: 'WordPress readme (version disclosure)' },
  { path: '/license.txt', severity: 'low', description: 'License file (version disclosure)' },
  { path: '/xmlrpc.php', severity: 'medium', description: 'WordPress XML-RPC (attack vector)' },
  { path: '/wp-json/', severity: 'info', description: 'WordPress REST API' },
  { path: '/.DS_Store', severity: 'medium', description: 'macOS directory metadata' },
  { path: '/backup.zip', severity: 'critical', description: 'Backup archive' },
  { path: '/backup.sql', severity: 'critical', description: 'Database backup' },
  { path: '/debug.log', severity: 'high', description: 'Debug log file' },
  { path: '/error.log', severity: 'high', description: 'Error log file' }
]

// Common admin paths to check
export const AdminPaths = [
  { path: '/admin', name: 'Generic Admin' },
  { path: '/wp-admin', name: 'WordPress Admin' },
  { path: '/wp-login.php', name: 'WordPress Login' },
  { path: '/administrator', name: 'Joomla Admin' },
  { path: '/admin.php', name: 'Admin Script' },
  { path: '/login', name: 'Login Page' },
  { path: '/user/login', name: 'Drupal Login' },
  { path: '/cpanel', name: 'cPanel' },
  { path: '/phpmyadmin', name: 'phpMyAdmin' }
]

// CMS signatures for detection
export const CMSSignatures = {
  wordpress: {
    name: 'WordPress',
    patterns: [
      '/wp-content/',
      '/wp-includes/',
      'wp-json',
      'generator.*wordpress',
      'wordpress.org'
    ],
    versionPattern: /wordpress\s*([\d.]+)/i
  },
  drupal: {
    name: 'Drupal',
    patterns: [
      'Drupal.settings',
      '/sites/default/',
      'generator.*drupal',
      'drupal.org'
    ],
    versionPattern: /drupal\s*([\d.]+)/i
  },
  joomla: {
    name: 'Joomla',
    patterns: [
      '/media/jui/',
      '/components/com_',
      'generator.*joomla',
      'joomla.org'
    ],
    versionPattern: /joomla!\s*([\d.]+)/i
  },
  shopify: {
    name: 'Shopify',
    patterns: [
      'cdn.shopify.com',
      'myshopify.com',
      'Shopify.theme'
    ],
    versionPattern: null
  },
  wix: {
    name: 'Wix',
    patterns: [
      'wix.com',
      'wixstatic.com',
      '_wix_browser_sess'
    ],
    versionPattern: null
  },
  squarespace: {
    name: 'Squarespace',
    patterns: [
      'squarespace.com',
      'static1.squarespace.com',
      'squarespace-cdn.com'
    ],
    versionPattern: null
  }
}

// Known vulnerable WordPress plugin patterns (simplified list)
export const VulnerablePlugins = [
  { slug: 'contact-form-7', vulnerableBelow: '5.8', severity: 'high' },
  { slug: 'elementor', vulnerableBelow: '3.18', severity: 'medium' },
  { slug: 'wpforms-lite', vulnerableBelow: '1.8.4', severity: 'high' },
  { slug: 'all-in-one-seo-pack', vulnerableBelow: '4.5', severity: 'high' },
  { slug: 'wordfence', vulnerableBelow: '7.10', severity: 'medium' },
  { slug: 'yoast', vulnerableBelow: '21.0', severity: 'medium' }
]

// Malware signatures (basic patterns)
export const MalwareSignatures = [
  { pattern: /eval\s*\(\s*base64_decode/gi, name: 'Base64 Eval', severity: 'critical' },
  { pattern: /document\.write\s*\(\s*unescape/gi, name: 'Obfuscated Script', severity: 'high' },
  { pattern: /<iframe[^>]+style\s*=\s*["'][^"']*display\s*:\s*none/gi, name: 'Hidden Iframe', severity: 'high' },
  { pattern: /fromCharCode\s*\([^)]{50,}/gi, name: 'Obfuscated CharCode', severity: 'medium' },
  { pattern: /<script[^>]+src\s*=\s*["']https?:\/\/[^"']*(?:evil|malware|hack)/gi, name: 'Suspicious Script Source', severity: 'critical' }
]

// Grade thresholds
export const GradeThresholds = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0
}

// Get letter grade from score
export function getGrade(score) {
  if (score >= GradeThresholds.A) return 'A'
  if (score >= GradeThresholds.B) return 'B'
  if (score >= GradeThresholds.C) return 'C'
  if (score >= GradeThresholds.D) return 'D'
  return 'F'
}

// Get grade color
export function getGradeColor(grade) {
  const colors = {
    A: 'secure',
    B: 'secure',
    C: 'threat',
    D: 'threat',
    F: 'critical'
  }
  return colors[grade] || 'gray'
}
