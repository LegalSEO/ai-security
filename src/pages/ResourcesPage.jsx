import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Download,
  Lock,
  Shield,
  FileText,
  Video,
  CheckCircle2,
  ArrowRight,
  Mail,
  Sparkles,
  Building2,
  Code,
  Users,
  Zap,
  AlertTriangle,
  Star,
  Crown
} from 'lucide-react'

// Page Header Component
function PageHeader({ badge, title, subtitle }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800 to-aegis-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-shield-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-shield-500/10 border border-shield-500/20 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-shield-400" />
            <span className="text-sm font-medium text-shield-400">{badge}</span>
          </div>
        )}
        <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  )
}

// Category Filter
function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            active === cat.id
              ? 'bg-shield-500 text-white'
              : 'bg-aegis-800/50 text-gray-400 hover:text-white hover:bg-aegis-700/50 border border-white/5'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

// Resource Card
function ResourceCard({ resource }) {
  const TypeIcon = resource.type === 'ebook' ? BookOpen : resource.type === 'video' ? Video : FileText

  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="bg-aegis-800/30 border border-white/5 rounded-2xl overflow-hidden hover:border-shield-500/30 transition-all group block"
    >
      {/* Thumbnail */}
      <div className={`h-48 relative ${resource.gradient} flex items-center justify-center`}>
        <TypeIcon className="w-16 h-16 text-white/20" />
        {resource.premium && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-threat-500/90 rounded-full">
            <Crown className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold text-white">Premium</span>
          </div>
        )}
        {resource.featured && !resource.premium && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-secure-500/90 rounded-full">
            <Star className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-semibold text-white">Popular</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="px-2 py-1 bg-aegis-700/50 rounded">{resource.category}</span>
          <span>•</span>
          <span>{resource.type === 'ebook' ? 'eBook' : resource.type === 'video' ? 'Video' : 'Guide'}</span>
        </div>
        <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-shield-400 transition-colors">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {resource.description}
        </p>

        {/* CTA */}
        {resource.premium ? (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-threat-500/10 border border-threat-500/30 text-threat-400 font-medium text-sm rounded-lg">
            <Crown className="w-4 h-4" />
            ${resource.price} - Learn More
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-shield-500/10 border border-shield-500/30 text-shield-400 font-medium text-sm rounded-lg">
            <ArrowRight className="w-4 h-4" />
            Learn More
          </div>
        )}
      </div>
    </Link>
  )
}

