/**
 * User Dashboard Page
 * Shows user's scans, account status, and upgrade options
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Search,
  FileText,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Crown,
  ArrowRight,
  ExternalLink,
  Globe,
  Loader2
} from 'lucide-react'
import { useAuth } from '../components/Auth'

// Mock scan history (would come from API/localStorage in production)
function getScanHistory(userId) {
  const key = `tzu_scans_${userId}`
  const scans = localStorage.getItem(key)
  return scans ? JSON.parse(scans) : []
}

export default function UserDashboard() {
  const { user, userLogout, refreshUser } = useAuth()
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.user?.id) {
      const history = getScanHistory(user.user.id)
      setScans(history)
    }
    setLoading(false)
  }, [user])

  if (!user) return null

  const { user: userData } = user

  return (
    <div className="min-h-screen bg-aegis-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
              Welcome back, {userData.name}
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your security scans and account
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/#scanner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
              New Scan
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Search}
            label="Scans Remaining"
            value={userData.scansRemaining === -1 ? 'Unlimited' : userData.scansRemaining}
            subtext={userData.plan === 'free' ? 'Resets monthly' : null}
            color="shield"
          />
          <StatCard
            icon={FileText}
            label="Total Scans"
            value={scans.length}
            color="secure"
          />
          <StatCard
            icon={Crown}
            label="Current Plan"
            value={userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)}
            subtext={userData.plan === 'free' ? 'Upgrade for more' : null}
            color={userData.plan === 'pro' ? 'shield' : userData.plan === 'enterprise' ? 'secure' : 'gray'}
          />
          <StatCard
            icon={Clock}
            label="Member Since"
            value={new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            color="gray"
          />
        </div>

        {/* Plan Upgrade CTA (for free users) */}
        {userData.plan === 'free' && (
          <div className="bg-gradient-to-r from-shield-500/10 to-secure-500/10 border border-shield-500/20 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-shield-400" />
                  <h2 className="font-display font-bold text-xl text-white">
                    Upgrade to Pro
                  </h2>
                </div>
                <p className="text-gray-400 max-w-xl">
                  Get unlimited scans, detailed vulnerability reports, priority alerts,
                  and advanced WordPress plugin analysis. Protect your business 24/7.
                </p>
              </div>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                View Plans
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Recent Scans */}
        <div className="bg-aegis-800/50 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-display font-bold text-lg text-white">
              Recent Scans
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-shield-400 animate-spin mx-auto" />
            </div>
          ) : scans.length === 0 ? (
            <div className="p-12 text-center">
              <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No scans yet</h3>
              <p className="text-gray-400 mb-6">
                Run your first security scan to see results here.
              </p>
              <Link
                to="/#scanner"
                className="inline-flex items-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
                Start Scanning
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {scans.map((scan, index) => (
                <ScanRow key={scan.id || index} scan={scan} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <QuickAction
            icon={FileText}
            title="Security Resources"
            description="Guides and checklists to improve your security"
            href="/resources"
          />
          <QuickAction
            icon={AlertTriangle}
            title="AI Threats Guide"
            description="Learn about the latest AI-powered attacks"
            href="/threats"
          />
          <QuickAction
            icon={Shield}
            title="Art of Cyber War"
            description="Strategic security wisdom from Sun Tzu"
            href="/art-of-cyber-war"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtext, color = 'shield' }) {
  const colorClasses = {
    shield: 'bg-shield-500/10 text-shield-400',
    secure: 'bg-secure-500/10 text-secure-400',
    threat: 'bg-threat-500/10 text-threat-400',
    gray: 'bg-gray-500/10 text-gray-400'
  }

  return (
    <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  )
}

function ScanRow({ scan }) {
  const gradeColors = {
    'A+': 'text-secure-400',
    'A': 'text-secure-400',
    'B': 'text-shield-400',
    'C': 'text-threat-400',
    'D': 'text-critical-400',
    'F': 'text-critical-400'
  }

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-aegis-800/30 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
        gradeColors[scan.grade] || 'text-gray-400'
      } bg-aegis-800`}>
        {scan.grade || '?'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{scan.hostname || scan.url}</p>
        <p className="text-xs text-gray-500">
          {new Date(scan.date || scan.createdAt).toLocaleDateString()}
          {scan.score && ` • Score: ${scan.score}/100`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {scan.issues > 0 && (
          <span className="flex items-center gap-1 text-xs text-threat-400">
            <AlertTriangle className="w-4 h-4" />
            {scan.issues} issues
          </span>
        )}

        <button className="p-2 text-gray-500 hover:text-white hover:bg-aegis-700 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
        </button>

        <button className="p-2 text-gray-500 hover:text-white hover:bg-aegis-700 rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, title, description, href }) {
  return (
    <Link
      to={href}
      className="group flex items-start gap-4 p-6 bg-aegis-800/50 border border-white/5 rounded-xl hover:border-shield-500/30 transition-colors"
    >
      <div className="p-3 bg-shield-500/10 rounded-xl group-hover:bg-shield-500/20 transition-colors">
        <Icon className="w-6 h-6 text-shield-400" />
      </div>
      <div>
        <h3 className="font-medium text-white group-hover:text-shield-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </Link>
  )
}
