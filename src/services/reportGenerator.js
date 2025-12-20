/**
 * PDF Security Report Generator
 *
 * Generates professional security audit reports from scan results.
 * Uses jsPDF for PDF generation.
 */

import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Brand colors (converted to RGB)
const COLORS = {
  primary: [14, 165, 233],      // shield-500 - #0ea5e9
  primaryDark: [2, 132, 199],   // shield-600
  success: [34, 197, 94],       // secure-500 - #22c55e
  warning: [249, 115, 22],      // threat-500 - #f97316
  danger: [239, 68, 68],        // critical-500 - #ef4444
  dark: [17, 24, 39],           // aegis-800
  darker: [10, 14, 26],         // aegis-900
  gray: [156, 163, 175],        // gray-400
  lightGray: [229, 231, 235],   // gray-200
  white: [255, 255, 255]
}

// Grade colors
const GRADE_COLORS = {
  A: COLORS.success,
  B: COLORS.success,
  C: COLORS.warning,
  D: COLORS.warning,
  F: COLORS.danger
}

/**
 * Generate PDF report from scan results
 * @param {object} scanResults - The scan results object
 * @param {boolean} isPro - Whether this is a Pro tier report
 * @returns {jsPDF} - The generated PDF document
 */
export function generateSecurityReport(scanResults, isPro = false) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  // Generate each section
  generateCoverPage(doc, scanResults, pageWidth, pageHeight)

  doc.addPage()
  generateExecutiveSummary(doc, scanResults, pageWidth, margin, isPro)

  doc.addPage()
  generateDetailedFindings(doc, scanResults, pageWidth, margin, isPro)

  doc.addPage()
  generateTechAssessment(doc, scanResults, pageWidth, margin)

  doc.addPage()
  generateRecommendations(doc, scanResults, pageWidth, margin, isPro)

  doc.addPage()
  generateCallToAction(doc, pageWidth, pageHeight, margin)

  // Add page numbers
  addPageNumbers(doc)

  return doc
}

/**
 * Download the PDF report
 */
export function downloadReport(scanResults, isPro = false) {
  const doc = generateSecurityReport(scanResults, isPro)
  const hostname = scanResults.hostname || 'website'
  const date = new Date().toISOString().split('T')[0]
  doc.save(`security-report-${hostname}-${date}.pdf`)
}

/**
 * Generate Cover Page
 */
function generateCoverPage(doc, scanResults, pageWidth, pageHeight) {
  const { hostname, score, grade, scanTime } = scanResults

  // Dark background
  doc.setFillColor(...COLORS.darker)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Decorative top gradient bar
  doc.setFillColor(...COLORS.primary)
  doc.rect(0, 0, pageWidth, 8, 'F')

  // Shield icon area (simplified geometric shape)
  const centerX = pageWidth / 2
  doc.setFillColor(...COLORS.primary)
  doc.setDrawColor(...COLORS.primary)

  // Draw a simple shield shape
  const shieldTop = 50
  const shieldWidth = 40
  const shieldHeight = 50

  doc.setLineWidth(2)
  doc.setDrawColor(...COLORS.primary)

  // Shield outline using lines
  const sx = centerX - shieldWidth / 2
  const sy = shieldTop
  doc.line(sx, sy, sx + shieldWidth, sy)
  doc.line(sx + shieldWidth, sy, sx + shieldWidth, sy + shieldHeight * 0.6)
  doc.line(sx + shieldWidth, sy + shieldHeight * 0.6, centerX, sy + shieldHeight)
  doc.line(centerX, sy + shieldHeight, sx, sy + shieldHeight * 0.6)
  doc.line(sx, sy + shieldHeight * 0.6, sx, sy)

  // Brand name
  doc.setTextColor(...COLORS.white)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('TZU SHIELD', centerX, 120, { align: 'center' })

  // Subtitle
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.gray)
  doc.text('Website Security Audit Report', centerX, 130, { align: 'center' })

  // Divider line
  doc.setDrawColor(...COLORS.primary)
  doc.setLineWidth(0.5)
  doc.line(centerX - 40, 145, centerX + 40, 145)

  // Website URL
  doc.setFontSize(16)
  doc.setTextColor(...COLORS.white)
  doc.setFont('helvetica', 'bold')
  doc.text(hostname || 'Unknown Website', centerX, 165, { align: 'center' })

  // Scan date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.gray)
  const scanDate = scanTime ? new Date(scanTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleDateString()
  doc.text(`Scan Date: ${scanDate}`, centerX, 175, { align: 'center' })

  // Score circle
  const scoreY = 210
  const scoreRadius = 30

  // Circle background
  doc.setFillColor(...COLORS.dark)
  doc.circle(centerX, scoreY, scoreRadius, 'F')

  // Circle border with grade color
  const gradeColor = GRADE_COLORS[grade] || COLORS.warning
  doc.setDrawColor(...gradeColor)
  doc.setLineWidth(3)
  doc.circle(centerX, scoreY, scoreRadius, 'S')

  // Grade letter
  doc.setFontSize(36)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...gradeColor)
  doc.text(grade || 'N/A', centerX, scoreY + 5, { align: 'center' })

  // Score number
  doc.setFontSize(12)
  doc.setTextColor(...COLORS.white)
  doc.text(`${score}/100`, centerX, scoreY + 18, { align: 'center' })

  // Score label
  doc.setFontSize(10)
  doc.setTextColor(...COLORS.gray)
  doc.text('SECURITY SCORE', centerX, scoreY + 45, { align: 'center' })

  // Score interpretation
  doc.setFontSize(11)
  doc.setTextColor(...gradeColor)
  doc.text(getScoreLabel(score), centerX, scoreY + 55, { align: 'center' })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(...COLORS.gray)
  doc.text('This report is generated by Tzu Shield automated scanning tools.', centerX, pageHeight - 25, { align: 'center' })
  doc.text('For questions or support, visit tzushield.com', centerX, pageHeight - 20, { align: 'center' })
}

