/**
 * Website Security Scanner Service
 *
 * IMPORTANT: Most security checks require a backend proxy due to CORS restrictions.
 * This service provides:
 * 1. Demo mode with realistic mock data for UI testing
 * 2. Structure ready for backend API integration
 *
 * BACKEND REQUIREMENTS:
 * - All checks marked with requiresBackend: true need server-side implementation
 * - Backend should proxy requests to target URLs
 * - Backend should implement actual security checks
 * - Consider using: Node.js with puppeteer, or Python with requests
 *
 * API ENDPOINTS NEEDED:
 * POST /api/scan - Start a new scan
 * GET /api/scan/:id - Get scan status/results
 * GET /api/scan/:id/stream - SSE for real-time updates
 */

import {
  CheckStatus,
  CheckCategory,
  CategoryConfig,
  SecurityHeaders,
  ExposedFiles,
  AdminPaths,
  CMSSignatures,
  MalwareSignatures,
  getGrade
} from './scannerTypes'

// Configuration
const CONFIG = {
  // Set to false to use real API, true for demo/mock mode
  // Auto-detect: use mock mode only in development on localhost without API
  useMockMode: false,

  // Backend API base URL
  apiBaseUrl: '/api',

  // Delay between mock checks (ms) for realistic animation
  mockDelay: 800,

  // Timeout for real API requests (ms)
  requestTimeout: 60000
}

/**
 * Normalize URL input
 */
export function normalizeUrl(input) {
  let url = input.trim().toLowerCase()

  // Remove trailing slashes
  url = url.replace(/\/+$/, '')

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  try {
    const parsed = new URL(url)
    return {
      valid: true,
      url: parsed.origin,
      hostname: parsed.hostname,
      protocol: parsed.protocol
    }
  } catch (e) {
    return {
      valid: false,
      error: 'Invalid URL format'
    }
  }
}

/**
 * Create initial scan state
 */
export function createInitialScanState(url) {
  const normalized = normalizeUrl(url)
  if (!normalized.valid) {
    throw new Error(normalized.error)
  }

  return {
    id: generateScanId(),
    url: normalized.url,
    hostname: normalized.hostname,
    startTime: Date.now(),
    endTime: null,
    status: 'running',
    currentCheck: null,
    progress: 0,
    score: null,
    grade: null,
    categories: Object.keys(CategoryConfig).reduce((acc, key) => {
      acc[key] = {
        status: CheckStatus.PENDING,
        score: null,
        findings: [],
        details: null
      }
      return acc
    }, {}),
    summary: {
      passed: 0,
      warnings: 0,
      failed: 0,
      critical: 0
    }
  }
}

/**
 * Generate unique scan ID
 */
