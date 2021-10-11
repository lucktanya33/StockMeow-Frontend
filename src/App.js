import { useState, useEffect } from "react"
import { HashRouter as Router, Switch, Route, useParams } from "react-router-dom";
import Axios from "axios";
import styled from "styled-components";
import Header from "./Header";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage  from './pages/RegisterPage';
import LoginPage  from './pages/LoginPage';
import './App.css';
import { API_PRODUCTION } from "./utils";
import { AuthContext } from "./context";
import { createGlobalStyle } from 'styled-components'

// styles
const Root = styled.div`
  padding-top: 64px;
`
// 設定html body 底色
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.grey};
  }
`

function App() {
const [user, setUser] = useState(null)
Axios.defaults.withCredentials = true

// 拿到登入狀態
useEffect(() => {
  Axios.get(`${API_PRODUCTION}/login`)
  .then((response) => {
    if(response.data.user) {
      setUser(response.data.user[0])
    }
  })
}, [])
return (
  <AuthContext.Provider value={{user, setUser}}>
  <GlobalStyle />
  <Root>
    <Router>
      <Header />
      <Switch>   
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/stock-hot">
          <SearchPage />
        </Route>
        <Route exact path="/profile">
          <ProfilePage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>                      
        <Route exact path="/login">
          <LoginPage />
        </Route>     
      </Switch>
    </Router>
  </Root>
  </AuthContext.Provider>
);
}
export default App;
