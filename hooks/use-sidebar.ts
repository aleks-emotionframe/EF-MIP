"use client"

import { useState, useCallback } from "react"

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  return { isCollapsed, toggle, setIsCollapsed }
}
