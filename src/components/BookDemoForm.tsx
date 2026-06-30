import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { submitDemoForm } from '../lib/submitDemoForm'

type FieldName = 'businessName' | 'city' | 'mobileNumber' | 'role'
type FieldErrors = Partial<Record<FieldName, string>>

const fields: {
  name: FieldName
  label: string
  placeholder: string
  type: string
  autoComplete: string
}[] = [
  {
    name: 'businessName',
    label: 'Business name',
    placeholder: 'e.g. Nova Aesthetics',
    type: 'text',
    autoComplete: 'organization',
  },
  {
    name: 'city',
    label: 'City',
    placeholder: 'e.g. Bengaluru',
    type: 'text',
    autoComplete: 'address-level2',
  },
  {
    name: 'mobileNumber',
    label: 'Mobile number',
    placeholder: 'e.g. +91 98765 43210',
    type: 'tel',
    autoComplete: 'tel',
  },
  {
    name: 'role',
    label: 'Your role',
    placeholder: 'e.g. Clinic owner, Sales head',
    type: 'text',
    autoComplete: 'organization-title',
  },
]

function validateFields(values: Record<FieldName, string>): FieldErrors {
  const errors: FieldErrors = {}

  if (!values.businessName.trim()) {
    errors.businessName = 'Business name is required.'
  }
  if (!values.city.trim()) {
    errors.city = 'City is required.'
  }
  if (!values.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required.'
  }
  if (!values.role.trim()) {
    errors.role = 'Your role is required.'
  }

  return errors
}

export function BookDemoForm() {
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [role, setRole] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const values: Record<FieldName, string> = {
    businessName,
    city,
    mobileNumber,
    role,
  }

  const setters: Record<FieldName, (value: string) => void> = {
    businessName: setBusinessName,
    city: setCity,
    mobileNumber: setMobileNumber,
    role: setRole,
  }

  const clearFieldError = (name: FieldName) => {
    setFieldErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    const trimmed = {
      businessName: businessName.trim(),
      city: city.trim(),
      mobileNumber: mobileNumber.trim(),
      role: role.trim(),
    }

    const errors = validateFields(trimmed)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setStatus('submitting')

    try {
      await submitDemoForm(trimmed)
      setStatus('success')
      setBusinessName('')
      setCity('')
      setMobileNumber('')
      setRole('')
    } catch {
      setStatus('idle')
      setSubmitError('Something went wrong. Please try again or email kavidhasan.m@carepay.money.')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="demo-form-panel demo-form-success mt-8"
      >
        <p className="font-display text-ink text-xl md:text-2xl">You&apos;re on the list.</p>
        <p className="cta-funnel__subtext mt-3 text-sm leading-relaxed md:text-base">
          Thanks for reaching out — we&apos;ll be in touch shortly to schedule a demo.
        </p>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="demo-form demo-form-panel mt-8 text-left"
    >
      <div className="space-y-3">
        {fields.map((field) => {
          const error = fieldErrors[field.name]
          const errorId = `${field.name}-error`

          return (
            <label key={field.name} className="demo-form__field block">
              <span className="demo-form__label">{field.label}</span>
              <input
                type={field.type}
                name={field.name}
                value={values[field.name]}
                onChange={(event) => {
                  setters[field.name](event.target.value)
                  clearFieldError(field.name)
                }}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                required
                disabled={status === 'submitting'}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`demo-form__input ${error ? 'demo-form__input--error' : ''}`}
              />
              {error && (
                <p id={errorId} className="demo-form__field-error mt-1.5 text-xs" role="alert">
                  {error}
                </p>
              )}
            </label>
          )
        })}
      </div>

      {submitError && (
        <p className="demo-form__error mt-3 text-sm" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="btn-white mt-5 w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Book a demo'}
      </button>
    </form>
  )
}
