import { useContext } from "react"
import Axios from "axios";
import styled from "styled-components"
import { Link, useLocation } from "react-router-dom";
import { AuthContext, Fav2Context } from './context'
import { API_LOCAL, API_PRODUCTION } from "./utils";

// styles
const HeaderContainer = styled.div`
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  background-color:${props => props.theme.colors.grey};
  box-sizing: border-box;
`
const NavbarList = styled.div`
  display: flex;
  align-items: center;
`
const LeftContainer = styled.div`
  display: flex;
  align-items: center;

  ${NavbarList} {
    margin-left: 64px;
  }
`
const Nav = styled(Link)`
  padding: 10px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  color: black;
  text-decoration: none;
  font-size: 16px;

  ${(props) => 
    props.$active && 
    `
    background: ${props => props.theme.colors.darkBlue};
    `}
`

const Brand = styled(Link)`
  width: 120px;
  padding: 10px; 
  font-size: 26px;
  font-weight: bold;
  color: ${props => props.theme.colors.darkGrey};
  text-decoration: none;

`
const LoginHint = styled.div`
  width: 24%;
  padding: 5px; 
  height: 40px;
  color: ${props => props.theme.colors.darkBlue};
  font-size: 14px;
  font-weight: bolder;
  box-sizing: border-box;
`
const LogOut = styled.div`
  padding: 10px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  color: black;
  text-decoration: none;
  font-size: 16px;

  ${(props) => 
    props.$active && 
    `
    background: ${props => props.theme.colors.darkBlue};
    `}
`

function Header() {
  // React router USAGE
  const location = useLocation()//location.pathname可以知道現在點擊的路徑
  const { user, setUser } = useContext(AuthContext)
  const { myFav2, setMyFav2 } = useContext(Fav2Context)

  Axios.defaults.withCredentials = true
  
  // functions
  const handleLogOut = () => {
    setUser(null)
    Axios.get(`${API_PRODUCTION}/logout`)
    .then((response) => {
      console.log('GET LOGOUT', response)
      setMyFav2([])
    })
  }
  return (
    <HeaderContainer>
    <LeftContainer>
    <Brand to="/">玩股喵</Brand>
    <LoginHint>
    {user ? ('Hi '+ user.username) : "請登入"}
    </LoginHint>
    </LeftContainer>
    <NavbarList>
      <Nav to="/" $active={location.pathname === '/'}>討論</Nav>
      <Nav to="/search" $active={location.pathname === '/search'}>查詢</Nav>
      {!user && (
        <Nav to="/register" $active={location.pathname === '/register'}>註冊</Nav>
      )}      
      {!user && (
        <Nav to="/login" $active={location.pathname === '/login'}>登入</Nav>
      )}
      {user && (       
      <Nav to="/profile" $active={location.pathname === '/profile'}>個人</Nav>
      )}      
      {user && (       
        <LogOut onClick={handleLogOut}>登出</LogOut>
      )}
    </NavbarList>
    </HeaderContainer>
  )
}

export default Header;
