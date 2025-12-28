import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Shield,
  Bot,
  Zap,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Mail,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  Server,
  Code,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Clock,
  TrendingUp,
  Users,
  Award,
  Sparkles
} from 'lucide-react'
import { Scanner } from './components/Scanner'
import { ExitIntentPopup, InlineEmailCapture } from './components/EmailCapture'
import { AuthProvider, AdminRoute, UserRoute, AdminLoginPage, UserLoginPage, UserHeader, useAuth } from './components/Auth'
import { ImageSlider, GallerySlider } from './components/ImageSlider'

// Page imports
import ThreatsPage from './pages/ThreatsPage'
import WordPressSecurityPage from './pages/WordPressSecurityPage'
import ResourcesPage from './pages/ResourcesPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import AboutPage from './pages/AboutPage'
import PricingPage from './pages/PricingPage'
import AdminDashboard from './pages/AdminDashboard'
import ArtOfCyberWarPage from './pages/ArtOfCyberWarPage'
import UserDashboard from './pages/UserDashboard'
import SecurityChecklistPage from './pages/SecurityChecklistPage'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-aegis-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/images/logos/logo3.png"
              alt="Tzu Shield"
              className="h-16 md:h-20 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Learn Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                onMouseEnter={() => setLearnOpen(true)}
                onMouseLeave={() => setLearnOpen(false)}
              >
                Learn
                <ChevronDown className="w-4 h-4" />
              </button>
              <div
                className={`absolute top-full left-0 pt-2 ${learnOpen ? 'block' : 'hidden'}`}
                onMouseEnter={() => setLearnOpen(true)}
                onMouseLeave={() => setLearnOpen(false)}
              >
                <div className="bg-aegis-800 border border-white/10 rounded-xl shadow-xl p-2 min-w-[220px]">
                  <Link
                    to="/threats"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-aegis-700/50 transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5 text-critical-400" />
                    <div>
                      <div className="text-sm font-medium text-white">AI Threats</div>
                      <div className="text-xs text-gray-500">Learn about modern attacks</div>
                    </div>
                  </Link>
                  <Link
                    to="/wordpress-security"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-aegis-700/50 transition-colors"
                  >
                    <Code className="w-5 h-5 text-threat-400" />
                    <div>
                      <div className="text-sm font-medium text-white">WordPress Security</div>
                      <div className="text-xs text-gray-500">Protect your WP site</div>
                    </div>
                  </Link>
                  <Link
                    to="/resources"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-aegis-700/50 transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-shield-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Resources</div>
                      <div className="text-xs text-gray-500">Guides & downloads</div>
                    </div>
                  </Link>
                  <Link
                    to="/art-of-cyber-war"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-aegis-700/50 transition-colors"
                  >
                    <Shield className="w-5 h-5 text-secure-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Art of Cyber War</div>
                      <div className="text-xs text-gray-500">Sun Tzu's wisdom applied</div>
                    </div>
                  </Link>
                  <Link
                    to="/checklist"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-aegis-700/50 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-shield-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Security Checklist</div>
                      <div className="text-xs text-gray-500">Step-by-step guide</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/#scanner"
              className={`text-sm transition-colors ${isActive('/') ? 'text-shield-400' : 'text-gray-400 hover:text-white'}`}
            >
              Free Scanner
            </Link>
            <Link
              to="/pricing"
              className={`text-sm transition-colors ${isActive('/pricing') ? 'text-shield-400' : 'text-gray-400 hover:text-white'}`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`text-sm transition-colors ${isActive('/about') ? 'text-shield-400' : 'text-gray-400 hover:text-white'}`}
            >
              About
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/#scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-shield-500 hover:bg-shield-400 text-white font-semibold text-sm rounded-lg transition-all hover:shadow-lg hover:shadow-shield-500/25"
            >
              Scan Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-1">
              <Link
                to="/threats"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                AI Threats
              </Link>
              <Link
                to="/wordpress-security"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                WordPress Security
              </Link>
              <Link
                to="/resources"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Resources
              </Link>
              <Link
                to="/art-of-cyber-war"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Art of Cyber War
              </Link>
              <Link
                to="/checklist"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Security Checklist
              </Link>
              <Link
                to="/#scanner"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Free Scanner
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-aegis-800/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <div className="px-4 pt-4">
                <Link
                  to="/#scanner"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-shield-500 text-white font-semibold text-sm rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Scan Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Hero Section
