import React, { useEffect } from "react"

interface SettingsProps {
  data: any
  setMartingaleState: (newValue: boolean) => void
  setToastMessage: (newValue: any) => void
  setToastType: (newValue: any) => void
  martingale: boolean
  socket: WebSocket
  loginid: any
}

const Settings: React.FC<SettingsProps> = ({
  data,
  setMartingaleState,
  setToastMessage,
  setToastType,
  martingale,
  socket,
  loginid,
}) => {
  function getAccountType(code: any) {
    let type

    let str = code
    let trimmedStr = str.substring(0, 2)
    if (trimmedStr === "CR") {
      return (type = "Real")
    }
    if (trimmedStr === "VR") {
      return (type = "Demo")
    }
    return (type = "Unknown")
  }

  function getAccountTypeClass(code: any) {
    let cssClass

    let str = code
    let trimmedStr = str.substring(0, 2)
    if (trimmedStr === "CR") {
      return (cssClass = "successInfo")
    }
    if (trimmedStr === "VR") {
      return (cssClass = "warningInfo")
    }
  }
  const handleOncheckedMartingale = () => {
    if (!martingale) {
      setMartingaleState(true)
      setToastMessage("Martingale enabled")
      setToastType("success")
    } else {
      setMartingaleState(false)
      setToastMessage("Martingale disabled")
      setToastType("info")
    }
  }

  function sendMsg(msg: any) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg))
    }
  }

  const handleBalanceResetBtn = () => {
    sendMsg({
      topup_virtual: 1,
      loginid: loginid,
    })
  }

  return (
    <div className='settingsContainer'>
      <div className='settingHeader'>Settings</div>

      <div className='accountInfo'>
        <div className={`accountTypeInfo ${getAccountTypeClass(data.loginid)}`}>
          {getAccountType(data.loginid)}
          {getAccountType(data.loginid) === "Demo" ? (
            <div
              typeof='button'
              className='resetBalBtn'
              onClick={handleBalanceResetBtn}
            >
              Reset Balance
            </div>
          ) : null}
        </div>

        <div className='accountIdInfo dangerInfo'>
          {data.loginid} ({data.currency})
        </div>
      </div>

      <div className='settingsContainerTitle'>Positions Protection</div>

      <div className='settingsList1 displayRow'>
        <h3 className='settingsListSubTitle'>Martingale</h3>
        <section className='slider-checkbox'>
          <input type='checkbox' id='c2' onChange={handleOncheckedMartingale} />
          <label htmlFor='Martingale'></label>
        </section>
      </div>
    </div>
  )
}

export default Settings
