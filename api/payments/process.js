/**
 * Vercel Serverless Function: Process Payment
 *
 * POST /api/payments/process
 * Body: { sourceId, planId, userId, amount, currency }
 *
 * SETUP REQUIRED:
 * 1. Add SQUARE_ACCESS_TOKEN to Vercel environment variables
 * 2. Add SQUARE_LOCATION_ID to Vercel environment variables
 * 3. For sandbox testing, use sandbox tokens
 */

// Square SDK would be imported here in production
// import { Client, Environment } from 'square'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.status(200).set(corsHeaders).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { sourceId, planId, userId, amount, currency } = req.body

    // Validate required fields
    if (!sourceId || !planId || !userId || !amount) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
      return
    }

    // Check for Square credentials
    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const locationId = process.env.SQUARE_LOCATION_ID

    if (!accessToken || !locationId) {
      // Demo mode - simulate successful payment
      console.log('Square credentials not configured - running in demo mode')

      res.status(200).json({
        success: true,
        demo: true,
        payment: {
          id: 'demo_' + Date.now(),
          status: 'COMPLETED',
          amount: amount,
          currency: currency || 'USD',
          planId: planId,
          createdAt: new Date().toISOString()
        },
        message: 'Demo payment processed successfully'
      })
      return
    }

    // In production, use Square SDK
    // const client = new Client({
    //   accessToken: accessToken,
    //   environment: process.env.SQUARE_ENVIRONMENT === 'production'
    //     ? Environment.Production
    //     : Environment.Sandbox
    // })

    // const { result } = await client.paymentsApi.createPayment({
    //   sourceId: sourceId,
    //   idempotencyKey: `${userId}-${planId}-${Date.now()}`,
    //   amountMoney: {
    //     amount: BigInt(amount),
    //     currency: currency || 'USD'
    //   },
    //   locationId: locationId,
    //   note: `Tzu Shield ${planId} subscription for user ${userId}`
    // })

    // For now, return demo response
    res.status(200).json({
      success: true,
      demo: true,
      payment: {
        id: 'demo_' + Date.now(),
        status: 'COMPLETED',
        amount: amount,
        currency: currency || 'USD',
        planId: planId,
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Payment processing error:', error)

    res.status(500).json({
      success: false,
      error: error.message || 'Payment processing failed'
    })
  }
}
