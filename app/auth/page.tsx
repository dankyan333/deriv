"use client"

import { AccountsT, useDerivAccount } from "@/hooks/useDerivAccount"
import Link from "next/link"
import React, { Suspense, useState } from "react"

const Page = () => {
  return (
    <>
      <Suspense>
        <DerivAccounts></DerivAccounts>
      </Suspense>
    </>
  )
}

const DerivAccounts = () => {
  const DerivAccounts = useDerivAccount()
  const [accounts, setAccounts] = useState<AccountsT[]>(DerivAccounts)

  if (accounts.length === 0) {
    return <div className=''> Loading...</div>
  }

  return (
    <>
      <div>Choose Account</div>

      <div className='accountCardContainer'>
        {accounts.map((account: any) => {
          const url = `bot?token=${account.token}`
          return (
            <Link key={account.code} href={url}>
              <div className='accountCard'>
                <div className='accountCardType'></div>
                <div className='accountCardBalanceInfo'>
                  {account.code} {account.currency}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Page
