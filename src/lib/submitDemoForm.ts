const FORM_ENDPOINT = import.meta.env.VITE_DEMO_FORM_URL as string | undefined
const FORM_EMAIL = 'kavidhasan.m@carepay.money'
const FORM_CC = 'gaurav@carepay.money,nikhil@aarogya-pay.com'

export type DemoFormPayload = {
  businessName: string
  city: string
  mobileNumber: string
  role: string
}

export async function submitDemoForm({ businessName, city, mobileNumber, role }: DemoFormPayload) {
  if (FORM_ENDPOINT) {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        businessName,
        city,
        mobileNumber,
        role,
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Form submission failed')
    }

    const result = (await response.json()) as { success?: boolean; error?: string }
    if (result.success === false) {
      throw new Error(result.error ?? 'Form submission failed')
    }

    return
  }

  const response = await fetch(`https://formsubmit.co/ajax/${FORM_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      business_name: businessName,
      city,
      mobile_number: mobileNumber,
      role,
      _subject: 'New Lumen demo request',
      _template: 'table',
      _captcha: 'false',
      _cc: FORM_CC,
    }),
  })

  if (!response.ok) {
    throw new Error('Form submission failed')
  }
}
