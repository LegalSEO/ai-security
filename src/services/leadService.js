/**
 * Lead Management Service
 * Handles lead capture, scoring, and storage
 * Currently uses localStorage - replace with API calls when backend is ready
 */

const STORAGE_KEYS = {
  LEADS: 'tzu_leads',
  EMAIL_SEQUENCES: 'tzu_email_sequences',
  SETTINGS: 'tzu_lead_settings'
}

// Lead status types
export const LeadStatus = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  UNSUBSCRIBED: 'unsubscribed'
}

// Lead source types
export const LeadSource = {
  SCAN_RESULT: 'scan_result',
  RESOURCE_DOWNLOAD: 'resource_download',
  NEWSLETTER: 'newsletter',
  EXIT_INTENT: 'exit_intent'
}

// Email sequence types
export const EmailSequenceType = {
  POST_SCAN: 'post_scan',
  CRITICAL_ISSUES: 'critical_issues',
  WORDPRESS_ISSUES: 'wordpress_issues',
  WEEKLY_TIPS: 'weekly_tips'
}

/**
 * Generate unique ID
 */
function generateId() {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all leads from storage
 */
export function getLeads() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading leads:', error)
    return []
  }
}

/**
 * Save leads to storage
 */
function saveLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads))
    return true
  } catch (error) {
    console.error('Error saving leads:', error)
    return false
  }
}

/**
 * Create or update a lead
 */
export function saveLead(leadData) {
  const leads = getLeads()

  // Check if lead exists by email
  const existingIndex = leads.findIndex(l => l.email.toLowerCase() === leadData.email.toLowerCase())

  if (existingIndex >= 0) {
    // Update existing lead
    const existing = leads[existingIndex]
    leads[existingIndex] = {
      ...existing,
      ...leadData,
      updatedAt: new Date().toISOString(),
      scanHistory: [
        ...(existing.scanHistory || []),
        ...(leadData.scanData ? [{
          ...leadData.scanData,
          scannedAt: new Date().toISOString()
        }] : [])
      ],
      downloads: [
        ...(existing.downloads || []),
        ...(leadData.downloads || [])
      ],
      sources: [...new Set([...(existing.sources || []), leadData.source])]
    }
    saveLeads(leads)
    return leads[existingIndex]
  } else {
    // Create new lead
    const newLead = {
      id: generateId(),
      email: leadData.email,
      status: LeadStatus.NEW,
      source: leadData.source,
      sources: [leadData.source],

      // Scan data
      websiteUrl: leadData.websiteUrl || null,
      securityScore: leadData.securityScore || null,
      securityGrade: leadData.securityGrade || null,
      criticalIssues: leadData.criticalIssues || 0,
      warningIssues: leadData.warningIssues || 0,
      isWordPress: leadData.isWordPress || false,

      // Scan history
      scanHistory: leadData.scanData ? [{
        ...leadData.scanData,
        scannedAt: new Date().toISOString()
      }] : [],

      // Downloads
      downloads: leadData.downloads || [],

      // Email preferences
      subscribedToNewsletter: leadData.subscribedToNewsletter || false,
      emailSequences: [],

      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    }

    leads.push(newLead)
    saveLeads(leads)

    // Trigger appropriate email sequence
    triggerEmailSequence(newLead)

    return newLead
  }
}

/**
 * Get lead by email
 */
export function getLeadByEmail(email) {
  const leads = getLeads()
  return leads.find(l => l.email.toLowerCase() === email.toLowerCase())
}

/**
 * Get lead by ID
 */
export function getLeadById(id) {
  const leads = getLeads()
  return leads.find(l => l.id === id)
}

/**
 * Update lead status
 */
export function updateLeadStatus(id, status) {
  const leads = getLeads()
  const index = leads.findIndex(l => l.id === id)

  if (index >= 0) {
    leads[index].status = status
    leads[index].updatedAt = new Date().toISOString()
    saveLeads(leads)
    return leads[index]
  }
  return null
}

