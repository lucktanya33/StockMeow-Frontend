import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { API_LOCAL } from '../utils'
import { AuthContext } from '../context'

function LoginPage() {
const [usernameReg, setUsernameReg] = useState([])
const [passwordReg, setPasswordReg] = useState([])
const { user, setUser } = useContext(AuthContext)

Axios.defaults.withCredentials = true

const handleRegister = () => {
  Axios.post(`${API_LOCAL}/register`, {
    username: usernameReg,
    password: passwordReg
  }).then((response) => {
  })
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
    </div>
  );
}
export default LoginPage;