function Hero() {
  const [url, setUrl] = useState('')

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-shield-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secure-500/10 rounded-full blur-3xl" />

      {/* Animated gradient orb */}
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-shield-500/20 to-secure-500/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-threat-500/10 border border-threat-500/20 rounded-full mb-8 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-threat-400" />
            <span className="text-sm font-medium text-threat-400">AI-powered attacks increased 300% in 2024</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 animate-slide-up">
            Hackers Have AI Now.
            <br />
            <span className="text-gradient">Does Your Defense?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up delay-100">
            Automated bots scan millions of websites daily looking for easy targets.
            Our free security scanner shows you exactly what they see —
            <span className="text-white font-medium"> before they attack.</span>
          </p>

          {/* Scanner Input */}
          <div className="max-w-xl mx-auto animate-slide-up delay-200">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-shield-500 to-secure-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
              <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-aegis-800 rounded-xl border border-white/10">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-aegis-700 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your website URL..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                  />
                </div>
                <a
                  href="#scanner"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-shield-500 to-shield-600 hover:from-shield-400 hover:to-shield-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-shield-500/25 hover:shadow-shield-500/40"
                >
                  <Search className="w-5 h-5" />
                  <span>Scan Free</span>
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No signup required. Results in 60 seconds.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-slide-up delay-300">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck className="w-5 h-5 text-secure-400" />
              <span className="text-sm">10,000+ sites scanned</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-5 h-5 text-shield-400" />
              <span className="text-sm">Results in 60 seconds</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Lock className="w-5 h-5 text-secure-400" />
              <span className="text-sm">100% private & secure</span>
            </div>
          </div>

          {/* Sun Tzu Quote */}
          <div className="mt-12 animate-slide-up delay-400">
            <p className="text-sm italic text-gray-500">
              "If you know the enemy and know yourself, you need not fear the result of a hundred battles."
              <span className="text-gray-600"> — Sun Tzu</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-gray-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

// Problem Section
function Problem() {
  const threats = [
    {
      icon: Bot,
      title: "AI-Powered Reconnaissance",
      description: "Bots using GPT and machine learning now scan and catalog vulnerabilities 1000x faster than humans ever could.",
      color: "threat"
    },
    {
      icon: Zap,
      title: "Automated Exploit Chains",
      description: "AI can chain together multiple small vulnerabilities into devastating attacks — automatically, at scale.",
      color: "critical"
    },
    {
      icon: Code,
      title: "Custom Malware Generation",
      description: "Attackers use AI to generate unique, undetectable malware variants for each target site.",
      color: "threat"
    },
    {
      icon: Users,
      title: "Social Engineering at Scale",
      description: "AI crafts perfect phishing emails by analyzing your site's content, team, and customer base.",
      color: "critical"
    }
  ]

  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800 to-aegis-900" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-critical-500/10 border border-critical-500/20 rounded-full mb-6">
            <ShieldAlert className="w-4 h-4 text-critical-400" />
            <span className="text-sm font-medium text-critical-400">The New Reality</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
            The Game Has
            <span className="text-gradient-warm"> Changed</span>
          </h2>
          <p className="text-lg text-gray-400">
            Hackers aren't manually typing commands anymore. They're deploying AI armies that
            probe millions of websites simultaneously. Your site is being scanned right now —
            <span className="text-white font-medium"> the question is whether you're ready.</span>
          </p>
          <p className="mt-4 text-sm italic text-gray-500">
            "The art of war teaches us to rely not on the likelihood of the enemy's not coming,
            but on our own readiness to receive him." — Sun Tzu
          </p>
        </div>

        {/* Threat Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {threats.map((threat, index) => (
            <div
              key={index}
              className="group relative p-6 md:p-8 bg-aegis-800/50 backdrop-blur border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${threat.color === 'threat' ? 'bg-threat-500/10' : 'bg-critical-500/10'}`}>
                  <threat.icon className={`w-6 h-6 ${threat.color === 'threat' ? 'text-threat-400' : 'text-critical-400'}`} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg md:text-xl mb-2 text-white group-hover:text-shield-400 transition-colors">
                    {threat.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {threat.description}
                  </p>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-threat-500/0 via-threat-500/5 to-critical-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">
            Still think your basic security plugins are enough?
          </p>
          <a
            href="#scanner"
            className="inline-flex items-center gap-2 text-shield-400 hover:text-shield-300 font-medium transition-colors"
          >
            Find out what hackers see
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

// Scanner Section - Interactive Security Scanner
function ScannerSection() {
  const features = [
    {
      icon: Server,
      title: "Infrastructure Analysis",
      description: "SSL, DNS, and server configuration checks"
    },
    {
      icon: Code,
      title: "CMS & Plugin Scan",
      description: "WordPress, Shopify, and vulnerability detection"
    },
    {
      icon: Eye,
      title: "Threat Intelligence",
      description: "Blacklist and malware signature scanning"
    },
    {
      icon: ShieldCheck,
      title: "Security Headers",
      description: "HTTP header configuration analysis"
    }
  ]

  return (
    <section id="scanner" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800/50 to-aegis-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-shield-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-shield-500/10 border border-shield-500/20 rounded-full mb-6">
            <Search className="w-4 h-4 text-shield-400" />
            <span className="text-sm font-medium text-shield-400">Free Security Scanner</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
            See What Hackers See —
            <span className="text-gradient"> In 60 Seconds</span>
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Our scanner performs the same reconnaissance that attackers use to find vulnerable targets.
            Get a comprehensive security snapshot — completely free.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-aegis-800/50 border border-white/5 rounded-full"
              >
                <feature.icon className="w-4 h-4 text-shield-400" />
                <span className="text-sm text-gray-300">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Scanner Component */}
        <Scanner />
      </div>
    </section>
  )
}

