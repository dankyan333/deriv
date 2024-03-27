"use client"
import { connected } from "process"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  fifthStrategy,
  firstStrategy,
  fourthStrategy,
  secondStrategy,
} from "./useStrategy"

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
  setToastMessage,
  setToastType,
}: {
  messages: any
  socket: WebSocket
  setConnected: Dispatch<SetStateAction<boolean>>
  setLiveAction: Dispatch<SetStateAction<any>>
  setLiveActionClassName: Dispatch<SetStateAction<any>>
  setShowLiveActionLoader: Dispatch<SetStateAction<any>>
  setToastMessage: Dispatch<SetStateAction<any>>
  setToastType: Dispatch<SetStateAction<any>>
}) => {
  const [account, setAccount] = useState<any>()
  const [asset, setAsset] = useState<number[]>([])
  const [stopped, setStopped] = useState(true)
  const [runningTrades, setRunningTrades] = useState(0)
  const [stake, setStakeValue] = useState(0.35)
  const [stakes, setStakes] = useState<number[]>([])
  const [defaultStake, setDefaultStake] = useState(0.35)
  const [trades, setTrades] = useState<Trade[]>([])
  const [faketrades, setFakeTrades] = useState<Trade[]>([])
  const [takeProfit, setTakeProfit] = useState<number>(0)
  const [stopLoss, setStopLoss] = useState<number>(0)
  const [totalProfit, setTotalProfit] = useState<number>(0)
  const [totalstopsProfit, setTotalStopsProfit] = useState<number>(0)
  const [invalidInputValue, setInvalidINputValue] = useState(false)
  const [profitClass, setProfitClass] = useState<any>()
  const [martingale, setMartingale] = useState<boolean>(false)
  const [strategy, setStrategy] = useState<any>("first")
  const [strategyarray, setStrategyArray] = useState<number>(2)
  const [symbol, setSymbol] = useState<any>("1HZ100V")
  useEffect(
    function () {
      function sendMsg(msg: any) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(msg))
        }
      }
      function trimToTwoDecimals(number: any) {
        const roundedNum = parseFloat(number.toFixed(2))
        return roundedNum
      }
      function calculateProfit(stopLoss = 0, takeProfit = 0) {
        if (stopped) return
        if (stopLoss === 0 && takeProfit === 0) {
          return
        }
        setTotalStopsProfit(
          faketrades.reduce((acc, trade) => acc + trade.profit, 0)
        )
        if (stopLoss !== 0 && totalstopsProfit <= -stopLoss) {
          setStakeValue(defaultStake)
          setStopped(true)
          setTotalStopsProfit(0)
          setFakeTrades([])
          setToastMessage(
            `Stop Loss ${trimToTwoDecimals(totalstopsProfit)} USD`
          )
          setToastType("error")
          return
        }
        if (takeProfit !== 0 && totalstopsProfit >= takeProfit) {
          setStakeValue(defaultStake)
          setStopped(true)
          setTotalStopsProfit(0)
          setFakeTrades([])
          setToastMessage(
            `Take Profit +${trimToTwoDecimals(totalstopsProfit)} USD`
          )
          setToastType("success")
          return
        }
      }
      function calculateTotalProfit() {
        const calctotalProfit = trades.reduce(
          (acc, trade) => acc + trade.profit,
          0
        )
        const roundedVal = parseFloat(calctotalProfit.toFixed(2))
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
        if (strategy === "first") {
          setStrategyArray(2)
          setSymbol("1HZ100V")
        } else if (strategy === "second") {
          setStrategyArray(2)
          setSymbol("1HZ100V")
        } else if (strategy === "fourth") {
          setStrategyArray(2)
          setSymbol("1HZ100V")
        } else if (strategy === "fifth") {
          setStrategyArray(1)
          setSymbol("1HZ100V")
        }
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
        if (strategy === "first") {
          firstStrategy(
            stopped,
            runningTrades,
            asset,
            setLiveAction,
            setShowLiveActionLoader,
            setLiveActionClassName,
            setRunningTrades,
            setStakes,
            stake,
            sendMsg,
            setDefaultStake
          )
        } else if (strategy === "second") {
          secondStrategy(
            stopped,
            runningTrades,
            asset,
            setLiveAction,
            setShowLiveActionLoader,
            setLiveActionClassName,
            setRunningTrades,
            setStakes,
            stake,
            sendMsg,
            setDefaultStake
          )
        } else if (strategy === "fourth") {
          fourthStrategy(
            stopped,
            runningTrades,
            asset,
            setLiveAction,
            setShowLiveActionLoader,
            setLiveActionClassName,
            setRunningTrades,
            setStakes,
            stake,
            sendMsg,
            setDefaultStake
          )
        } else if (strategy === "fifth") {
          fifthStrategy(
            stopped,
            runningTrades,
            asset,
            setLiveAction,
            setShowLiveActionLoader,
            setLiveActionClassName,
            setRunningTrades,
            setStakes,
            stake,
            sendMsg,
            setDefaultStake
          )
        }
      }
      function startMartingale(status: string) {
        if (!martingale) return
        switch (status) {
          case "won":
            setStakeValue(defaultStake)
            break
          case "lost":
            const newStake = stake * 2
            setStakeValue(newStake)
            break
          default:
            break
        }
      }
      switch (messages?.msg_type) {
        case "authorize":
          const authData = messages?.authorize
          setAccount((prevData: any) => {
            const { balance, currency, loginid, is_virtual, account_list } =
              messages?.authorize

            prevData = { balance, currency, loginid, is_virtual, account_list }
            return prevData
          })
          // get ticks
          sendMsg({
            ticks: symbol,
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
          let currentArrayToBeUsed = strategyarray
          let lastOneDigit: any
          setAsset(prevAsset => {
            const updatedAsset = [...prevAsset]
            let newTick = String(messages?.tick.quote)
            function isPriceLengthDifferent(price: any) {
              const targetLength = "1111.11".length
              return price.toString().length !== targetLength
            }
            if (isPriceLengthDifferent(newTick)) {
              lastOneDigit = 0
            } else {
              lastOneDigit = parseInt(newTick.slice(-1))
            }
            updatedAsset.unshift(lastOneDigit)
            if (updatedAsset.length > currentArrayToBeUsed) {
              while (updatedAsset.length > currentArrayToBeUsed) {
                updatedAsset.pop()
              }
            }
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
            setFakeTrades(prevTrades => [newTrade, ...prevTrades])
            setRunningTrades(0)
            setShowLiveActionLoader(false)
            if (status === "won") {
              startMartingale(status)
              setLiveAction((prevData: any) => {
                prevData = `You have ${status} +${profit} USD`
                return prevData
              })
              setLiveActionClassName("successInfo")
            }
            if (status === "lost") {
              startMartingale(status)
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
      calculateProfit(stopLoss, takeProfit)
      calculateTotalProfit()
    },
    [messages, strategy, strategyarray, totalstopsProfit, symbol]
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
    martingale,
    setMartingale,
    defaultStake,
    setDefaultStake,
    setStakes,
    stakes,
    setStrategy,
    setSymbol,
  }
}
