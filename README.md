# Stock Meow 玩股喵

## 簡介
玩股喵是一個用 React 及 express.js 建立的簡易的股票資訊彙集網站，活潑簡明的介面讓使用者在上班或是聚會的時候也能夠看股票  
平台使用者有兩種身份：一般使用者及會員。查詢系統提供個股基本資訊。註冊為會員後可以把個股加入我的最愛追蹤頁面，並且在討論區即時和大家討論盤勢和個股  
 ↳ [專案連結](https://lucktanya33.github.io/StockMeow-Frontend/#/)  
 
 ![](https://i.imgur.com/az0EBuc.gif)

## 進行時間（進行中）
2021/10~

## 使用技術
* ReactJS
* HTML
* CSS
* [TWSE OpenApi](https://openapi.twse.com.tw/)
* NodeJS
* PHP
* MySQL
* Heroku

### 前端使用技術說明
* styled-components - 以 CSS-in-JS 方式撰寫畫面
* react-router - 製作分頁路由
* useContext - 避免上下層過度依賴
* Axios - 處理 Ajax 發送 HTTP 請求

### 部署
前端部署於 Github pages
後端 server 部署於 Heroku

## 功能介紹
### 權限區分
使用者、會員
### 討論區頁面
* 使用者可以觀看評論
* 會員可以發表評論

### 查詢頁面
* 使用者輸入上市台股名稱/代號，可以看到個股基本資訊：前日收盤價、本月月均價、本益比、殖利率
* 會員可以把股票加到我的最愛在個人頁面查看

### 熱門頁面
* 使用者可以看到每日成交量前 20 檔的股票

### 個人頁面
* 會員可以查看自己最愛的股票基本資訊



## 功能展示
歡迎使用會員測試帳號登入使用，帳密如下：
```
會員
帳號：stockholic
密碼：ilovestock
```
### 使用者-查詢並且加入比較
![](https://i.imgur.com/az0EBuc.gif)

### 會員-加入股票到我的最愛
![](https://i.imgur.com/KrYjKxR.gif)

### 會員-在論壇區發布討論
![](https://i.imgur.com/xMmI5Y2.gif)

### UX優化
錯誤提示
![](https://i.imgur.com/UDAfsDm.gif)

成功提示
![](https://i.imgur.com/8FdAI6j.gif)
