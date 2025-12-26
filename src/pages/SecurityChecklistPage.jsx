/**
 * Security Checklist Page - MVP Version
 * Static checklist with localStorage progress saving
 */

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Lock,
  Server,
  Globe,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Zap,
  Download,
  Search,
  RefreshCw,
  Key,
  Eye,
  Database,
  Mail,
  Smartphone,
  Cloud,
  Settings
} from 'lucide-react'
import jsPDF from 'jspdf'

// Storage key for localStorage
const STORAGE_KEY = 'tzu_security_checklist_progress'

// Difficulty levels
const DIFFICULTY = {
  EASY: { label: 'Easy', color: 'bg-secure-500/20 text-secure-400', time: '5-10 min' },
  MEDIUM: { label: 'Medium', color: 'bg-shield-500/20 text-shield-400', time: '15-30 min' },
  HARD: { label: 'Advanced', color: 'bg-threat-500/20 text-threat-400', time: '30-60 min' }
}

// Checklist data
const checklistData = [
  {
    id: 'ssl-https',
    name: 'SSL & HTTPS Security',
    icon: Lock,
    description: 'Secure your site connections',
    tasks: [
      {
        id: 'ssl-1',
        title: 'Install SSL Certificate',
        difficulty: 'EASY',
        why: 'SSL encrypts data between your visitors and your server. Without it, hackers can intercept passwords, credit cards, and personal info.',
        steps: [
          'Log into your hosting control panel (cPanel, Plesk, etc.)',
          'Look for "SSL/TLS" or "Security" section',
          'Use "Let\'s Encrypt" for free SSL or purchase a certificate',
          'Install the certificate for your domain',
          'Verify by visiting https://yourdomain.com'
        ]
      },
      {
        id: 'ssl-2',
        title: 'Force HTTPS Redirect',
        difficulty: 'EASY',
        why: 'Even with SSL installed, visitors can still access your site via HTTP. Forcing HTTPS ensures all traffic is encrypted.',
        steps: [
          'Access your .htaccess file via FTP or file manager',
          'Add redirect rules to force HTTPS',
          'Or enable "Force SSL" in your hosting panel',
          'Test by visiting http://yourdomain.com - should redirect to https://',
          'Check all internal links use https://'
        ]
      },
      {
        id: 'ssl-3',
        title: 'Enable HSTS Header',
        difficulty: 'MEDIUM',
        why: 'HSTS tells browsers to only connect via HTTPS, preventing downgrade attacks and SSL stripping.',
        steps: [
          'Add HSTS header to your server configuration',
          'Start with a short max-age (300 seconds) for testing',
          'Gradually increase to 31536000 (1 year)',
          'Consider adding includeSubDomains directive',
          'Test with securityheaders.com'
        ]
      },
      {
        id: 'ssl-4',
        title: 'Check Certificate Expiration',
        difficulty: 'EASY',
        why: 'Expired certificates cause browser warnings that scare away visitors and can break your site functionality.',
        steps: [
          'Click the padlock icon in your browser',
          'View certificate details and expiration date',
          'Set a calendar reminder 30 days before expiration',
          'Enable auto-renewal if available',
          'Consider monitoring services like SSL Labs'
        ]
      }
    ]
  },
  {
    id: 'passwords-auth',
    name: 'Passwords & Authentication',
    icon: Key,
    description: 'Protect access to your accounts',
    tasks: [
      {
        id: 'auth-1',
        title: 'Use Strong Admin Passwords',
        difficulty: 'EASY',
        why: 'Weak passwords are the #1 cause of website breaches. Attackers use automated tools that try millions of password combinations.',
        steps: [
          'Use a password manager (1Password, Bitwarden, LastPass)',
          'Generate passwords with 16+ characters',
          'Include uppercase, lowercase, numbers, symbols',
          'Never reuse passwords across sites',
          'Change default admin usernames (not "admin")'
        ]
      },
      {
        id: 'auth-2',
        title: 'Enable Two-Factor Authentication',
        difficulty: 'EASY',
        why: 'Even if your password is stolen, 2FA prevents unauthorized access by requiring a second verification step.',
        steps: [
          'Install an authenticator app (Google Authenticator, Authy)',
          'Enable 2FA in your CMS/hosting admin panel',
          'Scan the QR code with your authenticator app',
          'Save backup codes in a secure location',
          'Test login with 2FA enabled'
        ]
      },
      {
        id: 'auth-3',
        title: 'Limit Login Attempts',
        difficulty: 'MEDIUM',
        why: 'Brute force attacks try thousands of password combinations. Limiting attempts blocks these automated attacks.',
        steps: [
          'Install a security plugin (Wordfence, Sucuri, etc.)',
          'Configure to lock out after 3-5 failed attempts',
          'Set lockout duration (15-30 minutes)',
          'Whitelist your own IP address',
          'Enable email notifications for lockouts'
        ]
      },
      {
        id: 'auth-4',
        title: 'Change Default Login URL',
        difficulty: 'MEDIUM',
        why: 'Attackers know default login URLs (/wp-admin, /admin). Custom URLs reduce automated attack surface.',
        steps: [
          'Install a login URL plugin or configure via .htaccess',
          'Choose a unique, non-obvious URL',
          'Update bookmarks and team documentation',
          'Test the new login URL works correctly',
          'Ensure the old URL returns 404'
        ]
      },
      {
        id: 'auth-5',
        title: 'Review User Accounts',
        difficulty: 'EASY',
        why: 'Old accounts from former employees or unused admin accounts are security risks waiting to be exploited.',
        steps: [
          'List all user accounts in your CMS',
          'Delete accounts no longer needed',
          'Downgrade permissions where possible',
          'Ensure each person has their own account',
          'Review account activity logs'
        ]
      }
    ]
  },
  {
    id: 'updates-maintenance',
    name: 'Updates & Maintenance',
    icon: RefreshCw,
    description: 'Keep your software current',
    tasks: [
      {
        id: 'update-1',
        title: 'Update CMS Core',
        difficulty: 'MEDIUM',
        why: 'Outdated CMS versions have known vulnerabilities. Hackers actively scan for and exploit unpatched sites.',
        steps: [
          'Backup your site before updating',
          'Check current version in admin dashboard',
          'Review changelog for breaking changes',
          'Update to latest stable version',
          'Test site functionality after update'
        ]
      },
      {
        id: 'update-2',
        title: 'Update All Plugins/Extensions',
        difficulty: 'MEDIUM',
        why: 'Plugins are the most common attack vector. A single vulnerable plugin can compromise your entire site.',
        steps: [
          'Review all installed plugins',
          'Remove unused or abandoned plugins',
          'Update remaining plugins to latest versions',
          'Check compatibility before bulk updates',
          'Test site after updates'
        ]
      },
      {
        id: 'update-3',
        title: 'Update Themes',
        difficulty: 'EASY',
        why: 'Theme vulnerabilities can allow attackers to inject malicious code or gain admin access.',
        steps: [
          'Delete unused themes (keep only active + one default)',
          'Update active theme to latest version',
          'Check child theme for custom modifications',
          'Review theme after update for visual issues',
          'Consider premium themes with regular updates'
        ]
      },
      {
        id: 'update-4',
        title: 'Set Up Automatic Updates',
        difficulty: 'MEDIUM',
        why: 'Manual updates are often delayed or forgotten. Auto-updates ensure security patches are applied quickly.',
        steps: [
          'Enable auto-updates for minor CMS versions',
          'Configure plugin auto-updates for trusted plugins',
          'Set up email notifications for updates',
          'Schedule weekly manual review of major updates',
          'Use staging environment for testing'
        ]
      },
      {
        id: 'update-5',
        title: 'Monitor for Vulnerabilities',
        difficulty: 'MEDIUM',
        why: 'New vulnerabilities are discovered daily. Staying informed lets you act before attackers exploit them.',
        steps: [
          'Subscribe to security mailing lists',
          'Follow your CMS security blog',
          'Use vulnerability scanning tools',
          'Set up Google Alerts for "[your CMS] vulnerability"',
          'Review security news weekly'
        ]
      }
    ]
  },
  {
    id: 'backups',
    name: 'Backups & Recovery',
    icon: Database,
    description: 'Prepare for the worst case',
    tasks: [
      {
        id: 'backup-1',
        title: 'Set Up Automated Backups',
        difficulty: 'MEDIUM',
        why: 'Without backups, a hack or server failure means starting from scratch. Regular backups are your insurance policy.',
        steps: [
          'Choose a backup solution (plugin or hosting feature)',
          'Configure daily database backups',
          'Configure weekly full-site backups',
          'Set retention period (keep 30 days minimum)',
          'Verify backups are running successfully'
        ]
      },
      {
        id: 'backup-2',
        title: 'Store Backups Off-Site',
        difficulty: 'MEDIUM',
        why: 'Backups on the same server can be lost in a server failure or ransomware attack. Off-site storage protects against total loss.',
        steps: [
          'Set up cloud storage (AWS S3, Google Drive, Dropbox)',
          'Configure backup plugin to sync to cloud',
          'Verify files are uploading correctly',
          'Test download speed and accessibility',
          'Consider geographic redundancy'
        ]
      },
      {
        id: 'backup-3',
        title: 'Test Backup Restoration',
        difficulty: 'HARD',
        why: 'A backup you can\'t restore is worthless. Regular testing ensures you can actually recover when needed.',
        steps: [
          'Set up a staging/test environment',
          'Download a recent backup',
          'Restore to the test environment',
          'Verify all functionality works',
          'Document the restoration process'
        ]
      },
      {
        id: 'backup-4',
        title: 'Backup Before Major Changes',
        difficulty: 'EASY',
        why: 'Updates and changes can break your site. A pre-change backup lets you quickly roll back if something goes wrong.',
        steps: [
          'Create manual backup before updates',
          'Include both files and database',
          'Label backup with date and reason',
          'Keep for at least 7 days after change',
          'Verify backup completed successfully'
        ]
      }
    ]
  },
  {
    id: 'security-headers',
    name: 'Security Headers',
    icon: Shield,
    description: 'Configure browser protections',
    tasks: [
      {
        id: 'header-1',
        title: 'Add Content Security Policy',
        difficulty: 'HARD',
        why: 'CSP prevents XSS attacks by controlling which scripts can run on your site. It\'s one of the most powerful security headers.',
        steps: [
          'Audit your site for inline scripts and styles',
          'Start with a report-only CSP to identify issues',
          'Gradually tighten the policy',
          'Add nonces or hashes for inline scripts',
          'Test thoroughly before enforcing'
        ]
      },
      {
        id: 'header-2',
        title: 'Enable X-Frame-Options',
        difficulty: 'EASY',
        why: 'Prevents clickjacking attacks where your site is embedded in a malicious iframe to trick users.',
        steps: [
          'Add X-Frame-Options header to server config',
          'Set value to DENY or SAMEORIGIN',
          'Test that your site can\'t be iframed',
          'Exception: Allow specific domains if needed',
          'Verify with browser developer tools'
        ]
      },
      {
        id: 'header-3',
        title: 'Set X-Content-Type-Options',
        difficulty: 'EASY',
        why: 'Prevents MIME type sniffing which can lead to XSS attacks through malicious file uploads.',
        steps: [
          'Add X-Content-Type-Options: nosniff header',
          'Apply to all responses',
          'Test with securityheaders.com',
          'Ensure correct Content-Type on all resources',
          'No configuration needed beyond adding header'
        ]
      },
      {
        id: 'header-4',
        title: 'Configure Referrer Policy',
        difficulty: 'EASY',
        why: 'Controls how much referrer information is sent with requests, preventing information leakage.',
        steps: [
          'Choose appropriate policy level',
          'Recommended: strict-origin-when-cross-origin',
          'Add Referrer-Policy header to server config',
          'Test external link behavior',
          'Check analytics still work correctly'
        ]
      },
      {
        id: 'header-5',
        title: 'Add Permissions Policy',
        difficulty: 'MEDIUM',
        why: 'Controls which browser features your site can use, reducing attack surface from compromised scripts.',
        steps: [
          'Identify features your site actually needs',
          'Disable unused features (camera, microphone, etc.)',
          'Add Permissions-Policy header',
          'Test that required features still work',
          'Review periodically as needs change'
        ]
      }
    ]
  },
  {
    id: 'file-security',
    name: 'File & Upload Security',
    icon: FileText,
    description: 'Protect your file system',
    tasks: [
      {
        id: 'file-1',
        title: 'Restrict File Upload Types',
        difficulty: 'MEDIUM',
        why: 'Unrestricted uploads let attackers upload malicious scripts that can take over your server.',
        steps: [
          'Whitelist allowed file extensions',
          'Block executable files (.php, .exe, .js, etc.)',
          'Validate MIME types server-side',
          'Rename uploaded files to random strings',
          'Store uploads outside web root if possible'
        ]
      },
      {
        id: 'file-2',
        title: 'Set Correct File Permissions',
        difficulty: 'MEDIUM',
        why: 'Wrong permissions let attackers modify files or execute malicious code. Restrictive permissions limit damage.',
        steps: [
          'Set directories to 755',
          'Set files to 644',
          'Config files should be 600 or 640',
          'Never use 777 permissions',
          'Use SSH/SFTP, not FTP'
        ]
      },
      {
        id: 'file-3',
        title: 'Disable Directory Listing',
        difficulty: 'EASY',
        why: 'Directory listing exposes your file structure, helping attackers find vulnerable files and backups.',
        steps: [
          'Add "Options -Indexes" to .htaccess',
          'Or configure in server settings',
          'Test by visiting directories without index file',
          'Should show 403 Forbidden, not file list',
          'Check all directories on your site'
        ]
      },
      {
        id: 'file-4',
        title: 'Protect Sensitive Files',
        difficulty: 'MEDIUM',
        why: 'Config files, backups, and logs contain sensitive info. Exposing them can lead to complete compromise.',
        steps: [
          'Block access to .htaccess, wp-config.php, etc.',
          'Move sensitive files above web root',
          'Block access to backup files (.sql, .zip)',
          'Protect log files from public access',
          'Test by trying to access these files directly'
        ]
      }
    ]
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Detection',
    icon: Eye,
    description: 'Know when something is wrong',
    tasks: [
      {
        id: 'monitor-1',
        title: 'Set Up Uptime Monitoring',
        difficulty: 'EASY',
        why: 'You should know your site is down before your customers do. Uptime monitors alert you immediately.',
        steps: [
          'Sign up for UptimeRobot, Pingdom, or similar',
          'Add your website URL to monitor',
          'Configure alert thresholds',
          'Set up email/SMS notifications',
          'Add key pages beyond just homepage'
        ]
      },
      {
        id: 'monitor-2',
        title: 'Enable File Integrity Monitoring',
        difficulty: 'MEDIUM',
        why: 'Hackers modify core files to inject malware. Integrity monitoring detects unauthorized changes.',
        steps: [
          'Install security plugin with file monitoring',
          'Run initial scan to establish baseline',
          'Configure email alerts for changes',
          'Review and whitelist legitimate changes',
          'Investigate unexpected modifications'
        ]
      },
      {
        id: 'monitor-3',
        title: 'Monitor for Blacklisting',
        difficulty: 'EASY',
        why: 'If your site gets hacked and blacklisted, you lose search rankings and customers see scary warnings.',
        steps: [
          'Set up Google Search Console',
          'Enable security issue notifications',
          'Check Safe Browsing status regularly',
          'Use VirusTotal for additional checking',
          'Set up alerts for blacklist status'
        ]
      },
      {
        id: 'monitor-4',
        title: 'Review Access Logs',
        difficulty: 'MEDIUM',
        why: 'Logs reveal attack attempts, successful breaches, and suspicious activity before major damage occurs.',
        steps: [
          'Locate your server access logs',
          'Look for unusual 404 errors (scanning)',
          'Check for repeated failed logins',
          'Identify suspicious IP addresses',
          'Set up log analysis tools'
        ]
      },
      {
        id: 'monitor-5',
        title: 'Set Up Security Alerts',
        difficulty: 'MEDIUM',
        why: 'Real-time alerts let you respond to attacks as they happen, minimizing damage and data loss.',
        steps: [
          'Configure alerts for failed logins',
          'Alert on admin account changes',
          'Notify on file modifications',
          'Set up alerts for new user registrations',
          'Configure thresholds to reduce noise'
        ]
      }
    ]
  },
  {
    id: 'forms-input',
    name: 'Forms & User Input',
    icon: Mail,
    description: 'Secure your forms and inputs',
    tasks: [
      {
        id: 'form-1',
        title: 'Add CAPTCHA to Forms',
        difficulty: 'EASY',
        why: 'Bots spam contact forms, create fake accounts, and attempt brute force attacks. CAPTCHA blocks automated abuse.',
        steps: [
          'Sign up for reCAPTCHA or hCaptcha',
          'Get API keys for your domain',
          'Add CAPTCHA to login, registration, contact forms',
          'Use invisible CAPTCHA for better UX',
          'Test that forms still work for real users'
        ]
      },
      {
        id: 'form-2',
        title: 'Validate and Sanitize Inputs',
        difficulty: 'HARD',
        why: 'Unsanitized input leads to SQL injection, XSS, and other attacks. Proper validation is your first defense.',
        steps: [
          'Use parameterized queries for database',
          'Escape all output displayed to users',
          'Validate input types (email, phone, etc.)',
          'Set maximum lengths for all fields',
          'Use security-focused form plugins'
        ]
      },
      {
        id: 'form-3',
        title: 'Implement Rate Limiting',
        difficulty: 'MEDIUM',
        why: 'Without rate limiting, attackers can flood your forms with requests, causing spam and server overload.',
        steps: [
          'Limit form submissions per IP per hour',
          'Add delays between submissions',
          'Track and block repeat offenders',
          'Use honeypot fields to catch bots',
          'Consider using a WAF with rate limiting'
        ]
      },
      {
        id: 'form-4',
        title: 'Secure File Upload Forms',
        difficulty: 'MEDIUM',
        why: 'File uploads are high-risk. Without proper validation, attackers can upload malware disguised as images.',
        steps: [
          'Restrict to specific file types',
          'Check file content, not just extension',
          'Scan uploads with antivirus',
          'Store uploads outside web root',
          'Generate random filenames'
        ]
      }
    ]
  },
  {
    id: 'hosting',
    name: 'Hosting & Server',
    icon: Server,
    description: 'Secure your hosting environment',
    tasks: [
      {
        id: 'host-1',
        title: 'Choose Secure Hosting',
        difficulty: 'MEDIUM',
        why: 'Budget hosting often means shared servers with poor isolation. A compromised neighbor can affect your site.',
        steps: [
          'Research hosting security reputation',
          'Look for isolated environments (VPS, managed)',
          'Verify automatic security updates',
          'Check for included WAF/DDoS protection',
          'Review backup and recovery options'
        ]
      },
      {
        id: 'host-2',
        title: 'Configure Firewall Rules',
        difficulty: 'MEDIUM',
        why: 'Firewalls block malicious traffic before it reaches your application, stopping many attacks automatically.',
        steps: [
          'Enable hosting provider firewall',
          'Block common attack patterns',
          'Whitelist only necessary ports',
          'Consider a Web Application Firewall (WAF)',
          'Review and update rules regularly'
        ]
      },
      {
        id: 'host-3',
        title: 'Use SFTP Instead of FTP',
        difficulty: 'EASY',
        why: 'FTP sends passwords in plain text. Anyone on the network can capture your credentials.',
        steps: [
          'Disable FTP in hosting control panel',
          'Enable SFTP/SSH access',
          'Update file transfer client settings',
          'Use key-based authentication if possible',
          'Change password after switching'
        ]
      },
      {
        id: 'host-4',
        title: 'Disable Unnecessary Services',
        difficulty: 'HARD',
        why: 'Every running service is a potential attack vector. Disable what you don\'t need to reduce risk.',
        steps: [
          'Audit running services on server',
          'Disable unused services (FTP, mail, etc.)',
          'Remove unnecessary software packages',
          'Block unused ports at firewall',
          'Document what services are required'
        ]
      }
    ]
  },
  {
    id: 'mobile-api',
    name: 'Mobile & API Security',
    icon: Smartphone,
    description: 'Protect mobile and API access',
    tasks: [
      {
        id: 'mobile-1',
        title: 'Secure API Endpoints',
        difficulty: 'HARD',
        why: 'APIs often bypass traditional security. Unsecured endpoints can leak data or allow unauthorized actions.',
        steps: [
          'Require authentication for all API calls',
          'Use API keys or OAuth tokens',
          'Implement rate limiting per key',
          'Validate all input parameters',
          'Log API access for monitoring'
        ]
      },
      {
        id: 'mobile-2',
        title: 'Test Mobile Responsiveness',
        difficulty: 'EASY',
        why: 'Security features should work on mobile. Broken mobile layouts can hide security warnings or CAPTCHA.',
        steps: [
          'Test all security features on mobile',
          'Verify CAPTCHA works on touch screens',
          'Check 2FA input on mobile devices',
          'Test login flow on various devices',
          'Ensure security warnings are visible'
        ]
      },
      {
        id: 'mobile-3',
        title: 'Disable XML-RPC if Unused',
        difficulty: 'EASY',
        why: 'XML-RPC is a common attack vector for brute force and DDoS attacks, especially on WordPress sites.',
        steps: [
          'Check if you use XML-RPC features',
          'If not, block xmlrpc.php access',
          'Use plugin or .htaccess rules',
          'Test that blocking doesn\'t break features',
          'Consider alternatives like REST API'
        ]
      }
    ]
  }
]