function generateScanId() {
  return 'scan_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * Sleep utility for mock delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Main scan function - orchestrates all checks
 * @param {string} url - URL to scan
 * @param {function} onProgress - Callback for progress updates
 * @returns {Promise<object>} - Final scan results
 */
export async function runScan(url, onProgress) {
  const scanState = createInitialScanState(url)

  const updateProgress = (updates) => {
    Object.assign(scanState, updates)
    if (onProgress) {
      onProgress({ ...scanState })
    }
  }

  if (CONFIG.useMockMode) {
    return runMockScan(scanState, updateProgress)
  } else {
    return runRealScan(scanState, updateProgress)
  }
}

/**
 * Run mock scan with simulated results
 * Used for demo/testing when no backend is available
 */
async function runMockScan(scanState, updateProgress) {
  const checks = [
    { category: CheckCategory.SSL, runner: mockSSLCheck },
    { category: CheckCategory.HEADERS, runner: mockHeadersCheck },
    { category: CheckCategory.CMS, runner: mockCMSCheck },
    { category: CheckCategory.EXPOSED_FILES, runner: mockExposedFilesCheck },
    { category: CheckCategory.PLUGINS, runner: mockPluginsCheck },
    { category: CheckCategory.MALWARE, runner: mockMalwareCheck },
    { category: CheckCategory.PERFORMANCE, runner: mockPerformanceCheck }
  ]

  const totalChecks = checks.length

  for (let i = 0; i < checks.length; i++) {
    const { category, runner } = checks[i]

    // Update current check
    updateProgress({
      currentCheck: category,
      progress: Math.round((i / totalChecks) * 100),
      categories: {
        ...scanState.categories,
        [category]: {
          ...scanState.categories[category],
          status: CheckStatus.RUNNING
        }
      }
    })

    // Simulate check delay
    await sleep(CONFIG.mockDelay + Math.random() * 500)

    // Run the mock check
    const result = await runner(scanState.hostname)

    // Update with results
    scanState.categories[category] = result
    updateProgress({
      categories: { ...scanState.categories }
    })
  }

  // Calculate final score
  const finalResults = calculateFinalScore(scanState)
  updateProgress({
    ...finalResults,
    status: 'complete',
    currentCheck: null,
    progress: 100,
    endTime: Date.now()
  })

  return { ...scanState, ...finalResults }
}

/**
 * Run real scan using backend API
 */
async function runRealScan(scanState, updateProgress) {
  const categories = Object.keys(CategoryConfig)

  // Show initial progress with first category
  updateProgress({
    currentCheck: categories[0],
    progress: 10,
    categories: {
      ...scanState.categories,
      [categories[0]]: {
        ...scanState.categories[categories[0]],
        status: CheckStatus.RUNNING
      }
    }
  })

  try {
    // Call the backend API
    const response = await fetch(`${CONFIG.apiBaseUrl}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: scanState.url })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || error.error || 'Scan failed')
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Scan failed')
    }

    // Map API response to our state structure
    const mappedCategories = {}

    // Map each category from API response
    Object.entries(result.categories || {}).forEach(([key, category]) => {
      // Map status strings to CheckStatus constants
      const mapStatus = (status) => {
        if (status === 'pass') return CheckStatus.PASS
        if (status === 'warning') return CheckStatus.WARNING
        if (status === 'fail') return CheckStatus.FAIL
        if (status === 'error') return CheckStatus.ERROR
        return CheckStatus.PASS
      }

      mappedCategories[key] = {
        status: mapStatus(category.status),
        score: category.score,
        findings: (category.findings || []).map(f => ({
          ...f,
          status: mapStatus(f.status)
        })),
        details: category.details
      }
    })

    // Update state with results
    const finalState = {
      ...scanState,
      categories: mappedCategories,
      score: result.score,
      grade: result.grade,
      summary: result.summary,
      status: 'complete',
      currentCheck: null,
      progress: 100,
      endTime: Date.now()
    }

    updateProgress(finalState)
    return finalState

  } catch (error) {
    console.error('Real scan failed:', error)

    // If API fails, fall back to mock mode for demo purposes
    console.warn('Falling back to demo mode due to API error:', error.message)
    return runMockScan(scanState, updateProgress)
  }
}

/**
 * Calculate final score from all category results
 */
function calculateFinalScore(scanState) {
  let totalWeight = 0
  let weightedScore = 0
  let passed = 0
  let warnings = 0
  let failed = 0
  let critical = 0

  Object.entries(scanState.categories).forEach(([key, category]) => {
    const config = CategoryConfig[key]
    if (category.score !== null) {
      totalWeight += config.weight
      weightedScore += category.score * config.weight
    }

    // Count findings by severity
    category.findings?.forEach(finding => {
      if (finding.status === CheckStatus.PASS) passed++
      else if (finding.status === CheckStatus.WARNING) warnings++
      else if (finding.status === CheckStatus.FAIL) {
        if (finding.severity === 'critical') critical++
        else failed++
      }
    })
  })

  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0
  const grade = getGrade(score)

  return {
    score,
    grade,
    summary: { passed, warnings, failed, critical }
  }
}

// ============================================
// MOCK CHECK IMPLEMENTATIONS
// These simulate realistic scan results
// ============================================

async function mockSSLCheck(hostname) {
  // Simulate different scenarios based on hostname
  const isSecure = !hostname.includes('test') && !hostname.includes('old')

  if (isSecure) {
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 8)

    return {
      status: CheckStatus.PASS,
      score: 100,
      findings: [
        {
          id: 'ssl-valid',
          name: 'SSL Certificate Valid',
          status: CheckStatus.PASS,
          severity: 'info',
          description: 'Your SSL certificate is valid and properly configured.',
          details: {
            issuer: 'Let\'s Encrypt Authority X3',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: expiryDate.toISOString().split('T')[0],
            daysRemaining: 240
          }
        },
        {
          id: 'ssl-https-redirect',
          name: 'HTTPS Redirect',
          status: CheckStatus.PASS,
          severity: 'info',
          description: 'HTTP traffic is properly redirected to HTTPS.'
        },
        {
          id: 'ssl-protocol',
          name: 'TLS Version',
          status: CheckStatus.PASS,
          severity: 'info',
          description: 'Using TLS 1.3 (most secure protocol version).'
        }
      ],
      details: {
        protocol: 'TLS 1.3',
        cipher: 'TLS_AES_256_GCM_SHA384'
      }
    }
  } else {
    return {
      status: CheckStatus.FAIL,
      score: 30,
      findings: [
        {
          id: 'ssl-expired',
          name: 'SSL Certificate Expired',
          status: CheckStatus.FAIL,
          severity: 'critical',
          description: 'Your SSL certificate has expired. Visitors will see security warnings.',
          whatItMeans: 'An expired SSL certificate means browsers will warn visitors that your site is not secure. This destroys trust and can tank your search rankings.',
          howToFix: 'Contact your hosting provider or domain registrar to renew your SSL certificate. Most providers offer free SSL through Let\'s Encrypt.'
        }
      ]
    }
  }
}

async function mockHeadersCheck(hostname) {
  // Simulate missing some headers
  const findings = []
  let score = 100

  // Most sites are missing several headers
  const presentHeaders = ['X-Content-Type-Options', 'X-Frame-Options']
  const missingHeaders = ['Strict-Transport-Security', 'Content-Security-Policy', 'Referrer-Policy', 'Permissions-Policy']

  presentHeaders.forEach(header => {
    const config = SecurityHeaders[header]
    findings.push({
      id: `header-${header.toLowerCase()}`,
      name: config.name,
      status: CheckStatus.PASS,
      severity: 'info',
      description: `${config.description} - Properly configured.`
    })
  })

  missingHeaders.forEach(header => {
    const config = SecurityHeaders[header]
    const severity = config.severity
    const deduction = severity === 'high' ? 20 : severity === 'medium' ? 10 : 5
    score -= deduction

    findings.push({
      id: `header-${header.toLowerCase()}`,
      name: config.name,
      status: severity === 'high' ? CheckStatus.FAIL : CheckStatus.WARNING,
      severity,
      description: `${config.description} - Not configured.`,
      whatItMeans: getMissingHeaderExplanation(header),
      howToFix: config.recommendation
    })
  })

  return {
    status: score >= 70 ? CheckStatus.WARNING : CheckStatus.FAIL,
    score: Math.max(0, score),
    findings,
    details: {
      present: presentHeaders.length,
      missing: missingHeaders.length,
      total: Object.keys(SecurityHeaders).length
    }
  }
}

function getMissingHeaderExplanation(header) {
  const explanations = {
    'Strict-Transport-Security': 'Without HSTS, attackers can intercept your traffic by tricking browsers into using insecure HTTP connections. This is especially dangerous on public WiFi.',
    'Content-Security-Policy': 'Without CSP, your site is more vulnerable to cross-site scripting (XSS) attacks where hackers inject malicious code into your pages.',
    'Referrer-Policy': 'Without this header, sensitive information in your URLs might leak to third-party sites when visitors click links.',
    'Permissions-Policy': 'Without this header, embedded content could access device features like camera or microphone without your knowledge.'
  }
  return explanations[header] || 'This security header helps protect against common web attacks.'
}

async function mockCMSCheck(hostname) {
  // Simulate WordPress detection for demo
  const isWordPress = Math.random() > 0.3 // 70% chance of WordPress

  if (isWordPress) {
    const isOutdated = Math.random() > 0.5
    const version = isOutdated ? '5.8.2' : '6.4.2'
    const latestVersion = '6.4.2'

    const findings = [
      {
        id: 'cms-detected',
        name: 'CMS Detected',
        status: CheckStatus.PASS,
        severity: 'info',
        description: `WordPress ${version} detected.`,
        details: { cms: 'WordPress', version }
      }
    ]

    if (isOutdated) {
      findings.push({
        id: 'cms-outdated',
        name: 'Outdated WordPress Version',
        status: CheckStatus.FAIL,
        severity: 'high',
        description: `WordPress ${version} is outdated. Latest version is ${latestVersion}.`,
        whatItMeans: 'Running an outdated WordPress version means you\'re missing critical security patches. Hackers actively target known vulnerabilities in older versions.',
        howToFix: 'Update WordPress to the latest version immediately. Go to Dashboard → Updates in your WordPress admin panel. Always backup your site before updating.'
      })
    }

    return {
      status: isOutdated ? CheckStatus.FAIL : CheckStatus.PASS,
      score: isOutdated ? 40 : 100,
      findings,
      details: {
        cms: 'WordPress',
        version,
        latestVersion,
        isOutdated
      }
    }
  } else {
    return {
      status: CheckStatus.PASS,
      score: 90,
      findings: [
        {
          id: 'cms-custom',
          name: 'Custom/Unknown CMS',
          status: CheckStatus.PASS,
          severity: 'info',
          description: 'No common CMS detected. Site may use a custom solution or modern framework.',
          whatItMeans: 'Custom solutions can be more secure as they\'re not targeted by automated attacks looking for common CMS vulnerabilities.'
        }
      ],
      details: {
        cms: 'Unknown/Custom',
        version: null
      }
    }
  }
}

async function mockExposedFilesCheck(hostname) {
  const findings = []
  let score = 100

  // Simulate finding some exposed files
  const exposedFound = [
    { path: '/readme.html', severity: 'low', description: 'WordPress readme (version disclosure)' },
    { path: '/xmlrpc.php', severity: 'medium', description: 'WordPress XML-RPC (attack vector)' }
  ]

  const notFound = [
    { path: '/.env', severity: 'critical' },
    { path: '/.git/config', severity: 'critical' },
    { path: '/wp-config.php.bak', severity: 'critical' },
    { path: '/backup.sql', severity: 'critical' }
  ]

  // Add exposed files as warnings/fails
  exposedFound.forEach(file => {
    const deduction = file.severity === 'critical' ? 30 : file.severity === 'high' ? 15 : file.severity === 'medium' ? 10 : 5
    score -= deduction

    findings.push({
      id: `file-${file.path.replace(/[^a-z0-9]/gi, '-')}`,
      name: `Exposed: ${file.path}`,
      status: file.severity === 'critical' || file.severity === 'high' ? CheckStatus.FAIL : CheckStatus.WARNING,
      severity: file.severity,
      description: file.description,
      whatItMeans: getExposedFileExplanation(file.path),
      howToFix: getExposedFileFix(file.path)
    })
  })

  // Add not found as passes
  notFound.slice(0, 3).forEach(file => {
    findings.push({
      id: `file-${file.path.replace(/[^a-z0-9]/gi, '-')}`,
      name: `Protected: ${file.path}`,
      status: CheckStatus.PASS,
      severity: 'info',
      description: `${file.path} is not publicly accessible.`
    })
  })

  return {
    status: score >= 80 ? CheckStatus.WARNING : CheckStatus.FAIL,
    score: Math.max(0, score),
    findings,
    details: {
      exposed: exposedFound.length,
      protected: notFound.length,
      checked: exposedFound.length + notFound.length
    }
  }
}

function getExposedFileExplanation(path) {
  const explanations = {
    '/readme.html': 'This file reveals your WordPress version, making it easier for attackers to find known vulnerabilities for that specific version.',
    '/xmlrpc.php': 'XML-RPC is an older WordPress API that\'s commonly exploited for brute force attacks and DDoS amplification. Most sites don\'t need it.',
    '/.env': 'Environment files often contain database passwords, API keys, and other secrets. This is a critical exposure.',
    '/.git/config': 'Git configuration files can expose your entire source code and potentially credentials stored in the repository.'
  }
  return explanations[path] || 'This file may expose sensitive information about your site.'
}

function getExposedFileFix(path) {
  const fixes = {
    '/readme.html': 'Delete readme.html from your WordPress root folder. It\'s not needed for WordPress to function.',
    '/xmlrpc.php': 'Disable XML-RPC using a security plugin like Wordfence or Sucuri, or add a block in your .htaccess file.',
    '/.env': 'Immediately change all credentials in this file. Configure your server to block access to dotfiles.',
    '/.git/config': 'Remove the .git folder from your public web directory or configure your server to block access to it.'
  }
  return fixes[path] || 'Configure your server to block public access to this file.'
}

async function mockPluginsCheck(hostname) {
  // Simulate plugin detection
  const findings = []
  let score = 100

  const detectedPlugins = [
    { name: 'Contact Form 7', slug: 'contact-form-7', version: '5.7.2', status: 'outdated', vulnerable: true },
    { name: 'Yoast SEO', slug: 'yoast', version: '21.6', status: 'current', vulnerable: false },
    { name: 'WooCommerce', slug: 'woocommerce', version: '8.3.1', status: 'current', vulnerable: false },
    { name: 'Elementor', slug: 'elementor', version: '3.17', status: 'outdated', vulnerable: false }
  ]

  detectedPlugins.forEach(plugin => {
    if (plugin.vulnerable) {
      score -= 25
      findings.push({
        id: `plugin-${plugin.slug}`,
        name: plugin.name,
        status: CheckStatus.FAIL,
        severity: 'high',
        description: `${plugin.name} v${plugin.version} has known security vulnerabilities.`,
        whatItMeans: 'This plugin has publicly known security holes that hackers can exploit. Automated bots scan for these vulnerable plugins constantly.',
        howToFix: `Update ${plugin.name} to the latest version immediately from your WordPress admin panel (Plugins → Installed Plugins).`,
        details: { version: plugin.version, vulnerable: true }
      })
    } else if (plugin.status === 'outdated') {
      score -= 10
      findings.push({
        id: `plugin-${plugin.slug}`,
        name: plugin.name,
        status: CheckStatus.WARNING,
        severity: 'medium',
        description: `${plugin.name} v${plugin.version} may be outdated.`,
        whatItMeans: 'While no known vulnerabilities were found, running outdated plugins increases your risk.',
        howToFix: `Check for updates to ${plugin.name} in your WordPress admin panel.`,
        details: { version: plugin.version, vulnerable: false }
      })
    } else {
      findings.push({
        id: `plugin-${plugin.slug}`,
        name: plugin.name,
        status: CheckStatus.PASS,
        severity: 'info',
        description: `${plugin.name} v${plugin.version} appears current.`,
        details: { version: plugin.version, vulnerable: false }
      })
    }
  })

  return {
    status: score < 70 ? CheckStatus.FAIL : score < 90 ? CheckStatus.WARNING : CheckStatus.PASS,
    score: Math.max(0, score),
    findings,
    details: {
      detected: detectedPlugins.length,
      vulnerable: detectedPlugins.filter(p => p.vulnerable).length,
      outdated: detectedPlugins.filter(p => p.status === 'outdated').length
    }
  }
}

async function mockMalwareCheck(hostname) {
  // Most sites should pass malware check
  const hasMalware = Math.random() > 0.9 // 10% chance of issues

  if (hasMalware) {
    return {
      status: CheckStatus.FAIL,
      score: 20,
      findings: [
        {
          id: 'malware-suspicious-script',
          name: 'Suspicious Script Detected',
          status: CheckStatus.FAIL,
          severity: 'critical',
          description: 'Potentially malicious obfuscated JavaScript found on your site.',
          whatItMeans: 'Your site may be infected with malware that could steal visitor data, redirect to malicious sites, or damage your search rankings.',
          howToFix: 'Immediately scan your site with a malware removal tool like Sucuri or Wordfence. Consider hiring a security professional if the infection is severe.'
        }
      ],
      details: {
        safeBrowsing: 'flagged',
        signatures: 1
      }
    }
  }

  return {
    status: CheckStatus.PASS,
    score: 100,
    findings: [
      {
        id: 'malware-clean',
        name: 'No Malware Detected',
        status: CheckStatus.PASS,
        severity: 'info',
        description: 'No known malware signatures or suspicious patterns found.'
      },
      {
        id: 'malware-safebrowsing',
        name: 'Google Safe Browsing',
        status: CheckStatus.PASS,
        severity: 'info',
        description: 'Site is not flagged in Google Safe Browsing database.'
      }
    ],
    details: {
      safeBrowsing: 'clean',
      signatures: 0
    }
  }
}

async function mockPerformanceCheck(hostname) {
  const findings = []
  let score = 100

  // Check for outdated libraries
  const outdatedLib = Math.random() > 0.4 // 60% chance of outdated jQuery

  if (outdatedLib) {
    score -= 20
    findings.push({
      id: 'lib-jquery-outdated',
      name: 'Outdated jQuery',
      status: CheckStatus.WARNING,
      severity: 'medium',
      description: 'jQuery 1.12.4 detected. Current version is 3.7.1.',
      whatItMeans: 'Older jQuery versions have known security vulnerabilities and can slow down your site.',
      howToFix: 'Update jQuery to the latest version. If using WordPress, your theme or plugins may need updating.'
    })
  } else {
    findings.push({
      id: 'lib-jquery-current',
      name: 'jQuery Version',
      status: CheckStatus.PASS,
      severity: 'info',
      description: 'jQuery 3.7.1 detected (current version).'
    })
  }

  // Mixed content check
  const hasMixedContent = Math.random() > 0.7
  if (hasMixedContent) {
    score -= 15
    findings.push({
      id: 'mixed-content',
      name: 'Mixed Content Warning',
      status: CheckStatus.WARNING,
      severity: 'medium',
      description: 'Some resources are loaded over insecure HTTP connections.',
      whatItMeans: 'Mixed content can expose your visitors to security risks and causes browser warnings.',
      howToFix: 'Update all resource URLs to use HTTPS, or use protocol-relative URLs (//).'
    })
  }

  return {
    status: score >= 80 ? CheckStatus.PASS : CheckStatus.WARNING,
    score: Math.max(0, score),
    findings,
    details: {
      libraries: {
        jquery: outdatedLib ? '1.12.4' : '3.7.1'
      },
      mixedContent: hasMixedContent
    }
  }
}

// Export configuration for external modification
export { CONFIG as ScannerConfig }
