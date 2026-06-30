/**
 * Google Apps Script — deploy as web app (Execute as: Me, Who has access: Anyone)
 * 1. Create a Google Sheet with headers in row 1: Timestamp | Business Name | City | Mobile Number | Role
 * 2. Extensions → Apps Script → paste this file → set SHEET_ID and NOTIFICATION_EMAIL
 * 3. Deploy → New deployment → Web app → copy the URL
 * 4. Add URL to GitHub repo secret VITE_DEMO_FORM_URL (or .env locally)
 */
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'
const NOTIFICATION_EMAIL = 'kavidhasan.m@carepay.money'
const NOTIFICATION_CC = 'gaurav@carepay.money,nikhil@aarogya-pay.com'

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents)
    const businessName = String(payload.businessName || '').trim()
    const city = String(payload.city || '').trim()
    const mobileNumber = String(payload.mobileNumber || '').trim()
    const role = String(payload.role || '').trim()
    const submittedAt = payload.submittedAt || new Date().toISOString()

    if (!businessName || !city || !mobileNumber || !role) {
      return jsonResponse({ success: false, error: 'Missing required fields' })
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
    sheet.appendRow([submittedAt, businessName, city, mobileNumber, role])

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      cc: NOTIFICATION_CC,
      subject: 'New Lumen demo request',
      htmlBody:
        '<h2>New demo request</h2>' +
        '<p><strong>Business:</strong> ' + escapeHtml(businessName) + '</p>' +
        '<p><strong>City:</strong> ' + escapeHtml(city) + '</p>' +
        '<p><strong>Mobile:</strong> ' + escapeHtml(mobileNumber) + '</p>' +
        '<p><strong>Role:</strong> ' + escapeHtml(role) + '</p>' +
        '<p><strong>Submitted:</strong> ' + escapeHtml(submittedAt) + '</p>',
    })

    return jsonResponse({ success: true })
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) })
  }
}

function doOptions() {
  return jsonResponse({ success: true })
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
