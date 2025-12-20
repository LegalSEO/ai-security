import { Link } from 'react-router-dom'
import {
  Shield,
  Eye,
  Target,
  Swords,
  Brain,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Quote,
  Scroll,
  Crown,
  Compass,
  Mountain,
  Flame,
  Wind,
  Droplets
} from 'lucide-react'

// Sun Tzu quotes mapped to cybersecurity principles
const strategicPrinciples = [
  {
    quote: "The supreme art of war is to subdue the enemy without fighting.",
    author: "Sun Tzu, The Art of War",
    principle: "Prevention Over Reaction",
    application: "The best security posture stops attacks before they happen. Proactive scanning, monitoring, and hardening prevent breaches entirely — far better than responding after the damage is done.",
    icon: Shield,
    color: "shield"
  },
  {
    quote: "If you know the enemy and know yourself, you need not fear the result of a hundred battles.",
    author: "Sun Tzu, The Art of War",
    principle: "Know Your Vulnerabilities",
    application: "Understanding your own systems' weaknesses is as crucial as understanding attacker techniques. Regular security audits reveal blind spots before hackers exploit them.",
    icon: Eye,
    color: "secure"
  },
  {
    quote: "All warfare is based on deception.",
    author: "Sun Tzu, The Art of War",
    principle: "Assume Nothing",
    application: "Attackers use social engineering, phishing, and misdirection. Every unexpected email, login attempt, or system behavior should be verified. Trust, but verify everything.",
    icon: AlertTriangle,
    color: "threat"
  },
  {
    quote: "Appear weak when you are strong, and strong when you are weak.",
    author: "Sun Tzu, The Art of War",
    principle: "Security Through Obscurity (As One Layer)",
    application: "Don't broadcast your security stack. Hide version numbers, remove server signatures, and present a minimal attack surface. Make reconnaissance harder for automated scanners.",
    icon: Lock,
    color: "shield"
  },
  {
    quote: "The whole secret lies in confusing the enemy, so that he cannot fathom our real intent.",
    author: "Sun Tzu, The Art of War",
    principle: "Defense in Depth",
    application: "Layer your defenses. Firewalls, WAFs, intrusion detection, encryption, and monitoring work together. If one layer fails, others remain to confuse and stop attackers.",
    icon: Mountain,
    color: "secure"
  },
  {
    quote: "Speed is the essence of war.",
    author: "Sun Tzu, The Art of War",
    principle: "Rapid Response",
    application: "When a breach is detected, every second counts. Automated alerts, incident response plans, and quick containment procedures minimize damage and data loss.",
    icon: Flame,
    color: "critical"
  }
]

const fiveElements = [
  {
    element: "Water",
    icon: Droplets,
    tzuQuote: "Water shapes its course according to the nature of the ground over which it flows.",
    securityPrinciple: "Adaptive Security",
    description: "Your security posture must adapt to changing threats. What worked yesterday may not work tomorrow. Stay fluid, update constantly, and flow around new obstacles.",
    color: "from-blue-500/20 to-blue-600/10"
  },
  {
    element: "Fire",
    icon: Flame,
    tzuQuote: "The attack by fire is a powerful weapon if you can spread it and control it.",
    securityPrinciple: "Controlled Aggression",
    description: "Penetration testing and ethical hacking let you attack your own systems — finding weaknesses before real attackers do. Use offensive tools defensively.",
    color: "from-orange-500/20 to-red-600/10"
  },
  {
    element: "Earth",
    icon: Mountain,
    tzuQuote: "Security against defeat implies defensive tactics.",
    securityPrinciple: "Strong Foundations",
    description: "Build on solid ground. Secure configurations, updated systems, and proper authentication create an unshakeable foundation that withstands attacks.",
    color: "from-amber-500/20 to-yellow-600/10"
  },
  {
    element: "Metal",
    icon: Shield,
    tzuQuote: "The quality of decision is like the well-timed swoop of a falcon.",
    securityPrinciple: "Decisive Action",
    description: "When threats are detected, act decisively. Block the IP, isolate the system, revoke the credentials. Hesitation allows attackers to deepen their foothold.",
    color: "from-gray-400/20 to-slate-500/10"
  },
  {
    element: "Wood",
    icon: Wind,
    tzuQuote: "In the midst of chaos, there is also opportunity.",
    securityPrinciple: "Growth & Learning",
    description: "Every security incident is a learning opportunity. Post-mortems, updated procedures, and team training grow your defensive capabilities from each challenge.",
    color: "from-green-500/20 to-emerald-600/10"
  }
]

const warfareParallels = [
  {
    ancient: "Scout the terrain before battle",
    modern: "Conduct regular vulnerability scans",
    icon: Compass
  },
  {
    ancient: "Know your generals and their capabilities",
    modern: "Understand your team's security skills and gaps",
    icon: Crown
  },
  {
    ancient: "Fortify your castle walls",
    modern: "Configure firewalls and security headers",
    icon: Shield
  },
  {
    ancient: "Post watchmen at all hours",
    modern: "Implement 24/7 monitoring and alerting",
    icon: Eye
  },
  {
    ancient: "Train soldiers for battle",
    modern: "Conduct security awareness training",
    icon: Target
  },
  {
    ancient: "Have plans for siege and retreat",
    modern: "Create incident response and backup plans",
    icon: Scroll
  }
]

