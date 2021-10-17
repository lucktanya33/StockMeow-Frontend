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
import { AuthContext, FavContext, Fav2Context, InfoContext } from "./context";
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
const [stockInfoPrice, setStockInfoPrice] = useState([])
const [stockInfoPE, setStockInfoPE] = useState([])
const [myFav, setMyFav] =useState([])
const [myFav2, setMyFav2] =useState([])

const [loaded, setLoaded] = useState(false)

const [infoCompleted, setInfoCompleted ] = useState([])

// useEffect
useEffect(() => {
    // 拿到登入狀態
    Axios.get(`${API_PRODUCTION}/login`)
    .then(
      (response) => {
        if(response.data.user) {
          setUser(response.data.user[0])
      }
    })
    // 拿資料
    getInfo()
    // 拿最愛
    getFav()
}, [])

useEffect(() => {
  // 拿最愛2
  if (user) {
    console.log('getFav2');
    getFav2()
    }
}, [user])

const getFav = () => {
  Axios.get(`${API_PRODUCTION}/my-fav`).then(
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
  }, {
    headers: {"Content-Type": "application/json; charset=utf-8"}
  }).then((response) => {
    if (response.data.message) {
      console.log(response.data.message)
    } else {
      console.log('post my fav2', response);
      setMyFav2(response.data)
    }
  })
}

// 確認載入完全
useEffect(() => {
  if(stockInfoPrice.length > 1000) {
    setLoaded(true)
  }
}, [stockInfoPrice])

// 整理資料
useEffect(() => {
  if(loaded) {
    organizeInfo()
  }
}, [loaded])

const getInfo = () => {
  // 拿價格
  fetch(API_HEROKU_PRICE)// `${API_STOCK_REMOTE}/price.php`
  .then(response =>{
    return  response.json()
  })
  .then( data =>{
    const dataPrice = data.stock_new
    const toArray = Object.values(dataPrice)
    setStockInfoPrice(toArray)
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
}

const organizeInfo = () => {
    const infoProcessing = stockInfoPrice.map(item => ({'PE':'', 'Dividend':'', ...item}))
    for (let i = 0; i < infoProcessing.length; i ++) {
      // 結合PE, Dividend
      for (let x = 0; x < stockInfoPE.length; x ++) {
        if (infoProcessing[i].Code == stockInfoPE[x].Code) {
          infoProcessing[i].PE = stockInfoPE[x].PEratio
          infoProcessing[i].Dividend = stockInfoPE[x].DividendYield
        }
      }
      // 空白處理
      if (infoProcessing[i].PE == '') {
        infoProcessing[i].PE = '無資料'
      }
      if (infoProcessing[i].Dividend == '') {
        infoProcessing[i].Dividend = '無資料'
      }
    }
    setInfoCompleted(infoProcessing)
}

/*const checkLoaded = () => {
  if(stockInfoPrice.length > 1000) {
    console.log(1);
    setLoaded(true)
    return
  } else {
    console.log(2)
    setTimeout(checkLoaded, 1000);
  }  
}*/

return (
  <InfoContext.Provider value={{infoCompleted, setInfoCompleted}}>
  <AuthContext.Provider value={{user, setUser}}>
  <FavContext.Provider value={{myFav, setMyFav}}>
  <Fav2Context.Provider value={{myFav2, setMyFav2}}>
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
  </Fav2Context.Provider>
  </FavContext.Provider>
  </AuthContext.Provider>
  </InfoContext.Provider>
);
}
export default App;
