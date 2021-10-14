import { useState, useEffect } from "react"
import { HashRouter as Router, Switch, Route, useParams } from "react-router-dom";
import Axios from "axios";
import styled from "styled-components";
import Header from "./Header";
import DiscussPage from "./pages/DiscussPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage  from './pages/RegisterPage';
import LoginPage  from './pages/LoginPage';
import './App.css';
import { API_PRODUCTION, API_HEROKU_PRICE, API_HEROKU_PE } from "./utils";
import { AuthContext, PriceContext, PEContext } from "./context";
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
// setting  
Axios.defaults.withCredentials = true

// states
const [user, setUser] = useState(null)
const [stockInfoPE, setStockInfoPE] = useState([])
const [stockInfoPrice, setStockInfoPrice] = useState([])

// useEffect
useEffect(() => {
  // 拿到登入狀態
  Axios.get(`${API_PRODUCTION}/login`)
  .then((response) => {
    if(response.data.user) {
      setUser(response.data.user[0])
    }
  
  // 拿資料-價格
  fetch(API_HEROKU_PRICE)// `${API_STOCK_REMOTE}/price.php`
  .then(response =>{
    return  response.json()
  })
  .then( data =>{
    const dataPrice = data.stock_new
    console.log(dataPrice)
    const toArray = Object.values(dataPrice)
    console.log(toArray)
    setStockInfoPrice(toArray)
  })
  })
  // 拿資料-本益比
  fetch(API_HEROKU_PE)
  .then(response => {
    return response.json()
    
  })
  .then(data => {
    const PE = data.stock_pe
    setStockInfoPE(PE)
  })
}, [])

return (
  <PriceContext.Provider value={{stockInfoPrice, setStockInfoPrice}}>
  <PEContext.Provider value={{stockInfoPE, setStockInfoPE}}>
  <AuthContext.Provider value={{user, setUser}}>
  <GlobalStyle />
  <Root>
    <Router>
      <Header />
      <Switch>   
        <Route exact path="/">
          <DiscussPage />
        </Route>
        <Route exact path="/search">
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
  </PEContext.Provider>
  </PriceContext.Provider>
);
}
export default App;