/**
 * Generate Executive Summary
 */
function generateExecutiveSummary(doc, scanResults, pageWidth, margin, isPro) {
  const { hostname, score, grade, summary, categories } = scanResults

  // Header
  drawSectionHeader(doc, 'Executive Summary', margin, 20, pageWidth)

  let yPos = 45

  // Overall Assessment
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('Overall Assessment', margin, yPos)

  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)

  const assessment = getOverallAssessment(score, summary, hostname)
  const assessmentLines = doc.splitTextToSize(assessment, pageWidth - margin * 2)
  doc.text(assessmentLines, margin, yPos)
  yPos += assessmentLines.length * 5 + 10

  // Key Findings Summary Box
  doc.setFillColor(245, 247, 250)
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 35, 3, 3, 'F')

  yPos += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('Key Findings', margin + 5, yPos)

  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  // Finding counts
  const findingsX = margin + 10
  const findingsSpacing = 45

  // Critical
  doc.setTextColor(...COLORS.danger)
  doc.text(`${summary?.critical || 0}`, findingsX, yPos)
  doc.setTextColor(80, 80, 80)
  doc.text('Critical', findingsX + 8, yPos)

  // Failed
  doc.setTextColor(...COLORS.danger)
  doc.text(`${summary?.failed || 0}`, findingsX + findingsSpacing, yPos)
  doc.setTextColor(80, 80, 80)
  doc.text('Failed', findingsX + findingsSpacing + 8, yPos)

  // Warnings
  doc.setTextColor(...COLORS.warning)
  doc.text(`${summary?.warnings || 0}`, findingsX + findingsSpacing * 2, yPos)
  doc.setTextColor(80, 80, 80)
  doc.text('Warnings', findingsX + findingsSpacing * 2 + 8, yPos)

  // Passed
  doc.setTextColor(...COLORS.success)
  doc.text(`${summary?.passed || 0}`, findingsX + findingsSpacing * 3, yPos)
  doc.setTextColor(80, 80, 80)
  doc.text('Passed', findingsX + findingsSpacing * 3 + 8, yPos)

  yPos += 25

  // AI Readiness Score
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('AI Threat Readiness', margin, yPos)

  yPos += 8
  const aiScore = calculateAIReadinessScore(scanResults)
  const aiScoreColor = aiScore >= 70 ? COLORS.success : aiScore >= 50 ? COLORS.warning : COLORS.danger

  // AI Score bar
  doc.setFillColor(230, 230, 230)
  doc.roundedRect(margin, yPos, 100, 8, 2, 2, 'F')
  doc.setFillColor(...aiScoreColor)
  doc.roundedRect(margin, yPos, aiScore, 8, 2, 2, 'F')

  doc.setFontSize(10)
  doc.setTextColor(...aiScoreColor)
  doc.text(`${aiScore}/100`, margin + 105, yPos + 6)

  yPos += 5
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  const aiReadinessText = getAIReadinessDescription(aiScore)
  doc.text(aiReadinessText, margin, yPos + 10)

  yPos += 25

  // Top 3 Priority Actions
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('Top Priority Actions', margin, yPos)

  yPos += 8

  const priorities = getTopPriorities(scanResults)
  priorities.slice(0, 3).forEach((priority, index) => {
    doc.setFillColor(...(priority.severity === 'critical' ? COLORS.danger : COLORS.warning))
    doc.circle(margin + 3, yPos + 2, 2, 'F')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.dark)
    doc.text(`${index + 1}. ${priority.title}`, margin + 8, yPos + 3)

    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    const descLines = doc.splitTextToSize(priority.description, pageWidth - margin * 2 - 10)
    doc.text(descLines, margin + 8, yPos + 2)
    yPos += descLines.length * 4 + 8
  })

  if (!isPro) {
    yPos += 10
    drawProUpgradeBox(doc, margin, yPos, pageWidth, 'Get the full report with detailed fix instructions')
  }
}

