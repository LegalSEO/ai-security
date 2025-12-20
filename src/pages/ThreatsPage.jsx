import { Link } from 'react-router-dom'
import {
  Bot,
  Brain,
  Target,
  Zap,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Users,
  Mail,
  Lock,
  Search,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Building2,
  Globe
} from 'lucide-react'

// Page Header Component
function PageHeader({ badge, title, subtitle }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800 to-aegis-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-critical-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-critical-500/10 border border-critical-500/20 rounded-full mb-6">
            <Bot className="w-4 h-4 text-critical-400" />
            <span className="text-sm font-medium text-critical-400">{badge}</span>
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

// Stat Card
function StatCard({ icon: Icon, stat, label }) {
  return (
    <div className="bg-aegis-800/50 border border-white/5 rounded-2xl p-6 text-center">
      <Icon className="w-8 h-8 text-critical-400 mx-auto mb-3" />
      <div className="font-display font-bold text-3xl md:text-4xl text-white mb-2">{stat}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

// Attack Type Card
function AttackCard({ icon: Icon, title, description, examples }) {
  return (
    <div className="bg-aegis-800/30 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-critical-500/30 transition-colors">
      <div className="w-12 h-12 bg-critical-500/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-critical-400" />
      </div>
      <h3 className="font-display font-semibold text-xl text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      {examples && examples.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-500">Examples:</span>
          <ul className="space-y-1">
            {examples.map((example, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <XCircle className="w-4 h-4 text-critical-400 mt-0.5 flex-shrink-0" />
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Case Study Card
function CaseStudy({ industry, attack, impact, lesson }) {
  return (
    <div className="bg-gradient-to-br from-critical-500/5 to-aegis-800/50 border border-critical-500/20 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 text-critical-400 text-sm font-medium mb-3">
        <Building2 className="w-4 h-4" />
        {industry}
      </div>
      <h4 className="font-display font-semibold text-lg text-white mb-3">{attack}</h4>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-threat-400 mt-0.5" />
          <span className="text-gray-400"><span className="text-threat-400 font-medium">Impact:</span> {impact}</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-secure-400 mt-0.5" />
          <span className="text-gray-400"><span className="text-secure-400 font-medium">Lesson:</span> {lesson}</span>
        </div>
      </div>
    </div>
  )
}

export default function ThreatsPage() {
  const stats = [
    { icon: TrendingUp, stat: "300%", label: "Increase in AI-powered attacks (2024)" },
    { icon: Clock, stat: "22 sec", label: "Average time to compromise" },
    { icon: DollarSign, stat: "$4.35M", label: "Average breach cost" },
    { icon: Target, stat: "43%", label: "Attacks target small businesses" }
  ]

  const attackTypes = [
    {
      icon: Mail,
      title: "AI-Generated Phishing",
      description: "Attackers use AI to craft highly personalized emails that bypass spam filters and fool even savvy users. These emails reference real conversations and mimic writing styles perfectly.",
      examples: [
        "Fake invoice from a vendor you actually use",
        "Password reset that looks identical to the real thing",
        "CEO impersonation requesting urgent wire transfer"
      ]
    },
    {
      icon: Bot,
      title: "Automated Vulnerability Scanning",
      description: "AI-powered bots continuously scan millions of websites, instantly detecting outdated plugins, weak configurations, and known vulnerabilities. Your site is being probed right now.",
      examples: [
        "WordPress plugin exploits within hours of disclosure",
        "Automated SQL injection attempts",
        "Brute force login attacks at scale"
      ]
    },
    {
      icon: Brain,
      title: "Deepfake Voice & Video",
      description: "Criminals clone voices and create fake video to impersonate business owners, employees, and partners. A 3-second audio clip is enough to clone a voice.",
      examples: [
        "Fake voicemail from your bank requesting verification",
        "Video call with a 'colleague' requesting access",
        "Voice authorization for fraudulent transactions"
      ]
    },
    {
      icon: Lock,
      title: "Smart Ransomware",
      description: "Modern ransomware uses AI to identify your most valuable files, spread undetected, and demand ransoms calibrated to what you can afford to pay.",
      examples: [
        "Encrypted backups before you notice the attack",
        "Exfiltration of sensitive data before encryption",
        "Targeted ransom amounts based on business research"
      ]
    },
    {
      icon: Search,
      title: "Credential Stuffing",
      description: "AI tests stolen username/password combinations across thousands of sites simultaneously, finding where you've reused passwords.",
      examples: [
        "Breach of one account leads to all accounts",
        "Business email compromise from personal breach",
        "Customer data theft through admin account reuse"
      ]
    },
    {
      icon: Globe,
      title: "SEO Poisoning & Malvertising",
      description: "Attackers use AI to create convincing fake websites that rank highly in search results, tricking you into downloading malware or entering credentials.",
      examples: [
        "Fake software download sites ranking #1",
        "Malicious ads appearing on legitimate sites",
        "Clone sites that steal customer payments"
      ]
    }
  ]

  const caseStudies = [
    {
      industry: "Local Accounting Firm",
      attack: "AI-powered phishing led to ransomware",
      impact: "$85,000 ransom + 2 weeks downtime + lost client trust",
      lesson: "Regular security scans would have caught the vulnerable remote access software"
    },
    {
      industry: "E-commerce Store",
      attack: "Automated bot discovered outdated WooCommerce plugin",
      impact: "4,200 customer credit cards stolen, $120,000 in fines",
      lesson: "Automated vulnerability monitoring would have flagged the outdated plugin"
    },
    {
      industry: "Medical Practice",
      attack: "Credential stuffing from breached personal email",
      impact: "HIPAA violation, $250,000 settlement, reputation damage",
      lesson: "Multi-factor authentication and breach monitoring would have prevented access"
    },
    {
      industry: "Marketing Agency",
      attack: "Deepfake voice call authorized fraudulent wire transfer",
      impact: "$47,000 lost, never recovered",
      lesson: "Verification protocols for financial requests are essential"
    }
  ]

  return (
    <div className="min-h-screen">
      <PageHeader
        badge="Threat Intelligence"
        title="AI-Powered Threats: What You Need to Know"
        subtitle="Hackers have access to the same AI technology as Fortune 500 companies. Here's how they're using it against small businesses — and what you can do about it."
      />

      {/* Stats Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* How AI Changed Hacking */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-6 text-center">
            How AI Changed the Game
          </h2>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-400 mb-6">
              Before AI, hackers had to manually research targets, craft phishing emails, and probe for vulnerabilities one at a time. A skilled attacker might compromise a few dozen businesses per month.
            </p>
            <p className="text-gray-400 mb-6">
              <span className="text-critical-400 font-semibold">Now, AI automates everything.</span> A single attacker can scan millions of websites, generate thousands of personalized phishing emails, and exploit vulnerabilities within minutes of their discovery — all running 24/7 without human intervention.
            </p>
            <p className="text-gray-400">
              The result? Small businesses that were "too small to target" are now the <span className="text-white font-semibold">primary targets</span>. You have valuable data and less security than enterprises. To AI-powered attackers, you're the low-hanging fruit.
            </p>
          </div>
        </div>
      </section>

      {/* Attack Types */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4 text-center">
            Common AI-Powered Attack Types
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Understanding the threats is the first step to defending against them. Here's what you're up against.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attackTypes.map((attack, i) => (
              <AttackCard key={i} {...attack} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Small Businesses */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-8 h-8 text-threat-400" />
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              Why Small Businesses Are Prime Targets
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3">Attackers Think:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-critical-400 mt-0.5" />
                  "They probably don't have dedicated IT security"
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-critical-400 mt-0.5" />
                  "Their WordPress site hasn't been updated in months"
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-critical-400 mt-0.5" />
                  "They'll pay the ransom because they can't afford downtime"
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-critical-400 mt-0.5" />
                  "They have customer data but weak protections"
                </li>
              </ul>
            </div>
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3">The Reality:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400">
                  <AlertTriangle className="w-5 h-5 text-threat-400 mt-0.5" />
                  60% of small businesses close within 6 months of a breach
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <AlertTriangle className="w-5 h-5 text-threat-400 mt-0.5" />
                  Average cost of a data breach for SMBs: $108,000
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <AlertTriangle className="w-5 h-5 text-threat-400 mt-0.5" />
                  46% of all breaches impact businesses with &lt;1000 employees
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <AlertTriangle className="w-5 h-5 text-threat-400 mt-0.5" />
                  Most attacks are automated — no business is "too small"
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4 text-center">
            Real-World Examples
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            These anonymized cases illustrate how AI-powered attacks impact real businesses. The common thread? Prevention was possible.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudies.map((study, i) => (
              <CaseStudy key={i} {...study} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-aegis-800/50 to-aegis-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldAlert className="w-16 h-16 text-shield-400 mx-auto mb-6" />
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
            Don't Wait Until It's Too Late
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Our free security scan shows you exactly what attackers see when they probe your website.
            Find out if you're vulnerable — before they do.
          </p>
          <Link
            to="/#scanner"
            className="inline-flex items-center gap-2 px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-shield-500/25"
          >
            Scan Your Website Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
