import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { API_PRODUCTION } from '../../utils'
import { AuthContext } from '../../context'

function LoginPage() {
const [usernameReg, setUsernameReg] = useState([])
const [passwordReg, setPasswordReg] = useState([])

const [username, setUsername] = useState([])
const [password, setPassword] = useState([])

const [errMessageLogin, setErrMessageLogin] = useState('')

const { user, setUser } = useContext(AuthContext)

Axios.defaults.withCredentials = true

const handleRegister = () => {
  Axios.post(`${API_PRODUCTION}/register`, {
    username: usernameReg,
    password: passwordReg
  }).then((response) => {
  })
}

const handleLogin = () => {
  Axios.post(`${API_PRODUCTION}/login`, {
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
    }
  })
}

const clearErrorHint = () => {
  setErrMessageLogin('')
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

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <div>
          <label>Username</label>
          <input 
            type="text"
            onChange={(e) => setUsernameReg(e.target.value)}
            />
        </div>
        <div>  
          <label>Password</label>
          <input
            type="text"
            onChange={(e) => setPasswordReg(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleRegister}> Now Register </button> 
        </div>
      </div>
      <div className="login">
        <h1>Login</h1>
        <div>
          <label>Username</label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            onFocus={clearErrorHint}          
            />
        </div>
        <div>  
          <label>Password</label>
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)} 
            onFocus={clearErrorHint}           
            />
        </div>
        <div>
          <button onClick={handleLogin}> Now Login </button> 
        </div>
        <h1>{errMessageLogin}</h1>
        {user && <h1>登入狀態：{user.username}</h1>}
      </div>    
    </div>
  );
}
export default LoginPage;
