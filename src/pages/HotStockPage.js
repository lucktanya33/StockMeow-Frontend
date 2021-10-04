import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { API_STOCK_LOCAL, API_STOCK_REMOTE } from './../utils'

function HotStockPage() {
  // states
  // API拿到的資料
  const [stockInfo, setStockInfo] = useState([])
  const [stockInfoPrice, setStockInfoPrice] = useState([])
  // 輸入查詢
  const [stockSearching, setStockSearching] = useState(null)
  // 查詢後結果
  const [targetStockInfo, setTargetStockInfo] = useState([])
  const [targetStockPrice, setTargetStockPrice] = useState([])
  const [searchingErr, setSearchingErr] = useState(null)

  const getStockPrice = () => {
    fetch(`${API_STOCK_REMOTE}/price.php`)
    .then(response =>{
       return  response.json()
    })
    .then( data =>{
      const dataArray = data.stock_try
      // method-slice
      const dataSingleStock = dataArray.slice(10037, 11019)
      setStockInfoPrice(dataSingleStock)
    })
  }

  const handleSearch = () => {
    // 清空
    setTargetStockInfo([])
    setTargetStockPrice([])

    fetch(`${API_STOCK_REMOTE}/try.php`)
    .then(response =>{
       return  response.json()
    })
    .then( data =>{
      const dataArray = data.stock_try
      console.log(dataArray.length);
      setStockInfo(dataArray)
      getStockPrice()
      // searching
      const targetInfoByName = dataArray.filter(stockItem => stockItem.Name == stockSearching)
      const targetInfoByCode = dataArray.filter(stockItem => stockItem.Code == stockSearching)
      // 查詢邏輯
      const validSearching = (targetInfoByCode.length !== 0 || targetInfoByName.length !== 0)
      if (validSearching) {
        // 拿股價資訊
        const targetPriceInfoByCode = stockInfoPrice.filter(stockItem => stockItem.Code == stockSearching)
        const targetPriceInfoByName = stockInfoPrice.filter(stockItem => stockItem.Name == stockSearching)
        if ( targetInfoByCode.length !== 0) {
          setTargetStockInfo(targetInfoByCode)
          setTargetStockPrice(targetPriceInfoByCode)
        }
        if ( targetInfoByName.length !== 0) {
          setTargetStockInfo(targetInfoByName)
          setTargetStockPrice(targetPriceInfoByName)
        }
      } else {
        setSearchingErr('無效的查詢，請輸入正確股票名稱')
        setTargetStockInfo([])
        setTargetStockPrice([])
      }
    })
  }
  const clearSearchingErr = () => {
    setSearchingErr(null)
  }
  return (
    <div>
    <h1>熱門股票</h1>
    <button onClick={getStockPrice}>測試API</button>
    <form onSubmit={handleSearch}>
      <input
      placeholder="輸入上市股票名稱/代號"
      onChange={(e) => setStockSearching(e.target.value)}
      onFocus={clearSearchingErr}
      />
      <button>查詢</button>
    </form>
    <h2>{searchingErr}</h2>
    <div>
      <h3> 名稱：{targetStockInfo.map(item => item.Name)}</h3>
      <h3> 股價：{targetStockPrice.map(item => item.ClosingPrice)}</h3>
      <h3> 月均價：{targetStockPrice.map(item => item.MonthlyAveragePrice)}</h3>
      <h3> 本益比：{targetStockInfo.map(item => item.PEratio)}</h3>
      <h3> 殖利率：{targetStockInfo.map(item => item.DividendYield)}</h3>
    </div>
    </div>
  )
}
export default HotStockPage;
