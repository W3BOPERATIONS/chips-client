"use client"

import { useMemo } from "react"

const normalizePhone = (value) => (value || "").replace(/[^+\d]/g, "")

/**
 * Props:
 * - type: "phone" | "email"
 * - value: string (e.g., "+91 94283 62005" or "contact@example.com")
 * - className: optional styles passed through
 * - children: optional custom label, otherwise value is shown
 */
const ContactLink = ({ type, value, className = "", children }) => {
  // Compute the href using tel:/mailto:. This triggers the OS/browser "Pick an app" dialog.
  const href = useMemo(() => {
    if (type === "phone") return `tel:${normalizePhone(value)}`
    if (type === "email") return `mailto:${value}`
    return "#"
  }, [type, value])

  return (
    <a
      href={href}
      className={`no-underline hover:no-underline focus:no-underline active:no-underline decoration-transparent ${className}`}
      aria-label={type === "phone" ? `Call ${value}` : `Email ${value}`}
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      {children || value}
    </a>
  )
}

export default ContactLink
