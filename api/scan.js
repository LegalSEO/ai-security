/**
 * Vercel Serverless Function: Website Security Scanner
 *
 * POST /api/scan
 * Body: { url: "https://example.com" }
 *
 * Returns comprehensive security scan results
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import tls from 'tls';

// CORS headers for the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Security headers we check for
const SECURITY_HEADERS = {
  'strict-transport-security': {
    name: 'HSTS',
    description: 'Forces HTTPS connections',
    severity: 'high',
    recommendation: 'Add Strict-Transport-Security header with max-age of at least 1 year'
  },
  'content-security-policy': {
    name: 'CSP',
    description: 'Prevents XSS and injection attacks',
    severity: 'high',
    recommendation: 'Implement a Content-Security-Policy to control resource loading'
  },
  'x-frame-options': {
    name: 'X-Frame-Options',
    description: 'Prevents clickjacking attacks',
    severity: 'medium',
    recommendation: 'Set X-Frame-Options to DENY or SAMEORIGIN'
  },
  'x-content-type-options': {
    name: 'X-Content-Type-Options',
    description: 'Prevents MIME type sniffing',
    severity: 'medium',
    recommendation: 'Set X-Content-Type-Options to nosniff'
  },
  'x-xss-protection': {
    name: 'X-XSS-Protection',
    description: 'Legacy XSS filter',
    severity: 'low',
    recommendation: 'Set X-XSS-Protection to 1; mode=block'
  },
  'referrer-policy': {
    name: 'Referrer-Policy',
    description: 'Controls referrer information leakage',
    severity: 'low',
    recommendation: 'Set Referrer-Policy to strict-origin-when-cross-origin'
  },
  'permissions-policy': {
    name: 'Permissions-Policy',
    description: 'Controls browser feature access',
    severity: 'low',
    recommendation: 'Implement Permissions-Policy to restrict unnecessary browser features'
  }
};

// Exposed files to check
const EXPOSED_FILES = [
  { path: '/.env', severity: 'critical', description: 'Environment variables with secrets' },
  { path: '/.git/config', severity: 'critical', description: 'Git repository configuration' },
  { path: '/wp-config.php.bak', severity: 'critical', description: 'WordPress config backup' },
  { path: '/.htaccess', severity: 'high', description: 'Apache configuration file' },
  { path: '/phpinfo.php', severity: 'high', description: 'PHP information disclosure' },
  { path: '/readme.html', severity: 'low', description: 'WordPress readme (version disclosure)' },
  { path: '/license.txt', severity: 'low', description: 'License file (version disclosure)' },
  { path: '/xmlrpc.php', severity: 'medium', description: 'WordPress XML-RPC (attack vector)' },
  { path: '/debug.log', severity: 'high', description: 'Debug log file' },
  { path: '/wp-config.php~', severity: 'critical', description: 'WordPress config backup' },
  { path: '/.DS_Store', severity: 'medium', description: 'macOS directory metadata' },
  { path: '/backup.zip', severity: 'critical', description: 'Backup archive' },
  { path: '/backup.sql', severity: 'critical', description: 'Database backup' },
];

// CMS signatures
const CMS_SIGNATURES = {
  wordpress: {
    name: 'WordPress',
    patterns: ['/wp-content/', '/wp-includes/', 'wp-json', 'wordpress'],
    versionPatterns: [
      /<meta[^>]+generator[^>]+wordpress\s*([\d.]+)/i,
      /ver=([\d.]+)[^"]*wp-/i
    ]
  },
  drupal: {
    name: 'Drupal',
    patterns: ['Drupal.settings', '/sites/default/', 'drupal'],
    versionPatterns: [/<meta[^>]+generator[^>]+drupal\s*([\d.]+)/i]
  },
  joomla: {
    name: 'Joomla',
    patterns: ['/media/jui/', '/components/com_', 'joomla'],
    versionPatterns: [/<meta[^>]+generator[^>]+joomla[^"]*\s*([\d.]+)/i]
  },
  shopify: {
    name: 'Shopify',
    patterns: ['cdn.shopify.com', 'myshopify.com', 'Shopify.theme'],
    versionPatterns: []
  },
  wix: {
    name: 'Wix',
    patterns: ['wix.com', 'wixstatic.com', '_wix_browser_sess'],
    versionPatterns: []
  },
  squarespace: {
    name: 'Squarespace',
    patterns: ['squarespace.com', 'static1.squarespace.com'],
    versionPatterns: []
  }
};

// Malware signatures (basic patterns)
const MALWARE_SIGNATURES = [
  { pattern: /eval\s*\(\s*base64_decode/gi, name: 'Base64 Eval', severity: 'critical' },
  { pattern: /document\.write\s*\(\s*unescape/gi, name: 'Obfuscated Script', severity: 'high' },
  { pattern: /<iframe[^>]+style\s*=\s*["'][^"']*display\s*:\s*none/gi, name: 'Hidden Iframe', severity: 'high' },
  { pattern: /fromCharCode\s*\([^)]{100,}/gi, name: 'Obfuscated CharCode', severity: 'medium' },
];

/**
 * Main handler
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Normalize URL
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl.valid) {
      return res.status(400).json({ error: normalizedUrl.error });
    }

    console.log(`Starting scan for: ${normalizedUrl.url}`);

    // Run all checks in parallel
    const [sslResult, headersResult, pageData] = await Promise.all([
      checkSSL(normalizedUrl.hostname),
      checkSecurityHeaders(normalizedUrl.url),
      fetchPage(normalizedUrl.url)
    ]);

    // These depend on page data
    const cmsResult = detectCMS(pageData.html, normalizedUrl.url);
    const malwareResult = checkMalwareSignatures(pageData.html);

    // Check exposed files (run a few in parallel, not all to avoid rate limiting)
    const exposedFilesResult = await checkExposedFiles(normalizedUrl.url);

    // Calculate scores
    const categories = {
      ssl: sslResult,
      headers: headersResult,
      cms: cmsResult,
      exposed_files: exposedFilesResult,
      malware: malwareResult,
      performance: checkPerformance(pageData.html)
    };

    // Calculate final score
    const { score, grade, summary } = calculateFinalScore(categories);

    const result = {
      success: true,
      url: normalizedUrl.url,
      hostname: normalizedUrl.hostname,
      scanTime: new Date().toISOString(),
      score,
      grade,
      summary,
      categories
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error('Scan error:', error);
    return res.status(500).json({
      error: 'Scan failed',
      message: error.message
    });
  }
}

/**
 * Normalize and validate URL
 */
