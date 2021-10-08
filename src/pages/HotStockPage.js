import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import styled from "styled-components"
import { API_STOCK_LOCAL, API_STOCK_REMOTE, API_HEROKU_PRICE, API_HEROKU_PE } from './../utils'

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

function HotStockPage() {
  // states
  // 載入頁面
  const [LoadingPage, setLoadingPage] = useState(true)
  // API拿到的資料
  const [stockInfoPE, setStockInfoPE] = useState([])
  const [stockInfoPrice, setStockInfoPrice] = useState([])
  // 輸入查詢
  const [stockSearching, setStockSearching] = useState(null)
  // 查詢後結果
  const [targetPrice, setTargetPrice] = useState([])
  const [targetPE, setTargetPE] = useState([])
  const [searchingErr, setSearchingErr] = useState(null)

  // useEffect (每次render先串API拿資料存到states)
  useEffect(() => {
    setStockInfo()
    const timer = setTimeout(() => {
      setLoadingPage(false)//六秒後拿掉loading畫面
    }, 6000);
    return () => clearTimeout(timer);
  }, [])

  const setStockInfo = () => {
    // 拿資料-價格
    fetch(API_HEROKU_PRICE)// `${API_STOCK_REMOTE}/price.php`
    .then(response =>{
       return  response.json()
    })
    .then( data =>{
      const dataPrice = data.stock_try
      const Price = dataPrice.filter(item => item.Code < 10000)//拿出權證以外的資料
      setStockInfoPrice(Price)
      //setIsLoaded(true)
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
        setSearchingErr('無效的查詢，請輸入正確代號或名稱')
        setTargetPrice([])
        setTargetPE([])
      }
  }

  const clearSearchingErr = () => {
    setSearchingErr(null)
  }
  return (
    <div>
    {LoadingPage && <Loading>正在幫您載入1102檔台股中...</Loading>}
    {!LoadingPage && (
    <div> 
    <h1>熱門股票</h1>
    <form onSubmit={handleSearch}>
      <input
      placeholder="輸入上市股票名稱/代號"
      onChange={(e) => setStockSearching(e.target.value)}
      onFocus={clearSearchingErr}
      />
      <button>查詢</button>
    </form>
    <h3>{searchingErr}</h3>
    <div>
      <h3> 名稱：{targetPE.map(item => item.Name)}</h3>
      <h3> 股價：{targetPrice.map(item => item.ClosingPrice)}</h3>
      <h3> 月均價：{targetPrice.map(item => item.MonthlyAveragePrice)}</h3>
      <h3> 本益比：{targetPE.map(item => item.PEratio)}</h3>
      <h3> 殖利率：{targetPE.map(item => item.DividendYield)}</h3>
    </div>
    </div>     
    )}
    </div>
  )
}
export default HotStockPage;
