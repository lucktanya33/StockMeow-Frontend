import { useContext } from "react"
import Axios from "axios";
import styled from "styled-components"
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from './context'
import { API_PRODUCTION } from "./utils";

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
  font-size: 20px;

  ${(props) => 
    props.$active && 
    `
    background: rgba(0, 0, 0, 0.1);
    `}
`

const Brand = styled(Link)`
  width: 120px; 
  font-size: 30px;
  font-weight: bold;
  color: black;
  text-decoration: none;
`

const LoginHint = styled.div`
  height: 60px;
  color: orange;
  font-size: 14px;
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

  ${(props) => 
    props.$active && 
    `
    background: rgba(0, 0, 0, 0.1);
    `}
`

function Header() {
  // React router USAGE
  const location = useLocation()//location.pathname可以知道現在點擊的路徑
  const { user, setUser } = useContext(AuthContext)
  Axios.defaults.withCredentials = true
  
  // functions
  const handleLogOut = () => {
    setUser(null)
    Axios.get(`${API_PRODUCTION}/logout`)
    .then((response) => {
      console.log('GET LOGOUT', response)
    })
  }
  return (
    <HeaderContainer>
    <LeftContainer>
    <Brand to="/">玩股喵</Brand>
    <LoginHint>
    <p>{user ? ('你好 '+ user.username) : "請登入"}</p>
    </LoginHint>
    <NavbarList>    
      <Nav to="/" $active={location.pathname === '/'}>討論</Nav>
      <Nav to="/stock-hot" $active={location.pathname === '/stock-hot'}>查詢</Nav>
    </NavbarList>
    </LeftContainer>
    <NavbarList>
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
