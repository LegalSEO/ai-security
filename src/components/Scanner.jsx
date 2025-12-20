import { useState } from 'react'
import {
  Shield,
  Lock,
  Code,
  FileWarning,
  Puzzle,
  Bug,
  Clock,
  Search,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  Info,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Download,
  FileText,
  Crown
} from 'lucide-react'
import { useScanner } from '../hooks/useScanner'
import { CheckStatus, CategoryConfig, getGradeColor } from '../services/scannerTypes'
import { downloadReport } from '../services/reportGenerator'

// Icon mapping for categories
const CategoryIcons = {
  ssl: Lock,
  headers: Shield,
  cms: Code,
  exposed_files: FileWarning,
  plugins: Puzzle,
  malware: Bug,
  performance: Clock
}

/**
 * Main Scanner Component
 */
export function Scanner() {
  const { scanState, isScanning, error, startScan, resetScan } = useScanner()
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim() && !isScanning) {
      startScan(url.trim())
    }
  }

  const handleNewScan = () => {
    setUrl('')
    resetScan()
  }

  // Show results if scan is complete
  if (scanState?.status === 'complete') {
    return <ScanResults results={scanState} onNewScan={handleNewScan} />
  }

  // Show progress if scanning
  if (isScanning && scanState) {
    return <ScanProgress scanState={scanState} />
  }

  // Show input form
  return (
    <ScannerForm
      url={url}
      setUrl={setUrl}
      onSubmit={handleSubmit}
      isScanning={isScanning}
      error={error}
    />
  )
}

/**
 * Scanner Input Form
 */
function ScannerForm({ url, setUrl, onSubmit, isScanning, error }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={onSubmit}>
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-shield-500 to-secure-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />

          <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-aegis-800 rounded-xl border border-white/10">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-aegis-700 rounded-lg">
              <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL (e.g., example.com)"
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                disabled={isScanning}
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !url.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-shield-500 to-shield-600 hover:from-shield-400 hover:to-shield-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-shield-500/25 hover:shadow-shield-500/40"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Scan Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-critical-500/10 border border-critical-500/20 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-critical-400 flex-shrink-0 mt-0.5" />
          <p className="text-critical-400 text-sm">{error}</p>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-gray-500">
        We only check publicly accessible information. No login credentials needed.
      </p>
    </div>
  )
}

/**
 * Scan Progress Display
 */
