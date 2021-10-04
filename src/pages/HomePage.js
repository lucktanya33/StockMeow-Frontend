import React, { useState, useEffect, useContext } from "react"
import Axios from "axios";
import styled from "styled-components"
import { API_PRODUCTION } from "../utils";
import { AuthContext } from "../context"
const API_ENDPOINT = 'https://student-json-api.lidemy.me/comments'

// styled components
const Page = styled.div`
  width: 360px;
  margin: 0 auto;
`
const Title = styled.h2`
  color: #333;
`
const MessageForm = styled.form`
  margin-top: 16px;
`
const MessageTextArea = styled.textarea`
  width: 100%;
`

const TitleInput = styled.textarea`
  width: 100%;
`
const BodyInput = styled.textarea`
  width: 100%;
`
const SubmitButton = styled.button`
  margin-top: 8px;
`

const DeleteButton = styled.button`
  margin-top: 8px;
`
const MessageList = styled.div`
  margin-top: 16px;
`
const MessageContainer = styled.div`
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px 16px;

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

const MessageId = styled.div`
  color: black;
`
const MessageTime = styled.div``
const MessageTitle = styled.div`
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

function Message({ id, author, time, title, content, deleteTest }) {
  return(
    <MessageContainer>
      <MessageHead>
        <MessageId>{id}</MessageId>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHead>
      <MessageTitle>{title}</MessageTitle>
      <MessageBody>{content}</MessageBody>
      <DeleteButton onClick={() => {deleteTest(id)}}>刪除</DeleteButton>
    </MessageContainer>
  )
}

const ErrorMessage = styled.div`
  color: red;
`

function HomePage() {
  // States
  const [inputValue, setInputValue] = useState()
  const [messageApiError, setMessageApiError] = useState(null)
  const [postMessageError, setPostMessageError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // states2 
  const [messages, setMessages] = useState([])
  const [inputTitle, setInputTitle] = useState('')
  const [inputBody, setInputBody] = useState('')
  
  // contexts
  const { user, setUser } = useContext(AuthContext)

  const updateMessages = () => {
    fetch(API_ENDPOINT)
    .then(res => res.json())
    .then((data) => {
      setMessages(data)
    })
    .catch((err) => {
      setMessageApiError(err.message)
    })
  }

  const updateMessages2 = () => {
    Axios.get(`${API_PRODUCTION}/posts`)
    .then((response) => {
      setMessages(response.data)
    })
  }

  const handleFormSubmit2 = () => {
    Axios.post(`${API_PRODUCTION}/create-post`, {inputTitle, inputBody})
    .then((response) => {
      console.log(response);
    })
  }

  // useEffect
  // render 完成之後串 API 拿資料
  useEffect(() => {
    updateMessages()
  }, [])

  const handleTextareaChange = e => {
    setInputValue(e.target.value)
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    // 預防連續點擊-如果已經按下submitting 就return這個function
    if (isSubmitting) {
     return 
    }
    setIsSubmitting(true)
    // 串API-送出留言
    fetch('https://student-json-api.lidemy.me/comments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        nickname: 'hey',
        body: inputValue
      })
    })
    .then(res => res.json())
    .then((data) => {
      setIsSubmitting(false)
      if (data.ok === 0) {
        setIsSubmitting(false)
        setPostMessageError(data.message)
        return
      }
      updateMessages()
      setInputValue('')
    })
    .catch(err => {
      setIsSubmitting(false)
      setPostMessageError(err.message)
    })
  }

  const handleTextareaFocus = () => {// onFocus游標移過去textarea框框時要做的事ㄋ
    setPostMessageError(null)
  }

  const deleteTest = (id) => {
    fetch( `https://student-json-api.lidemy.me/comments/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => updateMessages()) 
    .catch(err => console.log(err)) 
  }

  return (
    <Page>
      {isSubmitting && <Loading>正在送出...</Loading>}
      <button onClick={updateMessages2}>測試API</button>
      <MessageForm onSubmit={handleFormSubmit2}>
        <TitleInput
        rows={2}
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
        <SubmitButton>送出留言</SubmitButton>
        {postMessageError && <ErrorMessage>{postMessageError}</ErrorMessage>}
      </MessageForm>

      <Title>發表你對股市的看法...</Title>
      <MessageForm onSubmit={handleFormSubmit}>
        <MessageTextArea
        rows={10}
        value={inputValue}
        onChange={handleTextareaChange}
        onFocus={handleTextareaFocus}
        />
        <SubmitButton>送出留言</SubmitButton>
        {postMessageError && <ErrorMessage>{postMessageError}</ErrorMessage>}
      </MessageForm>
      {messageApiError && (
      <ErrorMessage>
        Something went wrong: {messageApiError.toString()}
      </ErrorMessage>)}
      <MessageList>
        {messages.map(message => (
          <Message
          key={message.id}
          id={message.id}
          author={message.username}
          title={message.title}
          content={message.body}
          time={new Date(message.createdAt).toLocaleString()}
          deleteTest={deleteTest}
          >
          {message.body}
          </Message>
        ))}
      </MessageList>
    </Page>
  );
}

export default HomePage;
