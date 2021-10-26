import React, { useState, useEffect, useContext } from "react"
import Axios from "axios";
import styled, { keyframes } from "styled-components"
import { API_PRODUCTION } from "../utils";
import { AuthContext } from "../context"
import { ButtonSmall, TitlePage, ErrorHint, Example } from "../StyleComponents";

// styled components
const Page = styled.div`
  width: 360px;
  margin: 0 auto;
`
const MessageForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 350px;
  margin-top: 16px;
  border-radius: 8px;
  background-color: white;
`
const TitleInput = styled.textarea`
  width: 80%;
  margin-top: 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.darkGrey};
  background-color: ${props => props.theme.colors.grey};
`
const BodyInput = styled.textarea`
  width: 80%;
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.grey};
`
const MessageList = styled.div`
  margin-top: 16px;
`
const MessageContainer = styled.div`
  border-radius: 8px;
  padding: 8px 16px;
  background-color: white;

  &:not(:first-child) {
    margin-top: 12px;
  }
`
const MessageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 4px;
`
const MessageAuthor = styled.div`
  color: black;
`
const MessageTime = styled.div`
  font-size: 12px;
`
const MessageTitle = styled.div`
  width: 55%;
  font-weight: bold;
  font-size: 20px;
`
const MessageBody = styled.div``
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

function Message({ id, author, time, title, content }) {
  return(
    <MessageContainer>
      <MessageHead>
        <MessageTitle>{title}</MessageTitle>
        <div>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
        </div>
      </MessageHead>
      <MessageBody>{content}</MessageBody>
    </MessageContainer>
  )
}

function HomePage() {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

  // states2 
  const [messages, setMessages] = useState([])
  const [inputTitle, setInputTitle] = useState('')
  const [inputBody, setInputBody] = useState('')

  // States-error
  const [error, setError] = useState([
    {status: 0,
    type: '',
    message: ''
    }
  ])
  
  // contexts
  const { user, setUser } = useContext(AuthContext)

    // useEffect-render 完成之後串 API 拿資料
    useEffect(() => {
      updateMessages()
    }, [])

    // 錯誤提示自動消失
    useEffect(() => {
      if(error) {
        const timer2 = setTimeout(() => {
          setError([])
        }, 1800
        )
        return () => clearTimeout(timer2);
      }
    }, [error])
  
  const updateMessages = () => {
    Axios.get(`${API_PRODUCTION}/posts`)
    .then((response) => {
      setMessages(response.data)
    })
    .catch((err) => {
      setError({
        status: 1,
        type: 'getRequest',
        message: `載入留言資料似乎有點狀況：${err.message}`
      })
    })
  }

  const handleFormSubmit = () => {
    // 未登入
    if (!user) {
      setError({
        status: 1,
        type: 'notUser',
        message: '你還沒登入!'
      })
      return
    }
    // 空值
    if (inputBody === '' || inputTitle === '') {
      setError({
        status: 1,
        type: 'empty',
        message: '請輸入要發表的內容！'
      })      
      return
    }
    setIsSubmitting(true)
    Axios.post(`${API_PRODUCTION}/create-post`, {inputTitle, inputBody})
    .then((response) => {
      console.log(response);
      setIsSubmitting(false)
      updateMessages()
    })
    .catch(err => {
      setIsSubmitting(false)
      setError({
        status: 1,
        type: 'postRequest',
        message: `送出留言有點狀況：${err.message}`
      }) 
    })
  }

  const handleTextareaFocus = () => {
    setError([])
  }

  return (
    <Page>
      {isSubmitting && <Loading>正在送出...</Loading>}
      <TitlePage>發表你對股市的看法</TitlePage>
      <MessageForm onSubmit={handleFormSubmit}>
        <TitleInput
        rows={3}
        placeholder={"輸入標題..."}
        onChange={(e) => {setInputTitle(e.target.value)}}
        onFocus={handleTextareaFocus}        
        />
        <BodyInput
        rows={10}
        placeholder={"輸入內容..."}
        onChange={(e) => {setInputBody(e.target.value)}}
        onFocus={handleTextareaFocus}
        />
        <ButtonSmall>送出留言</ButtonSmall>
      </MessageForm>
      {error.status == 1 && (
        <ErrorHint>{error.message}</ErrorHint>
      )}
      <MessageList>
        {messages.map(message => (
          <Message
          key={message.id}
          id={message.id}
          author={message.username}
          title={message.title}
          content={message.body}
          time={new Date(message.createdAt).toLocaleString()}
          >
          {message.body}
          </Message>
        ))}
      </MessageList>
    </Page>
  );
}

export default HomePage;
