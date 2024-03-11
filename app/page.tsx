import { myPref } from "@/lib/Preferences"
import Link from "next/link"

export default function Home() {
  return (
    <div className='h-screen flex flex-col gap-2 justify-center items-center'>
      <div className='shadow-lg border-b border-slate-600 w-full absolute top-0  bg-slate-900 text-center py-4'>
        gdhdg
      </div>
      <form
        action='/bot'
        className='flex flex-col gap-2 px-3 py-4 w-[90%] md:w-auto bg-white'
      >
        <div className='flex flex-col'>
          <label htmlFor='token'>Token</label>
          <input
            className='px-3 py-2 border border-blue-800 text-blue-800'
            type='text'
            name='token'
          />
        </div>
        <div className='flex justify-center'>
          <button className='px-3 py-2 bg-red-500' type='submit'>
            Submit
          </button>
        </div>
      </form>

      <Link className='' href={`${myPref.httpUrl}${myPref.appId}`}>
        Continue with deriv
      </Link>
    </div>
  )
}
