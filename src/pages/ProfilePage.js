import { useState, useEffect, useContext, useRef } from 'react'
import { FavContext, Fav2Context, InfoContext } from './../context'
import { TargetWrap, TargetHeader, TargetName, TargetInfo, Time, Info } from '../StyleComponents'

function ProfilePage() {
  const { myFav, setMyFav } = useContext(FavContext)
  const { infoCompleted, setInfoCompleted } = useContext(InfoContext)
  const { myFav2, setMyFav2 } = useContext(Fav2Context)

  // states
  const [myFavInfo, setMyFavInfo] = useState([])
  const [ isLoaded, setIsLoaded] = useState(false)

  let myFavProcessing = []
  const id = useRef(1)

  useEffect(() => {
    if(infoCompleted.length > 1000) {
      setIsLoaded(true)
    }
  }, [infoCompleted])

  useEffect(() => {
    if (isLoaded) {
    // 拿到喜愛股票的資料
    myFav2.forEach(element => {
      infoCompleted.forEach(item => {
        if (element.stock_code == item.Code) {
          console.log(item.Code)
          myFavProcessing.push({
            id: id.current,
            Code: item.Code,
            Name: item.Name,
            ClosingPrice: item.ClosingPrice,
            MonthlyAveragePrice: item.MonthlyAveragePrice,
            PE: item.PE,
            Dividend: item.Dividend
          })
          setMyFavInfo(myFavProcessing)
          id.current ++
        }
      })
    })
    }
  }, [isLoaded])

  useEffect(() => {
    if (myFav2) {
    // 拿到喜愛股票的資料
    myFav2.forEach(element => {
      infoCompleted.forEach(item => {
        if (element.stock_code == item.Code) {
          console.log(item.Code)
          myFavProcessing.push({
            id: id.current,
            Code: item.Code,
            Name: item.Name,
            ClosingPrice: item.ClosingPrice,
            MonthlyAveragePrice: item.MonthlyAveragePrice,
            PE: item.PE,
            Dividend: item.Dividend
          })
          setMyFavInfo(myFavProcessing)
          id.current ++
        }
      })
    })
    }
  }, [myFav2])  
  return (
    <div>
    <h1>我的最愛股票</h1>
    {myFavInfo.filter(item => item.id > 0).map(item => 
        <TargetWrap>
          <TargetHeader>
            <TargetName>
              {item.Name} {item.Code}
            </TargetName>
            <Time>{"更新時間 "}時間待補</Time>
          </TargetHeader>
            <TargetInfo>
              <Info>
                <p>股價</p>
                <p>{item.ClosingPrice}</p>
              </Info>
              <Info>
                <p>月均價</p>
                <p>{item.MonthlyAveragePrice}</p>
              </Info>
              <Info>
                <p>本益比</p>
                <p>{item.PE}</p>
              </Info>
              <Info>
                <p>殖利率</p>
                <p>{item.Dividend}</p>
              </Info>              
            </TargetInfo>
        </TargetWrap>
    )
    }   
    </div>
  )
}
export default ProfilePage;