export default function ArtOfCyberWarPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800 to-aegis-900" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-shield-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secure-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-shield-500/10 border border-shield-500/20 rounded-full mb-8">
              <Scroll className="w-4 h-4 text-shield-400" />
              <span className="text-sm font-medium text-shield-400">Ancient Wisdom, Modern Defense</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
              The Art of
              <span className="text-gradient"> Cyber War</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              2,500 years ago, Sun Tzu wrote the definitive guide to strategic warfare.
              Today, his principles are more relevant than ever in the digital battlefield
              where businesses face AI-powered attacks every second.
            </p>

            {/* Featured Quote */}
            <div className="relative max-w-2xl mx-auto mt-12">
              <div className="absolute -inset-4 bg-gradient-to-r from-shield-500/10 to-secure-500/10 rounded-2xl blur-xl" />
              <div className="relative bg-aegis-800/80 border border-white/10 rounded-2xl p-8">
                <Quote className="w-8 h-8 text-shield-400 mb-4 mx-auto" />
                <blockquote className="text-2xl md:text-3xl font-display font-medium text-white italic mb-4">
                  "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win."
                </blockquote>
                <cite className="text-gray-400">— Sun Tzu, The Art of War</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-aegis-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6 text-center">
              Why Sun Tzu for <span className="text-gradient">Cybersecurity?</span>
            </h2>

            <div className="prose prose-invert prose-lg mx-auto">
              <p className="text-gray-400 leading-relaxed">
                Sun Tzu's <em>The Art of War</em> has guided military strategists, business leaders, and
                athletes for millennia. Its timeless principles about preparation, knowledge, and
                strategic thinking apply perfectly to the modern cyber threat landscape.
              </p>
              <p className="text-gray-400 leading-relaxed">
                At <strong className="text-white">Tzu Shield</strong>, we believe the best defense starts with understanding —
                understanding your own vulnerabilities, understanding your adversaries, and understanding
                that the battle is won before the first attack ever lands.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Just as ancient generals prepared their defenses before the enemy arrived, modern
                businesses must harden their systems, monitor their perimeters, and plan their
                responses before hackers strike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Principles */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800/50 to-aegis-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secure-500/10 border border-secure-500/20 rounded-full mb-6">
              <Brain className="w-4 h-4 text-secure-400" />
              <span className="text-sm font-medium text-secure-400">Core Principles</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Six Strategies for <span className="text-gradient">Cyber Defense</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sun Tzu's wisdom translated into actionable cybersecurity practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategicPrinciples.map((item, index) => (
              <div
                key={index}
                className="group relative bg-aegis-800/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl mb-4 inline-block ${
                  item.color === 'shield' ? 'bg-shield-500/10' :
                  item.color === 'secure' ? 'bg-secure-500/10' :
                  item.color === 'threat' ? 'bg-threat-500/10' :
                  'bg-critical-500/10'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.color === 'shield' ? 'text-shield-400' :
                    item.color === 'secure' ? 'text-secure-400' :
                    item.color === 'threat' ? 'text-threat-400' :
                    'text-critical-400'
                  }`} />
                </div>

                <blockquote className="text-sm italic text-gray-300 mb-3 border-l-2 border-shield-500/30 pl-3">
                  "{item.quote}"
                </blockquote>

                <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-shield-400 transition-colors">
                  {item.principle}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.application}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Five Elements */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-aegis-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-shield-500/10 border border-shield-500/20 rounded-full mb-6">
              <Swords className="w-4 h-4 text-shield-400" />
              <span className="text-sm font-medium text-shield-400">The Five Elements</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Balance in <span className="text-gradient">Defense</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Like the five elements of ancient philosophy, effective security requires balance
              across multiple disciplines
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiveElements.map((item, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${item.color} border border-white/10 rounded-2xl p-6 overflow-hidden`}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <item.icon className="w-24 h-24" />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                    <h3 className="font-display font-bold text-xl text-white">{item.element}</h3>
                  </div>

                  <blockquote className="text-sm italic text-gray-300 mb-4 border-l-2 border-white/20 pl-3">
                    "{item.tzuQuote}"
                  </blockquote>

                  <h4 className="font-semibold text-shield-400 mb-2">{item.securityPrinciple}</h4>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ancient vs Modern Parallels */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-aegis-900 via-aegis-800/50 to-aegis-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ancient Tactics, <span className="text-gradient">Modern Application</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The parallels between ancient warfare and modern cybersecurity are striking
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {warfareParallels.map((item, index) => (
                <div
                  key={index}
                  className="group grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center bg-aegis-800/30 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Scroll className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300">{item.ancient}</span>
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-shield-400" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-secure-400 flex-shrink-0 md:hidden" />
                    <span className="text-white font-medium">{item.modern}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-aegis-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-shield-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-12 h-12 text-shield-400 mx-auto mb-6" />

            <blockquote className="text-2xl md:text-3xl font-display font-medium text-white italic mb-6">
              "He who is prudent and lies in wait for an enemy who is not, will be victorious."
            </blockquote>
            <cite className="text-gray-400 block mb-8">— Sun Tzu, The Art of War</cite>

            <p className="text-lg text-gray-400 mb-8">
              Don't wait for attackers to find your vulnerabilities.
              <span className="text-white font-medium"> Know them first.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#scanner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-shield-500/25"
              >
                Scan Your Defenses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-aegis-800 hover:bg-aegis-700 text-white font-semibold rounded-xl border border-white/10 transition-all"
              >
                Download Strategy Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Quote */}
      <section className="relative py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 italic">
              "The greatest victory is that which requires no battle."
            </p>
            <p className="text-gray-600 text-sm mt-2">
              — The philosophy behind Tzu Shield
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