/**
 * Generate Detailed Findings
 */
function generateDetailedFindings(doc, scanResults, pageWidth, margin, isPro) {
  drawSectionHeader(doc, 'Detailed Security Findings', margin, 20, pageWidth)

  let yPos = 45
  const { categories } = scanResults

  const categoryNames = {
    ssl: 'SSL/HTTPS Security',
    headers: 'Security Headers',
    cms: 'CMS & Platform',
    exposed_files: 'Exposed Files',
    plugins: 'Plugins & Themes',
    malware: 'Malware Detection',
    performance: 'Technology Stack'
  }

  Object.entries(categories || {}).forEach(([key, category]) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage()
      yPos = 30
    }

    const categoryName = categoryNames[key] || key
    const statusColor = category.status === 'pass' ? COLORS.success :
                       category.status === 'warning' ? COLORS.warning : COLORS.danger

    // Category header
    doc.setFillColor(...statusColor)
    doc.circle(margin + 3, yPos + 2, 3, 'F')

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.dark)
    doc.text(categoryName, margin + 10, yPos + 3)

    // Score badge
    if (category.score !== null && category.score !== undefined) {
      doc.setFontSize(9)
      doc.setTextColor(...statusColor)
      doc.text(`${category.score}/100`, pageWidth - margin - 15, yPos + 3)
    }

    yPos += 10

    // Findings
    if (category.findings && category.findings.length > 0) {
      category.findings.forEach((finding, idx) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 30
        }

        const findingColor = finding.status === 'pass' ? COLORS.success :
                            finding.status === 'warning' ? COLORS.warning : COLORS.danger

        // Finding status indicator
        doc.setFillColor(...findingColor)
        doc.rect(margin + 5, yPos, 2, 2, 'F')

        // Finding name
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...COLORS.dark)
        doc.text(finding.name || 'Finding', margin + 10, yPos + 2)

        // Severity badge
        if (finding.severity && finding.severity !== 'info') {
          const sevColor = finding.severity === 'critical' ? COLORS.danger :
                          finding.severity === 'high' ? COLORS.danger :
                          finding.severity === 'medium' ? COLORS.warning : COLORS.gray
          doc.setFontSize(7)
          doc.setTextColor(...sevColor)
          doc.text(finding.severity.toUpperCase(), pageWidth - margin - 20, yPos + 2)
        }

        yPos += 5

        // Description
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        if (finding.description) {
          const descLines = doc.splitTextToSize(finding.description, pageWidth - margin * 2 - 15)
          doc.text(descLines, margin + 10, yPos + 2)
          yPos += descLines.length * 4 + 2
        }

        // What it means (Pro only)
        if (isPro && finding.whatItMeans) {
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(80, 80, 80)
          const whatLines = doc.splitTextToSize(`Why it matters: ${finding.whatItMeans}`, pageWidth - margin * 2 - 15)
          doc.text(whatLines, margin + 10, yPos + 2)
          yPos += whatLines.length * 4 + 2
        }

        // How to fix (Pro only)
        if (isPro && finding.howToFix) {
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(...COLORS.primary)
          doc.text('How to fix:', margin + 10, yPos + 2)
          yPos += 4
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(60, 60, 60)
          const fixLines = doc.splitTextToSize(finding.howToFix, pageWidth - margin * 2 - 15)
          doc.text(fixLines, margin + 10, yPos + 2)
          yPos += fixLines.length * 4 + 2
        }

        yPos += 5
      })
    }

    yPos += 8
  })

  if (!isPro) {
    if (yPos > 240) {
      doc.addPage()
      yPos = 30
    }
    drawProUpgradeBox(doc, margin, yPos, pageWidth, 'Upgrade to Pro for detailed fix instructions for each finding')
  }
}

