"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface Trade {
  buy_price: number
  status: string
  profit: number
  contract_id: string
}

export const useMessages = ({
  messages,
  socket,
  setConnected,
  setLiveAction,
  setLiveActionClassName,
  setShowLiveActionLoader,
}: {
  messages: any
  socket: WebSocket
  setConnected: Dispatch<SetStateAction<boolean>>
  setLiveAction: Dispatch<SetStateAction<any>>
  setLiveActionClassName: Dispatch<SetStateAction<any>>
  setShowLiveActionLoader: Dispatch<SetStateAction<any>>
}) => {
  const [account, setAccount] = useState<any>()
  const [asset, setAsset] = useState<number[]>([])
  const [stopped, setStopped] = useState(true)
  const [runningTrades, setRunningTrades] = useState(0)
  const [stake, setStakeValue] = useState(0.35)
  const [trades, setTrades] = useState<Trade[]>([])
  const [takeProfit, setTakeProfit] = useState<number>(0)
  const [stopLoss, setStopLoss] = useState<number>(0)
  const [totalProfit, setTotalProfit] = useState<number>(0)
  const [totalstopsProfit, setTotalStopsProfit] = useState<number>(0)
  const [invalidInputValue, setInvalidINputValue] = useState(false)
  const [profitClass, setProfitClass] = useState<any>()

  useEffect(
    function () {
      function sendMsg(msg: any) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(msg))
        }
      }

      function calculateStops() {
        if (stopped) return
        if (takeProfit < 1 || stake < 1) return
        let newtotalProfit = trades.reduce(
          (acc, trade) => acc + trade.profit,
          0
        )
        if (newtotalProfit >= takeProfit || newtotalProfit <= -stopLoss) {
          setStopped(true)
          setTotalStopsProfit(0)
        } else {
          setStopped(false)
          setTotalStopsProfit(newtotalProfit)
        }
      }

      function calculateTotalProfit() {
        if (stopped) return
        let calctotalProfit = trades.reduce(
          (acc, trade) => acc + trade.profit,
          0
        )
        let roundedVal = parseFloat(calctotalProfit.toFixed(2))
        if (roundedVal < 0) {
          setProfitClass("dangerInfo")
        } else if (Number.isInteger(roundedVal)) {
          setProfitClass("successInfo")
          setTotalProfit(parseInt(`+${roundedVal}`))
        } else {
          setProfitClass("successInfo")
          setTotalProfit(parseFloat(`+${roundedVal}`))
        }
        setTotalProfit(roundedVal)
      }

      function analysis() {
        if (stopped) {
          setLiveAction("Start bot")
          setShowLiveActionLoader(false)
          setLiveActionClassName("warningInfo")
          return
        }
        if (runningTrades > 0) return

        setLiveAction("Waiting for trading signal")
        setShowLiveActionLoader(true)
        setLiveActionClassName("dangerInfo")

        let count = 0
        for (let digit of asset) {
          if (digit <= 3) {
            count++
          }
        }

        if (count === asset.length) {
          //open trade
          setLiveAction("Trading signal acquired, placing trade")
          setShowLiveActionLoader(true)
          setLiveActionClassName("successInfo")

          sendMsg({
            buy: 1,
            subscribe: 1,
            price: stake,
            parameters: {
              amount: stake,
              basis: "stake",
              contract_type: "DIGITOVER",
              barrier: 3,
              currency: "USD",
              duration: 1,
              duration_unit: "t",
              symbol: "1HZ100V",
            },
          })

          setRunningTrades(prevData => {
            return prevData + 1
          })
        }
      }
      switch (messages?.msg_type) {
        case "authorize":
          const authData = messages?.authorize
          setAccount((prevData: any) => {
            const { balance, currency, loginid, is_virtual } =
              messages?.authorize

            prevData = { balance, currency, loginid, is_virtual }

            return prevData
          })
          // get ticks
          sendMsg({
            ticks: "1HZ100V",
            subscribe: 1,
          })

          sendMsg({
            balance: 1,
            subscribe: 1,
          })

          setConnected(true)
          break
        case "balance":
          setAccount((prevData: any) => {
            prevData.balance = messages?.balance?.balance
            return prevData
          })
          break
        case "history":
          break
        case "tick":
          let lastOneDigit: any

          setAsset(prev => {
            const updatedAsset = [...prev]
            let newTick = String(messages?.tick.quote)

            function isPriceLengthDifferent(price: any) {
              const targetLength = "1567.81".length
              return price.toString().length !== targetLength
            }
            if (isPriceLengthDifferent(newTick)) {
              lastOneDigit = [0]
            } else {
              lastOneDigit = newTick
                .slice(-1)
                .split("")
                .map(digit => parseInt(digit))
            }

            updatedAsset.unshift(parseInt(lastOneDigit))
            if (updatedAsset.length > 3) {
              updatedAsset.pop()
            }
            // console.log(updatedAsset)
            return updatedAsset
          })

          break
        case "buy":
          break
        case "proposal_open_contract":
          const proposal = messages?.proposal_open_contract
          if (proposal?.is_sold) {
            const data = messages.proposal_open_contract
            const { status, profit, buy_price, contract_id } = data
            const newTrade: Trade = { buy_price, status, profit, contract_id }
            setTrades(prevTrades => [newTrade, ...prevTrades])
            setRunningTrades(0)
            setShowLiveActionLoader(false)

            if (status === "won") {
              setLiveAction((prevData: any) => {
                prevData = `You have ${status} +${profit} USD`
                return prevData
              })
              setLiveActionClassName("successInfo")
            }
            if (status === "lost") {
              setLiveAction((prevData: any) => {
                prevData = `You have ${status} ${profit} USD`
                return prevData
              })
              setLiveActionClassName("dangerInfo")
            }
          }
          break
        case "ping":
          break

        default:
          break
      }
      analysis()
      calculateStops()
      calculateTotalProfit()
    },
    [messages]
  )

  return {
    account,
    stopped,
    setStopped,
    stake,
    setStakeValue,
    trades,
    takeProfit,
    stopLoss,
    setTakeProfit,
    setStopLoss,
    invalidInputValue,
    setInvalidINputValue,
    totalProfit,
    setTotalProfit,
    profitClass,
    setProfitClass,
  }
}
