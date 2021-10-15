import { useContext } from 'react'
import { FavContext } from './../context'

function ProfilePage() {
  const { myFav, setMyFav } = useContext(FavContext)

  return (
    <div>
    <h1>我的最愛股票</h1>
    {myFav.map(item => <h3>{item}</h3>)}
    </div>
  )
}
export default ProfilePage;
