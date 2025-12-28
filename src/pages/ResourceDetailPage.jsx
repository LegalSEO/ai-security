/**
 * Resource Detail Page
 * Individual page for each ebook, guide, or checklist
 * Includes detailed info, features, and download with signup gate
 */

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Download,
  Lock,
  Shield,
  FileText,
  Video,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Crown,
  Star,
  Clock,
  FileType,
  Users,
  Target,
  Lightbulb,
  List,
  Zap,
  AlertTriangle,
  BookMarked,
  Layers
} from 'lucide-react'
import { useAuth } from '../components/Auth'
import { recordDownload } from '../services/leadService'

// Resource data with full details
export const resourcesData = {
  'website-security-101': {
    id: 1,
    slug: 'website-security-101',
    title: "Website Security 101: A Non-Technical Guide",
    subtitle: "Everything you need to know about website security, explained in plain English",
    description: "This comprehensive guide breaks down complex security concepts into easy-to-understand language. Perfect for business owners, marketers, and anyone who manages a website but doesn't have a technical background.",
    category: "basics",
    type: "ebook",
    gradient: "bg-gradient-to-br from-shield-500/30 to-shield-600/10",
    premium: false,
    featured: true,
    pages: 45,
    readTime: "2 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/website-security-101.pdf",
    coverImage: "/images/top-images/securityai1.png",
    features: [
      "Plain English explanations - no technical jargon",
      "Real-world examples of security threats",
      "Step-by-step action items you can implement today",
      "Checklists and quick-reference guides",
      "Recommended tools and services"
    ],
    tableOfContents: [
      "Chapter 1: Why Website Security Matters",
      "Chapter 2: Common Threats Explained",
      "Chapter 3: SSL and HTTPS Basics",
      "Chapter 4: Password Best Practices",
      "Chapter 5: Keeping Software Updated",
      "Chapter 6: Backup Fundamentals",
      "Chapter 7: Recognizing When You've Been Hacked",
      "Chapter 8: What to Do After a Breach",
      "Chapter 9: Building a Security Routine",
      "Chapter 10: Tools and Resources"
    ],
    whoIsItFor: [
      "Small business owners managing their own website",
      "Marketing professionals responsible for company websites",
      "Entrepreneurs launching their first online presence",
      "Anyone who wants to understand website security basics"
    ],
    whatYouWillLearn: [
      "How hackers find and exploit vulnerable websites",
      "The essential security measures every website needs",
      "How to check if your website is secure",
      "When to DIY vs. when to hire a professional",
      "How to create a simple security maintenance routine"
    ]
  },
  'ai-threat-landscape-2025': {
    id: 2,
    slug: 'ai-threat-landscape-2025',
    title: "The AI Threat Landscape 2025",
    subtitle: "How artificial intelligence is being weaponized by hackers",
    description: "A comprehensive analysis of how cybercriminals are using AI to create more sophisticated attacks. Includes real examples, case studies, and practical defense strategies you can implement.",
    category: "basics",
    type: "ebook",
    gradient: "bg-gradient-to-br from-critical-500/30 to-critical-600/10",
    premium: false,
    featured: false,
    pages: 38,
    readTime: "1.5 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/ai-threat-landscape-2025.pdf",
    coverImage: "/images/top-images/cyberdefense1.png",
    features: [
      "Analysis of AI-powered attack techniques",
      "Real-world case studies and examples",
      "Defense strategies for each threat type",
      "Future predictions from security experts",
      "Resource list for staying informed"
    ],
    tableOfContents: [
      "Introduction: The AI Arms Race",
      "Chapter 1: AI-Generated Phishing Attacks",
      "Chapter 2: Deepfakes and Social Engineering",
      "Chapter 3: Automated Vulnerability Scanning",
      "Chapter 4: AI-Powered Malware",
      "Chapter 5: Voice Cloning and Vishing",
      "Chapter 6: Defending Against AI Threats",
      "Chapter 7: The Future of AI in Cybersecurity",
      "Appendix: Tools and Resources"
    ],
    whoIsItFor: [
      "Business owners concerned about emerging threats",
      "IT professionals wanting to stay ahead",
      "Security-conscious individuals",
      "Anyone who wants to understand modern cyber threats"
    ],
    whatYouWillLearn: [
      "How AI is changing the threat landscape",
      "Specific AI attack techniques being used today",
      "How to identify AI-generated threats",
      "Practical defense strategies",
      "How to train your team to recognize AI threats"
    ]
  },
  'wordpress-security-checklist': {
    id: 3,
    slug: 'wordpress-security-checklist',
    title: "WordPress Security Hardening Checklist",
    subtitle: "47 steps to lock down your WordPress site",
    description: "A comprehensive, actionable checklist covering every aspect of WordPress security. From basic settings to advanced configurations, this guide walks you through securing your site step by step.",
    category: "wordpress",
    type: "guide",
    gradient: "bg-gradient-to-br from-threat-500/30 to-threat-600/10",
    premium: false,
    featured: true,
    pages: 28,
    readTime: "45 minutes",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/wordpress-security-checklist.pdf",
    coverImage: "/images/wordpress/444cf93e-ebf1-4e1f-a18d-639a72f42bc0.png",
    features: [
      "47 specific, actionable security tasks",
      "Priority ratings for each item",
      "Estimated time for each task",
      "Plugin recommendations",
      "Printable checklist format"
    ],
    tableOfContents: [
      "Section 1: WordPress Core Security",
      "Section 2: User & Authentication Security",
      "Section 3: Plugin & Theme Security",
      "Section 4: Database Security",
      "Section 5: File System Security",
      "Section 6: Server Configuration",
      "Section 7: Backup & Recovery",
      "Section 8: Monitoring & Maintenance"
    ],
    whoIsItFor: [
      "WordPress site owners",
      "Web developers managing WordPress sites",
      "Agencies maintaining client WordPress sites",
      "Anyone responsible for WordPress security"
    ],
    whatYouWillLearn: [
      "Critical WordPress security settings",
      "How to audit and secure plugins",
      "Database security best practices",
      "File permission configurations",
      "Ongoing maintenance procedures"
    ]
  },
  'plugin-security-audit': {
    id: 4,
    slug: 'plugin-security-audit',
    title: "Plugin Security Audit Template",
    subtitle: "Spreadsheet template to audit all your WordPress plugins",
    description: "A ready-to-use spreadsheet template for systematically auditing your WordPress plugins. Track security status, update frequency, developer reputation, and more to make informed decisions about which plugins to keep.",
    category: "wordpress",
    type: "guide",
    gradient: "bg-gradient-to-br from-threat-500/30 to-threat-600/10",
    premium: false,
    featured: false,
    pages: 12,
    readTime: "30 minutes",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/plugin-security-audit.pdf",
    coverImage: null,
    features: [
      "Pre-built spreadsheet template",
      "Plugin evaluation criteria",
      "Risk scoring methodology",
      "Decision framework",
      "Update tracking system"
    ],
    tableOfContents: [
      "How to Use This Template",
      "Plugin Evaluation Criteria",
      "Risk Scoring System",
      "The Audit Process",
      "Making Keep/Remove Decisions",
      "Ongoing Monitoring"
    ],
    whoIsItFor: [
      "WordPress administrators",
      "Web developers",
      "Security-conscious site owners",
      "Agencies managing multiple sites"
    ],
    whatYouWillLearn: [
      "How to evaluate plugin security",
      "Warning signs of risky plugins",
      "When to replace or remove plugins",
      "How to document plugin decisions",
      "Ongoing plugin management"
    ]
  },
  'migrating-from-wordpress': {
    id: 5,
    slug: 'migrating-from-wordpress',
    title: "Migrating Away from WordPress: Complete Guide",
    subtitle: "Step-by-step guide to moving to modern, secure alternatives",
    description: "A comprehensive guide for businesses ready to leave WordPress behind. Covers the full migration process, from choosing an alternative to executing the move without losing SEO or functionality.",
    category: "wordpress",
    type: "ebook",
    gradient: "bg-gradient-to-br from-secure-500/30 to-secure-600/10",
    premium: true,
    price: 29,
    featured: false,
    pages: 65,
    readTime: "3 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/migrating-from-wordpress.pdf",
    coverImage: null,
    features: [
      "Complete migration roadmap",
      "Platform comparison matrix",
      "SEO preservation strategies",
      "Content migration tools",
      "Post-migration checklist"
    ],
    tableOfContents: [
      "Part 1: Should You Leave WordPress?",
      "Part 2: Choosing Your New Platform",
      "Part 3: Pre-Migration Planning",
      "Part 4: Content Migration Process",
      "Part 5: Design & Functionality",
      "Part 6: SEO & Redirects",
      "Part 7: Testing & Launch",
      "Part 8: Post-Migration Tasks"
    ],
    whoIsItFor: [
      "Business owners frustrated with WordPress security",
      "Companies wanting better performance",
      "Sites that have outgrown WordPress",
      "Anyone considering a platform change"
    ],
    whatYouWillLearn: [
      "Modern WordPress alternatives",
      "How to migrate content safely",
      "Preserving SEO during migration",
      "Avoiding common migration mistakes",
      "Post-migration optimization"
    ]
  },
  'small-business-cybersecurity-blueprint': {
    id: 6,
    slug: 'small-business-cybersecurity-blueprint',
    title: "Small Business Cybersecurity Blueprint",
    subtitle: "A complete security framework for businesses with limited resources",
    description: "A practical, prioritized security framework designed specifically for small businesses. Focuses on high-impact, low-cost security measures that provide the most protection for your investment.",
    category: "small-business",
    type: "ebook",
    gradient: "bg-gradient-to-br from-shield-500/30 to-secure-600/10",
    premium: false,
    featured: true,
    pages: 52,
    readTime: "2.5 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/small-business-cybersecurity-blueprint.pdf",
    coverImage: "/images/top-images/tzushield2.png",
    features: [
      "Prioritized security roadmap",
      "Budget-friendly recommendations",
      "Industry-specific guidance",
      "Compliance considerations",
      "Vendor evaluation criteria"
    ],
    tableOfContents: [
      "Introduction: Security on a Budget",
      "Chapter 1: Assessing Your Current State",
      "Chapter 2: Essential Security Foundation",
      "Chapter 3: Protecting Your Data",
      "Chapter 4: Securing Your Network",
      "Chapter 5: Employee Security",
      "Chapter 6: Vendor & Third-Party Risk",
      "Chapter 7: Incident Preparedness",
      "Chapter 8: Building a Security Culture",
      "Appendix: Tools & Resources by Budget"
    ],
    whoIsItFor: [
      "Small business owners (1-50 employees)",
      "Startups building security from scratch",
      "Businesses without dedicated IT staff",
      "Anyone managing security on a limited budget"
    ],
    whatYouWillLearn: [
      "Where to focus limited security resources",
      "Free and low-cost security tools",
      "How to prioritize security investments",
      "Building security into daily operations",
      "When to outsource vs. DIY"
    ]
  },
  'incident-response-plan': {
    id: 7,
    slug: 'incident-response-plan',
    title: "Incident Response Plan Template",
    subtitle: "What to do when (not if) you get hacked",
    description: "A customizable incident response plan template that tells you exactly what to do when a security incident occurs. Includes step-by-step procedures, communication templates, and recovery checklists.",
    category: "small-business",
    type: "guide",
    gradient: "bg-gradient-to-br from-critical-500/30 to-threat-600/10",
    premium: false,
    featured: false,
    pages: 24,
    readTime: "1 hour",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/incident-response-plan.pdf",
    coverImage: null,
    features: [
      "Complete IR plan template",
      "Role assignment worksheets",
      "Communication templates",
      "Evidence preservation guide",
      "Recovery checklists"
    ],
    tableOfContents: [
      "Why You Need an IR Plan",
      "Section 1: Preparation",
      "Section 2: Identification",
      "Section 3: Containment",
      "Section 4: Eradication",
      "Section 5: Recovery",
      "Section 6: Lessons Learned",
      "Appendix: Templates & Worksheets"
    ],
    whoIsItFor: [
      "Small business owners",
      "IT managers",
      "Anyone responsible for security incidents",
      "Businesses without formal IR procedures"
    ],
    whatYouWillLearn: [
      "How to prepare for security incidents",
      "Step-by-step incident response",
      "How to communicate during incidents",
      "Evidence preservation basics",
      "Post-incident improvement"
    ]
  },
  'employee-security-training': {
    id: 8,
    slug: 'employee-security-training',
    title: "Employee Security Training Slides",
    subtitle: "Ready-to-use presentation for training your team",
    description: "A professionally designed presentation covering essential security topics for employees. Includes speaker notes, quiz questions, and customizable slides to match your branding.",
    category: "small-business",
    type: "guide",
    gradient: "bg-gradient-to-br from-shield-500/30 to-shield-600/10",
    premium: true,
    price: 49,
    featured: false,
    pages: 60,
    readTime: "2 hour presentation",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/employee-security-training.pdf",
    coverImage: null,
    features: [
      "60+ professionally designed slides",
      "Comprehensive speaker notes",
      "Interactive quiz questions",
      "Customizable branding",
      "Printable handouts"
    ],
    tableOfContents: [
      "Module 1: Why Security Matters",
      "Module 2: Password Security",
      "Module 3: Phishing & Social Engineering",
      "Module 4: Safe Browsing & Email",
      "Module 5: Physical Security",
      "Module 6: Mobile Device Security",
      "Module 7: Data Handling",
      "Module 8: Incident Reporting"
    ],
    whoIsItFor: [
      "HR professionals",
      "IT managers",
      "Business owners",
      "Anyone training employees on security"
    ],
    whatYouWillLearn: [
      "How to deliver effective security training",
      "Key topics every employee should know",
      "How to measure training effectiveness",
      "Creating a security-aware culture",
      "Ongoing training best practices"
    ]
  },
  'security-headers-guide': {
    id: 9,
    slug: 'security-headers-guide',
    title: "Security Headers Configuration Guide",
    subtitle: "Technical deep-dive into HTTP security headers",
    description: "A comprehensive technical guide to implementing HTTP security headers. Includes copy-paste configurations for Apache, Nginx, and various hosting platforms.",
    category: "technical",
    type: "guide",
    gradient: "bg-gradient-to-br from-secure-500/30 to-secure-600/10",
    premium: false,
    featured: false,
    pages: 32,
    readTime: "1.5 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/security-headers-guide.pdf",
    coverImage: null,
    features: [
      "All major security headers explained",
      "Copy-paste configurations",
      "Platform-specific instructions",
      "Testing and validation tools",
      "Troubleshooting guide"
    ],
    tableOfContents: [
      "Introduction to Security Headers",
      "Content-Security-Policy (CSP)",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Strict-Transport-Security (HSTS)",
      "Referrer-Policy",
      "Permissions-Policy",
      "Implementation Guide",
      "Testing & Validation"
    ],
    whoIsItFor: [
      "Web developers",
      "System administrators",
      "DevOps engineers",
      "Security professionals"
    ],
    whatYouWillLearn: [
      "What each security header does",
      "How to implement headers correctly",
      "Common configuration mistakes",
      "How to test your implementation",
      "Maintaining headers over time"
    ]
  },
  'ssl-tls-best-practices': {
    id: 10,
    slug: 'ssl-tls-best-practices',
    title: "SSL/TLS Best Practices",
    subtitle: "Complete guide to HTTPS and encryption configuration",
    description: "Everything you need to know about SSL certificates, HTTPS implementation, and encryption best practices. From certificate selection to advanced configuration options.",
    category: "technical",
    type: "ebook",
    gradient: "bg-gradient-to-br from-shield-500/30 to-shield-600/10",
    premium: false,
    featured: false,
    pages: 40,
    readTime: "2 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/ssl-tls-best-practices.pdf",
    coverImage: null,
    features: [
      "Certificate types explained",
      "Installation guides",
      "Configuration optimization",
      "Renewal automation",
      "Troubleshooting common issues"
    ],
    tableOfContents: [
      "SSL/TLS Fundamentals",
      "Certificate Types & Selection",
      "Certificate Installation",
      "HTTPS Configuration",
      "Performance Optimization",
      "Certificate Renewal",
      "Mixed Content Issues",
      "Testing & Validation",
      "Troubleshooting Guide"
    ],
    whoIsItFor: [
      "Web developers",
      "System administrators",
      "Site owners managing SSL",
      "Anyone implementing HTTPS"
    ],
    whatYouWillLearn: [
      "How SSL/TLS encryption works",
      "Choosing the right certificate",
      "Proper HTTPS implementation",
      "Optimizing for performance",
      "Maintaining certificates"
    ]
  },
  'waf-setup-guide': {
    id: 11,
    slug: 'waf-setup-guide',
    title: "Web Application Firewall Setup",
    subtitle: "Implementing and configuring a WAF for your website",
    description: "A detailed guide to setting up a Web Application Firewall. Covers popular options like Cloudflare, AWS WAF, and ModSecurity with step-by-step configuration instructions.",
    category: "technical",
    type: "guide",
    gradient: "bg-gradient-to-br from-secure-500/30 to-secure-600/10",
    premium: true,
    price: 39,
    featured: false,
    pages: 48,
    readTime: "2.5 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/waf-setup-guide.pdf",
    coverImage: null,
    features: [
      "WAF comparison matrix",
      "Platform-specific setup guides",
      "Rule configuration examples",
      "Performance optimization",
      "Monitoring & alerting setup"
    ],
    tableOfContents: [
      "WAF Fundamentals",
      "Choosing a WAF Solution",
      "Cloudflare WAF Setup",
      "AWS WAF Configuration",
      "ModSecurity Implementation",
      "Rule Management",
      "False Positive Handling",
      "Performance Tuning",
      "Monitoring & Maintenance"
    ],
    whoIsItFor: [
      "System administrators",
      "DevOps engineers",
      "Security professionals",
      "Technical site owners"
    ],
    whatYouWillLearn: [
      "How WAFs protect websites",
      "Choosing the right WAF",
      "Step-by-step implementation",
      "Rule configuration best practices",
      "Ongoing WAF management"
    ]
  },
  'security-audit-methodology': {
    id: 12,
    slug: 'security-audit-methodology',
    title: "Complete Security Audit Methodology",
    subtitle: "Professional-grade security assessment framework",
    description: "The complete methodology our team uses for client security audits. Includes assessment templates, testing procedures, and report frameworks used by professional security auditors.",
    category: "technical",
    type: "ebook",
    gradient: "bg-gradient-to-br from-critical-500/30 to-critical-600/10",
    premium: true,
    price: 79,
    featured: false,
    pages: 85,
    readTime: "4 hours",
    lastUpdated: "December 2024",
    downloadFile: "/downloads/security-audit-methodology.pdf",
    coverImage: "/images/top-images/cyberwar3.png",
    features: [
      "Complete audit methodology",
      "Assessment templates",
      "Testing procedures",
      "Report templates",
      "Client communication guides"
    ],
    tableOfContents: [
      "Part 1: Audit Planning",
      "Part 2: Reconnaissance",
      "Part 3: Vulnerability Assessment",
      "Part 4: Configuration Review",
      "Part 5: Authentication Testing",
      "Part 6: Authorization Testing",
      "Part 7: Data Protection Review",
      "Part 8: Reporting & Remediation",
      "Appendix: Templates & Tools"
    ],
    whoIsItFor: [
      "Security consultants",
      "IT auditors",
      "Penetration testers",
      "Internal security teams"
    ],
    whatYouWillLearn: [
      "Professional audit methodology",
      "Systematic testing procedures",
      "Vulnerability prioritization",
      "Report writing best practices",
      "Client communication skills"
    ]
  }
}

