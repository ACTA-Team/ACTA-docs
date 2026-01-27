"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
    
    if (!key) {
      if (process.env.NODE_ENV === "development") {
        console.warn("PostHog: NEXT_PUBLIC_POSTHOG_KEY no está definido")
      }
      return
    }

    if (!host) {
      if (process.env.NODE_ENV === "development") {
        console.warn("PostHog: NEXT_PUBLIC_POSTHOG_HOST no está definido")
      }
      return
    }

    posthog.init(key, {
      api_host: "/ingest",
      ui_host: host,
      capture_pageview: false,
      capture_pageleave: true,
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    if (!ph || !pathname) return

    let url = window.origin + pathname
    const search = searchParams.toString()
    if (search) {
      url += "?" + search
    }

    ph.capture("$pageview", { $current_url: url })
  }, [ph, pathname, searchParams])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
