import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { API_LOCAL, API_PRODUCTION } from '../utils'
import { AuthContext, FavContext, Fav2Context } from '../context'
import { ButtonSubmit, Input, InputTitle, TitlePage, ErrorHint, SucceedHint } from '../StyleComponents'

function LoginPage() {
// setting
Axios.defaults.withCredentials = true

// states
const [username, setUsername] = useState(null)
const [password, setPassword] = useState(null)
const [actionSucceed, setActionSucceed] = useState(false)
// states-error
const [error, setError] = useState([
  {status: 0,
  type: '',
  message: ''
  }
])
const [errorGetFav, setErrorGetFav] = useState(null)

const { user, setUser } = useContext(AuthContext)
const { myFav, setMyFav } = useContext(FavContext)
const { myFav2, setMyFav2 } = useContext(Fav2Context)

const [userFE, setUserFE] = useState(null) 

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

// 登入後拿fav
useEffect(() => {
  if (user) {
    getFav2()
  }
}, [user])

// 清除成功提示
useEffect(() => {
  if(actionSucceed) {
    console.log('hi');
    const timer = setTimeout(() => {
      setActionSucceed(false)
    }, 2300);
    return () => clearTimeout(timer);
  }
}, [actionSucceed])

const handleLogin = () => {
  // 檢查空值
  if (!username || !password) {
    setError({
      status: 1,
      type: 'empty',
      message: '填寫未完全'
    })
    return
  }
  // 登入
  Axios.post(`${API_PRODUCTION}/login`, {
    username: username,
    password: password
  }, {
    headers: {"Content-Type": "application/json; charset=utf-8"}
  }).then((response) => {
    if (response.data.message) {
      setError({
        status: 1,
        type: 'post',
        message: '帳號或密碼錯誤'
      })
    } else {
      console.log('response', response);
      setUserFE(username)
      setUser(response.data[0])
      setActionSucceed(true)
      setUsername('')
      setPassword('')
      //getFav()
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

const getFav2 = () => {
  Axios.post(`${API_PRODUCTION}/my-fav2`, {
    username: user.username,
    password: password
  }, {
    headers: {"Content-Type": "application/json; charset=utf-8"}
  }).then((response) => {
    if (response.data.message) {
      setErrorGetFav(response.data.message)
    } else {
      console.log('post my fav2', response);
      setMyFav2(response.data)
    }
  })
}

const clearErrorHint = () => {
  setError([])
}

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
            value={username}        
            />
          <InputTitle>密碼</InputTitle>
          <Input
            type="text"
            placeholder="輸入你的密碼..."
            onChange={(e) => setPassword(e.target.value)} 
            onFocus={clearErrorHint}
            value={password} 
            />
          <ButtonSubmit onClick={handleLogin}> 立刻登入 </ButtonSubmit> 
        {error.status == 1 && (
        <ErrorHint>{error.message}</ErrorHint>
        )}
        {actionSucceed && 
        <SucceedHint>成功登入</SucceedHint>
        }
        {user && <h1>登入狀態：{user.username}</h1>}
      </div>    
    </div>
  );
}
export default LoginPage;
