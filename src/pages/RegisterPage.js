import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { API_LOCAL, API_PRODUCTION } from '../utils'
import { AuthContext } from '../context'
import { ButtonSubmit, Input, InputTitle, TitlePage, SucceedHint } from '../StyleComponents'

function LoginPage() {
const [usernameReg, setUsernameReg] = useState([])
const [passwordReg, setPasswordReg] = useState([])
const [actionSucceed, setActionSucceed] = useState(false)
const { user, setUser } = useContext(AuthContext)

Axios.defaults.withCredentials = true

const handleRegister = () => {
  Axios.post(`${API_PRODUCTION}/register`, {
    username: usernameReg,
    password: passwordReg
  }).then((response) => {
    setActionSucceed(true)
    setPasswordReg('')
    setUsernameReg('')
  })
}

// 拿到登入狀態
useEffect(() => {
  Axios.get(`${API_PRODUCTION}/login`)
  .then((response) => {
    console.log(response.data.user)
    if(response.data.user) {
      setUser(response.data.user[0])
    }
  })
}, [])

// 清除成功提示
useEffect(() => {
  if(actionSucceed) {
    const timer = setTimeout(() => {
      setActionSucceed(false)
    }, 2300);
    return () => clearTimeout(timer);
  }
}, [actionSucceed])

  return (
    <div className="App">
      <div className="registration">
        <TitlePage>註冊</TitlePage>
          <InputTitle>帳號</InputTitle>
          <Input
            type="text"
            placeholder="輸入你的帳號..."
            onChange={(e) => setUsernameReg(e.target.value)}
            value={usernameReg}
            />
          <InputTitle>密碼</InputTitle>
          <Input
            type="text"
            placeholder="輸入你的密碼..."
            onChange={(e) => setPasswordReg(e.target.value)}
            value={passwordReg}
          />
          <ButtonSubmit onClick={handleRegister}>立即註冊</ButtonSubmit>
          {actionSucceed && 
          <SucceedHint>成功註冊</SucceedHint>
          }
      </div>
    </div>
  );
}
export default LoginPage;