function normalizeUrl(input) {
  let url = input.trim().toLowerCase();
  url = url.replace(/\/+$/, '');

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    const parsed = new URL(url);
    return {
      valid: true,
      url: parsed.origin,
      hostname: parsed.hostname,
      protocol: parsed.protocol
    };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Check SSL certificate
 */
async function checkSSL(hostname) {
  return new Promise((resolve) => {
    const findings = [];
    let score = 100;

    const options = {
      host: hostname,
      port: 443,
      method: 'HEAD',
      rejectUnauthorized: false, // We want to inspect even invalid certs
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      const socket = res.socket;

      if (socket && socket.getPeerCertificate) {
        const cert = socket.getPeerCertificate();

        if (cert && Object.keys(cert).length > 0) {
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();
          const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));

          // Check if expired
          if (validTo < now) {
            score = 0;
            findings.push({
              id: 'ssl-expired',
              name: 'SSL Certificate Expired',
              status: 'fail',
              severity: 'critical',
              description: `Certificate expired on ${validTo.toDateString()}`,
              whatItMeans: 'An expired SSL certificate means browsers will warn visitors that your site is not secure. This destroys trust and tanks search rankings.',
              howToFix: 'Renew your SSL certificate immediately through your hosting provider or domain registrar.'
            });
          } else if (daysRemaining < 30) {
            score -= 20;
            findings.push({
              id: 'ssl-expiring-soon',
              name: 'SSL Certificate Expiring Soon',
              status: 'warning',
              severity: 'medium',
              description: `Certificate expires in ${daysRemaining} days (${validTo.toDateString()})`,
              whatItMeans: 'Your certificate will expire soon. If not renewed, visitors will see security warnings.',
              howToFix: 'Renew your SSL certificate before it expires. Most hosts offer auto-renewal.'
            });
          } else {
            findings.push({
              id: 'ssl-valid',
              name: 'SSL Certificate Valid',
              status: 'pass',
              severity: 'info',
              description: `Valid until ${validTo.toDateString()} (${daysRemaining} days remaining)`,
              details: {
                issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown',
                validFrom: validFrom.toISOString().split('T')[0],
                validUntil: validTo.toISOString().split('T')[0],
                daysRemaining
              }
            });
          }

          // Check if authorized (trusted chain)
          if (socket.authorized) {
            findings.push({
              id: 'ssl-trusted',
              name: 'Certificate Trusted',
              status: 'pass',
              severity: 'info',
              description: 'Certificate is issued by a trusted authority.'
            });
          } else {
            score -= 30;
            findings.push({
              id: 'ssl-untrusted',
              name: 'Certificate Not Trusted',
              status: 'fail',
              severity: 'high',
              description: socket.authorizationError || 'Certificate chain is not trusted',
              whatItMeans: 'Browsers may show security warnings to visitors.',
              howToFix: 'Ensure your SSL certificate is from a trusted Certificate Authority.'
            });
          }
        } else {
          score = 20;
          findings.push({
            id: 'ssl-no-cert',
            name: 'No SSL Certificate',
            status: 'fail',
            severity: 'critical',
            description: 'No SSL certificate found or unable to retrieve certificate info.',
            whatItMeans: 'Your site may not be using HTTPS properly.',
            howToFix: 'Install an SSL certificate. Most hosts offer free SSL via Let\'s Encrypt.'
          });
        }
      }

      resolve({
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score: Math.max(0, score),
        findings
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'fail',
        score: 0,
        findings: [{
          id: 'ssl-error',
          name: 'SSL Connection Failed',
          status: 'fail',
          severity: 'critical',
          description: `Could not establish SSL connection: ${err.message}`,
          whatItMeans: 'Your site may not support HTTPS or has SSL configuration issues.',
          howToFix: 'Ensure your server is configured for HTTPS and the SSL certificate is properly installed.'
        }]
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'warning',
        score: 50,
        findings: [{
          id: 'ssl-timeout',
          name: 'SSL Check Timeout',
          status: 'warning',
          severity: 'medium',
          description: 'SSL check timed out. The server may be slow or blocking our request.'
        }]
      });
    });

    req.end();
  });
}