/**
 * Delete lead
 */
export function deleteLead(id) {
  const leads = getLeads()
  const filtered = leads.filter(l => l.id !== id)
  saveLeads(filtered)
  return filtered.length < leads.length
}

/**
 * Filter leads by criteria
 */
export function filterLeads(criteria = {}) {
  let leads = getLeads()

  // Filter by grade
  if (criteria.grade) {
    leads = leads.filter(l => l.securityGrade === criteria.grade)
  }

  // Filter by WordPress
  if (criteria.isWordPress !== undefined) {
    leads = leads.filter(l => l.isWordPress === criteria.isWordPress)
  }

  // Filter by status
  if (criteria.status) {
    leads = leads.filter(l => l.status === criteria.status)
  }

  // Filter by source
  if (criteria.source) {
    leads = leads.filter(l => l.sources?.includes(criteria.source))
  }

  // Filter by score range
  if (criteria.minScore !== undefined) {
    leads = leads.filter(l => (l.securityScore || 0) >= criteria.minScore)
  }
  if (criteria.maxScore !== undefined) {
    leads = leads.filter(l => (l.securityScore || 100) <= criteria.maxScore)
  }

  // Filter by critical issues
  if (criteria.hasCriticalIssues) {
    leads = leads.filter(l => (l.criticalIssues || 0) > 0)
  }

  // Filter by date range
  if (criteria.startDate) {
    leads = leads.filter(l => new Date(l.createdAt) >= new Date(criteria.startDate))
  }
  if (criteria.endDate) {
    leads = leads.filter(l => new Date(l.createdAt) <= new Date(criteria.endDate))
  }

  // Sort
  if (criteria.sortBy) {
    leads.sort((a, b) => {
      const aVal = a[criteria.sortBy]
      const bVal = b[criteria.sortBy]
      const direction = criteria.sortDir === 'asc' ? 1 : -1

      if (aVal < bVal) return -1 * direction
      if (aVal > bVal) return 1 * direction
      return 0
    })
  } else {
    // Default: newest first
    leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return leads
}

/**
 * Get lead statistics
 */
export function getLeadStats() {
  const leads = getLeads()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)

  const thisMonth = new Date()
  thisMonth.setMonth(thisMonth.getMonth() - 1)

  // Calculate stats
  const scansToday = leads.filter(l => new Date(l.createdAt) >= today).length
  const scansThisWeek = leads.filter(l => new Date(l.createdAt) >= thisWeek).length
  const scansThisMonth = leads.filter(l => new Date(l.createdAt) >= thisMonth).length

  const leadsWithScores = leads.filter(l => l.securityScore !== null)
  const averageScore = leadsWithScores.length > 0
    ? Math.round(leadsWithScores.reduce((sum, l) => sum + l.securityScore, 0) / leadsWithScores.length)
    : 0

  const gradeDistribution = {
    'A+': leads.filter(l => l.securityGrade === 'A+').length,
    'A': leads.filter(l => l.securityGrade === 'A').length,
    'B': leads.filter(l => l.securityGrade === 'B').length,
    'C': leads.filter(l => l.securityGrade === 'C').length,
    'D': leads.filter(l => l.securityGrade === 'D').length,
    'F': leads.filter(l => l.securityGrade === 'F').length
  }

  const wordPressSites = leads.filter(l => l.isWordPress).length
  const criticalIssuesSites = leads.filter(l => (l.criticalIssues || 0) > 0).length
  const newsletterSubscribers = leads.filter(l => l.subscribedToNewsletter).length

  const sourceDistribution = {
    [LeadSource.SCAN_RESULT]: leads.filter(l => l.sources?.includes(LeadSource.SCAN_RESULT)).length,
    [LeadSource.RESOURCE_DOWNLOAD]: leads.filter(l => l.sources?.includes(LeadSource.RESOURCE_DOWNLOAD)).length,
    [LeadSource.NEWSLETTER]: leads.filter(l => l.sources?.includes(LeadSource.NEWSLETTER)).length,
    [LeadSource.EXIT_INTENT]: leads.filter(l => l.sources?.includes(LeadSource.EXIT_INTENT)).length
  }

  return {
    totalLeads: leads.length,
    scansToday,
    scansThisWeek,
    scansThisMonth,
    averageScore,
    gradeDistribution,
    wordPressSites,
    criticalIssuesSites,
    newsletterSubscribers,
    sourceDistribution,
    statusDistribution: {
      [LeadStatus.NEW]: leads.filter(l => l.status === LeadStatus.NEW).length,
      [LeadStatus.CONTACTED]: leads.filter(l => l.status === LeadStatus.CONTACTED).length,
      [LeadStatus.QUALIFIED]: leads.filter(l => l.status === LeadStatus.QUALIFIED).length,
      [LeadStatus.CONVERTED]: leads.filter(l => l.status === LeadStatus.CONVERTED).length
    }
  }
}

