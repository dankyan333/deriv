"use client"
import { subscribe } from "diagnostics_channel"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export const useMessages = ({
  messages,
  socket,
  setConnected,
}: {
  messages: any
  socket: WebSocket
  setConnected: Dispatch<SetStateAction<boolean>>
}) => {
  const [account, setAccount] = useState<any>()
  const [asset, setAsset] = useState<number[]>([])
  const [stopped, setStopped] = useState(true)
  const [runningTrades, setRunningTrades] = useState(0)

  useEffect(
    function () {
      function sendMsg(msg: any) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(msg))
        }
      }

      function analysis() {
        if (stopped) return
        if (runningTrades > 0) return

        let count = 0
        for (let digit of asset) {
          if (digit <= 3) {
            count++
          }
        }
        console.log("analysing")

        if (count === asset.length) {
          //open trade
          console.log("signal acquired")

          sendMsg({
            buy: 1,
            subscribe: 1,
            price: 1000,
            parameters: {
              amount: 1000,
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
          setAsset(prev => {
            const newAsset = [...prev]
            let newTick = String(messages?.tick.quote)
            newAsset.unshift(parseInt(newTick[newTick.length - 1]))
            if (newAsset.length > 3) {
              newAsset.pop()
            }
            return newAsset
          })
          break
        case "buy":
          console.log(messages?.buy)
          break
        case "proposal_open_contract":
          const proposal = messages?.proposal_open_contract
          if (proposal?.is_sold) {
            setRunningTrades(0)
          }
          break
        case "ping":
          break

        default:
          break
      }
      analysis()
    },
    [messages]
  )

  return { account, stopped, setStopped }
}
