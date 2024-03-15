import React, { useState, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

interface NavSubMenuProps {
  data: any
}

const NavSubMenu: React.FC<NavSubMenuProps> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [existing_accounts, setExistingAccounts] = useState<any[]>([])

  useEffect(() => {
    const storedAccounts = sessionStorage.getItem("accounts")
    if (storedAccounts) {
      setExistingAccounts(JSON.parse(storedAccounts))
    } else {
      setExistingAccounts(data.account_list)
    }
  }, [data.account_list])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

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
        {existing_accounts.map((account: any) => (
          <li key={account.token || account.loginid}>
            {account.token ? (
              <Link href={`bot?token=${account.token}`}>
                {`${account.code} ${account.currency}`}
              </Link>
            ) : (
              <span>{`${account.loginid} ${account.currency}`}</span>
            )}
          </li>
        ))}
        <LogoutButton></LogoutButton>
      </ul>
    </nav>
  )
}

export default NavSubMenu
