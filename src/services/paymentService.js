/**
 * Payment Service - Square Integration
 *
 * SETUP REQUIRED:
 * 1. Create a Square Developer account at https://squareup.com/developers
 * 2. Create an application to get your credentials
 * 3. Get your Application ID and Location ID
 * 4. Add them to your environment variables:
 *    - VITE_SQUARE_APP_ID
 *    - VITE_SQUARE_LOCATION_ID
 *
 * For sandbox testing, use the sandbox credentials.
 * For production, use production credentials and change the CDN URL.
 */

// Configuration
const CONFIG = {
  // Square application ID (from environment or fallback for testing)
  applicationId: import.meta.env.VITE_SQUARE_APP_ID || 'sandbox-sq0idb-XXXXXXXXXXXXXXX',

  // Square location ID
  locationId: import.meta.env.VITE_SQUARE_LOCATION_ID || 'XXXXXXXXXXXXXXXXX',

  // Environment: 'sandbox' for testing, 'production' for live
  environment: import.meta.env.VITE_SQUARE_ENVIRONMENT || 'sandbox',

  // Currency
  currency: 'USD'
}

// Pricing plans
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: 'Free',
    interval: null,
    features: [
      '5 security scans per month',
      'Basic vulnerability report',
      'Email recommendations',
      'Standard support'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 2900, // in cents
    priceDisplay: '$29/month',
    interval: 'MONTHLY',
    squareVariationId: null, // Set after creating in Square
    features: [
      '100 security scans per month',
      'Detailed vulnerability reports',
      'WordPress plugin analysis',
      'Priority email alerts',
      'PDF export with branding',
      'Priority support'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9900, // in cents
    priceDisplay: '$99/month',
    interval: 'MONTHLY',
    squareVariationId: null,
    features: [
      'Unlimited security scans',
      'Advanced threat detection',
      'Custom scan schedules',
      'API access',
      'White-label reports',
      'Dedicated support',
      'SLA guarantee'
    ]
  }
}

// Store for Square payment instance
let squarePayments = null
let card = null

/**
 * Load Square Web Payments SDK
 */
export async function loadSquareSDK() {
  // Check if already loaded
  if (window.Square) {
    return window.Square
  }

  const script = document.createElement('script')
  script.src = CONFIG.environment === 'sandbox'
    ? 'https://sandbox.web.squarecdn.com/v1/square.js'
    : 'https://web.squarecdn.com/v1/square.js'

  script.async = true

  return new Promise((resolve, reject) => {
    script.onload = () => resolve(window.Square)
    script.onerror = () => reject(new Error('Failed to load Square SDK'))
    document.body.appendChild(script)
  })
}

/**
 * Initialize Square Payments
 */
export async function initializePayments() {
  try {
    const Square = await loadSquareSDK()

    if (!squarePayments) {
      squarePayments = Square.payments(CONFIG.applicationId, CONFIG.locationId)
    }

    return squarePayments
  } catch (error) {
    console.error('Failed to initialize Square payments:', error)
    throw error
  }
}

/**
 * Create a card payment form
 * @param {string} containerId - ID of the container element for the card form
 */
export async function createCardForm(containerId) {
  try {
    const payments = await initializePayments()

    // Destroy existing card if present
    if (card) {
      await card.destroy()
    }

    // Create card payment method
    card = await payments.card()

    // Attach to DOM
    await card.attach(`#${containerId}`)

    return card
  } catch (error) {
    console.error('Failed to create card form:', error)
    throw error
  }
}

/**
 * Tokenize a card payment
 * @returns {Promise<{token: string, status: string}>}
 */
export async function tokenizeCard() {
  if (!card) {
    throw new Error('Card form not initialized')
  }

  try {
    const result = await card.tokenize()

    if (result.status === 'OK') {
      return {
        token: result.token,
        status: 'OK'
      }
    } else {
      throw new Error(result.errors?.[0]?.message || 'Tokenization failed')
    }
  } catch (error) {
    console.error('Card tokenization failed:', error)
    throw error
  }
}

/**
 * Process a payment (calls backend API)
 * @param {string} token - Card token from tokenize()
 * @param {string} planId - Plan ID (pro, enterprise)
 * @param {string} userId - User ID
 */
export async function processPayment(token, planId, userId) {
  const plan = PLANS[planId]

  if (!plan || plan.price === 0) {
    throw new Error('Invalid plan selected')
  }

  try {
    // In production, this would call your backend API
    // The backend handles the actual Square API payment processing
    const response = await fetch('/api/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sourceId: token,
        planId: planId,
        userId: userId,
        amount: plan.price,
        currency: CONFIG.currency
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Payment failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Payment processing failed:', error)
    throw error
  }
}

/**
 * Create a subscription (for recurring payments)
 * @param {string} token - Card token
 * @param {string} planId - Plan ID
 * @param {string} userId - User ID
 * @param {object} customerInfo - Customer details
 */
export async function createSubscription(token, planId, userId, customerInfo) {
  const plan = PLANS[planId]

  if (!plan || plan.price === 0) {
    throw new Error('Invalid plan selected')
  }

  try {
    // This would call your backend to create a Square subscription
    const response = await fetch('/api/payments/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sourceId: token,
        planId: planId,
        userId: userId,
        customer: customerInfo,
        amount: plan.price,
        interval: plan.interval
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Subscription creation failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Subscription creation failed:', error)
    throw error
  }
}

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Square subscription ID
 * @param {string} userId - User ID
 */
export async function cancelSubscription(subscriptionId, userId) {
  try {
    const response = await fetch('/api/payments/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriptionId,
        userId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Cancellation failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Subscription cancellation failed:', error)
    throw error
  }
}

/**
 * Get saved payment methods for a customer
 * @param {string} customerId - Square customer ID
 */
export async function getSavedCards(customerId) {
  try {
    const response = await fetch(`/api/payments/cards/${customerId}`)

    if (!response.ok) {
      return []
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to get saved cards:', error)
    return []
  }
}

/**
 * Store a transaction record locally (for demo/offline mode)
 */
export function storeTransaction(userId, planId, amount, status) {
  const key = `tzu_transactions_${userId}`
  const transactions = JSON.parse(localStorage.getItem(key) || '[]')

  transactions.push({
    id: 'txn_' + Date.now().toString(36),
    planId,
    amount,
    status,
    createdAt: new Date().toISOString()
  })

  localStorage.setItem(key, JSON.stringify(transactions))
}

/**
 * Get transaction history
 */
export function getTransactionHistory(userId) {
  const key = `tzu_transactions_${userId}`
  return JSON.parse(localStorage.getItem(key) || '[]')
}

/**
 * Cleanup card form
 */
export async function destroyCardForm() {
  if (card) {
    await card.destroy()
    card = null
  }
}

// Export config for use in components
export { CONFIG as PaymentConfig }
