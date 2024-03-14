import React, { useState, useEffect } from "react"
import { AccountsT, useDerivAccount } from "@/hooks/useDerivAccount"
import Link from "next/link"

interface NavSubMenuProps {
  data: any
}

const NavSubMenu: React.FC<NavSubMenuProps> = ({ data }) => {
  const derivAccount = useDerivAccount()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [allaccounts, setAllAccounts] = useState<AccountsT[]>([])

  useEffect(() => {
    if (derivAccount) {
      setAllAccounts(derivAccount)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  console.log(allaccounts)

  let existing_accounts =
    allaccounts.length === 0 ? data.account_list : allaccounts

  return (
    <nav className='navMenu'>
      <label htmlFor='navTitleText' onClick={toggleMenu}>
        <div className='navTitleText'>
          {data.loginid} ({data.currency})
        </div>
      </label>

      <ul
        id='navContainer'
        className={`navDropMenu ${isMenuOpen ? "show" : ""}`}
      >
        <div className='navMenuTitle'>My Accounts</div>
        {existing_accounts.map((account: any) => {
          if (account.token) {
            const url = `bot?token=${account.token}`
            return (
              <li key={account.code}>
                <Link href={url}>
                  {account.code} {account.currency}
                </Link>
              </li>
            )
          } else {
            return (
              <li key={account.loginid}>
                {account.loginid} {account.currency}
              </li>
            )
          }
        })}
      </ul>
    </nav>
  )
}

export default NavSubMenu