/**
 * Export leads to CSV
 */
export function exportToCSV(leads = null) {
  const data = leads || getLeads()

  const headers = [
    'Email',
    'Website URL',
    'Security Score',
    'Grade',
    'Critical Issues',
    'Warning Issues',
    'WordPress',
    'Status',
    'Source',
    'Newsletter',
    'Created At',
    'Last Activity'
  ]

  const rows = data.map(lead => [
    lead.email,
    lead.websiteUrl || '',
    lead.securityScore || '',
    lead.securityGrade || '',
    lead.criticalIssues || 0,
    lead.warningIssues || 0,
    lead.isWordPress ? 'Yes' : 'No',
    lead.status,
    lead.sources?.join('; ') || '',
    lead.subscribedToNewsletter ? 'Yes' : 'No',
    new Date(lead.createdAt).toLocaleString(),
    new Date(lead.lastActivityAt).toLocaleString()
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  return csvContent
}

/**
 * Download CSV file
 */
export function downloadCSV(leads = null, filename = 'leads-export.csv') {
  const csv = exportToCSV(leads)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Email Sequences
 * Structure for automated email follow-ups
 * These will be triggered when connecting to an email service
 */

// Email sequence templates
export const EmailSequences = {
  [EmailSequenceType.POST_SCAN]: {
    name: 'Post-Scan Follow-up',
    description: 'Sent after a user completes a security scan',
    trigger: 'scan_complete',
    emails: [
      {
        delay: 0, // Immediate
        subject: 'Your Security Scan Results for {{websiteUrl}}',
        template: 'post_scan_immediate',
        variables: ['websiteUrl', 'securityScore', 'securityGrade', 'criticalIssues', 'topIssues']
      },
      {
        delay: 3 * 24 * 60 * 60 * 1000, // 3 days
        subject: 'Have you fixed these security issues yet?',
        template: 'post_scan_followup',
        condition: 'criticalIssues > 0'
      },
      {
        delay: 7 * 24 * 60 * 60 * 1000, // 7 days
        subject: 'Quick security tips based on your scan',
        template: 'post_scan_tips'
      }
    ]
  },

  [EmailSequenceType.CRITICAL_ISSUES]: {
    name: 'Critical Issues Alert',
    description: 'Urgent follow-up for sites with critical vulnerabilities',
    trigger: 'critical_issues_found',
    condition: 'criticalIssues >= 3 || securityGrade === "F"',
    emails: [
      {
        delay: 0,
        subject: '⚠️ URGENT: {{criticalIssues}} Critical Security Issues Found',
        template: 'critical_alert',
        variables: ['websiteUrl', 'criticalIssues', 'issuesList']
      },
      {
        delay: 24 * 60 * 60 * 1000, // 1 day
        subject: 'Your website is at risk - we can help',
        template: 'critical_offer_help'
      },
      {
        delay: 4 * 24 * 60 * 60 * 1000, // 4 days
        subject: 'Last chance: Fix your security issues before it\'s too late',
        template: 'critical_final_warning'
      }
    ]
  },

  [EmailSequenceType.WORDPRESS_ISSUES]: {
    name: 'WordPress Security Sequence',
    description: 'Targeted content for WordPress site owners with issues',
    trigger: 'wordpress_issues',
    condition: 'isWordPress && (criticalIssues > 0 || warningIssues > 2)',
    emails: [
      {
        delay: 2 * 24 * 60 * 60 * 1000, // 2 days after scan
        subject: 'WordPress Security: Why Your Site is at Risk',
        template: 'wp_security_intro'
      },
      {
        delay: 5 * 24 * 60 * 60 * 1000, // 5 days
        subject: '5 WordPress Security Mistakes You\'re Probably Making',
        template: 'wp_common_mistakes'
      },
      {
        delay: 8 * 24 * 60 * 60 * 1000, // 8 days
        subject: 'Is it time to leave WordPress behind?',
        template: 'wp_alternatives',
        variables: ['websiteUrl', 'issueCount']
      },
      {
        delay: 12 * 24 * 60 * 60 * 1000, // 12 days
        subject: 'Free Consultation: Rebuild Your Site Securely',
        template: 'wp_rebuild_offer'
      }
    ]
  },

  [EmailSequenceType.WEEKLY_TIPS]: {
    name: 'Weekly Security Tips',
    description: 'Newsletter for ongoing engagement',
    trigger: 'newsletter_subscribe',
    recurring: true,
    interval: 7 * 24 * 60 * 60 * 1000, // Weekly
    emails: [
      {
        subject: 'This Week in Security: {{weeklyTopic}}',
        template: 'weekly_tips',
        variables: ['weeklyTopic', 'tip1', 'tip2', 'tip3', 'featuredResource']
      }
    ]
  }
}

/**
 * Get email sequences for a lead
 */
export function getEmailSequencesForLead(lead) {
  const sequences = []

  // Post-scan sequence
  if (lead.scanHistory && lead.scanHistory.length > 0) {
    sequences.push(EmailSequenceType.POST_SCAN)
  }

  // Critical issues sequence
  if (lead.criticalIssues >= 3 || lead.securityGrade === 'F') {
    sequences.push(EmailSequenceType.CRITICAL_ISSUES)
  }

  // WordPress sequence
  if (lead.isWordPress && (lead.criticalIssues > 0 || lead.warningIssues > 2)) {
    sequences.push(EmailSequenceType.WORDPRESS_ISSUES)
  }

  // Weekly tips
  if (lead.subscribedToNewsletter) {
    sequences.push(EmailSequenceType.WEEKLY_TIPS)
  }

  return sequences
}

/**
 * Trigger email sequence for a lead
 * This function logs the sequence - replace with actual email service calls
 */
function triggerEmailSequence(lead) {
  const sequences = getEmailSequencesForLead(lead)

  sequences.forEach(sequenceType => {
    const sequence = EmailSequences[sequenceType]

    console.log(`[Email Sequence] Triggered: ${sequence.name} for ${lead.email}`)
    console.log(`[Email Sequence] First email: "${sequence.emails[0].subject}"`)

    // Store triggered sequence
    const leads = getLeads()
    const index = leads.findIndex(l => l.id === lead.id)
    if (index >= 0) {
      leads[index].emailSequences = leads[index].emailSequences || []
      leads[index].emailSequences.push({
        type: sequenceType,
        triggeredAt: new Date().toISOString(),
        status: 'active'
      })
      saveLeads(leads)
    }
  })

  return sequences
}

/**
 * Record a resource download
 */
export function recordDownload(email, resourceId, resourceTitle) {
  const lead = getLeadByEmail(email)

  if (lead) {
    const leads = getLeads()
    const index = leads.findIndex(l => l.id === lead.id)

    if (index >= 0) {
      leads[index].downloads = leads[index].downloads || []
      leads[index].downloads.push({
        resourceId,
        resourceTitle,
        downloadedAt: new Date().toISOString()
      })
      leads[index].lastActivityAt = new Date().toISOString()

      if (!leads[index].sources.includes(LeadSource.RESOURCE_DOWNLOAD)) {
        leads[index].sources.push(LeadSource.RESOURCE_DOWNLOAD)
      }

      saveLeads(leads)
      return true
    }
  }

  return false
}

/**
 * Subscribe to newsletter
 */
export function subscribeToNewsletter(email, source = LeadSource.NEWSLETTER) {
  const existingLead = getLeadByEmail(email)

  if (existingLead) {
    const leads = getLeads()
    const index = leads.findIndex(l => l.id === existingLead.id)

    if (index >= 0) {
      leads[index].subscribedToNewsletter = true
      leads[index].lastActivityAt = new Date().toISOString()

      if (!leads[index].sources.includes(source)) {
        leads[index].sources.push(source)
      }

      saveLeads(leads)

      // Trigger weekly tips sequence
      triggerEmailSequence(leads[index])

      return leads[index]
    }
  } else {
    // Create new lead from newsletter signup
    return saveLead({
      email,
      source,
      subscribedToNewsletter: true
    })
  }
}

/**
 * Capture lead from scan results
 */
export function captureFromScan(email, scanResults, subscribeNewsletter = false) {
  // Extract data from scan results
  const criticalIssues = Object.values(scanResults.categories || {})
    .reduce((count, cat) => {
      return count + (cat.findings || []).filter(f => f.status === 'fail').length
    }, 0)

  const warningIssues = Object.values(scanResults.categories || {})
    .reduce((count, cat) => {
      return count + (cat.findings || []).filter(f => f.status === 'warning').length
    }, 0)

  const isWordPress = scanResults.categories?.cms?.findings?.some(
    f => f.name?.toLowerCase().includes('wordpress')
  ) || false

  return saveLead({
    email,
    source: LeadSource.SCAN_RESULT,
    websiteUrl: scanResults.url,
    securityScore: scanResults.score,
    securityGrade: scanResults.grade,
    criticalIssues,
    warningIssues,
    isWordPress,
    subscribedToNewsletter: subscribeNewsletter,
    scanData: {
      url: scanResults.url,
      score: scanResults.score,
      grade: scanResults.grade,
      criticalIssues,
      warningIssues,
      categories: Object.keys(scanResults.categories || {}).map(key => ({
        name: key,
        status: scanResults.categories[key].status,
        score: scanResults.categories[key].score
      }))
    }
  })
}

// Initialize with some demo data if empty (for testing)
export function initDemoData() {
  const leads = getLeads()

  if (leads.length === 0) {
    const demoLeads = [
      {
        email: 'demo1@example.com',
        source: LeadSource.SCAN_RESULT,
        websiteUrl: 'https://example-shop.com',
        securityScore: 45,
        securityGrade: 'D',
        criticalIssues: 3,
        warningIssues: 5,
        isWordPress: true,
        subscribedToNewsletter: true
      },
      {
        email: 'demo2@example.com',
        source: LeadSource.SCAN_RESULT,
        websiteUrl: 'https://secure-site.com',
        securityScore: 85,
        securityGrade: 'A',
        criticalIssues: 0,
        warningIssues: 2,
        isWordPress: false,
        subscribedToNewsletter: false
      },
      {
        email: 'demo3@example.com',
        source: LeadSource.NEWSLETTER,
        subscribedToNewsletter: true
      }
    ]

    demoLeads.forEach(lead => saveLead(lead))
    console.log('[Lead Service] Demo data initialized')
  }
}