/**
 * Generate Technology Assessment
 */
function generateTechAssessment(doc, scanResults, pageWidth, margin) {
  drawSectionHeader(doc, 'Technology & Age Assessment', margin, 20, pageWidth)

  let yPos = 45
  const { categories } = scanResults

  // Detected Technology
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('Detected Technology Stack', margin, yPos)

  yPos += 10

  const techStack = detectTechStack(scanResults)

  // Tech table
  const techData = techStack.map(tech => [
    tech.name,
    tech.version || 'Unknown',
    tech.status,
    tech.risk
  ])

  doc.autoTable({
    startY: yPos,
    head: [['Technology', 'Version', 'Status', 'Risk Level']],
    body: techData,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: COLORS.dark,
      textColor: COLORS.white,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      3: {
        cellWidth: 25,
        halign: 'center'
      }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 3) {
        const risk = data.cell.raw
        if (risk === 'High') {
          data.cell.styles.textColor = COLORS.danger
        } else if (risk === 'Medium') {
          data.cell.styles.textColor = COLORS.warning
        } else {
          data.cell.styles.textColor = COLORS.success
        }
      }
    }
  })

  yPos = doc.lastAutoTable.finalY + 15

  // Legacy Risk Score
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('Legacy Risk Assessment', margin, yPos)

  yPos += 10

  const legacyScore = calculateLegacyRiskScore(techStack)
  const legacyColor = legacyScore <= 30 ? COLORS.success :
                     legacyScore <= 60 ? COLORS.warning : COLORS.danger

  // Legacy score bar
  doc.setFillColor(230, 230, 230)
  doc.roundedRect(margin, yPos, 100, 10, 2, 2, 'F')
  doc.setFillColor(...legacyColor)
  doc.roundedRect(margin, yPos, legacyScore, 10, 2, 2, 'F')

  doc.setFontSize(10)
  doc.setTextColor(...legacyColor)
  doc.text(`${legacyScore}% Risk`, margin + 105, yPos + 7)

  yPos += 18

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  const legacyDesc = getLegacyRiskDescription(legacyScore)
  const legacyLines = doc.splitTextToSize(legacyDesc, pageWidth - margin * 2)
  doc.text(legacyLines, margin, yPos)

  yPos += legacyLines.length * 4 + 15

  // Comparison to Modern Standards
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('Comparison to Modern Security Standards', margin, yPos)

  yPos += 10

  const standards = [
    { name: 'HTTPS/TLS', standard: 'TLS 1.3', status: categories?.ssl?.score >= 80 ? 'Meets' : 'Below' },
    { name: 'Security Headers', standard: 'OWASP Recommended', status: categories?.headers?.score >= 70 ? 'Partial' : 'Below' },
    { name: 'CMS Updates', standard: 'Latest Version', status: categories?.cms?.score >= 80 ? 'Meets' : 'Below' },
    { name: 'Malware Protection', standard: 'Clean', status: categories?.malware?.score >= 90 ? 'Meets' : 'Below' }
  ]

  doc.autoTable({
    startY: yPos,
    head: [['Security Area', 'Modern Standard', 'Your Status']],
    body: standards.map(s => [s.name, s.standard, s.status]),
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: COLORS.dark,
      textColor: COLORS.white,
      fontStyle: 'bold'
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 2) {
        const status = data.cell.raw
        if (status === 'Meets') {
          data.cell.styles.textColor = COLORS.success
        } else if (status === 'Partial') {
          data.cell.styles.textColor = COLORS.warning
        } else {
          data.cell.styles.textColor = COLORS.danger
        }
      }
    }
  })
}

