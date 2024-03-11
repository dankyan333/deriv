"use client"

import { useGetQueryParams } from "./useGetQueryParams"

export type AccountsT = {
  code: string
  token: string
  isLive: boolean
  currency: string
}

export const useDerivAccount = (): AccountsT[] => {
  const derivAccounts = useGetQueryParams()
  const myDerivAccounts = []

  const derivAccountsTotal = (Object.keys(derivAccounts).length - 1) / 3
  for (let i = 1; i <= derivAccountsTotal; i++) {
    myDerivAccounts.push({
      code: derivAccounts["acct" + i],
      token: derivAccounts["token" + i],
      isLive: false,
      currency: derivAccounts["cur" + i],
    })
  }

  return myDerivAccounts
}
