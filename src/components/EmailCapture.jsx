import { useState, useEffect, useCallback } from 'react'
import {
  Mail,
  X,
  CheckCircle2,
  Shield,
  Download,
  Bell,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import {
  saveLead,
  captureFromScan,
  subscribeToNewsletter,
  recordDownload,
  LeadSource
} from '../services/leadService'

/**
 * Email Capture Modal
 * Used after scan completes and for resource downloads
 */
export function EmailCaptureModal({
  isOpen,
  onClose,
  onSuccess,
  type = 'scan', // 'scan' | 'resource' | 'newsletter'
  scanResults = null,
  resource = null,
  title,
  description
}) {
  const [email, setEmail] = useState('')
  const [subscribeNews, setSubscribeNews] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setSuccess(false)
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      let lead

      if (type === 'scan' && scanResults) {
        lead = captureFromScan(email, scanResults, subscribeNews)
      } else if (type === 'resource' && resource) {
        // First check if lead exists, if not create one
        lead = saveLead({
          email,
          source: LeadSource.RESOURCE_DOWNLOAD,
          subscribedToNewsletter: subscribeNews,
          downloads: [{
            resourceId: resource.id,
            resourceTitle: resource.title,
            downloadedAt: new Date().toISOString()
          }]
        })
      } else if (type === 'newsletter') {
        lead = subscribeToNewsletter(email, LeadSource.NEWSLETTER)
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.(email, lead)
        onClose()
      }, 1500)

    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Email capture error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Determine content based on type
  const getContent = () => {
    if (type === 'scan' && scanResults) {
      return {
        icon: Shield,
        iconColor: 'text-shield-400',
        iconBg: 'bg-shield-500/10',
        title: title || 'Get Your Full Security Report',
        description: description || `We'll email you a detailed PDF report for ${scanResults.url} with actionable fix instructions.`,
        buttonText: 'Send My Report',
        successText: 'Check your inbox!'
      }
    } else if (type === 'resource' && resource) {
      return {
        icon: Download,
        iconColor: 'text-secure-400',
        iconBg: 'bg-secure-500/10',
        title: title || `Download: ${resource.title}`,
        description: description || 'Enter your email and we\'ll send you the download link immediately.',
        buttonText: 'Send Download Link',
        successText: 'Check your inbox!'
      }
    } else {
      return {
        icon: Bell,
        iconColor: 'text-shield-400',
        iconBg: 'bg-shield-500/10',
        title: title || 'Stay Protected',
        description: description || 'Get weekly security tips and threat alerts delivered to your inbox.',
        buttonText: 'Subscribe',
        successText: 'You\'re subscribed!'
      }
    }
  }

  const content = getContent()
  const IconComponent = content.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-aegis-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-aegis-800 border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          // Success state
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-secure-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-secure-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              {content.successText}
            </h3>
            <p className="text-gray-400">
              Your download link is on its way to {email}
            </p>
          </div>
        ) : (
          // Form state
          <>
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${content.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-8 h-8 ${content.iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                {content.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {content.description}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-critical-500/10 border border-critical-500/20 rounded-lg text-critical-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500 transition-colors"
                />
              </div>

              {type !== 'newsletter' && (
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribeNews}
                    onChange={(e) => setSubscribeNews(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-shield-500 focus:ring-shield-500 focus:ring-offset-aegis-800"
                  />
                  <span className="text-sm text-gray-400">
                    Also subscribe to weekly security tips
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 disabled:bg-shield-500/50 text-white font-semibold rounded-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {content.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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

/**
 * Inline Email Capture Form
 * Used in footer and other inline locations
 */
export function InlineEmailCapture({
  placeholder = 'your@email.com',
  buttonText = 'Subscribe',
  source = LeadSource.NEWSLETTER,
  onSuccess,
  className = ''
}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setLoading(true)

    try {
      const lead = subscribeToNewsletter(email, source)
      setSuccess(true)
      setEmail('')
      onSuccess?.(email, lead)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Something went wrong')
      console.error('Subscription error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={loading || success}
          className="flex-1 px-4 py-3 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || success}
          className="px-6 py-3 bg-shield-500 hover:bg-shield-400 disabled:bg-shield-500/50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : success ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Subscribed!
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>
      {error && (
        <p className="text-critical-400 text-sm mt-2">{error}</p>
      )}
    </form>
  )
}

/**
 * Exit Intent Popup
 * Shows when user is about to leave the page
 */
export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Check if already dismissed in this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('exitIntentDismissed')
    if (wasDismissed) {
      setDismissed(true)
    }
  }, [])

  // Detect exit intent
  useEffect(() => {
    if (dismissed) return

    const handleMouseLeave = (e) => {
      // Only trigger when mouse leaves from top of page
      if (e.clientY <= 0 && !isVisible && !dismissed) {
        // Delay slightly to avoid false triggers
        setTimeout(() => {
          setIsVisible(true)
        }, 100)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isVisible, dismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setDismissed(true)
    sessionStorage.setItem('exitIntentDismissed', 'true')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !email.includes('@')) return

    setLoading(true)

    try {
      saveLead({
        email,
        source: LeadSource.EXIT_INTENT,
        subscribedToNewsletter: true
      })

      setSuccess(true)
      setTimeout(() => {
        handleDismiss()
      }, 2000)
    } catch (err) {
      console.error('Exit intent capture error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible || dismissed) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-aegis-900/90 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Popup */}
      <div className="relative bg-gradient-to-br from-aegis-800 to-aegis-900 border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-16 h-16 text-secure-400 mx-auto mb-4" />
            <h3 className="font-display font-bold text-2xl text-white mb-2">
              You're on the list!
            </h3>
            <p className="text-gray-400">
              Check your inbox for your security guide.
            </p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-shield-500/20 rounded-full mb-4">
                <Sparkles className="w-10 h-10 text-shield-400" />
              </div>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
                Wait! Before You Go...
              </h3>
              <p className="text-gray-400">
                Get our free <span className="text-white font-medium">Website Security Checklist</span> —
                20 essential steps to protect your site from hackers.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-4 bg-aegis-900 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500 text-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-shield-500/25"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    'Get It Free'
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Join 2,000+ business owners protecting their websites.
                <br />
                Unsubscribe anytime.
              </p>
            </form>

            <button
              onClick={handleDismiss}
              className="block w-full text-center text-sm text-gray-500 hover:text-gray-400 mt-6 transition-colors"
            >
              No thanks, I'll risk it
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Scan Results Email Capture Banner
 * Shown after scan completes to capture lead
 */
export function ScanResultsEmailBanner({ scanResults, onCapture }) {
  const [email, setEmail] = useState('')
  const [subscribeNews, setSubscribeNews] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setLoading(true)
    setError('')

    try {
      const lead = captureFromScan(email, scanResults, subscribeNews)
      setSuccess(true)
      onCapture?.(email, lead)
    } catch (err) {
      setError('Something went wrong')
      console.error('Scan capture error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-secure-500/10 border border-secure-500/20 rounded-2xl p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-secure-400 mx-auto mb-3" />
        <h3 className="font-display font-bold text-lg text-white mb-2">
          Report Sent!
        </h3>
        <p className="text-gray-400 text-sm">
          Check your inbox at <span className="text-white">{email}</span> for your detailed security report.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-shield-500/10 to-secure-500/10 border border-shield-500/20 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-shield-500/20 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-shield-400" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-display font-bold text-lg text-white mb-2">
            Get Your Full Report Emailed
          </h3>
          <p className="text-gray-400 text-sm">
            We'll send you a detailed PDF with fix instructions for each issue found.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-auto">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 md:w-48 px-4 py-2.5 bg-aegis-900 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-shield-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-shield-500 hover:bg-shield-400 text-white font-semibold text-sm rounded-lg transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send'}
              </button>
            </div>
            {error && <p className="text-critical-400 text-xs">{error}</p>}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={subscribeNews}
                onChange={(e) => setSubscribeNews(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-600 text-shield-500 focus:ring-shield-500"
              />
              <span className="text-xs text-gray-400">
                Weekly security tips
              </span>
            </label>
          </div>
        </form>
      </div>
    </div>
  )
}
