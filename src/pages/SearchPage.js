import { useState, useEffect, useContext, useRef } from 'react'
import Axios from 'axios'
import styled from "styled-components"
import { InfoContext, AuthContext } from "../context"
import { API_STOCK_LOCAL, API_STOCK_REMOTE, API_HEROKU_PRICE, API_HEROKU_PE, API_LOCAL, API_PRODUCTION } from '../utils'
import { ButtonSmall } from '../StyleComponents'
import { TargetWrap, TargetHeader, TargetName, TargetInfo, Time, Info, ErrorHint } from '../StyleComponents'

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
  height: 40px;
  cursor: pointer;
  color: white;
  font-weight: bolder;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.darkBlue};

  : hover {
    background-color: ${props => props.theme.colors.vividBlue};
  }
`
const ButtonCompare = styled(ButtonSmall)`
  color: ${props => props.theme.colors.darkBlue};
  background-color: ${props => props.theme.colors.vividBlue}
`
function HotStockPage() {
  // states
  // 載入頁面
  const [LoadingPage, setLoadingPage] = useState(true)
  // 確認載入資料
  const [isInfoLoaded, setIsInfoLoaded] = useState(false)
  // 查詢-輸入中
  const [stockSearching, setStockSearching] = useState(null)
  // 查詢-結果
  const [targetInfo, setTargetInfo] = useState([
    {
      Code: "代號",
      Name: "股票名稱",
      ClosingPrice: '',
      MonthlyAveragePrice: '',
      PE: '',
      Dividend: ''
    }
  ])
  // 錯誤提醒
  const [searchFail, setSearchFail] = useState(false)
  const [searchDelay, setSearchDelay] = useState(false)
  const [errorCompare, setErrorCompare] = useState(false)
  const [errorAddFav, setErrorAddFav] = useState(false)
  // 比較
  const [comparedTarget, setComparedTarget] = useState([{
    id: 0,
    name: null,
    price: null
  }])

  // Context
  const { infoCompleted, setInfoCompleted } = useContext(InfoContext)
  const { user, setUser } = useContext(AuthContext)
 
  // 設定時間
  const today = new Date()
  const countYesterday = today - 1000*60*60*24
  const yesterday = new Date(countYesterday)
  const latestTime = yesterday.toLocaleDateString()

   //設定id
   const id = useRef(1)

  // useEffect (每次render先串API拿資料存到states)
  useEffect(() => {
    if (infoCompleted) {
      setIsInfoLoaded(true)
    }
    const timer = setTimeout(() => {
      setLoadingPage(false)//拿掉loading畫面
    }, 4000);
    return () => clearTimeout(timer);
  }, [])

  // 兩秒後提示消失-加入追蹤
  useEffect(() => {
    if(errorAddFav) {
      const timer2 = setTimeout(() => {
        setErrorAddFav(false)
      }, 1800)
      return () => clearTimeout(timer2);
    }
  }, [errorAddFav])

  const handleSearch = (e) => {
    e.preventDefault()
    // 資料未載入完
    if (!infoCompleted) {
      setSearchDelay(true)
      return
    }
    // 清空
    setSearchFail(false)
    setTargetInfo([])
    // 查詢邏輯
    const searchingResult = 
    infoCompleted.filter(item => item.Name == stockSearching || item.Code == stockSearching)
    const validSearch = (
      searchingResult.length!== 0
    )
    if (validSearch) {
      setTargetInfo([
        {
          Code: searchingResult[0].Code,
          Name: searchingResult[0].Name,
          ClosingPrice: searchingResult[0].ClosingPrice,
          MonthlyAveragePrice: searchingResult[0].MonthlyAveragePrice,
          PE: searchingResult[0].PE,
          Dividend: searchingResult[0].Dividend
        } 
      ])
    } else {
      setSearchFail(true)
    }
  }

  const clearSearchError = () => {
    setSearchFail(false)
    setSearchDelay(false)
  }

  const handleCompare = () => {
    setErrorCompare(false)
    // 錯誤-無查詢資料加入比較
    if(targetInfo[0].Code == "代號") {
      setErrorCompare(true)
      return
    }
    // 預防-重複加入比較
    const repeat = comparedTarget.filter(item => item.name == targetInfo[0].Name)
    if(repeat.length > 0) {
      return
    }
    // 加入比較
    setComparedTarget([
      {
        id: id.current,
        name: targetInfo[0].Name,
        price: targetInfo[0].ClosingPrice

      }, ...comparedTarget
    ])
    id.current++
  }

  const handleAddFav = () => {
    // 未登入
    if(!user) {
      console.log('登入才能加到最愛')
      setErrorAddFav(true)
      return
    }
    // 已登入
    Axios.post(`${API_PRODUCTION}/my-fav`, {
      username: user.username,
      stockCode: targetInfo[0].Code
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
      onFocus={clearSearchError}
      />
      <SearchButton>查詢</SearchButton>
    </form>
    </SearchArea>
    {searchFail && <h2>無效的查詢，請輸入正確代號或名稱</h2>}
    {searchDelay && <h2>資料庫有點延遲，再查詢一次！</h2>}
    {targetInfo && (
    <TargetWrap>
      <TargetHeader>
        <TargetName>
          {targetInfo.map(item => item.Name)} {targetInfo.map(item => item.Code)}
        </TargetName>
        <Time>{"更新時間 "}{latestTime}</Time>
      </TargetHeader>
        <TargetInfo>
          <Info>
            <p>股價</p>
            <p>{targetInfo.map(item => item.ClosingPrice)}</p>
          </Info>
          <Info>
            <p>月均價</p>
            <p>{targetInfo.map(item => item.MonthlyAveragePrice)}</p>
          </Info>
          <Info>
            <p>本益比</p>
            <p>{targetInfo.map(item => item.PE)}</p>
          </Info>
          <Info>
            <p>殖利率</p>
            <p>{targetInfo.map(item => item.Dividend)}</p>
          </Info>
        </TargetInfo>
        {isInfoLoaded && (
        <ButtonSmall onClick={handleAddFav}>加入追蹤</ButtonSmall>
        )}
        {isInfoLoaded && (
        <ButtonCompare onClick={handleCompare}>加入比較</ButtonCompare>
        )}
    </TargetWrap>
    )}
    {errorCompare && <h2>查詢股票後再加入比較！</h2>}
    {errorAddFav && (
        <ErrorHint>先登入才能加入最愛！</ErrorHint>
    )}
    {comparedTarget.filter(item => item.id > 0).map(item =>
      <TargetWrap>
        <TargetHeader>
          <TargetName>
          {item.name} {item.price}
          </TargetName>
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
