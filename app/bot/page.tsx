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
  const { connected, messages, account } = useWebsokets({ token })

  const {} = useMessages({ messages })

  if (!connected) {
    return <>Loading...</>
  }

  return (
    <>
      {/* {JSON.stringify(messages)} */}
      <div className='flex flex-col'>
        <li>Balance {account?.balance}</li>
      </div>
    </>
  )
}

export default page
