import styled from "styled-components"

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