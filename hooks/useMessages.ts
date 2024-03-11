"use client"
import { useEffect, useState } from "react"

export const useMessages = ({ messages }: { messages: any }) => {
  useEffect(
    function () {
      switch (messages?.msg_type) {
        case "authorize":
          break
        case "history":
          break
        case "tick":
          break
        case "buy":
          break
        case "proposal_open_contract":
          break
        case "ping":
          break

        default:
          break
      }
    },
    [messages]
  )

  return {}
}