/**
 * Generate Recommendations Summary
 */
function generateRecommendations(doc, scanResults, pageWidth, margin, isPro) {
  drawSectionHeader(doc, 'Recommendations Summary', margin, 20, pageWidth)

  let yPos = 45

  const recommendations = getAllRecommendations(scanResults)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`${recommendations.length} recommendations identified to improve your security posture.`, margin, yPos)

  yPos += 10

  // Recommendations table
  const recData = recommendations.map((rec, idx) => [
    `${idx + 1}`,
    rec.title,
    rec.priority,
    rec.effort,
    isPro ? (rec.canHelp ? 'Yes' : 'DIY') : '-'
  ])

  doc.autoTable({
    startY: yPos,
    head: [['#', 'Recommendation', 'Priority', 'Effort', 'We Can Help']],
    body: recData.slice(0, isPro ? recData.length : 5),
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: COLORS.dark,
      textColor: COLORS.white,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: function(data) {
      if (data.section === 'body') {
        if (data.column.index === 2) {
          const priority = data.cell.raw
          if (priority === 'Critical') {
            data.cell.styles.textColor = COLORS.danger
          } else if (priority === 'High') {
            data.cell.styles.textColor = COLORS.warning
          }
        }
        if (data.column.index === 3) {
          const effort = data.cell.raw
          if (effort === 'Easy') {
            data.cell.styles.textColor = COLORS.success
          } else if (effort === 'Hard') {
            data.cell.styles.textColor = COLORS.danger
          }
        }
      }
    }
  })

  yPos = doc.lastAutoTable.finalY + 10

  if (!isPro && recommendations.length > 5) {
    drawProUpgradeBox(doc, margin, yPos, pageWidth, `${recommendations.length - 5} more recommendations available in the Pro report`)
  }

  // Legend
  yPos = doc.lastAutoTable.finalY + 25
  if (yPos < 250) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.dark)
    doc.text('Effort Legend:', margin, yPos)

    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Easy = Can be done in minutes with basic technical knowledge', margin + 5, yPos)
    yPos += 4
    doc.text('Medium = Requires some technical skill or plugin installation', margin + 5, yPos)
    yPos += 4
    doc.text('Hard = Requires developer assistance or significant changes', margin + 5, yPos)
  }
}

/**
 * Generate Call to Action Page
 */
function generateCallToAction(doc, pageWidth, pageHeight, margin) {
  // Background
  doc.setFillColor(...COLORS.darker)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Top accent
  doc.setFillColor(...COLORS.primary)
  doc.rect(0, 0, pageWidth, 5, 'F')

  const centerX = pageWidth / 2

  // Headline
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.white)
  doc.text('Need Help Fixing', centerX, 50, { align: 'center' })
  doc.text('These Issues?', centerX, 62, { align: 'center' })

  // Subheadline
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.gray)
  doc.text('Our security experts can help you address these vulnerabilities', centerX, 80, { align: 'center' })
  doc.text('and protect your website from AI-powered threats.', centerX, 87, { align: 'center' })

  // Service boxes
  let yPos = 105

  // Pro Monitoring Box
  doc.setFillColor(30, 40, 60)
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 50, 3, 3, 'F')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.primary)
  doc.text('Pro Security Monitoring', margin + 10, yPos + 15)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.white)
  doc.text('24/7 automated monitoring with instant alerts when new vulnerabilities', margin + 10, yPos + 27)
  doc.text('are detected. Monthly reports and priority support included.', margin + 10, yPos + 34)

  doc.setTextColor(...COLORS.success)
  doc.text('Starting at $49/month', margin + 10, yPos + 44)

  yPos += 60

  // Website Upgrade Box
  doc.setFillColor(30, 40, 60)
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 50, 3, 3, 'F')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.success)
  doc.text('Website Security Upgrade', margin + 10, yPos + 15)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.white)
  doc.text('We\'ll implement all recommended security fixes, update your CMS,', margin + 10, yPos + 27)
  doc.text('and harden your website against modern threats.', margin + 10, yPos + 34)

  doc.setTextColor(...COLORS.success)
  doc.text('Custom quote based on your needs', margin + 10, yPos + 44)

  yPos += 60

  // Enterprise Box
  doc.setFillColor(30, 40, 60)
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 50, 3, 3, 'F')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.warning)
  doc.text('Enterprise Security', margin + 10, yPos + 15)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.white)
  doc.text('Dedicated security engineer, custom security policies, incident', margin + 10, yPos + 27)
  doc.text('response team, and compliance assistance for larger organizations.', margin + 10, yPos + 34)

  doc.setTextColor(...COLORS.success)
  doc.text('Contact us for enterprise pricing', margin + 10, yPos + 44)

  // Contact info
  yPos = pageHeight - 50

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.white)
  doc.text('Get Started Today', centerX, yPos, { align: 'center' })

  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.primary)
  doc.text('www.tzushield.com', centerX, yPos, { align: 'center' })

  yPos += 7
  doc.setTextColor(...COLORS.gray)
  doc.text('hello@tzushield.com', centerX, yPos, { align: 'center' })
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function drawSectionHeader(doc, title, margin, yPos, pageWidth) {
  doc.setFillColor(...COLORS.primary)
  doc.rect(margin, yPos, 5, 12, 'F')

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text(title, margin + 10, yPos + 9)

  doc.setDrawColor(230, 230, 230)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos + 18, pageWidth - margin, yPos + 18)
}

