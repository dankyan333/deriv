"use client"

import { useGetQueryParams } from "@/hooks/useGetQueryParams"
import { useLiveActionMessage } from "@/hooks/useLiveActionMessage"
import { useMessages } from "@/hooks/useMessages"
import { useWebsokets } from "@/hooks/useWebsokets"
import { ChangeEvent, Suspense } from "react"

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

  const {
    liveAction,
    liveActionClassName,
    showLiveActionLoader,
    setLiveAction,
    setLiveActionClassName,
    setShowLiveActionLoader,
  } = useLiveActionMessage()

  const { account, stopped, setStopped, stake, setStakeValue, trades } =
    useMessages({
      messages,
      socket,
      setConnected,
      setLiveAction,
      setLiveActionClassName,
      setShowLiveActionLoader,
    })

  const handleStakeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let stakeValue = event.target.valueAsNumber
    if (!stakeValue) {
      setLiveAction("Stake is empty!")
      setLiveActionClassName("dangerInfo")
      return
    }
    if (stakeValue < 0.34) {
      setLiveAction("Minimum stake is 0.35 USD")
      setLiveActionClassName("dangerInfo")
      return
    }
    if (stakeValue > 1000) {
      setLiveAction("Maximum stake is 1000 USD")
      setLiveActionClassName("dangerInfo")
      return
    }
    setStakeValue(stakeValue)
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
            <div className={`liveOutcome ${liveActionClassName}`}>
              {liveAction}
              {showLiveActionLoader ? (
                <div className='dot-windmill'></div>
              ) : null}
            </div>
          </div>
          <div className='tradeHistory'>
            <div className='tradeHistoryTitle'>All Trades</div>
            <div className='tradeHistoryHeading'>
              <div className='tradeHistoryHeading1'>Bet USD</div>
              <div className='tradeHistoryHeading2'>Payout</div>
            </div>
            {trades.length === 0 ? (
              <div className='tradeHistoryInfo3 pendingTradeInfo'>
                No trades
              </div>
            ) : (
              trades.map((trade: any) => (
                <div
                  key={trade.contract_id}
                  className={`tradeHistoryInfo ${
                    trade.status === "won" ? "wonTradeInfo" : "lostTradeInfo"
                  }`}
                >
                  <div className='tradeHistoryInfo1'>
                    {trade.buy_price.toFixed(2)}
                  </div>
                  <div className='tradeHistoryInfo2'>
                    {trade.profit.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <form className='stakeForm'>
          <label className='stakeLabel' htmlFor='stake'>
            Stake
          </label>
          <input
            readOnly={!stopped}
            value={stake}
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
              if (account?.balance < stake) {
                setLiveAction("Insufficient balance")
                setLiveActionClassName("dangerInfo")
                setStopped(true)
                return
              }
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
