import { useContext } from "react"
import Axios from "axios";
import styled from "styled-components"
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from './context'
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
  box-sizing: border-box;
`
const Brand = styled(Link)`
  font-size: 32px;
  font-weight: bold;
  color: black;
  text-decoration: none;
`

const NavbarList = styled.div`
  display: flex;
  align-items: center;
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

  ${(props) => 
    props.$active && 
    `
    background: rgba(0, 0, 0, 0.1);
    `}
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

const LeftContainer = styled.div`
  display: flex;
  align-items: center;

  ${NavbarList} {
    margin-left: 64px;
  }
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
    <NavbarList>    
      <Nav to="/" $active={location.pathname === '/'}>首頁</Nav>
      <Nav to="/register" $active={location.pathname === '/register'}>註冊</Nav>
      <Nav to="/posting" $active={location.pathname === '/posting'}>發布</Nav>
      <Nav to="/stock-hot" $active={location.pathname === '/stock-hot'}>熱門</Nav>
    </NavbarList>
    </LeftContainer>
    <NavbarList>
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
