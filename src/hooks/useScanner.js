import { useState, useCallback, useRef } from 'react'
import { runScan, normalizeUrl } from '../services/scannerService'

/**
 * Custom hook for managing scanner state
 */
export function useScanner() {
  const [scanState, setScanState] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(false)

  /**
   * Start a new scan
   */
  const startScan = useCallback(async (url) => {
    // Validate URL
    const normalized = normalizeUrl(url)
    if (!normalized.valid) {
      setError(normalized.error || 'Please enter a valid URL')
      return null
    }

    // Reset state
    setError(null)
    setIsScanning(true)
    abortRef.current = false

    try {
      const result = await runScan(url, (update) => {
        if (!abortRef.current) {
          setScanState(update)
        }
      })

      if (!abortRef.current) {
        setScanState(result)
        setIsScanning(false)
      }

      return result
    } catch (err) {
      if (!abortRef.current) {
        setError(err.message || 'Scan failed. Please try again.')
        setIsScanning(false)
      }
      return null
    }
  }, [])

  /**
   * Abort current scan
   */
  const abortScan = useCallback(() => {
    abortRef.current = true
    setIsScanning(false)
  }, [])

  /**
   * Reset scanner to initial state
   */
  const resetScan = useCallback(() => {
    abortRef.current = true
    setScanState(null)
    setIsScanning(false)
    setError(null)
  }, [])

  return {
    scanState,
    isScanning,
    error,
    startScan,
    abortScan,
    resetScan
  }
}

export default useScanner
