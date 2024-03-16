"use client"

import { Dispatch, SetStateAction } from "react"

export function firstStrategy(
  stopped: boolean,
  runningTrades: number,
  asset: number[],
  setLiveAction: Dispatch<SetStateAction<any>>,
  setShowLiveActionLoader: Dispatch<SetStateAction<any>>,
  setLiveActionClassName: Dispatch<SetStateAction<any>>,
  setRunningTrades: Dispatch<SetStateAction<number>>,
  setStakes: Dispatch<SetStateAction<number[]>>,
  stake: number,
  sendMsg: (msg: any) => void,
  setDefaultStake: Dispatch<SetStateAction<number>>
) {
  const count = asset.filter(digit => digit <= 3).length

  if (count === asset.length) {
    setLiveAction("Trading signal acquired, placing trade")
    setShowLiveActionLoader(true)
    setLiveActionClassName("successInfo")

    // Send message to initiate trade
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

    // Update running trades count
    setRunningTrades(prevData => prevData + 1)

    // Update stakes
    setStakes(prev => {
      const updatedStake = [...prev]
      updatedStake.unshift(stake)
      const firststake = updatedStake[updatedStake.length - 1]
      setDefaultStake(firststake)
      if (stopped) {
        setStakes([])
      }
      return updatedStake
    })
  }
}

export function secondStrategy(
  stopped: boolean,
  runningTrades: number,
  asset: number[],
  setLiveAction: Dispatch<SetStateAction<any>>,
  setShowLiveActionLoader: Dispatch<SetStateAction<any>>,
  setLiveActionClassName: Dispatch<SetStateAction<any>>,
  setRunningTrades: Dispatch<SetStateAction<number>>,
  setStakes: Dispatch<SetStateAction<number[]>>,
  stake: number,
  sendMsg: (msg: any) => void,
  setDefaultStake: Dispatch<SetStateAction<number>>
) {
  const count = asset.filter(digit => digit <= 3).length

  if (count === asset.length) {
    // Strategy condition met, execute the strategy
    setLiveAction("Trading signal acquired, placing trade")
    setShowLiveActionLoader(true)
    setLiveActionClassName("successInfo")

    // Send message to initiate trade
    sendMsg({
      buy: 1,
      subscribe: 1,
      price: stake,
      parameters: {
        amount: stake,
        basis: "stake",
        contract_type: "DIGITOVER",
        barrier: 1,
        currency: "USD",
        duration: 1,
        duration_unit: "t",
        symbol: "1HZ100V",
      },
    })

    // Update running trades count
    setRunningTrades(prevData => prevData + 1)

    // Update stakes
    setStakes(prev => {
      const updatedStake = [...prev]
      updatedStake.unshift(stake)
      const firststake = updatedStake[updatedStake.length - 1]
      setDefaultStake(firststake)
      if (stopped) {
        setStakes([])
      }
      return updatedStake
    })
  }
}

export function thirdStrategy(
  stopped: boolean,
  runningTrades: number,
  asset: number[],
  setLiveAction: Dispatch<SetStateAction<any>>,
  setShowLiveActionLoader: Dispatch<SetStateAction<any>>,
  setLiveActionClassName: Dispatch<SetStateAction<any>>,
  setRunningTrades: Dispatch<SetStateAction<number>>,
  setStakes: Dispatch<SetStateAction<number[]>>,
  stake: number,
  sendMsg: (msg: any) => void,
  setDefaultStake: Dispatch<SetStateAction<number>>
) {
  const count = asset.filter(digit => digit === 6).length

  if (count === asset.length) {
    setLiveAction("Trading signal acquired, placing trade")
    setShowLiveActionLoader(true)
    setLiveActionClassName("successInfo")

    // Send message to initiate trade
    sendMsg({
      buy: 1,
      subscribe: 1,
      price: stake,
      parameters: {
        amount: stake,
        basis: "stake",
        contract_type: "DIGITOVER",
        barrier: 6,
        currency: "USD",
        duration: 1,
        duration_unit: "t",
        symbol: "1HZ100V",
      },
    })

    // Update running trades count
    setRunningTrades(prevData => prevData + 1)

    // Update stakes
    setStakes(prev => {
      const updatedStake = [...prev]
      updatedStake.unshift(stake)
      const firststake = updatedStake[updatedStake.length - 1]
      setDefaultStake(firststake)
      if (stopped) {
        setStakes([])
      }
      return updatedStake
    })
  }
}
