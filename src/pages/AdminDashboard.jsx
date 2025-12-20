import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Users,
  TrendingUp,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Mail,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  ArrowUpRight,
  Trash2,
  Eye,
  RefreshCw,
  FileText,
  Code,
  Bell
} from 'lucide-react'
import {
  getLeads,
  getLeadStats,
  filterLeads,
  updateLeadStatus,
  deleteLead,
  downloadCSV,
  initDemoData,
  LeadStatus,
  LeadSource
} from '../services/leadService'

// Stat Card Component
function StatCard({ icon: Icon, label, value, subValue, color = 'shield' }) {
  const colorClasses = {
    shield: 'bg-shield-500/10 text-shield-400',
    secure: 'bg-secure-500/10 text-secure-400',
    threat: 'bg-threat-500/10 text-threat-400',
    critical: 'bg-critical-500/10 text-critical-400'
  }

  return (
    <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {subValue && (
          <span className="text-xs text-gray-500">{subValue}</span>
        )}
      </div>
      <div className="font-display font-bold text-2xl text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

// Grade Badge Component
function GradeBadge({ grade }) {
  const colors = {
    'A+': 'bg-secure-500/20 text-secure-400 border-secure-500/30',
    'A': 'bg-secure-500/20 text-secure-400 border-secure-500/30',
    'B': 'bg-shield-500/20 text-shield-400 border-shield-500/30',
    'C': 'bg-threat-500/20 text-threat-400 border-threat-500/30',
    'D': 'bg-threat-500/20 text-threat-400 border-threat-500/30',
    'F': 'bg-critical-500/20 text-critical-400 border-critical-500/30'
  }

  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${colors[grade] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {grade || '-'}
    </span>
  )
}

// Status Badge Component
function StatusBadge({ status }) {
  const configs = {
    [LeadStatus.NEW]: { label: 'New', color: 'bg-shield-500/20 text-shield-400' },
    [LeadStatus.CONTACTED]: { label: 'Contacted', color: 'bg-threat-500/20 text-threat-400' },
    [LeadStatus.QUALIFIED]: { label: 'Qualified', color: 'bg-secure-500/20 text-secure-400' },
    [LeadStatus.CONVERTED]: { label: 'Converted', color: 'bg-secure-500/20 text-secure-400' },
    [LeadStatus.UNSUBSCRIBED]: { label: 'Unsubscribed', color: 'bg-gray-500/20 text-gray-400' }
  }

  const config = configs[status] || configs[LeadStatus.NEW]

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

// Lead Row Component
function LeadRow({ lead, onStatusChange, onDelete, expanded, onToggle }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      <tr className="border-b border-white/5 hover:bg-aegis-800/30 transition-colors">
        <td className="py-4 px-4">
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-aegis-700 rounded-full flex items-center justify-center text-sm font-medium text-white">
              {lead.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white font-medium">{lead.email}</div>
              {lead.websiteUrl && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {lead.websiteUrl.replace(/^https?:\/\//, '')}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <GradeBadge grade={lead.securityGrade} />
        </td>
        <td className="py-4 px-4">
          <span className="text-white font-mono">{lead.securityScore ?? '-'}</span>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            {lead.criticalIssues > 0 && (
              <span className="flex items-center gap-1 text-critical-400 text-sm">
                <XCircle className="w-4 h-4" />
                {lead.criticalIssues}
              </span>
            )}
            {lead.warningIssues > 0 && (
              <span className="flex items-center gap-1 text-threat-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {lead.warningIssues}
              </span>
            )}
            {!lead.criticalIssues && !lead.warningIssues && (
              <span className="text-gray-500 text-sm">-</span>
            )}
          </div>
        </td>
        <td className="py-4 px-4">
          {lead.isWordPress ? (
            <span className="inline-flex items-center gap-1 text-shield-400 text-sm">
              <Code className="w-4 h-4" />
              WP
            </span>
          ) : (
            <span className="text-gray-500 text-sm">-</span>
          )}
        </td>
        <td className="py-4 px-4">
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value)}
            className="bg-aegis-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-shield-500"
          >
            {Object.entries(LeadStatus).map(([key, value]) => (
              <option key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </td>
        <td className="py-4 px-4 text-gray-400 text-sm">
          {formatDate(lead.createdAt)}
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className="p-1.5 text-gray-500 hover:text-white hover:bg-aegis-700 rounded transition-colors"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(lead.id)}
              className="p-1.5 text-gray-500 hover:text-critical-400 hover:bg-critical-500/10 rounded transition-colors"
              title="Delete lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Details */}
      {expanded && (
        <tr className="bg-aegis-800/20">
          <td colSpan="9" className="px-4 py-4">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sources */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Lead Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {lead.sources?.map((source, i) => (
                    <span key={i} className="px-2 py-1 bg-aegis-700/50 rounded text-xs text-gray-300">
                      {source.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scan History */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Scan History</h4>
                {lead.scanHistory?.length > 0 ? (
                  <div className="space-y-1">
                    {lead.scanHistory.slice(0, 3).map((scan, i) => (
                      <div key={i} className="text-xs text-gray-500">
                        Score: {scan.score} • {new Date(scan.scannedAt).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">No scans</span>
                )}
              </div>

              {/* Downloads */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Downloads</h4>
                {lead.downloads?.length > 0 ? (
                  <div className="space-y-1">
                    {lead.downloads.map((dl, i) => (
                      <div key={i} className="text-xs text-gray-500">
                        {dl.resourceTitle}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">No downloads</span>
                )}
              </div>

              {/* Email Sequences */}
              {lead.emailSequences?.length > 0 && (
                <div className="md:col-span-3">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Active Email Sequences</h4>
                  <div className="flex flex-wrap gap-2">
                    {lead.emailSequences.map((seq, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 bg-shield-500/10 rounded text-xs text-shield-400">
                        <Mail className="w-3 h-3" />
                        {seq.type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// Grade Distribution Chart
function GradeChart({ distribution }) {
  const grades = ['A+', 'A', 'B', 'C', 'D', 'F']
  const max = Math.max(...Object.values(distribution), 1)

  const colors = {
    'A+': 'bg-secure-400',
    'A': 'bg-secure-400',
    'B': 'bg-shield-400',
    'C': 'bg-threat-400',
    'D': 'bg-threat-400',
    'F': 'bg-critical-400'
  }

  return (
    <div className="flex items-end gap-2 h-24">
      {grades.map(grade => (
        <div key={grade} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-aegis-700/50 rounded-t relative" style={{ height: '80px' }}>
            <div
              className={`absolute bottom-0 w-full rounded-t ${colors[grade]} transition-all`}
              style={{ height: `${(distribution[grade] / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{grade}</span>
          <span className="text-xs text-gray-400">{distribution[grade]}</span>
        </div>
      ))}
    </div>
  )
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedLead, setExpandedLead] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [filterWordPress, setFilterWordPress] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  // Load data
  const loadData = () => {
    setLoading(true)

    // Initialize demo data if empty
    initDemoData()

    // Get stats
    const leadStats = getLeadStats()
    setStats(leadStats)

    // Get filtered leads
    const criteria = {
      sortBy,
      sortDir
    }

    if (filterGrade) criteria.grade = filterGrade
    if (filterWordPress === 'yes') criteria.isWordPress = true
    if (filterWordPress === 'no') criteria.isWordPress = false
    if (filterStatus) criteria.status = filterStatus
    if (filterSource) criteria.source = filterSource

    let filteredLeads = filterLeads(criteria)

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredLeads = filteredLeads.filter(lead =>
        lead.email.toLowerCase().includes(term) ||
        lead.websiteUrl?.toLowerCase().includes(term)
      )
    }

    setLeads(filteredLeads)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [filterGrade, filterWordPress, filterStatus, filterSource, sortBy, sortDir, searchTerm])

  const handleStatusChange = (id, status) => {
    updateLeadStatus(id, status)
    loadData()
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id)
      loadData()
    }
  }

  const handleExport = () => {
    const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(leads, filename)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterGrade('')
    setFilterWordPress('')
    setFilterStatus('')
    setFilterSource('')
  }

  const hasActiveFilters = searchTerm || filterGrade || filterWordPress || filterStatus || filterSource

  return (
    <div className="min-h-screen bg-aegis-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
              Lead Dashboard
            </h1>
            <p className="text-gray-400">
              Manage and track all captured leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-aegis-800 hover:bg-aegis-700 border border-white/10 text-white text-sm rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-shield-500 hover:bg-shield-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Total Leads"
              value={stats.totalLeads}
              color="shield"
            />
            <StatCard
              icon={TrendingUp}
              label="Scans Today"
              value={stats.scansToday}
              subValue={`${stats.scansThisWeek} this week`}
              color="secure"
            />
            <StatCard
              icon={BarChart3}
              label="Avg Score"
              value={stats.averageScore}
              color="shield"
            />
            <StatCard
              icon={AlertTriangle}
              label="Critical Issues"
              value={stats.criticalIssuesSites}
              subValue="sites affected"
              color="critical"
            />
          </div>
        )}

        {/* Additional Stats Row */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Grade Distribution */}
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Grade Distribution</h3>
              <GradeChart distribution={stats.gradeDistribution} />
            </div>

            {/* Quick Stats */}
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Site Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400 text-sm">
                    <Code className="w-4 h-4 text-shield-400" />
                    WordPress Sites
                  </span>
                  <span className="text-white font-medium">{stats.wordPressSites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400 text-sm">
                    <XCircle className="w-4 h-4 text-critical-400" />
                    Critical Issues
                  </span>
                  <span className="text-white font-medium">{stats.criticalIssuesSites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400 text-sm">
                    <Bell className="w-4 h-4 text-secure-400" />
                    Newsletter Subs
                  </span>
                  <span className="text-white font-medium">{stats.newsletterSubscribers}</span>
                </div>
              </div>
            </div>

            {/* Lead Sources */}
            <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Lead Sources</h3>
              <div className="space-y-3">
                {Object.entries(stats.sourceDistribution).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm capitalize">
                      {source.replace('_', ' ')}
                    </span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-aegis-800/50 border border-white/5 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email or website..."
                className="w-full pl-10 pr-4 py-2 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500"
              />
            </div>

            {/* Grade Filter */}
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-2 bg-aegis-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-shield-500"
            >
              <option value="">All Grades</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>

            {/* WordPress Filter */}
            <select
              value={filterWordPress}
              onChange={(e) => setFilterWordPress(e.target.value)}
              className="px-4 py-2 bg-aegis-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-shield-500"
            >
              <option value="">All Sites</option>
              <option value="yes">WordPress Only</option>
              <option value="no">Non-WordPress</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-aegis-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-shield-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(LeadStatus).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-2 bg-aegis-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-shield-500"
            >
              <option value="">All Sources</option>
              {Object.entries(LeadSource).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.replace('_', ' ')}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-aegis-800/50 border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-aegis-800/50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase w-10"></th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">CMS</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-gray-500">
                      No leads found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  leads.map(lead => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      expanded={expandedLead === lead.id}
                      onToggle={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {leads.length} of {stats?.totalLeads || 0} leads
            </div>
          </div>
        </div>

        {/* Back to Site Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-shield-400 hover:text-shield-300 transition-colors text-sm"
          >
            ← Back to main site
          </Link>
        </div>
      </div>
    </div>
  )
}
