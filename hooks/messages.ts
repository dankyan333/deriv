const auth = {
  authorize: {
    account_list: [
      {
        account_category: "trading",
        account_type: "binary",
        broker: "CR",
        created_at: 1709295677,
        currency: "USD",
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: "svg",
        linked_to: [],
        loginid: "CR6733154",
      },
      {
        account_category: "trading",
        account_type: "binary",
        broker: "CR",
        created_at: 1709380328,
        currency: "tUSDT",
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: "svg",
        linked_to: [],
        loginid: "CR6737420",
      },
      {
        account_category: "trading",
        account_type: "binary",
        broker: "CR",
        created_at: 1709380953,
        currency: "LTC",
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: "svg",
        linked_to: [],
        loginid: "CR6737446",
      },
      {
        account_category: "trading",
        account_type: "binary",
        broker: "VRTC",
        created_at: 1709223257,
        currency: "USD",
        is_disabled: 0,
        is_virtual: 1,
        landing_company_name: "virtual",
        linked_to: [],
        loginid: "VRTC10032609",
      },
    ],
    balance: 30554.7,
    country: "ke",
    currency: "USD",
    email: "dankyan165@gmail.com",
    fullname: " ",
    is_virtual: 1,
    landing_company_fullname: "Deriv Limited",
    landing_company_name: "virtual",
    linked_to: [],
    local_currencies: { KES: { fractional_digits: 2 } },
    loginid: "VRTC10032609",
    preferred_language: "EN",
    scopes: ["read", "trade", "trading_information"],
    upgradeable_landing_companies: ["svg"],
    user_id: 14146166,
  },
  echo_req: { authorize: "<not shown>" },
  msg_type: "authorize",
}

const url =
  "http://localhost:3000/auth?acct1=CR6733154&token1=a1-OQMXWIYSKoIkbTOfmK2x0rTn1BCPy&cur1=USD&acct2=CR6737420&token2=a1-HBIP4C3RIIVTHAQA5Yyq84OrfvyBb&cur2=tUSDT&acct3=CR6737446&token3=a1-S9u0kKhS7nJEOXad9rblYSmQOCeRm&cur3=LTC&acct4=VRTC10032609&token4=a1-pH5H5It3zUz8Ud372gTH6AY5L0iU9&cur4=USD&state="

// OPEN POSITION
const open_p = {
  balance_after: 12968.57,
  buy_price: 100.35,
  contract_id: 235182732668,
  longcode:
    "Win payout if the last digit of Volatility 100 (1s) Index is strictly higher than 3 after 1 ticks.",
  payout: 164.51,
  purchase_time: 1710263524,
  shortcode: "DIGITOVER_1HZ100V_164.51_1710263524_1T_3_0",
  start_time: 1710263524,
  transaction_id: 469194892528,
}

// CLOSE POSITION
const closed_p = {
  account_id: 204552128,
  barrier: "3",
  barrier_count: 1,
  bid_price: 0,
  buy_price: 100.35,
  contract_id: 235182732668,
  contract_type: "DIGITOVER",
  currency: "USD",
  current_spot: 1571.63,
}