/**
 * Check security headers
 */
async function checkSecurityHeaders(url) {
  return new Promise((resolve) => {
    const findings = [];
    let score = 100;

    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.protocol === 'https:' ? 443 : 80,
      path: '/',
      method: 'HEAD',
      timeout: 10000
    };

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      const headers = res.headers;
      const headerKeys = Object.keys(headers).map(h => h.toLowerCase());

      Object.entries(SECURITY_HEADERS).forEach(([headerKey, config]) => {
        const headerValue = headers[headerKey];

        if (headerValue) {
          findings.push({
            id: `header-${headerKey}`,
            name: config.name,
            status: 'pass',
            severity: 'info',
            description: `${config.description} - Configured`,
            details: { value: headerValue.substring(0, 100) }
          });
        } else {
          const deduction = config.severity === 'high' ? 15 : config.severity === 'medium' ? 10 : 5;
          score -= deduction;

          findings.push({
            id: `header-${headerKey}`,
            name: config.name,
            status: config.severity === 'high' ? 'fail' : 'warning',
            severity: config.severity,
            description: `${config.description} - Missing`,
            whatItMeans: getHeaderExplanation(headerKey),
            howToFix: config.recommendation
          });
        }
      });

      resolve({
        status: score >= 70 ? 'pass' : score >= 40 ? 'warning' : 'fail',
        score: Math.max(0, score),
        findings,
        details: {
          present: findings.filter(f => f.status === 'pass').length,
          missing: findings.filter(f => f.status !== 'pass').length,
          total: Object.keys(SECURITY_HEADERS).length
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'error',
        score: 0,
        findings: [{
          id: 'headers-error',
          name: 'Headers Check Failed',
          status: 'error',
          severity: 'high',
          description: `Could not retrieve headers: ${err.message}`
        }]
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'warning',
        score: 50,
        findings: [{
          id: 'headers-timeout',
          name: 'Headers Check Timeout',
          status: 'warning',
          severity: 'medium',
          description: 'Request timed out while checking security headers.'
        }]
      });
    });

    req.end();
  });
}

