import { Link } from 'react-router-dom'
import {
  Shield,
  Heart,
  Target,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  MessageCircle,
  Lightbulb,
  TrendingUp
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
            <Shield className="w-4 h-4 text-shield-400" />
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

// Value Card
function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-aegis-800/30 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-shield-500/30 transition-colors">
      <div className="w-12 h-12 bg-shield-500/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-shield-400" />
      </div>
      <h3 className="font-display font-semibold text-xl text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

// Stat Item
function StatItem({ number, label }) {
  return (
    <div className="text-center">
      <div className="font-display font-bold text-4xl md:text-5xl text-shield-400 mb-2">{number}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

// Principle Card
function PrincipleCard({ number, title, description }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-secure-500/20 rounded-full flex items-center justify-center">
          <span className="font-display font-bold text-secure-400">{number}</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-2">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: "Empowerment, Not Fear",
      description: "We believe in educating and empowering business owners, not scaring them into buying services. Knowledge is your first line of defense."
    },
    {
      icon: MessageCircle,
      title: "Plain English",
      description: "Security doesn't have to be complicated. We translate technical jargon into actionable advice that anyone can understand and implement."
    },
    {
      icon: Target,
      title: "Practical Solutions",
      description: "We focus on what actually matters for your business. Not theoretical risks, but real threats with real solutions you can afford."
    },
    {
      icon: Heart,
      title: "Honest Guidance",
      description: "We'll tell you what you actually need, not what makes us the most money. Sometimes the best advice is 'you don't need that.'"
    }
  ]

  const principles = [
    {
      number: "1",
      title: "We don't sell fear",
      description: "You'll never see us using scare tactics or exaggerating threats. We present facts and let you make informed decisions."
    },
    {
      number: "2",
      title: "We're transparent about capabilities",
      description: "Our tools do what we say they do. We won't promise 100% security (no one can) or make claims we can't back up."
    },
    {
      number: "3",
      title: "We price fairly",
      description: "Our pricing is clear, honest, and designed for small businesses. No hidden fees, no surprise charges, no enterprise-only features."
    },
    {
      number: "4",
      title: "We educate first",
      description: "Even if you never become a customer, our free resources should help you improve your security posture."
    },
    {
      number: "5",
      title: "We respect your data",
      description: "We practice what we preach. Your data is encrypted, never sold, and you can delete it anytime."
    }
  ]

  return (
    <div className="min-h-screen">
      <PageHeader
        badge="About Aegis"
        title="Security Made Accessible"
        subtitle="We believe every business deserves enterprise-grade security insights, regardless of size or technical expertise."
      />

      {/* Mission Statement */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              The cybersecurity industry has a problem: it's built for enterprises with dedicated IT teams and six-figure budgets. Small businesses and solopreneurs are left to fend for themselves, often unaware of the risks they face until it's too late.
            </p>
            <p className="text-gray-400 text-lg mb-6">
              <span className="text-white font-semibold">Aegis Security exists to change that.</span> We're building tools and resources that give every business owner visibility into their security posture — the same visibility that Fortune 500 companies have, but designed for people who aren't security experts.
            </p>
            <p className="text-gray-400 text-lg">
              We started Aegis because we saw too many small businesses get hurt by preventable attacks. Businesses that didn't know their WordPress was vulnerable, that their contact form was exposed, or that their SSL certificate had expired. We're here to make sure that doesn't happen to you.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatItem number="10K+" label="Websites Scanned" />
            <StatItem number="50K+" label="Vulnerabilities Found" />
            <StatItem number="2K+" label="Businesses Protected" />
            <StatItem number="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4 text-center">
            What We Believe
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Our values guide everything we do, from the tools we build to how we talk about security.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <ValueCard key={i} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4 text-center">
            Our Commitment to You
          </h2>
          <p className="text-gray-400 text-center mb-12">
            These are the principles we hold ourselves to.
          </p>
          <div className="space-y-8">
            {principles.map((principle, i) => (
              <PrincipleCard key={i} {...principle} />
            ))}
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-8 text-center">
            Why We're Different
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-aegis-800/50 border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-critical-400 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Traditional Security Companies
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-critical-400">✗</span>
                  Use fear-based marketing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-critical-400">✗</span>
                  Require expensive consultations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-critical-400">✗</span>
                  Hide pricing behind sales calls
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-critical-400">✗</span>
                  Speak in technical jargon
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-critical-400">✗</span>
                  Build for enterprise budgets
                </li>
              </ul>
            </div>
            <div className="bg-aegis-800/50 border border-secure-500/20 rounded-2xl p-6">
              <h3 className="font-semibold text-secure-400 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Aegis Security
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secure-400 mt-0.5" />
                  Educates and empowers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secure-400 mt-0.5" />
                  Free scan, instant results
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secure-400 mt-0.5" />
                  Transparent, affordable pricing
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secure-400 mt-0.5" />
                  Plain English explanations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secure-400 mt-0.5" />
                  Built for small businesses
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-12 h-12 text-shield-400 mx-auto mb-6" />
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-6">
            Built by Security Professionals
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Our team has experience in enterprise security, penetration testing, and helping businesses
            recover from breaches. We've seen what goes wrong — and we've built Aegis to prevent it.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="px-4 py-2 bg-aegis-700/50 rounded-full">10+ Years Security Experience</span>
            <span className="px-4 py-2 bg-aegis-700/50 rounded-full">Certified Security Professionals</span>
            <span className="px-4 py-2 bg-aegis-700/50 rounded-full">OWASP Contributors</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-shield-500/10 to-secure-500/10 border border-shield-500/20 rounded-3xl p-8 md:p-12 text-center">
            <Zap className="w-16 h-16 text-shield-400 mx-auto mb-6" />
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              Ready to See Where You Stand?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Our free security scan takes 60 seconds and shows you exactly what vulnerabilities exist on your website.
              No sales pitch, just actionable information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#scanner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-shield-500/25"
              >
                Scan Your Website Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-aegis-700 hover:bg-aegis-600 border border-white/10 text-white font-semibold rounded-xl transition-all"
              >
                Browse Free Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
