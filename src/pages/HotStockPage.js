import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import styled from "styled-components"
import { API_STOCK_LOCAL, API_STOCK_REMOTE, API_HEROKU_PRICE, API_HEROKU_PE, API_LOCAL } from './../utils'

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
  border: 1px solid blue;
`
const SearchArea = styled.div`
  width: 100%;
`
const SearchInput = styled.input`
  width: 75%;
  height: 50px;
  margin: 0px 5px 0px 5px;
  border-radius: 5px;
`
const SearchButton = styled.button`
  width: 15%;
  margin: 0px 5px 0px 5px;
  height: 50px;
  cursor: pointer;
`

const TargetWrap = styled.div`
  width: 100%;
`
const TargetHeader = styled.div`
  width: 100%;
  border: 1px solid blue;
`
const TargetName = styled.div`
  height: 70px;
  display: flex;
  justify-content: space-between;
  padding: 0px 5px 0px 5px;
  font-size : 28px;
  font-weight: bold;
  color: black;
`
const Button = styled.button`
  cursor: pointer;
  width: 30%;
  margin: 0px 5px 0px 5px;
  height: 35px;
  background-color : pink;
  text-align: center;
  cursor: pointer;
`

const TargetInfo = styled.div`
  padding: 0px 5px 0px 5px;
  display: flex;
  justify-content: space-around;
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

  // useEffect (每次render先串API拿資料存到states)
  useEffect(() => {
    setStockInfo()
    const timer = setTimeout(() => {
      setLoadingPage(false)//六秒後拿掉loading畫面
    }, 6000);
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
    <h3>查詢你想了解的上市股票</h3>
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
    <div>
    <TargetName>
      <p> {targetPrice.map(item => item.Name)} {targetPrice.map(item => item.Code)}</p>
    </TargetName>
    <TargetInfo>
      <p> 股價{targetPrice.map(item => item.ClosingPrice)}</p>
      <p> 月均價{targetPrice.map(item => item.MonthlyAveragePrice)}</p>
      <p> 本益比{targetPE.map(item => item.PEratio)}</p>
      <p> 殖利率{targetPE.map(item => item.DividendYield)}</p>
    </TargetInfo>
    <Button onClick={handleAddFav}>加入追蹤</Button>
    </div>
    </TargetHeader>
    </TargetWrap>
    )}
    </Page>
    </div>    
    )}
    </div>
  )
}
export default HotStockPage;