function getHeaderExplanation(header) {
  const explanations = {
    'strict-transport-security': 'Without HSTS, attackers can intercept your traffic by tricking browsers into using insecure HTTP connections.',
    'content-security-policy': 'Without CSP, your site is more vulnerable to cross-site scripting (XSS) attacks.',
    'x-frame-options': 'Without this header, attackers could embed your site in an iframe for clickjacking attacks.',
    'x-content-type-options': 'Without this header, browsers might misinterpret files, leading to security vulnerabilities.',
    'referrer-policy': 'Without this header, sensitive information in your URLs might leak to third-party sites.',
    'permissions-policy': 'Without this header, embedded content could access device features without your knowledge.'
  };
  return explanations[header] || 'This security header helps protect against common web attacks.';
}

/**
 * Fetch page HTML for analysis
 */
async function fetchPage(url) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.protocol === 'https:' ? 443 : 80,
      path: '/',
      method: 'GET',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AegisSecurity/1.0; +https://aegissecurity.com)'
      }
    };

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
        // Limit to first 500KB
        if (data.length > 500000) {
          req.destroy();
        }
      });

      res.on('end', () => {
        resolve({ html: data, statusCode: res.statusCode, headers: res.headers });
      });
    });

    req.on('error', () => {
      resolve({ html: '', statusCode: 0, headers: {} });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ html: '', statusCode: 0, headers: {} });
    });

    req.end();
  });
}

/**
 * Detect CMS from page content
 */
function detectCMS(html, url) {
  const findings = [];
  let score = 100;
  let detectedCMS = null;
  let version = null;

  const lowerHtml = html.toLowerCase();

  for (const [key, cms] of Object.entries(CMS_SIGNATURES)) {
    const found = cms.patterns.some(pattern => lowerHtml.includes(pattern.toLowerCase()));

    if (found) {
      detectedCMS = cms.name;

      // Try to extract version
      for (const versionPattern of cms.versionPatterns) {
        const match = html.match(versionPattern);
        if (match && match[1]) {
          version = match[1];
          break;
        }
      }
      break;
    }
  }

  if (detectedCMS) {
    findings.push({
      id: 'cms-detected',
      name: 'CMS Detected',
      status: 'pass',
      severity: 'info',
      description: `${detectedCMS}${version ? ' ' + version : ''} detected`,
      details: { cms: detectedCMS, version }
    });

    // Check if WordPress version is outdated (simplified check)
    if (detectedCMS === 'WordPress' && version) {
      const majorVersion = parseFloat(version);
      if (majorVersion < 6.0) {
        score -= 30;
        findings.push({
          id: 'cms-outdated',
          name: 'Outdated CMS Version',
          status: 'fail',
          severity: 'high',
          description: `WordPress ${version} is outdated. Current major version is 6.x.`,
          whatItMeans: 'Outdated WordPress versions have known security vulnerabilities that attackers actively exploit.',
          howToFix: 'Update WordPress to the latest version via Dashboard → Updates. Always backup first.'
        });
      }
    }

    // Check for WordPress-specific issues
    if (detectedCMS === 'WordPress') {
      // Check for exposed user enumeration
      if (lowerHtml.includes('/author/') || lowerHtml.includes('wp-json/wp/v2/users')) {
        score -= 10;
        findings.push({
          id: 'cms-user-enum',
          name: 'User Enumeration Possible',
          status: 'warning',
          severity: 'medium',
          description: 'WordPress user information may be accessible.',
          whatItMeans: 'Attackers can discover usernames to target in brute force attacks.',
          howToFix: 'Use a security plugin to disable user enumeration and REST API user endpoints.'
        });
      }
    }
  } else {
    findings.push({
      id: 'cms-not-detected',
      name: 'CMS Not Detected',
      status: 'pass',
      severity: 'info',
      description: 'No common CMS detected. Site may use a custom solution or modern framework.',
      whatItMeans: 'Custom solutions can be more secure as they\'re not targeted by automated attacks.'
    });
  }

  return {
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score: Math.max(0, score),
    findings,
    details: { cms: detectedCMS, version }
  };
}

