import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Check,
  X,
  Zap,
  Clock,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  Crown,
  Star,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  Wrench,
  RefreshCw,
  Lock,
  Users,
  Building2
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

// Billing Toggle
function BillingToggle({ isAnnual, onChange }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
      <button
        onClick={() => onChange(!isAnnual)}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          isAnnual ? 'bg-shield-500' : 'bg-aegis-700'
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
            isAnnual ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
        Annual
        <span className="ml-2 text-secure-400 text-xs">Save 20%</span>
      </span>
    </div>
  )
}

// Pricing Card
function PricingCard({ plan, isAnnual, featured }) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
  const period = isAnnual ? '/year' : '/month'

  return (
    <div className={`relative rounded-3xl p-8 ${
      featured
        ? 'bg-gradient-to-b from-shield-500/20 to-aegis-800/50 border-2 border-shield-500/50'
        : 'bg-aegis-800/30 border border-white/5'
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-shield-500 rounded-full">
            <Star className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
          featured ? 'bg-shield-500/20' : 'bg-aegis-700/50'
        }`}>
          <plan.icon className={`w-7 h-7 ${featured ? 'text-shield-400' : 'text-gray-400'}`} />
        </div>
        <h3 className="font-display font-bold text-2xl text-white mb-2">{plan.name}</h3>
        <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

        {plan.price === 'custom' ? (
          <div className="mb-6">
            <span className="font-display font-bold text-4xl text-white">Custom</span>
            <span className="text-gray-500 ml-2">quote</span>
          </div>
        ) : plan.price === 0 ? (
          <div className="mb-6">
            <span className="font-display font-bold text-4xl text-white">Free</span>
          </div>
        ) : (
          <div className="mb-6">
            <span className="font-display font-bold text-4xl text-white">${price}</span>
            <span className="text-gray-500 ml-1">{period}</span>
            {isAnnual && plan.monthlyPrice && (
              <div className="text-sm text-secure-400 mt-1">
                ${Math.round(plan.annualPrice / 12)}/mo billed annually
              </div>
            )}
          </div>
        )}

        <Link
          to={plan.ctaLink}
          className={`block w-full py-3 px-6 rounded-xl font-semibold transition-all ${
            featured
              ? 'bg-shield-500 hover:bg-shield-400 text-white shadow-lg shadow-shield-500/25'
              : plan.price === 'custom'
              ? 'bg-threat-500/10 hover:bg-threat-500/20 text-threat-400 border border-threat-500/30'
              : 'bg-aegis-700 hover:bg-aegis-600 text-white border border-white/10'
          }`}
        >
          {plan.ctaText}
        </Link>
      </div>

      <div className="space-y-4">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-secure-400 mt-0.5 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            )}
            <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
              {feature.text}
              {feature.highlight && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-secure-500/20 text-secure-400 rounded-full">
                  {feature.highlight}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// FAQ Item
function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-white/5">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-white pr-8">{question}</span>
        <span className={`text-shield-400 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
      </button>
      {isOpen && (
        <div className="pb-6 text-gray-400">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFAQ, setOpenFAQ] = useState(0)

  const plans = [
    {
      name: "Free",
      description: "One-time security snapshot",
      icon: Shield,
      price: 0,
      monthlyPrice: 0,
      annualPrice: 0,
      ctaText: "Scan Now",
      ctaLink: "/#scanner",
      features: [
        { text: "One-time security scan", included: true },
        { text: "Basic security report (PDF)", included: true },
        { text: "SSL/HTTPS check", included: true },
        { text: "Security headers analysis", included: true },
        { text: "CMS detection", included: true },
        { text: "Exposed files check", included: true },
        { text: "Weekly monitoring", included: false },
        { text: "Priority alerts", included: false },
        { text: "Detailed fix instructions", included: false },
        { text: "Priority support", included: false }
      ]
    },
    {
      name: "Pro",
      description: "Continuous protection & monitoring",
      icon: Zap,
      price: 29,
      monthlyPrice: 29,
      annualPrice: 279,
      ctaText: "Start Pro Trial",
      ctaLink: "/#scanner",
      featured: true,
      features: [
        { text: "Weekly automated scans", included: true },
        { text: "Full Pro security reports", included: true, highlight: "Pro" },
        { text: "All Free features included", included: true },
        { text: "Detailed fix instructions", included: true },
        { text: "Email & SMS alerts", included: true },
        { text: "Security score tracking", included: true },
        { text: "Plugin vulnerability alerts", included: true },
        { text: "SSL expiration monitoring", included: true },
        { text: "Priority email support", included: true },
        { text: "Up to 3 websites", included: true }
      ]
    },
    {
      name: "Enterprise",
      description: "Custom solutions & site rebuilds",
      icon: Building2,
      price: "custom",
      ctaText: "Contact Us",
      ctaLink: "/about",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Unlimited websites", included: true },
        { text: "Custom scan schedules", included: true },
        { text: "API access", included: true },
        { text: "White-label reports", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "WordPress to static migration", included: true, highlight: "New" },
        { text: "Security hardening service", included: true },
        { text: "Incident response support", included: true },
        { text: "SLA guarantee", included: true }
      ]
    }
  ]

  const faqs = [
    {
      question: "What happens after my free scan?",
      answer: "You'll get an instant security report showing your website's vulnerabilities. There's no obligation to purchase anything. The free report includes actionable insights you can implement yourself. If you want ongoing monitoring or detailed fix instructions, you can upgrade to Pro anytime."
    },
    {
      question: "How often does Pro scan my website?",
      answer: "Pro scans run weekly by default, but you can trigger manual scans anytime. We also monitor for critical issues (like SSL expiration) daily. You'll receive immediate alerts if we detect any urgent security issues."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your Pro subscription at any time. If you're on annual billing, you'll continue to have access until the end of your billing period. We don't do refunds on annual plans, so monthly is a good option if you're not sure."
    },
    {
      question: "What's included in the Enterprise site rebuild?",
      answer: "We migrate your existing website to a modern, secure platform. This typically means moving from WordPress to a static site or headless CMS architecture. The result is faster, more secure, and often cheaper to host. Each project is custom quoted based on your site's complexity."
    },
    {
      question: "Do you offer refunds?",
      answer: "Monthly Pro subscriptions can be cancelled anytime with no refund needed (you just won't be billed again). For annual subscriptions, we offer a 14-day money-back guarantee if you're not satisfied. Enterprise projects are quoted individually with their own terms."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We practice what we preach. All data is encrypted in transit and at rest. We never store your website credentials. Scan results are only accessible to you. You can delete your account and all associated data at any time."
    }
  ]

  return (
    <div className="min-h-screen">
      <PageHeader
        badge="Pricing"
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that fits your needs. Start free, upgrade when you're ready."
      />

      {/* Billing Toggle */}
      <section className="relative py-8">
        <BillingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <PricingCard key={i} plan={plan} isAnnual={isAnnual} featured={plan.featured} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table - Desktop */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30 hidden lg:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-12 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Free</th>
                  <th className="text-center py-4 px-4 text-shield-400 font-medium">Pro</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Security Scans", free: "1x", pro: "Weekly", enterprise: "Custom" },
                  { feature: "PDF Reports", free: "Basic", pro: "Full Pro", enterprise: "White-label" },
                  { feature: "SSL Monitoring", free: false, pro: true, enterprise: true },
                  { feature: "Email Alerts", free: false, pro: true, enterprise: true },
                  { feature: "SMS Alerts", free: false, pro: true, enterprise: true },
                  { feature: "Fix Instructions", free: false, pro: true, enterprise: true },
                  { feature: "API Access", free: false, pro: false, enterprise: true },
                  { feature: "Websites", free: "1", pro: "3", enterprise: "Unlimited" },
                  { feature: "Support", free: "Email", pro: "Priority", enterprise: "Dedicated" },
                  { feature: "Site Rebuild Service", free: false, pro: false, enterprise: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4 text-white">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-5 h-5 text-secure-400 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">{row.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-shield-500/5">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-secure-400 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-shield-400 font-medium">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="w-5 h-5 text-secure-400 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-shield-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === i}
                onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="relative py-16 md:py-24 bg-aegis-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secure-500/10 rounded-full mb-6">
            <Lock className="w-10 h-10 text-secure-400" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
            14-Day Money-Back Guarantee
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Try Pro risk-free. If you're not completely satisfied within the first 14 days,
            we'll refund your payment in full. No questions asked.
          </p>
          <Link
            to="/#scanner"
            className="inline-flex items-center gap-2 px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-shield-500/25"
          >
            Start Your Free Scan
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-threat-500/10 to-shield-500/10 border border-threat-500/20 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-threat-500/20 rounded-2xl flex items-center justify-center">
                  <Wrench className="w-10 h-10 text-threat-400" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display font-bold text-2xl text-white mb-3">
                  Need a Complete Site Rebuild?
                </h3>
                <p className="text-gray-400 mb-6">
                  If your WordPress site is beyond saving, we can build you a modern, secure replacement.
                  Faster, safer, and often cheaper to maintain.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to="/wordpress-security"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-threat-500 hover:bg-threat-400 text-white font-semibold rounded-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Learn About Rebuilds
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-aegis-700 hover:bg-aegis-600 border border-white/10 text-white font-semibold rounded-xl transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
