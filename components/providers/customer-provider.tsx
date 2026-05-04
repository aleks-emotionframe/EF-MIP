"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface ActiveCustomer {
  id: string
  name: string
  slug: string
  industry?: string
  plan?: string
  website?: string
}

interface CustomerContextValue {
  activeCustomer: ActiveCustomer | null
  setActiveCustomer: (customer: ActiveCustomer | null) => void
  clearCustomer: () => void
}

const CustomerContext = createContext<CustomerContextValue>({
  activeCustomer: null,
  setActiveCustomer: () => {},
  clearCustomer: () => {},
})

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [activeCustomer, setActiveCustomerState] = useState<ActiveCustomer | null>(() => {
    if (typeof window === "undefined") return null
    const stored = sessionStorage.getItem("ef-active-customer")
    return stored ? JSON.parse(stored) : null
  })

  const setActiveCustomer = useCallback((customer: ActiveCustomer | null) => {
    setActiveCustomerState(customer)
    if (customer) {
      sessionStorage.setItem("ef-active-customer", JSON.stringify(customer))
    } else {
      sessionStorage.removeItem("ef-active-customer")
    }
  }, [])

  const clearCustomer = useCallback(() => {
    setActiveCustomerState(null)
    sessionStorage.removeItem("ef-active-customer")
  }, [])

  return (
    <CustomerContext.Provider value={{ activeCustomer, setActiveCustomer, clearCustomer }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  return useContext(CustomerContext)
}