function ScanProgress({ scanState }) {
  const { hostname, progress, currentCheck, categories } = scanState

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-aegis-800 border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-shield-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-shield-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Scanning...</h3>
                <p className="text-sm text-gray-400">{hostname}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-2xl text-shield-400">{progress}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-aegis-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-shield-500 to-secure-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Check list */}
        <div className="p-4 space-y-2">
          {Object.entries(categories).map(([key, category]) => {
            const config = CategoryConfig[key]
            const Icon = CategoryIcons[key] || Shield
            const isCurrentCheck = currentCheck === key
            const status = category.status

            return (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isCurrentCheck ? 'bg-shield-500/10 border border-shield-500/20' :
                  status === CheckStatus.PASS ? 'bg-secure-500/5' :
                  status === CheckStatus.WARNING ? 'bg-threat-500/5' :
                  status === CheckStatus.FAIL ? 'bg-critical-500/5' :
                  'bg-aegis-700/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isCurrentCheck ? 'bg-shield-500/20' :
                  status === CheckStatus.PASS ? 'bg-secure-500/20' :
                  status === CheckStatus.WARNING ? 'bg-threat-500/20' :
                  status === CheckStatus.FAIL ? 'bg-critical-500/20' :
                  'bg-aegis-600'
                }`}>
                  {status === CheckStatus.RUNNING || isCurrentCheck ? (
                    <Loader2 className="w-4 h-4 text-shield-400 animate-spin" />
                  ) : status === CheckStatus.PASS ? (
                    <CheckCircle2 className="w-4 h-4 text-secure-400" />
                  ) : status === CheckStatus.WARNING ? (
                    <AlertTriangle className="w-4 h-4 text-threat-400" />
                  ) : status === CheckStatus.FAIL ? (
                    <XCircle className="w-4 h-4 text-critical-400" />
                  ) : (
                    <Icon className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isCurrentCheck ? 'text-shield-400' :
                    status !== CheckStatus.PENDING ? 'text-white' : 'text-gray-500'
                  }`}>
                    {config.name}
                  </p>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
                {category.score !== null && (
                  <span className={`text-sm font-mono ${
                    category.score >= 80 ? 'text-secure-400' :
                    category.score >= 60 ? 'text-threat-400' : 'text-critical-400'
                  }`}>
                    {category.score}/100
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * Scan Results Display
 */
function ScanResults({ results, onNewScan }) {
  const { hostname, score, grade, summary, categories, endTime, startTime } = results
  const scanDuration = Math.round((endTime - startTime) / 1000)
  const gradeColorClass = getGradeColorClass(grade)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Score Card */}
      <div className="bg-aegis-800 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Grade Circle */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 ${gradeColorClass.border} flex items-center justify-center bg-aegis-900/50`}>
                <div className="text-center">
                  <span className={`font-display font-bold text-5xl ${gradeColorClass.text}`}>{grade}</span>
                  <p className="text-xs text-gray-500 mt-1">GRADE</p>
                </div>
              </div>
              <div className={`absolute -inset-2 rounded-full ${gradeColorClass.glow} blur-xl opacity-30`} />
            </div>

            {/* Score Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
                Security Score: {score}/100
              </h2>
              <p className="text-gray-400 mb-4">{hostname}</p>

              {/* Summary Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secure-400" />
                  <span className="text-sm text-gray-300">{summary.passed} passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-threat-400" />
                  <span className="text-sm text-gray-300">{summary.warnings} warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-critical-400" />
                  <span className="text-sm text-gray-300">{summary.failed + summary.critical} issues</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onNewScan}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-shield-500 hover:bg-shield-400 text-white font-semibold text-sm rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                New Scan
              </button>
              <button
                onClick={() => downloadReport(results, false)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-aegis-700 hover:bg-aegis-600 text-white font-semibold text-sm rounded-lg transition-all border border-white/10"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <span className="text-xs text-gray-500 text-center">
                Scanned in {scanDuration}s
              </span>
            </div>
          </div>
        </div>

        {/* Score Interpretation */}
        <div className={`px-6 py-4 ${gradeColorClass.bg} border-t ${gradeColorClass.borderLight}`}>
          <div className="flex items-start gap-3">
            {score >= 80 ? (
              <ShieldCheck className={`w-5 h-5 ${gradeColorClass.text} flex-shrink-0 mt-0.5`} />
            ) : score >= 60 ? (
              <ShieldAlert className={`w-5 h-5 ${gradeColorClass.text} flex-shrink-0 mt-0.5`} />
            ) : (
              <ShieldX className={`w-5 h-5 ${gradeColorClass.text} flex-shrink-0 mt-0.5`} />
            )}
            <div>
              <p className={`font-medium ${gradeColorClass.text}`}>
                {getScoreInterpretation(score).title}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {getScoreInterpretation(score).description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Results */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold text-lg text-white">Detailed Results</h3>
        {Object.entries(categories).map(([key, category]) => (
          <CategoryResult key={key} categoryKey={key} category={category} />
        ))}
      </div>

      {/* Pro Report Upgrade */}
      <div className="bg-gradient-to-r from-threat-500/10 to-shield-500/10 border border-threat-500/20 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-threat-500/20 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-threat-400" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Get the Full Pro Report
            </h3>
            <p className="text-gray-400 text-sm">
              Includes detailed fix instructions, step-by-step remediation guides,
              and priority support. Everything you need to fix these issues.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => downloadReport(results, true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-threat-500 to-threat-600 hover:from-threat-400 hover:to-threat-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-threat-500/25"
            >
              <FileText className="w-4 h-4" />
              Download Pro Report
            </button>
            <span className="text-xs text-gray-500 text-center">
              Includes fix instructions
            </span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-shield-500/10 to-secure-500/10 border border-shield-500/20 rounded-2xl p-6 md:p-8 text-center">
        <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-3">
          Want Continuous Protection?
        </h3>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          This scan shows your security at a single point in time. Threats evolve daily.
          Our Pro monitoring keeps watch 24/7 and alerts you the moment something changes.
        </p>
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all"
        >
          Explore Pro Monitoring
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

/**
 * Category Result Accordion
 */
function CategoryResult({ categoryKey, category }) {
  const [isExpanded, setIsExpanded] = useState(
    category.status === CheckStatus.FAIL || category.status === CheckStatus.WARNING
  )
  const config = CategoryConfig[categoryKey]
  const Icon = CategoryIcons[categoryKey] || Shield

  const statusColor = category.status === CheckStatus.PASS ? 'secure' :
                      category.status === CheckStatus.WARNING ? 'threat' : 'critical'

  return (
    <div className="bg-aegis-800 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${statusColor}-500/10`}>
          {category.status === CheckStatus.PASS ? (
            <CheckCircle2 className={`w-5 h-5 text-${statusColor}-400`} />
          ) : category.status === CheckStatus.WARNING ? (
            <AlertTriangle className={`w-5 h-5 text-${statusColor}-400`} />
          ) : (
            <XCircle className={`w-5 h-5 text-${statusColor}-400`} />
          )}
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-semibold text-white">{config.name}</h4>
            {category.findings?.length > 0 && (
              <span className="text-xs text-gray-500">
                ({category.findings.length} checks)
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{config.description}</p>
        </div>

        <div className="flex items-center gap-4">
          {category.score !== null && (
            <div className="text-right">
              <span className={`font-display font-bold text-lg text-${statusColor}-400`}>
                {category.score}
              </span>
              <span className="text-gray-500">/100</span>
            </div>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && category.findings && (
        <div className="border-t border-white/5 p-4 space-y-3">
          {category.findings.map((finding, index) => (
            <FindingItem key={finding.id || index} finding={finding} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Individual Finding Item
 */
function FindingItem({ finding }) {
  const [showDetails, setShowDetails] = useState(false)

  const statusIcon = finding.status === CheckStatus.PASS ? (
    <CheckCircle2 className="w-4 h-4 text-secure-400" />
  ) : finding.status === CheckStatus.WARNING ? (
    <AlertTriangle className="w-4 h-4 text-threat-400" />
  ) : (
    <XCircle className="w-4 h-4 text-critical-400" />
  )

  const bgColor = finding.status === CheckStatus.PASS ? 'bg-secure-500/5' :
                  finding.status === CheckStatus.WARNING ? 'bg-threat-500/5' : 'bg-critical-500/5'

  const hasMoreInfo = finding.whatItMeans || finding.howToFix

  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{statusIcon}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h5 className="font-medium text-white">{finding.name}</h5>
              <p className="text-sm text-gray-400 mt-1">{finding.description}</p>
            </div>
            {finding.severity && finding.severity !== 'info' && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                finding.severity === 'critical' ? 'bg-critical-500/20 text-critical-400' :
                finding.severity === 'high' ? 'bg-critical-500/20 text-critical-400' :
                finding.severity === 'medium' ? 'bg-threat-500/20 text-threat-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {finding.severity}
              </span>
            )}
          </div>

          {hasMoreInfo && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 mt-3 text-sm text-shield-400 hover:text-shield-300 transition-colors"
            >
              <Info className="w-3 h-3" />
              {showDetails ? 'Hide details' : 'Learn more'}
            </button>
          )}

          {showDetails && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-shield-500/30">
              {finding.whatItMeans && (
                <div>
                  <p className="text-xs font-semibold text-shield-400 uppercase tracking-wider mb-1">
                    What This Means
                  </p>
                  <p className="text-sm text-gray-300">{finding.whatItMeans}</p>
                </div>
              )}
              {finding.howToFix && (
                <div>
                  <p className="text-xs font-semibold text-secure-400 uppercase tracking-wider mb-1">
                    How To Fix
                  </p>
                  <p className="text-sm text-gray-300">{finding.howToFix}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Helper: Get grade color classes
 */
function getGradeColorClass(grade) {
  const colors = {
    A: {
      text: 'text-secure-400',
      border: 'border-secure-500',
      borderLight: 'border-secure-500/20',
      bg: 'bg-secure-500/5',
      glow: 'bg-secure-500'
    },
    B: {
      text: 'text-secure-400',
      border: 'border-secure-500',
      borderLight: 'border-secure-500/20',
      bg: 'bg-secure-500/5',
      glow: 'bg-secure-500'
    },
    C: {
      text: 'text-threat-400',
      border: 'border-threat-500',
      borderLight: 'border-threat-500/20',
      bg: 'bg-threat-500/5',
      glow: 'bg-threat-500'
    },
    D: {
      text: 'text-threat-400',
      border: 'border-threat-500',
      borderLight: 'border-threat-500/20',
      bg: 'bg-threat-500/5',
      glow: 'bg-threat-500'
    },
    F: {
      text: 'text-critical-400',
      border: 'border-critical-500',
      borderLight: 'border-critical-500/20',
      bg: 'bg-critical-500/5',
      glow: 'bg-critical-500'
    }
  }
  return colors[grade] || colors.C
}

/**
 * Helper: Get score interpretation
 */
function getScoreInterpretation(score) {
  if (score >= 90) {
    return {
      title: 'Excellent Security Posture',
      description: 'Your website follows security best practices. Keep monitoring for new threats.'
    }
  }
  if (score >= 80) {
    return {
      title: 'Good Security With Minor Issues',
      description: 'Your site is reasonably secure, but there are a few improvements that would strengthen your defenses.'
    }
  }
  if (score >= 70) {
    return {
      title: 'Moderate Risk - Action Recommended',
      description: 'Several security gaps were found that could be exploited. We recommend addressing the warnings soon.'
    }
  }
  if (score >= 60) {
    return {
      title: 'Significant Vulnerabilities Found',
      description: 'Your website has security issues that attackers commonly exploit. Prioritize the critical findings.'
    }
  }
  return {
    title: 'Critical Security Issues - Immediate Action Required',
    description: 'Your website has serious security vulnerabilities. Address the critical issues immediately to protect your site and visitors.'
  }
}

export default Scanner
