/**
 * Checkout Components
 * Payment modal and subscription handling with Square
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  CreditCard,
  Lock,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  Crown,
  Zap
} from 'lucide-react'
import {
  PLANS,
  createCardForm,
  tokenizeCard,
  processPayment,
  createSubscription,
  destroyCardForm,
  storeTransaction
} from '../services/paymentService'
import { updateUserPlan } from '../services/authService'
import { useAuth } from './Auth'

/**
 * Checkout Modal Component
 */
export function CheckoutModal({ planId, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [cardReady, setCardReady] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const cardContainerRef = useRef(null)
  const { user, refreshUser } = useAuth()

  const plan = PLANS[planId] || PLANS.pro

  // Initialize card form when modal opens
  useEffect(() => {
    if (isOpen && cardContainerRef.current) {
      initCard()
    }

    return () => {
      destroyCardForm()
    }
  }, [isOpen])

  const initCard = async () => {
    setLoading(true)
    setError('')

    try {
      await createCardForm('card-container')
      setCardReady(true)
    } catch (err) {
      console.error('Failed to initialize payment form:', err)
      setError('Failed to load payment form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cardReady || processing) return

    setProcessing(true)
    setError('')

    try {
      // Tokenize the card
      const { token } = await tokenizeCard()

      // Process the payment (in production, this calls your backend)
      // For demo, we'll simulate success
      const isDemoMode = true // Set to false when backend is ready

      if (isDemoMode) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Update user plan locally
        if (user?.user?.id) {
          updateUserPlan(user.user.id, planId)
          storeTransaction(user.user.id, planId, plan.price, 'completed')
          refreshUser()
        }

        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 2000)
      } else {
        // Real payment processing
        const result = await createSubscription(token, planId, user?.user?.id, {
          email: user?.user?.email,
          name: user?.user?.name
        })

        if (result.success) {
          updateUserPlan(user.user.id, planId)
          refreshUser()
          setSuccess(true)
          setTimeout(() => {
            onSuccess?.()
            onClose()
          }, 2000)
        } else {
          throw new Error(result.message || 'Payment failed')
        }
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-aegis-900/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-aegis-800 border border-white/10 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          // Success State
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-secure-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-secure-400" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">
              Welcome to {plan.name}!
            </h2>
            <p className="text-gray-400">
              Your subscription is now active. Enjoy unlimited security scanning!
            </p>
          </div>
        ) : (
          // Checkout Form
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-shield-500/10 rounded-lg">
                  <Crown className="w-6 h-6 text-shield-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-white">
                    Upgrade to {plan.name}
                  </h2>
                  <p className="text-gray-400 text-sm">{plan.priceDisplay}</p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-secure-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-critical-500/10 border border-critical-500/20 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-critical-400 flex-shrink-0" />
                  <p className="text-sm text-critical-400">{error}</p>
                </div>
              )}

              {/* Card Input Container */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Card Details
                </label>
                <div
                  id="card-container"
                  ref={cardContainerRef}
                  className="min-h-[56px] bg-aegis-900 border border-white/10 rounded-lg p-4"
                >
                  {loading && (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-shield-400 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                <Lock className="w-4 h-4" />
                <span>Secured with 256-bit SSL encryption</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!cardReady || processing}
                className="w-full flex items-center justify-center gap-2 py-4 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay {plan.priceDisplay}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Cancel anytime. No long-term commitment.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Inline Pricing Card with Checkout
 */
export function PricingCardWithCheckout({ planId, recommended = false }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const plan = PLANS[planId]

  const handleUpgrade = () => {
    if (!user) {
      // Redirect to login first
      navigate('/login', { state: { from: '/pricing' } })
      return
    }

    if (planId === 'free') {
      // Free plan doesn't need checkout
      return
    }

    setShowCheckout(true)
  }

  const handleSuccess = () => {
    // Redirect to dashboard after successful upgrade
    navigate('/dashboard')
  }

  if (!plan) return null

  return (
    <>
      <div
        className={`relative p-6 md:p-8 rounded-2xl transition-all ${
          recommended
            ? 'bg-gradient-to-b from-shield-500/10 to-aegis-800 border-2 border-shield-500/30 shadow-lg shadow-shield-500/10'
            : 'bg-aegis-800/50 border border-white/10'
        }`}
      >
        {recommended && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 bg-shield-500 text-white text-xs font-semibold rounded-full">
              Most Popular
            </span>
          </div>
        )}

        <div className="text-center mb-6">
          <h3 className="font-display font-bold text-xl text-white mb-2">
            {plan.name}
          </h3>
          <div className="text-3xl font-bold text-white">
            {planId === 'free' ? 'Free' : plan.priceDisplay.split('/')[0]}
            {planId !== 'free' && (
              <span className="text-base font-normal text-gray-400">/month</span>
            )}
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secure-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleUpgrade}
          disabled={user?.user?.plan === planId}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            recommended
              ? 'bg-shield-500 hover:bg-shield-400 text-white'
              : 'bg-aegis-700 hover:bg-aegis-600 text-white border border-white/10'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {user?.user?.plan === planId ? (
            'Current Plan'
          ) : planId === 'free' ? (
            'Get Started'
          ) : (
            <>
              <Zap className="w-4 h-4 inline mr-2" />
              Upgrade Now
            </>
          )}
        </button>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        planId={planId}
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}

/**
 * Simple Upgrade Button
 */
export function UpgradeButton({ planId = 'pro', className = '' }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const plan = PLANS[planId]

  const handleClick = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.user?.plan === planId || user.user?.plan === 'enterprise') {
      return
    }

    setShowCheckout(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-6 py-3 bg-shield-500 hover:bg-shield-400 text-white font-semibold rounded-xl transition-colors ${className}`}
      >
        <Crown className="w-5 h-5" />
        Upgrade to {plan?.name || 'Pro'}
      </button>

      <CheckoutModal
        planId={planId}
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => navigate('/dashboard')}
      />
    </>
  )
}
