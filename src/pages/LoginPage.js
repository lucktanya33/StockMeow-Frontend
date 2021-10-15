import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { API_LOCAL } from '../utils'
import { AuthContext, FavContext } from '../context'
import { ButtonSubmit, Input, InputTitle, TitlePage } from '../StyleComponents'

function LoginPage() {
// setting
Axios.defaults.withCredentials = true

// states
const [username, setUsername] = useState([])
const [password, setPassword] = useState([])

const [errMessageLogin, setErrMessageLogin] = useState('')

const { user, setUser } = useContext(AuthContext)
const { myFav, setMyFav } = useContext(FavContext)


const handleLogin = () => {
  // 登入
  Axios.post(`${API_LOCAL}/login`, {
    username: username,
    password: password
  }, {
    headers: {"Content-Type": "application/json; charset=utf-8"}
  }).then((response) => {
    if (response.data.message) {
      setErrMessageLogin(response.data.message)
    } else {
      console.log(response);
      setUser(response.data[0])
      getFav()
    }
  })
}

const getFav = () => {
  Axios.get(`${API_LOCAL}/my-fav`).then(
    (response) => {
      const dataArray = response.data
      const favStockData = dataArray.map(item => item.stock_code)
      console.log(favStockData);
      setMyFav(favStockData)
    })  
}

const clearErrorHint = () => {
  setErrMessageLogin('')
}

// 拿到登入狀態
useEffect(() => {
  Axios.get(`${API_LOCAL}/login`)
  .then((response) => {
    console.log(response.data.user)
    if(response.data.user) {
      setUser(response.data.user[0])
    }
  })
}, [])

  return (
    <div className="App">
      <div className="login">
      <TitlePage>登入</TitlePage>
          <InputTitle>帳號</InputTitle>
          <Input
            type="text"
            placeholder="輸入你的帳號..."
            onChange={(e) => setUsername(e.target.value)}
            onFocus={clearErrorHint}          
            />
          <InputTitle>密碼</InputTitle>
          <Input
            type="text"
            placeholder="輸入你的密碼..."
            onChange={(e) => setPassword(e.target.value)} 
            onFocus={clearErrorHint}           
            />
          <ButtonSubmit onClick={handleLogin}> 立刻登入 </ButtonSubmit> 
        <h1>{errMessageLogin}</h1>
        {user && <h1>登入狀態：{user.username}</h1>}
      </div>    
    </div>
  );
}
export default LoginPage;
