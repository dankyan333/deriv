"use client"
import { useGetQueryParams } from "@/hooks/useGetQueryParams"
import { useMessages } from "@/hooks/useMessages"
import { useWebsokets } from "@/hooks/useWebsokets"
import { ChangeEvent, Suspense, useState } from "react"

const page = () => {
  return (
    <Suspense>
      <GetToken></GetToken>
    </Suspense>
  )
}

const GetToken = () => {
  const { token } = useGetQueryParams()
  const { connected, setConnected, messages, socket } = useWebsokets({
    token,
  })

  const { account, stopped, setStopped } = useMessages({
    messages,
    socket,
    setConnected,
  })

  const [value, setValue] = useState(0.35)
  const handleStakeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.valueAsNumber)
  }

  if (!connected) {
    return (
      <div className='mainContainer font-sans'>
        <div className='loaderText'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='mainContainer font-sans'>
      <div className='topNavCard'>
        <li className='balInfo'>
          {account?.balance} {account?.currency}
        </li>
      </div>

      <div className='flexWrap'>
        <div className='tradeActivityContainer'>
          <div className='liveActivity'>
            <div className='liveOutcome successInfo'>You ahve +639.01</div>
          </div>
          <div className='tradeHistory'>
            <div className='tradeHistoryTitle'>All Trades</div>
            <div className='tradeHistoryHeading'>
              <div className='tradeHistoryHeading1'>Bet USD</div>
              <div className='tradeHistoryHeading2'>Payout</div>
            </div>
            <div className='tradeHistoryInfo pendingTradeInfo'>
              <div className='tradeHistoryInfo1'>1000.00</div>
              <div className='tradeHistoryInfo2'>1639.01</div>
            </div>
            <div className='tradeHistoryInfo wonTradeInfo'>
              <div className='tradeHistoryInfo1'>1000.00</div>
              <div className='tradeHistoryInfo2'>1639.01</div>
            </div>
            <div className='tradeHistoryInfo lostTradeInfo'>
              <div className='tradeHistoryInfo1'>1000.00</div>
              <div className='tradeHistoryInfo2'>1639.01</div>
            </div>
          </div>
        </div>

        <form className='stakeForm'>
          <label className='stakeLabel' htmlFor='stake'>
            Stake
          </label>
          <input
            value={value}
            onChange={handleStakeInputChange}
            className='stakeInput'
            type='number'
            name='stake'
            id='stake'
          />
          <button
            type='button'
            className={stopped ? "successButton" : "warningButton"}
            onClick={() => {
              setStopped(prevData => !prevData)
            }}
          >
            {stopped ? "Start" : "Stop"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default page
