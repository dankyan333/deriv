"use client"
import { myPref } from "@/lib/Preferences"
import { useEffect, useState } from "react"
// ZeYLjTYs5piyvUa
export const useWebsokets = ({ token }: { token: string }) => {
  const [messages, setMessages] = useState()
  const [account, setAccount] = useState<any>()
  const [connected, setConnected] = useState(false)

  useEffect(function () {
    let socket = new WebSocket(`${myPref.wsUrl}${myPref.appId}`)

    socket.onopen = function (e) {
      socket.send(
        JSON.stringify({
          authorize: token,
        })
      )

      socket.send(
        JSON.stringify({
          ping: 1,
        })
      )

      setInterval(function () {
        socket.send(
          JSON.stringify({
            ping: 1,
          })
        )
      }, 15000)
    }

    socket.onmessage = function (event) {
      const message = JSON.parse(event.data)
      setMessages(message)

      switch (message.msg_type) {
        case "authorize":
          const authData = message?.authorize
          setAccount((prevData: any) => {
            const { balance, currency, loginid, is_virtual } =
              message?.authorize

            prevData = { balance, currency, loginid, is_virtual }

            return prevData
          })
          setConnected(true)
          break

        default:
          break
      }
    }

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        )
      } else {
        console.log("[close] Connection died")
      }
    }

    socket.onerror = function (error) {
      console.log(error)
    }
  }, [])

  return { connected, messages, account }
}