// Load progress from localStorage
function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

// Save progress to localStorage
function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

// Task Item Component
function TaskItem({ task, isComplete, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const difficulty = DIFFICULTY[task.difficulty]

  return (
    <div className="border-b border-white/5 last:border-0">
      <div
        className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-aegis-800/30 transition-colors ${
          isComplete ? 'bg-secure-500/5' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            isComplete
              ? 'bg-secure-500 border-secure-500'
              : 'border-white/20 hover:border-shield-400'
          }`}
        >
          {isComplete && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${isComplete ? 'text-gray-400 line-through' : 'text-white'}`}>
            {task.title}
          </h4>
        </div>

        {/* Difficulty Badge */}
        <span className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
          <Clock className="w-3 h-3" />
          {difficulty.time}
        </span>

        {/* Expand Icon */}
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pl-14 space-y-4 animate-slide-down">
          {/* Why It Matters */}
          <div>
            <h5 className="text-sm font-medium text-shield-400 mb-1">Why it matters</h5>
            <p className="text-sm text-gray-400">{task.why}</p>
          </div>

          {/* Steps */}
          <div>
            <h5 className="text-sm font-medium text-shield-400 mb-2">How to do it</h5>
            <ol className="space-y-2">
              {task.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-aegis-700 text-white text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Difficulty & Time */}
          <div className="flex items-center gap-4 pt-2">
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
              <Zap className="w-3 h-3" />
              {difficulty.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              Estimated time: {difficulty.time}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Category Section Component
function CategorySection({ category, progress, onToggleTask }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const Icon = category.icon

  const completedCount = category.tasks.filter(t => progress[t.id]).length
  const totalCount = category.tasks.length
  const isAllComplete = completedCount === totalCount

  return (
    <div className="bg-aegis-800/50 border border-white/5 rounded-2xl overflow-hidden">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-5 hover:bg-aegis-800/50 transition-colors"
      >
        <div className={`p-3 rounded-xl ${isAllComplete ? 'bg-secure-500/20' : 'bg-shield-500/10'}`}>
          <Icon className={`w-6 h-6 ${isAllComplete ? 'text-secure-400' : 'text-shield-400'}`} />
        </div>

        <div className="flex-1 text-left">
          <h3 className="font-display font-semibold text-lg text-white">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-sm font-medium ${isAllComplete ? 'text-secure-400' : 'text-gray-400'}`}>
            {completedCount} of {totalCount}
          </span>
          <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* Tasks */}
      {isExpanded && (
        <div className="border-t border-white/5">
          {category.tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isComplete={!!progress[task.id]}
              onToggle={() => onToggleTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Main Page Component
export default function SecurityChecklistPage() {
  const [progress, setProgress] = useState(loadProgress)

  // Calculate stats
  const stats = useMemo(() => {
    const totalTasks = checklistData.reduce((sum, cat) => sum + cat.tasks.length, 0)
    const completedTasks = Object.values(progress).filter(Boolean).length
    const percentage = Math.round((completedTasks / totalTasks) * 100)
    return { total: totalTasks, completed: completedTasks, percentage }
  }, [progress])

  // Toggle task completion
  const toggleTask = (taskId) => {
    const newProgress = { ...progress, [taskId]: !progress[taskId] }
    setProgress(newProgress)
    saveProgress(newProgress)
  }

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    // Title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Website Security Checklist', pageWidth / 2, y, { align: 'center' })
    y += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text('by Tzu Shield - tzushield.com', pageWidth / 2, y, { align: 'center' })
    y += 15

    // Progress
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text(`Progress: ${stats.completed} of ${stats.total} tasks complete (${stats.percentage}%)`, 20, y)
    y += 15

    // Categories and Tasks
    checklistData.forEach(category => {
      // Check if we need a new page
      if (y > 260) {
        doc.addPage()
        y = 20
      }

      // Category header
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0)
      doc.text(category.name, 20, y)
      y += 8

      // Tasks
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      category.tasks.forEach(task => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }

        const isComplete = progress[task.id]
        const checkbox = isComplete ? '[X]' : '[ ]'
        doc.setTextColor(isComplete ? 100 : 0)
        doc.text(`${checkbox} ${task.title}`, 25, y)
        y += 6
      })
      y += 5
    })

    // Footer
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text('Generated by Tzu Shield - The Art of Cyber Defense', pageWidth / 2, 285, { align: 'center' })

    doc.save('tzu-shield-security-checklist.pdf')
  }

  return (
    <div className="min-h-screen bg-aegis-900 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-aegis-800/50 to-transparent py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-shield-500/10 border border-shield-500/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-shield-400" />
              <span className="text-sm font-medium text-shield-400">Pro Feature</span>
            </div>

            <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Website Security Checklist
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A comprehensive step-by-step guide to securing your business website.
              Complete tasks at your own pace — your progress is saved automatically.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-aegis-800/80 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">
                {stats.completed} of {stats.total} tasks complete
              </span>
              <span className="text-shield-400 font-bold text-lg">
                {stats.percentage}%
              </span>
            </div>
            <div className="h-3 bg-aegis-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-shield-500 to-secure-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            {stats.percentage === 100 && (
              <p className="text-secure-400 text-sm mt-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Congratulations! You've completed all security tasks.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {checklistData.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              progress={progress}
              onToggleTask={toggleTask}
            />
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-aegis-800/50 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">
                <CheckCircle2 className="w-4 h-4 inline mr-1 text-secure-400" />
                Your progress is automatically saved to this browser
              </p>
              <p className="text-gray-500 text-xs">
                Want to sync across devices? Create a free account.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-aegis-700 hover:bg-aegis-600 text-white font-medium rounded-xl border border-white/10 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <Link
                to="/#scanner"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-medium rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
                Scan Your Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