/**
 * Check for exposed sensitive files
 */
async function checkExposedFiles(baseUrl) {
  const findings = [];
  let score = 100;

  // Check files in batches to avoid rate limiting
  const checkFile = async (file) => {
    return new Promise((resolve) => {
      const fileUrl = new URL(file.path, baseUrl);
      const options = {
        hostname: fileUrl.hostname,
        port: fileUrl.protocol === 'https:' ? 443 : 80,
        path: fileUrl.pathname,
        method: 'HEAD',
        timeout: 5000
      };

      const protocol = fileUrl.protocol === 'https:' ? https : http;

      const req = protocol.request(options, (res) => {
        resolve({
          file,
          exists: res.statusCode >= 200 && res.statusCode < 400 && res.statusCode !== 403
        });
      });

      req.on('error', () => resolve({ file, exists: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ file, exists: false });
      });

      req.end();
    });
  };

  // Check files in parallel (limit concurrency)
  const results = await Promise.all(EXPOSED_FILES.map(checkFile));

  results.forEach(({ file, exists }) => {
    if (exists) {
      const deduction = file.severity === 'critical' ? 25 :
                       file.severity === 'high' ? 15 :
                       file.severity === 'medium' ? 10 : 5;
      score -= deduction;

      findings.push({
        id: `exposed-${file.path.replace(/[^a-z0-9]/gi, '-')}`,
        name: `Exposed: ${file.path}`,
        status: file.severity === 'critical' || file.severity === 'high' ? 'fail' : 'warning',
        severity: file.severity,
        description: file.description,
        whatItMeans: getExposedFileExplanation(file.path),
        howToFix: getExposedFileFix(file.path)
      });
    }
  });

  // Add some pass findings for context
  if (findings.length === 0) {
    findings.push({
      id: 'exposed-none',
      name: 'No Exposed Files Found',
      status: 'pass',
      severity: 'info',
      description: 'Common sensitive files are not publicly accessible.'
    });
  }

  return {
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score: Math.max(0, score),
    findings,
    details: {
      exposed: findings.filter(f => f.status !== 'pass').length,
      checked: EXPOSED_FILES.length
    }
  };
}

function getExposedFileExplanation(path) {
  const explanations = {
    '/.env': 'Environment files contain database passwords, API keys, and secrets.',
    '/.git/config': 'Git configuration could expose your source code and credentials.',
    '/readme.html': 'Reveals your WordPress version, helping attackers find known vulnerabilities.',
    '/xmlrpc.php': 'XML-RPC is commonly exploited for brute force attacks.',
    '/wp-config.php.bak': 'Backup config files may contain database credentials.',
    '/debug.log': 'Debug logs can reveal sensitive application information.'
  };
  return explanations[path] || 'This file may expose sensitive information.';
}

function getExposedFileFix(path) {
  const fixes = {
    '/.env': 'Block access via .htaccess or server config. Change all credentials immediately.',
    '/.git/config': 'Remove .git folder from public directory or block access via server config.',
    '/readme.html': 'Delete this file from WordPress root - it\'s not needed.',
    '/xmlrpc.php': 'Disable XML-RPC with a security plugin or .htaccess rules.',
    '/wp-config.php.bak': 'Delete backup files from your server immediately.',
    '/debug.log': 'Move logs outside web root or restrict access via server config.'
  };
  return fixes[path] || 'Configure your server to block public access to this file.';
}

