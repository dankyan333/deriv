"use client"
import { useGetQueryParams } from "@/hooks/useGetQueryParams"
import { useMessages } from "@/hooks/useMessages"
import { useWebsokets } from "@/hooks/useWebsokets"
import { Suspense } from "react"

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

  if (!connected) {
    return <>Loading...</>
  }

  return (
    <>
      {/* {JSON.stringify(messages)} */}
      <div className='flex flex-col'>
        <li>Balance {account?.balance}</li>
      </div>

      <button
        className='px-3 py-2 bg-blue-800'
        onClick={() => {
          setStopped(prevData => !prevData)
        }}
      >
        {stopped ? "start" : "stop"}
      </button>
    </>
  )
}

export default page