function drawProUpgradeBox(doc, margin, yPos, pageWidth, message) {
  doc.setFillColor(255, 247, 237) // Light orange
  doc.setDrawColor(...COLORS.warning)
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 3, 3, 'FD')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.warning)
  doc.text('UPGRADE TO PRO', margin + 10, yPos + 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(message, margin + 10, yPos + 18)
}

function addPageNumbers(doc) {
  const pageCount = doc.internal.getNumberOfPages()

  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i - 1} of ${pageCount - 1}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }
}

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent Security'
  if (score >= 80) return 'Good Security'
  if (score >= 70) return 'Moderate Risk'
  if (score >= 60) return 'Needs Attention'
  return 'Critical Issues Found'
}

function getOverallAssessment(score, summary, hostname) {
  const critical = summary?.critical || 0
  const failed = summary?.failed || 0
  const warnings = summary?.warnings || 0

  if (score >= 90) {
    return `The security scan of ${hostname} indicates a strong security posture. Your website follows most security best practices and is well-protected against common attack vectors. Continue monitoring for new threats and keep all software up to date.`
  } else if (score >= 70) {
    return `The security scan of ${hostname} reveals a moderate security posture with some areas requiring attention. While no critical vulnerabilities were detected, there are ${warnings} warnings that should be addressed to strengthen your defenses against increasingly sophisticated attacks.`
  } else if (score >= 50) {
    return `The security scan of ${hostname} has identified significant security concerns that require immediate attention. With ${critical + failed} failed checks and ${warnings} warnings, your website is vulnerable to common attack methods. We recommend prioritizing the critical issues listed in this report.`
  } else {
    return `URGENT: The security scan of ${hostname} has revealed critical security vulnerabilities. Your website is at high risk of being compromised by automated attacks. Immediate action is required to address the ${critical} critical issues and ${failed} failed security checks identified in this report.`
  }
}

function calculateAIReadinessScore(scanResults) {
  // AI readiness based on how well protected against automated attacks
  let score = 100
  const { summary, categories } = scanResults

  // Deduct for critical/failed items
  score -= (summary?.critical || 0) * 15
  score -= (summary?.failed || 0) * 10
  score -= (summary?.warnings || 0) * 3

  // Bonus for good headers (important for AI attack prevention)
  if (categories?.headers?.score >= 80) score += 5

  // Penalty for exposed files (easy targets for AI scanners)
  if (categories?.exposed_files?.score < 70) score -= 10

  return Math.max(0, Math.min(100, score))
}

function getAIReadinessDescription(score) {
  if (score >= 80) {
    return 'Your site is well-prepared to defend against AI-powered reconnaissance and automated attacks.'
  } else if (score >= 60) {
    return 'Your site has moderate protection but some gaps that automated scanners can exploit.'
  } else if (score >= 40) {
    return 'Your site has significant vulnerabilities that AI-powered attack tools will quickly identify.'
  } else {
    return 'CRITICAL: Your site is highly vulnerable to AI-powered attacks. Immediate action required.'
  }
}