// Download Modal with signup requirement
function DownloadModal({ resource, isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, userRegister, userLogin } = useAuth()
  const [mode, setMode] = useState('signup') // 'signup' or 'login'
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !resource) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        await userRegister(email, password, name)
      } else {
        await userLogin(email, password)
      }

      // Track the download
      recordDownload(email, resource.slug, resource.title)

      setSubmitted(true)
      setTimeout(() => {
        // Trigger download
        if (resource.downloadFile) {
          const link = document.createElement('a')
          link.href = resource.downloadFile
          link.download = resource.downloadFile.split('/').pop()
          link.click()
        }
        onClose()
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // If user is already logged in, just download
  const handleDirectDownload = () => {
    recordDownload(user.user.email, resource.slug, resource.title)
    if (resource.downloadFile) {
      const link = document.createElement('a')
      link.href = resource.downloadFile
      link.download = resource.downloadFile.split('/').pop()
      link.click()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-aegis-900/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-aegis-800 border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-secure-400 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">Download Starting!</h3>
            <p className="text-gray-400">Your download should begin automatically.</p>
          </div>
        ) : user ? (
          // User is logged in - direct download
          <div className="text-center">
            <div className="w-16 h-16 bg-shield-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-shield-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              Ready to Download
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Click below to download "{resource.title}"
            </p>
            <button
              onClick={handleDirectDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-lg transition-all"
            >
              <Download className="w-5 h-5" />
              Download Now
            </button>
          </div>
        ) : (
          // User needs to sign up/login
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-shield-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-shield-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                {mode === 'signup' ? 'Create Free Account' : 'Welcome Back'}
              </h3>
              <p className="text-gray-400 text-sm">
                {mode === 'signup'
                  ? 'Sign up free to download this resource and access more.'
                  : 'Log in to download this resource.'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-critical-500/10 border border-critical-500/20 rounded-lg mb-4">
                <p className="text-sm text-critical-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Create password (8+ chars)' : 'Your password'}
                required
                minLength={mode === 'signup' ? 8 : undefined}
                className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    {mode === 'signup' ? 'Create Account & Download' : 'Log In & Download'}
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-shield-400 hover:underline">
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-shield-400 hover:underline">
                    Sign up free
                  </button>
                </>
              )}
            </p>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                <CheckCircle2 className="w-3 h-3 inline mr-1 text-secure-400" />
                Free account includes 5 security scans per month
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Main Resource Detail Page
export default function ResourceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()

  const resource = resourcesData[slug]

  useEffect(() => {
    if (!resource) {
      navigate('/resources')
    }
  }, [resource, navigate])

  if (!resource) {
    return null
  }

  const TypeIcon = resource.type === 'ebook' ? BookOpen : resource.type === 'video' ? Video : FileText

  const handleDownload = () => {
    if (resource.premium) {
      // Navigate to pricing for premium resources
      navigate('/pricing')
    } else {
      setModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-aegis-900 pt-20">
      {/* Back Link */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Content */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-shield-500/10 border border-shield-500/20 rounded-full text-sm text-shield-400 capitalize">
                  {resource.category.replace('-', ' ')}
                </span>
                <span className="px-3 py-1 bg-aegis-700/50 rounded-full text-sm text-gray-400">
                  {resource.type === 'ebook' ? 'eBook' : 'Guide'}
                </span>
                {resource.premium && (
                  <span className="px-3 py-1 bg-threat-500/20 border border-threat-500/30 rounded-full text-sm text-threat-400 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
                {resource.featured && !resource.premium && (
                  <span className="px-3 py-1 bg-secure-500/20 border border-secure-500/30 rounded-full text-sm text-secure-400 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                {resource.title}
              </h1>

              <p className="text-xl text-gray-400 mb-6">
                {resource.subtitle}
              </p>

              <p className="text-gray-400 mb-8">
                {resource.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <FileType className="w-5 h-5 text-shield-400" />
                  <span>{resource.pages} pages</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5 text-shield-400" />
                  <span>{resource.readTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Zap className="w-5 h-5 text-shield-400" />
                  <span>Updated {resource.lastUpdated}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleDownload}
                className={`inline-flex items-center gap-3 px-8 py-4 font-semibold rounded-xl transition-all ${
                  resource.premium
                    ? 'bg-threat-500 hover:bg-threat-400 text-white'
                    : 'bg-shield-500 hover:bg-shield-400 text-white'
                }`}
              >
                {resource.premium ? (
                  <>
                    <Crown className="w-5 h-5" />
                    Get Access for ${resource.price}
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Free
                  </>
                )}
              </button>

              {!resource.premium && (
                <p className="text-sm text-gray-500 mt-3">
                  Free account required. No credit card needed.
                </p>
              )}
            </div>

            {/* Right: Cover Image or Placeholder */}
            <div className={`rounded-2xl overflow-hidden border border-white/10 ${resource.gradient}`}>
              {resource.coverImage ? (
                <img
                  src={resource.coverImage}
                  alt={resource.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[4/3] flex items-center justify-center">
                  <TypeIcon className="w-32 h-32 text-white/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-aegis-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl text-white mb-8 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-shield-400" />
            What's Inside
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resource.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-aegis-800/50 border border-white/5 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-secure-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* TOC */}
            <div>
              <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
                <List className="w-6 h-6 text-shield-400" />
                Table of Contents
              </h2>
              <ol className="space-y-3">
                {resource.tableOfContents.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <span className="flex-shrink-0 w-6 h-6 bg-aegis-800 rounded text-xs flex items-center justify-center text-shield-400">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            {/* Who & What */}
            <div className="space-y-8">
              {/* Who Is It For */}
              <div>
                <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-shield-400" />
                  Who Is This For?
                </h2>
                <ul className="space-y-2">
                  {resource.whoIsItFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400">
                      <Target className="w-4 h-4 text-secure-400 flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What You'll Learn */}
              <div>
                <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-shield-400" />
                  What You'll Learn
                </h2>
                <ul className="space-y-2">
                  {resource.whatYouWillLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-secure-400 flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-aegis-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
            Ready to {resource.premium ? 'Get Access' : 'Download'}?
          </h2>
          <p className="text-gray-400 mb-8">
            {resource.premium
              ? 'Invest in your security knowledge today.'
              : 'Create a free account and start improving your security.'}
          </p>

          <button
            onClick={handleDownload}
            className={`inline-flex items-center gap-3 px-10 py-5 font-semibold rounded-xl transition-all text-lg ${
              resource.premium
                ? 'bg-threat-500 hover:bg-threat-400 text-white'
                : 'bg-shield-500 hover:bg-shield-400 text-white'
            }`}
          >
            {resource.premium ? (
              <>
                <Crown className="w-6 h-6" />
                Get Access for ${resource.price}
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download Free Now
              </>
            )}
          </button>

          <div className="mt-8">
            <Link
              to="/resources"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Browse all resources
            </Link>
          </div>
        </div>
      </section>

      {/* Download Modal */}
      <DownloadModal
        resource={resource}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