// AI-Ready Audit Section
function AuditSection() {
  const auditItems = [
    "Outdated WordPress core, themes, and plugins",
    "Vulnerable third-party integrations",
    "Missing or misconfigured security plugins",
    "Weak authentication and user permissions",
    "Database exposure risks",
    "File permission vulnerabilities"
  ]

  return (
    <section id="audit" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-800/50 via-aegis-900 to-aegis-800/50" />
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-secure-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secure-500/10 border border-secure-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-secure-400" />
              <span className="text-sm font-medium text-secure-400">Deep Security Audit</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
              Is Your Website
              <span className="text-gradient"> AI-Ready?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Older websites — especially WordPress sites running outdated plugins — are
              <span className="text-white font-medium"> sitting ducks</span> for AI-powered attacks.
              Our comprehensive audit reveals exactly where you're vulnerable.
            </p>

            <div className="space-y-4 mb-8">
              {auditItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-secure-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-secure-400" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/wordpress-security"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secure-500 hover:bg-secure-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-secure-500/25"
            >
              Learn More About WordPress Security
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-secure-500/10 to-shield-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-aegis-800 border border-white/10 rounded-2xl p-8">
              {/* WordPress vulnerability preview */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#21759b]/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">W</span>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white">WordPress Security Check</h4>
                  <p className="text-sm text-gray-500">Last scan: Just now</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-critical-500/10 border border-critical-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-critical-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-critical-400">Critical: Outdated Plugin</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Contact Form 7 v5.4 has known SQL injection vulnerability
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-threat-500/10 border border-threat-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-threat-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-threat-400">Warning: Weak Authentication</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Default admin username detected, no 2FA enabled
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-secure-500/10 border border-secure-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secure-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-secure-400">Passed: SSL Certificate</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Valid certificate with proper configuration
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-gray-500">12 more issues found</span>
                <span className="text-sm text-shield-400 hover:text-shield-300 cursor-pointer">View full report →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Resources Section
function Resources() {
  const resources = [
    {
      type: "Guide",
      title: "The Small Business Owner's Guide to Website Security",
      description: "Everything you need to know about protecting your website, explained in plain English.",
      icon: BookOpen,
      color: "shield"
    },
    {
      type: "Checklist",
      title: "WordPress Security Hardening Checklist",
      description: "20 essential steps to lock down your WordPress site, with step-by-step instructions.",
      icon: CheckCircle2,
      color: "secure"
    },
    {
      type: "Ebook",
      title: "AI Threats in 2025: What Every Business Must Know",
      description: "How AI is changing cybersecurity and what you can do to stay protected.",
      icon: FileText,
      color: "threat"
    }
  ]

  return (
    <section id="resources" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 to-aegis-800" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-shield-500/10 border border-shield-500/20 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-shield-400" />
            <span className="text-sm font-medium text-shield-400">Free Resources</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
            Learn to Protect Your
            <span className="text-gradient"> Digital Assets</span>
          </h2>
          <p className="text-lg text-gray-400">
            Free guides, checklists, and ebooks to help you understand and improve your website security.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {resources.map((resource, index) => (
            <Link
              key={index}
              to="/resources"
              className="group relative p-6 bg-aegis-800/50 backdrop-blur border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
                resource.color === 'shield' ? 'bg-shield-500/10 text-shield-400' :
                resource.color === 'secure' ? 'bg-secure-500/10 text-secure-400' :
                'bg-threat-500/10 text-threat-400'
              }`}>
                <resource.icon className="w-3 h-3" />
                {resource.type}
              </div>

              <h3 className="font-display font-semibold text-lg mb-3 text-white group-hover:text-shield-400 transition-colors">
                {resource.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {resource.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-shield-400 group-hover:text-shield-300 transition-colors">
                Download Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                resource.color === 'shield' ? 'bg-gradient-to-r from-shield-500/5 to-transparent' :
                resource.color === 'secure' ? 'bg-gradient-to-r from-secure-500/5 to-transparent' :
                'bg-gradient-to-r from-threat-500/5 to-transparent'
              }`} />
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-shield-400 hover:text-shield-300 font-medium transition-colors"
          >
            View All Resources
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function Pricing() {
  const plans = [
    {
      name: "Free Scan",
      description: "Perfect for a quick security check",
      price: "0",
      period: "one-time",
      features: [
        "Basic vulnerability scan",
        "SSL certificate check",
        "Security headers analysis",
        "CMS detection",
        "Email report",
      ],
      cta: "Scan Free",
      ctaLink: "#scanner",
      featured: false
    },
    {
      name: "Pro Monitoring",
      description: "Continuous protection for your business",
      price: "49",
      period: "/month",
      features: [
        "Everything in Free, plus:",
        "24/7 continuous monitoring",
        "Real-time threat alerts",
        "Malware scanning & removal",
        "Firewall recommendations",
        "Priority support",
        "Monthly security reports",
      ],
      cta: "Start Pro Trial",
      ctaLink: "/pricing",
      featured: true
    },
    {
      name: "Enterprise",
      description: "Full-service security for larger sites",
      price: "Custom",
      period: "",
      features: [
        "Everything in Pro, plus:",
        "Dedicated security engineer",
        "Custom security policies",
        "Incident response team",
        "Compliance assistance",
        "Multi-site management",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      ctaLink: "/about",
      featured: false
    }
  ]

  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-800 via-aegis-900 to-aegis-800" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-shield-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secure-500/10 border border-secure-500/20 rounded-full mb-6">
            <Award className="w-4 h-4 text-secure-400" />
            <span className="text-sm font-medium text-secure-400">Protection Plans</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
            Choose Your Level of
            <span className="text-gradient"> Protection</span>
          </h2>
          <p className="text-lg text-gray-400">
            Start with a free scan, then upgrade to continuous monitoring for complete peace of mind.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-6 lg:p-8 rounded-2xl transition-all duration-300 ${
                plan.featured
                  ? 'bg-gradient-to-b from-shield-500/10 to-aegis-800 border-2 border-shield-500/30 shadow-lg shadow-shield-500/10'
                  : 'bg-aegis-800/50 border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-shield-500 text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-bold text-xl text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  {plan.price !== "Custom" && <span className="text-gray-400">$</span>}
                  <span className="font-display font-bold text-4xl text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-4 h-4 mt-1 flex-shrink-0 ${plan.featured ? 'text-shield-400' : 'text-secure-400'}`} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.ctaLink.startsWith('#') ? (
                <a
                  href={plan.ctaLink}
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-sm text-center transition-all ${
                    plan.featured
                      ? 'bg-shield-500 hover:bg-shield-400 text-white shadow-lg shadow-shield-500/25'
                      : 'bg-aegis-700 hover:bg-aegis-600 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  to={plan.ctaLink}
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-sm text-center transition-all ${
                    plan.featured
                      ? 'bg-shield-500 hover:bg-shield-400 text-white shadow-lg shadow-shield-500/25'
                      : 'bg-aegis-700 hover:bg-aegis-600 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* View Full Pricing */}
        <div className="mt-12 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-shield-400 hover:text-shield-300 font-medium transition-colors"
          >
            View Full Pricing Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <ShieldCheck className="w-5 h-5 text-secure-400" />
            <span className="text-sm">30-day money-back guarantee on all paid plans</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="bg-aegis-800/50 border border-white/5 rounded-2xl p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Get Weekly Security Tips
              </h3>
              <p className="text-gray-400 text-sm">
                Join 2,000+ business owners getting actionable security advice every week.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-[360px]">
              <InlineEmailCapture
                placeholder="your@email.com"
                buttonText="Subscribe"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/images/logos/logo3.png"
                alt="Tzu Shield"
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              "The supreme art of war is to subdue the enemy without fighting."
              — Ancient wisdom for modern cyber defense.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock className="w-4 h-4 text-secure-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ShieldCheck className="w-4 h-4 text-secure-400" />
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/#scanner" className="text-gray-400 hover:text-white transition-colors text-sm">Free Scanner</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pro Monitoring</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Enterprise</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/threats" className="text-gray-400 hover:text-white transition-colors text-sm">AI Threats</Link></li>
              <li><Link to="/wordpress-security" className="text-gray-400 hover:text-white transition-colors text-sm">WordPress Security</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-white transition-colors text-sm">Guides & Downloads</Link></li>
              <li><Link to="/art-of-cyber-war" className="text-gray-400 hover:text-white transition-colors text-sm">Art of Cyber War</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Tzu Shield. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/admin" className="text-sm text-gray-500 hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Featured Images Section
function FeaturedSection() {
  const images = [
    { src: '/images/top-images/cyberdefense1.png', alt: 'Cyber Defense System Active', caption: 'AI-Powered Defense Systems' },
    { src: '/images/top-images/tzushield2.png', alt: 'Protected Business Owner', caption: 'Enterprise Security for Small Business' },
    { src: '/images/top-images/tzushield3.png', alt: 'Strategic Cyber Defense', caption: 'Ancient Wisdom, Modern Protection' },
    { src: '/images/top-images/cyberwar3.png', alt: 'Strategic Security', caption: 'Outsmart the Attackers' },
    { src: '/images/top-images/securityai1.png', alt: 'Security Level Up', caption: 'Level Up Your Security Posture' }
  ]

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-800/50 via-aegis-900 to-aegis-800/50" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
            The Art of <span className="text-gradient">Cyber Defense</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            "Know your enemy and know yourself, and you can fight a hundred battles without disaster." — Sun Tzu
          </p>
        </div>

        <ImageSlider
          images={images}
          autoPlay={true}
          interval={5000}
          showArrows={true}
          showDots={true}
          aspectRatio="16/9"
          className="border border-white/10 shadow-2xl shadow-shield-500/10"
        />
      </div>
    </section>
  )
}

// Home Page Component
function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <FeaturedSection />
      <ScannerSection />
      <AuditSection />
      <Resources />
      <Pricing />
    </>
  )
}

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="relative min-h-screen noise-overlay">
      <Navigation />
      <main>{children}</main>
      <Footer />
      <ExitIntentPopup />
    </div>
  )
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public routes with layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/threats" element={<Layout><ThreatsPage /></Layout>} />
          <Route path="/wordpress-security" element={<Layout><WordPressSecurityPage /></Layout>} />
          <Route path="/resources" element={<Layout><ResourcesPage /></Layout>} />
          <Route path="/resources/:slug" element={<Layout><ResourceDetailPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
          <Route path="/art-of-cyber-war" element={<Layout><ArtOfCyberWarPage /></Layout>} />
          <Route path="/checklist" element={<Layout><SecurityChecklistPage /></Layout>} />

          {/* Auth routes (no layout) */}
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Layout><AdminDashboard /></Layout>
            </AdminRoute>
          } />

          {/* Protected user routes */}
          <Route path="/dashboard" element={
            <UserRoute>
              <Layout><UserDashboard /></Layout>
            </UserRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