function getTopPriorities(scanResults) {
  const priorities = []
  const { categories } = scanResults

  Object.values(categories || {}).forEach(category => {
    (category.findings || []).forEach(finding => {
      if (finding.status === 'fail' || (finding.status === 'warning' && finding.severity === 'high')) {
        priorities.push({
          title: finding.name,
          description: finding.howToFix || finding.description,
          severity: finding.severity
        })
      }
    })
  })

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  priorities.sort((a, b) => (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4))

  return priorities
}

function detectTechStack(scanResults) {
  const stack = []
  const { categories } = scanResults

  // CMS
  if (categories?.cms?.details?.cms) {
    const cms = categories.cms.details
    const isOutdated = cms.isOutdated || false
    stack.push({
      name: cms.cms,
      version: cms.version || 'Unknown',
      status: isOutdated ? 'Outdated' : 'Current',
      risk: isOutdated ? 'High' : 'Low'
    })
  }

  // SSL/TLS
  if (categories?.ssl) {
    const sslScore = categories.ssl.score
    stack.push({
      name: 'SSL/TLS',
      version: 'TLS 1.2+',
      status: sslScore >= 80 ? 'Valid' : 'Issues',
      risk: sslScore >= 80 ? 'Low' : 'High'
    })
  }

  // Security Headers
  if (categories?.headers) {
    const headerScore = categories.headers.score
    stack.push({
      name: 'Security Headers',
      version: '-',
      status: headerScore >= 70 ? 'Configured' : 'Missing',
      risk: headerScore >= 70 ? 'Low' : headerScore >= 40 ? 'Medium' : 'High'
    })
  }

  // Performance/Libraries
  if (categories?.performance?.findings) {
    categories.performance.findings.forEach(f => {
      if (f.id?.includes('jquery')) {
        const isOld = f.status !== 'pass'
        stack.push({
          name: 'jQuery',
          version: f.details?.version || 'Detected',
          status: isOld ? 'Outdated' : 'Current',
          risk: isOld ? 'Medium' : 'Low'
        })
      }
    })
  }

  if (stack.length === 0) {
    stack.push({
      name: 'Custom Stack',
      version: '-',
      status: 'Unknown',
      risk: 'Medium'
    })
  }

  return stack
}

function calculateLegacyRiskScore(techStack) {
  let riskScore = 0
  let items = 0

  techStack.forEach(tech => {
    items++
    if (tech.risk === 'High') riskScore += 40
    else if (tech.risk === 'Medium') riskScore += 20
    else riskScore += 5
  })

  return items > 0 ? Math.round(riskScore / items) : 50
}

function getLegacyRiskDescription(score) {
  if (score <= 20) {
    return 'Your technology stack is modern and well-maintained. Continue regular updates to maintain this status.'
  } else if (score <= 40) {
    return 'Your technology stack has some older components but overall is reasonably current. Consider updating the outdated elements identified above.'
  } else if (score <= 60) {
    return 'Your website uses several outdated technologies that increase security risk. A technology refresh is recommended.'
  } else {
    return 'WARNING: Your website relies heavily on legacy technology. This significantly increases your attack surface and makes security maintenance difficult. Consider a comprehensive upgrade.'
  }
}

function getAllRecommendations(scanResults) {
  const recs = []
  const { categories } = scanResults

  Object.values(categories || {}).forEach(category => {
    (category.findings || []).forEach(finding => {
      if (finding.status !== 'pass' && finding.howToFix) {
        const severity = finding.severity || 'medium'
        recs.push({
          title: finding.name,
          description: finding.howToFix,
          priority: severity === 'critical' ? 'Critical' : severity === 'high' ? 'High' : severity === 'medium' ? 'Medium' : 'Low',
          effort: getEffortLevel(finding),
          canHelp: true
        })
      }
    })
  })

  // Sort by priority
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
  recs.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4))

  return recs
}

function getEffortLevel(finding) {
  const name = (finding.name || '').toLowerCase()
  const fix = (finding.howToFix || '').toLowerCase()

  // Easy fixes
  if (fix.includes('delete') || fix.includes('remove file') || name.includes('readme')) {
    return 'Easy'
  }

  // Hard fixes
  if (fix.includes('developer') || fix.includes('rebuild') || fix.includes('migration')) {
    return 'Hard'
  }

  // Default to medium
  return 'Medium'
}

export default {
  generateSecurityReport,
  downloadReport
}
