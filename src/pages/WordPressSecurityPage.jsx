import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Shield,
  Puzzle,
  Clock,
  Bug,
  TrendingUp,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Server,
  Code,
  Lock,
  Zap,
  RefreshCw,
  Users,
  DollarSign,
  ExternalLink,
  AlertOctagon,
  ShieldCheck,
  Wrench
} from 'lucide-react'

// Page Header Component
function PageHeader({ badge, title, subtitle }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800 to-aegis-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-threat-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-threat-500/10 border border-threat-500/20 rounded-full mb-6">
            <AlertTriangle className="w-4 h-4 text-threat-400" />
            <span className="text-sm font-medium text-threat-400">{badge}</span>
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

// Stat Box
function StatBox({ stat, label, subtext }) {
  return (
    <div className="bg-aegis-800/50 border border-white/5 rounded-2xl p-6">
      <div className="font-display font-bold text-4xl md:text-5xl text-threat-400 mb-2">{stat}</div>
      <div className="font-semibold text-white mb-1">{label}</div>
      <div className="text-sm text-gray-500">{subtext}</div>
    </div>
  )
}

// Mistake Card
function MistakeCard({ number, title, description, danger }) {
  return (
    <div className="bg-aegis-800/30 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-threat-500/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-threat-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-threat-400">{number}</span>
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-white mb-2">{title}</h3>
          <p className="text-gray-400 mb-3">{description}</p>
          <div className="flex items-start gap-2 text-sm">
            <AlertOctagon className="w-4 h-4 text-critical-400 mt-0.5 flex-shrink-0" />
            <span className="text-critical-400">{danger}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Plugin Danger Item
function PluginDanger({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-threat-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-threat-400" />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}

// Alternative Option
function AlternativeOption({ icon: Icon, title, description, benefits }) {
  return (
    <div className="bg-aegis-800/50 border border-secure-500/20 rounded-2xl p-6 md:p-8">
      <div className="w-12 h-12 bg-secure-500/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-secure-400" />
      </div>
      <h3 className="font-display font-semibold text-xl text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-secure-400">
            <CheckCircle2 className="w-4 h-4" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function WordPressSecurityPage() {
  const stats = [
    { stat: "43%", label: "of all websites run WordPress", subtext: "Making it the #1 target for hackers" },
    { stat: "97%", label: "of WordPress attacks target plugins", subtext: "Not WordPress core itself" },
    { stat: "8,000+", label: "vulnerable plugins identified in 2024", subtext: "Many still in use on live sites" },
    { stat: "3x", label: "more breaches than other CMS", subtext: "Compared to modern alternatives" }
  ]

  const mistakes = [
    {
      number: 1,
      title: "Not Updating WordPress Core, Themes, or Plugins",
      description: "Every time you skip an update, you're leaving a known vulnerability exposed. Hackers have automated tools that scan for outdated installations 24/7.",
      danger: "90% of hacked WordPress sites were running outdated software"
    },
    {
      number: 2,
      title: "Using Nulled (Pirated) Themes or Plugins",
      description: "That 'free' premium theme likely contains backdoors, malware, or code that phones home to attackers. You're literally installing the hacker's toolkit.",
      danger: "Nulled plugins are the #1 source of WordPress malware"
    },
    {
      number: 3,
      title: "Weak Admin Passwords",
      description: "Using 'admin' as your username with a simple password is like leaving your front door open. Brute force attacks try thousands of combinations per hour.",
      danger: "Takes 2 seconds to crack 'password123' with modern tools"
    },
    {
      number: 4,
      title: "Too Many Plugins",
      description: "Each plugin is a potential vulnerability. The average WordPress site has 20+ plugins, but most only need 5-10. More plugins = more attack surface.",
      danger: "Each plugin multiplies your risk exponentially"
    },
    {
      number: 5,
      title: "No Security Plugin or Monitoring",
      description: "Most WordPress site owners only discover they've been hacked when customers complain or Google blacklists them. By then, the damage is done.",
      danger: "Average time to detect a WordPress breach: 197 days"
    },
    {
      number: 6,
      title: "Cheap Shared Hosting",
      description: "Budget hosting often means hundreds of sites on one server. If one gets hacked, yours is at risk. Plus, slow servers = poor security updates.",
      danger: "Cross-site contamination affects 1 in 3 shared hosting accounts"
    }
  ]

  const pluginDangers = [
    {
      icon: Clock,
      title: "Abandoned Plugins",
      description: "Millions of sites use plugins that haven't been updated in years. No updates = no security patches."
    },
    {
      icon: Bug,
      title: "Zero-Day Vulnerabilities",
      description: "When a vulnerability is discovered, attackers exploit it within hours. Plugin authors may take weeks to patch."
    },
    {
      icon: Users,
      title: "Supply Chain Attacks",
      description: "Hackers buy popular plugins from developers, then push malicious updates to all users automatically."
    },
    {
      icon: Code,
      title: "Poor Code Quality",
      description: "Many plugins are written by hobbyists without security expertise. SQL injection and XSS vulnerabilities are common."
    }
  ]

  const alternatives = [
    {
      icon: Zap,
      title: "Static Site Generators",
      description: "Sites built with tools like Next.js, Gatsby, or Hugo have no database to hack and no plugins to exploit.",
      benefits: [
        "No database vulnerabilities",
        "No plugin attack surface",
        "Lightning fast performance",
        "Simple, cheap hosting"
      ]
    },
    {
      icon: Server,
      title: "Headless CMS",
      description: "Keep the easy editing experience but serve a static frontend. The CMS stays behind a firewall.",
      benefits: [
        "Editor-friendly interface",
        "Separated frontend security",
        "API-based architecture",
        "Modern tech stack"
      ]
    },
    {
      icon: ShieldCheck,
      title: "Managed Website Services",
      description: "Let experts handle the security while you focus on your business. We build and maintain secure sites.",
      benefits: [
        "Professional security management",
        "Regular updates handled for you",
        "Monitoring and backups included",
        "Expert support when needed"
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      <PageHeader
        badge="WordPress Security"
        title="Is Your WordPress Site a Ticking Time Bomb?"
        subtitle="WordPress powers 43% of the web — making it the most targeted CMS in the world. Here's what every WordPress site owner needs to know."
      />

      {/* Stats Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <StatBox key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-6 text-center">
            The WordPress Paradox
          </h2>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-400 mb-6">
              WordPress is incredibly easy to set up. That's the problem. What takes minutes to install takes constant effort to secure. And most small business owners don't have the time, expertise, or awareness to maintain proper security.
            </p>
            <p className="text-gray-400 mb-6">
              The platform itself isn't inherently insecure — <span className="text-white font-semibold">the ecosystem around it is</span>. Tens of thousands of themes and plugins, written by developers with varying skill levels, create an attack surface that's nearly impossible to defend.
            </p>
            <p className="text-gray-400">
              For every legitimate security update, there are hackers reverse-engineering the patch to exploit the sites that haven't updated yet. It's a never-ending race — and most site owners don't even know they're running.
            </p>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4 text-center">
            6 WordPress Security Mistakes That Get Sites Hacked
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Most WordPress hacks are completely preventable. These are the mistakes we see over and over again.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {mistakes.map((mistake, i) => (
              <MistakeCard key={i} {...mistake} />
            ))}
          </div>
        </div>
      </section>

      {/* Plugin Dangers */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Puzzle className="w-8 h-8 text-threat-400" />
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              The Plugin Problem
            </h2>
          </div>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Plugins are WordPress's greatest strength and biggest weakness. Here's why they're so dangerous.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {pluginDangers.map((danger, i) => (
              <div key={i} className="bg-aegis-800/50 border border-white/5 rounded-xl p-6">
                <PluginDanger {...danger} />
              </div>
            ))}
          </div>

          {/* Plugin Stats */}
          <div className="mt-12 bg-gradient-to-r from-threat-500/10 to-critical-500/10 border border-threat-500/20 rounded-2xl p-6 md:p-8">
            <h3 className="font-display font-semibold text-lg text-white mb-4 text-center">
              Plugin Vulnerability Timeline
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display font-bold text-2xl text-threat-400">4 hours</div>
                <div className="text-sm text-gray-400">Average exploit time after disclosure</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-threat-400">14 days</div>
                <div className="text-sm text-gray-400">Average time for plugin patch</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-threat-400">60%</div>
                <div className="text-sm text-gray-400">Sites still unpatched after 30 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternatives */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4 text-center">
            Modern Alternatives to WordPress
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Many businesses are moving to more secure platforms. Here are your options.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {alternatives.map((alt, i) => (
              <AlternativeOption key={i} {...alt} />
            ))}
          </div>
        </div>
      </section>

      {/* If You're Staying on WordPress */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-6 text-center">
            Staying on WordPress? Here's Your Security Checklist
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="w-5 h-5 text-secure-400" />
                <h4 className="font-semibold text-white">Update Everything Weekly</h4>
              </div>
              <p className="text-sm text-gray-400">Core, themes, and plugins. Enable auto-updates where possible.</p>
            </div>
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-secure-400" />
                <h4 className="font-semibold text-white">Use Strong, Unique Passwords</h4>
              </div>
              <p className="text-sm text-gray-400">20+ characters for admin accounts. Use a password manager.</p>
            </div>
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-secure-400" />
                <h4 className="font-semibold text-white">Install a Security Plugin</h4>
              </div>
              <p className="text-sm text-gray-400">Wordfence, Sucuri, or iThemes Security for firewall and monitoring.</p>
            </div>
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Server className="w-5 h-5 text-secure-400" />
                <h4 className="font-semibold text-white">Upgrade Your Hosting</h4>
              </div>
              <p className="text-sm text-gray-400">Managed WordPress hosting with security features built in.</p>
            </div>
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Puzzle className="w-5 h-5 text-secure-400" />
                <h4 className="font-semibold text-white">Audit Your Plugins</h4>
              </div>
              <p className="text-sm text-gray-400">Remove unused plugins. Check last update dates. Fewer is better.</p>
            </div>
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-secure-400" />
                <h4 className="font-semibold text-white">Schedule Regular Backups</h4>
              </div>
              <p className="text-sm text-gray-400">Daily backups stored offsite. Test restoration regularly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-shield-500/10 to-secure-500/10 border border-shield-500/20 rounded-3xl p-8 md:p-12 text-center">
            <Wrench className="w-16 h-16 text-shield-400 mx-auto mb-6" />
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              Not Sure About Your WordPress Security?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Our free scan checks your WordPress site for known vulnerabilities, outdated plugins,
              security misconfigurations, and more. Get a complete security assessment in 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#scanner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-shield-500/25"
              >
                Scan Your WordPress Site
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-aegis-700 hover:bg-aegis-600 border border-white/10 text-white font-semibold rounded-xl transition-all"
              >
                View Rebuild Services
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