/**
 * Check for malware signatures
 */
function checkMalwareSignatures(html) {
  const findings = [];
  let score = 100;
  let signatureMatches = 0;

  MALWARE_SIGNATURES.forEach(sig => {
    if (sig.pattern.test(html)) {
      signatureMatches++;
      const deduction = sig.severity === 'critical' ? 40 : sig.severity === 'high' ? 25 : 15;
      score -= deduction;

      findings.push({
        id: `malware-${sig.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: sig.name,
        status: 'fail',
        severity: sig.severity,
        description: `Suspicious pattern detected: ${sig.name}`,
        whatItMeans: 'Your site may contain malicious code that could harm visitors or steal data.',
        howToFix: 'Scan your site with a malware removal tool like Sucuri or Wordfence. Consider hiring a security professional.'
      });
    }
  });

  if (signatureMatches === 0) {
    findings.push({
      id: 'malware-clean',
      name: 'No Malware Signatures',
      status: 'pass',
      severity: 'info',
      description: 'No known malware patterns detected in page source.'
    });
  }

  return {
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score: Math.max(0, score),
    findings,
    details: { signaturesFound: signatureMatches }
  };
}

/**
 * Check for outdated libraries
 */
function checkPerformance(html) {
  const findings = [];
  let score = 100;

  // Check jQuery version
  const jqueryMatch = html.match(/jquery[.-]?([\d.]+)(?:\.min)?\.js/i);
  if (jqueryMatch) {
    const version = jqueryMatch[1];
    const majorVersion = parseFloat(version);

    if (majorVersion < 3.0) {
      score -= 20;
      findings.push({
        id: 'lib-jquery-outdated',
        name: 'Outdated jQuery',
        status: 'warning',
        severity: 'medium',
        description: `jQuery ${version} detected. Current version is 3.7.x.`,
        whatItMeans: 'Older jQuery versions have security vulnerabilities.',
        howToFix: 'Update jQuery to version 3.x or higher.'
      });
    } else {
      findings.push({
        id: 'lib-jquery-current',
        name: 'jQuery Version',
        status: 'pass',
        severity: 'info',
        description: `jQuery ${version} detected.`
      });
    }
  }

  // Check for mixed content indicators
  const mixedContentPattern = /<(?:img|script|link|iframe)[^>]+src\s*=\s*["']http:\/\//gi;
  if (mixedContentPattern.test(html)) {
    score -= 15;
    findings.push({
      id: 'mixed-content',
      name: 'Mixed Content',
      status: 'warning',
      severity: 'medium',
      description: 'Some resources are loaded over insecure HTTP.',
      whatItMeans: 'Mixed content can expose visitors to security risks.',
      howToFix: 'Update all resource URLs to use HTTPS.'
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'performance-ok',
      name: 'Tech Stack Check',
      status: 'pass',
      severity: 'info',
      description: 'No obvious outdated libraries detected.'
    });
  }

  return {
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score: Math.max(0, score),
    findings
  };
}

/**
 * Calculate final score
 */
function calculateFinalScore(categories) {
  const weights = {
    ssl: 25,
    headers: 20,
    cms: 15,
    exposed_files: 20,
    malware: 15,
    performance: 5
  };

  let totalWeight = 0;
  let weightedScore = 0;
  let passed = 0;
  let warnings = 0;
  let failed = 0;
  let critical = 0;

  Object.entries(categories).forEach(([key, category]) => {
    const weight = weights[key] || 10;
    if (category.score !== null && category.score !== undefined) {
      totalWeight += weight;
      weightedScore += category.score * weight;
    }

    category.findings?.forEach(finding => {
      if (finding.status === 'pass') passed++;
      else if (finding.status === 'warning') warnings++;
      else if (finding.status === 'fail') {
        if (finding.severity === 'critical') critical++;
        else failed++;
      }
    });
  });

  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;

  let grade;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  return {
    score,
    grade,
    summary: { passed, warnings, failed, critical }
  };
}
