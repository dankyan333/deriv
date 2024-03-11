"use client"
import { myPref } from "@/lib/Preferences"
import { useEffect, useState } from "react"
// ZeYLjTYs5piyvUa
export const useWebsokets = ({ token }: { token: string }) => {
  const [messages, setMessages] = useState()
  const [connected, setConnected] = useState(false)
  const [socket, setSocket] = useState<any>()

  useEffect(
    function () {
      let ws = new WebSocket(`${myPref.wsUrl}${myPref.appId}`)

      ws.onopen = function (e) {
        ws.send(
          JSON.stringify({
            authorize: token,
          })
        )

        ws.send(
          JSON.stringify({
            ping: 1,
          })
        )

        setInterval(function () {
          ws.send(
            JSON.stringify({
              ping: 1,
            })
          )
        }, 15000)
      }

      ws.onmessage = function (event) {
        const message = JSON.parse(event.data)
        setMessages(message)
      }

      ws.onclose = function (event) {
        if (event.wasClean) {
          console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
          )
        } else {
          console.log("[close] Connection died")
        }
      }

      ws.onerror = function (error) {
        console.log(error)
      }

      setSocket(ws)
    },
    [token]
  )

  return { connected, setConnected, messages, socket }
}
