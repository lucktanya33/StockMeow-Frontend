import { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { API_LOCAL } from './../utils'
import { AuthContext } from './../context'


function ProfilePage() {
  // states
  const [favStock, setFavStock] = useState([])

  const getMyFav = () => {
    Axios.get(`${API_LOCAL}/my-fav`).then(
    (response) => {
      const dataArray = response.data
      const favStockAPI = dataArray.map(item => item.stock_code)
      console.log(favStockAPI);
      setFavStock(dataArray)
    })
  }

  return (
    <div>
    <h1>我的最愛股票</h1>
    <button onClick={getMyFav}>拿到最愛股票</button>
    {favStock.map(item => <h3>{item.stock_code}</h3>)}
    </div>
  )
}
export default ProfilePage;