// Email Capture Modal
function EmailCaptureModal({ resource, isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production, this would send to your email service
    setSubmitted(true)
    setTimeout(() => {
      onSubmit(email)
      setEmail('')
      setSubmitted(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-aegis-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-aegis-800 border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-secure-400 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">Check Your Email!</h3>
            <p className="text-gray-400">Your download link is on its way.</p>
          </div>
        ) : (
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
                Get Your Free Download
              </h3>
              <p className="text-gray-400 text-sm">
                Enter your email and we'll send you "{resource?.title}" immediately.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500 mb-4"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Send Me the Download
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'basics', label: 'Security Basics' },
    { id: 'wordpress', label: 'WordPress' },
    { id: 'small-business', label: 'Small Business' },
    { id: 'technical', label: 'Technical' }
  ]

  const resources = [
    {
      id: 1,
      slug: 'website-security-101',
      title: "Website Security 101: A Non-Technical Guide",
      description: "Everything you need to know about website security, explained in plain English. Perfect for business owners who want to understand the basics.",
      category: "basics",
      type: "ebook",
      gradient: "bg-gradient-to-br from-shield-500/30 to-shield-600/10",
      premium: false,
      featured: true
    },
    {
      id: 2,
      slug: 'ai-threat-landscape-2025',
      title: "The AI Threat Landscape 2025",
      description: "A comprehensive overview of how AI is being weaponized by hackers, with real examples and defense strategies.",
      category: "basics",
      type: "ebook",
      gradient: "bg-gradient-to-br from-critical-500/30 to-critical-600/10",
      premium: false,
      featured: false
    },
    {
      id: 3,
      slug: 'wordpress-security-checklist',
      title: "WordPress Security Hardening Checklist",
      description: "Step-by-step checklist to secure your WordPress site. Covers updates, plugins, passwords, backups, and more.",
      category: "wordpress",
      type: "guide",
      gradient: "bg-gradient-to-br from-threat-500/30 to-threat-600/10",
      premium: false,
      featured: true
    },
    {
      id: 4,
      slug: 'plugin-security-audit',
      title: "Plugin Security Audit Template",
      description: "A spreadsheet template to audit all your WordPress plugins for security risks, update status, and necessity.",
      category: "wordpress",
      type: "guide",
      gradient: "bg-gradient-to-br from-threat-500/30 to-threat-600/10",
      premium: false,
      featured: false
    },
    {
      id: 5,
      slug: 'migrating-from-wordpress',
      title: "Migrating Away from WordPress: Complete Guide",
      description: "Detailed guide on moving from WordPress to modern alternatives. Covers static sites, headless CMS, and managed solutions.",
      category: "wordpress",
      type: "ebook",
      gradient: "bg-gradient-to-br from-secure-500/30 to-secure-600/10",
      premium: true,
      price: 29
    },
    {
      id: 6,
      slug: 'small-business-cybersecurity-blueprint',
      title: "Small Business Cybersecurity Blueprint",
      description: "A complete security framework designed for small businesses. Prioritized actions based on your budget and resources.",
      category: "small-business",
      type: "ebook",
      gradient: "bg-gradient-to-br from-shield-500/30 to-secure-600/10",
      premium: false,
      featured: true
    },
    {
      id: 7,
      slug: 'incident-response-plan',
      title: "Incident Response Plan Template",
      description: "What to do when (not if) you get hacked. Customizable template with step-by-step procedures for small teams.",
      category: "small-business",
      type: "guide",
      gradient: "bg-gradient-to-br from-critical-500/30 to-threat-600/10",
      premium: false,
      featured: false
    },
    {
      id: 8,
      slug: 'employee-security-training',
      title: "Employee Security Training Slides",
      description: "Ready-to-use presentation for training your team on phishing, passwords, and security best practices.",
      category: "small-business",
      type: "guide",
      gradient: "bg-gradient-to-br from-shield-500/30 to-shield-600/10",
      premium: true,
      price: 49
    },
    {
      id: 9,
      slug: 'security-headers-guide',
      title: "Security Headers Configuration Guide",
      description: "Technical deep-dive into HTTP security headers. Includes copy-paste configurations for common setups.",
      category: "technical",
      type: "guide",
      gradient: "bg-gradient-to-br from-secure-500/30 to-secure-600/10",
      premium: false,
      featured: false
    },
    {
      id: 10,
      slug: 'ssl-tls-best-practices',
      title: "SSL/TLS Best Practices",
      description: "Everything about SSL certificates, HTTPS configuration, and encryption best practices for your website.",
      category: "technical",
      type: "ebook",
      gradient: "bg-gradient-to-br from-shield-500/30 to-shield-600/10",
      premium: false,
      featured: false
    },
    {
      id: 11,
      slug: 'waf-setup-guide',
      title: "Web Application Firewall Setup",
      description: "Guide to implementing and configuring a WAF for your website. Covers Cloudflare, AWS WAF, and more.",
      category: "technical",
      type: "guide",
      gradient: "bg-gradient-to-br from-secure-500/30 to-secure-600/10",
      premium: true,
      price: 39
    },
    {
      id: 12,
      slug: 'security-audit-methodology',
      title: "Complete Security Audit Methodology",
      description: "Professional-grade methodology for auditing website security. Used by our team for client assessments.",
      category: "technical",
      type: "ebook",
      gradient: "bg-gradient-to-br from-critical-500/30 to-critical-600/10",
      premium: true,
      price: 79
    }
  ]

  const filteredResources = activeCategory === 'all'
    ? resources
    : resources.filter(r => r.category === activeCategory)

  return (
    <div className="min-h-screen">
      <PageHeader
        badge="Resource Library"
        title="Security Guides & Resources"
        subtitle="Free guides, templates, and tools to help you understand and improve your website security. Written for real people, not security experts."
      />

      {/* Category Filter */}
      <section className="relative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Resources Grid */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
              />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No resources found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 text-shield-400 mx-auto mb-6" />
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
            Get New Resources First
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join 2,000+ business owners getting weekly security tips, new guides, and threat alerts.
            No spam, just actionable security advice.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-lg transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-shield-500/10 to-secure-500/10 border border-shield-500/20 rounded-3xl p-8 md:p-12 text-center">
            <Shield className="w-16 h-16 text-shield-400 mx-auto mb-6" />
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              Ready to See Your Security Status?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              All the guides in the world won't help if you don't know where you stand.
              Run our free scan to see your current vulnerabilities.
            </p>
            <Link
              to="/#scanner"
              className="inline-flex items-center gap-2 px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-shield-500/25"
            >
              Scan Your Website Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
