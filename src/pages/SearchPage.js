import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import styled from "styled-components"
import { API_STOCK_LOCAL, API_STOCK_REMOTE, API_HEROKU_PRICE, API_HEROKU_PE, API_LOCAL } from '../utils'

const Loading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Page = styled.div`
  width: 360px;
  margin: 0 auto;
  padding-top: 35px;
  background-color: ${props => props.theme.colors.grey};
`
const SearchArea = styled.div`
  width: 100%;
`
const SearchInput = styled.input`
  width: 75%;
  height: 50px;
  margin: 0px 3px 0px 3px;
  font-size: 20px;
  border: 0px;
  border-radius: 8px;
`
const SearchButton = styled.button`
  width: 13%;
  margin: 0px 3px 0px 3px;
  height: 50px;
  cursor: pointer;
  color: white;
  font-size: 12px;
  font-weight: bolder;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.darkBlue};

  : hover {
    background-color: ${props => props.theme.colors.vividBlue};
  }
`
const TargetWrap = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  box-sizing: border-box;
`
const TargetHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
`
const TargetName = styled.span`
  width: 60%;
  padding: 0px 5px 0px 5px;
  font-size : 28px;
  font-weight: bold;
  color: black;
`
const Time = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  font-size: 14px;
`
const Button = styled.button`
  cursor: pointer;
  width: 30%;
  margin: 0px 5px 10px 5px;
  height: 35px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  color: white;
  font-weight: bolder;
  border: none;
  background-color: ${props => props.theme.colors.darkBlue};
`
const TargetInfo = styled.div`
  padding: 0px 5px 0px 5px;
  display: flex;
  justify-content: space-around;
`
const Info = styled.div`
`
function HotStockPage() {
  // states
  // 載入頁面
  const [LoadingPage, setLoadingPage] = useState(true)
  // API拿到的資料
  const [stockInfoPE, setStockInfoPE] = useState([])
  const [stockInfoPrice, setStockInfoPrice] = useState([])
  // 確認載入資料
  const [isInfoLoaded, setIsInfoLoaded] = useState(false)
  // 輸入查詢
  const [stockSearching, setStockSearching] = useState(null)
  // 查詢後結果
  const [targetPrice, setTargetPrice] = useState([])
  const [targetPE, setTargetPE] = useState([])
  const [searchFail, setSearchFail] = useState(false)

  // 設定時間
  const today = new Date()
  const countYesterday = today - 1000*60*60*24
  const yesterday = new Date(countYesterday)
  const latestTime = yesterday.toLocaleDateString()

  // useEffect (每次render先串API拿資料存到states)
  useEffect(() => {
    setStockInfo()
    const timer = setTimeout(() => {
      setLoadingPage(false)//六秒後拿掉loading畫面
    }, 1000);
    return () => clearTimeout(timer);
  }, [])

  // useEffect 資料載入完顯示預設股票
  useEffect(() => {
    setStockSearching(2330)
    if (isInfoLoaded) {
      handleSearch()
    }
  },[isInfoLoaded])

  const setStockInfo = () => {
    // 拿資料-價格
    fetch(API_HEROKU_PRICE)// `${API_STOCK_REMOTE}/price.php`
    .then(response =>{
       return  response.json()
    })
    .then( data =>{
      const dataPrice = data.stock_try
      const price = dataPrice.filter(item => item.Code < 10000)//拿出權證以外的資料
      setStockInfoPrice(price)
      if (price.length > 1000) {
        setIsInfoLoaded(true)
      }
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

  const handleSearch = () => {
    // 清空
    setSearchFail(false)
    setTargetPrice([])
    setTargetPE([])
    // searching
      const targetPriceByName = stockInfoPrice.filter(stockItem => stockItem.Name == stockSearching)
      const targetPriceByCode = stockInfoPrice.filter(stockItem => stockItem.Code == stockSearching)
      const targetPEByCode = stockInfoPE.filter(stockItem => stockItem.Code == stockSearching)
      const targetPEByName = stockInfoPE.filter(stockItem => stockItem.Name == stockSearching)
      // 查詢邏輯
      const validSearching = (targetPriceByCode.length !== 0 || targetPriceByName.length !== 0)
      if (validSearching) {
        // 查詢目標資訊
        if ( targetPriceByCode.length !== 0) {
          setTargetPrice(targetPriceByCode)
          setTargetPE(targetPEByCode)
        }
        if ( targetPriceByName.length !== 0) {
          setTargetPrice(targetPriceByName)
          setTargetPE(targetPEByName)
        }
      } else {
        setSearchFail(true)
        setTargetPrice([])
        setTargetPE([])
      }
  }

  const handleAddFav = () => {
    console.log(targetPrice[0].Code);
    Axios.post(`${API_LOCAL}/my-fav`, {
      stockCode: targetPrice[0].Code
    }).then(
      response => {
        console.log('post my fav code', response);
      }
    )
  }
  return (
    <div>
    {LoadingPage && <Loading>正在幫您載入1102檔台股中...</Loading>}
    {!LoadingPage && (
    <div> 
    <Page>
    <SearchArea>
    <form onSubmit={handleSearch}>
      <SearchInput
      placeholder="輸入上市股票名稱/代號"
      onChange={(e) => setStockSearching(e.target.value)}
      />
      <SearchButton>查詢</SearchButton>
    </form>
    </SearchArea>
    {searchFail && <h2>無效的查詢，請輸入正確代號或名稱</h2>}
    {!searchFail && (
    <TargetWrap>
      <TargetHeader>
        <TargetName>
          {targetPrice.map(item => item.Name)} {targetPrice.map(item => item.Code)}
        </TargetName>
        <Time>{"更新時間 "}{latestTime}</Time>
      </TargetHeader>
        <TargetInfo>
          <Info>
            <p>股價</p>
            <p>{targetPrice.map(item => item.ClosingPrice)}</p>
          </Info>
          <Info>
            <p>月均價</p>
            <p>{targetPrice.map(item => item.MonthlyAveragePrice)}</p>
          </Info>
          <Info>
            <p>本益比</p>
            <p>{targetPE.map(item => item.PEratio)}</p>
          </Info>
          <Info>
            <p>殖利率</p>
            <p>{targetPE.map(item => item.DividendYield)}</p>
          </Info>
        </TargetInfo>
        <Button onClick={handleAddFav}>加入追蹤</Button>
    </TargetWrap>
    )}
    </Page>
    </div>    
    )}
    </div>
  )
}
export default HotStockPage;
