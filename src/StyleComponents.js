import styled from "styled-components"
import { keyframes } from "styled-components"
export const TitlePage = styled.h1`
color: ${props => props.theme.colors.darkGrey};
margin: 30px;
`

export const Input = styled.input`
width: 75%;
height: 50px;
margin: 0px 3px 8px 3px;
font-size: 20px;
border: 0px;
border-radius: 8px;
`
export const InputTitle = styled.div`
display: flex;
justify-content: center;
width: 75%;
height: 40px;
margin: 0 auto;
font-size: 20px;
font-weight: bolder;
border: 0px;
border-radius: 8px;
color: ${props => props.theme.colors.darkGrey};
`

export const ButtonSubmit = styled.button`
width: 78%;
margin: 40px 2px 20px 2px;
height: 50px;
border-radius: 8px;
text-align: center;
cursor: pointer;
color: white;
font-size: 20px;
font-weight: bolder;
border: 0px;
background-color: ${props => props.theme.colors.darkBlue};

: hover {
  color: ${props => props.theme.colors.darkBlue};
  background-color: white;
}
`
export const ButtonSmall = styled.button`
cursor: pointer;
width: 30%;
margin: 0px 5px 10px 5px;
height: 35px;
border-radius: 8px;
text-align: center;
cursor: pointer;
color: white;
font-weight: bolder;
border: none;
background-color: ${props => props.theme.colors.darkBlue};
`
// stock info card
export const TargetWrap = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  box-sizing: border-box;
`
export const TargetHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
`
export const TargetName = styled.span`
  width: 60%;
  padding: 0px 5px 0px 5px;
  font-size : 28px;
  font-weight: bold;
  color: black;
`
export const Time = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  font-size: 14px;
`
export const TargetInfo = styled.div`
  padding: 0px 5px 0px 5px;
  display: flex;
  justify-content: space-around;
`
export const Info = styled.div`
`

// animation 
export const Example = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`
export const ErrorHint = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid white;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.vividBlue};
  animation: 2s ${Example} ease-out;
`
export const SucceedHint = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid white;
  box-sizing: border-box;
  background-color: pink;
  animation: 3s ${Example} ease-out;
`