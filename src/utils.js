// API-網站系統
export  const API_LOCAL = "http://localhost:3001"
export const API_PRODUCTION = "https://lit-earth-99012.herokuapp.com"

// API-股票資訊
export const API_STOCK_LOCAL = "http://192.168.64.4/api_stock"
export const API_STOCK_REMOTE = "http://mentor-program.co/mtr04group1/lucktanya33/stock"

// API-股票資訊HEROKU
export const API_HEROKU_PRICE = "https://secure-brook-06568.herokuapp.com/"
export const API_HEROKU_PE = "https://tranquil-thicket-64578.herokuapp.com/"

// 最新股票時間
const today = new Date()
const countYesterday = today - 1000*60*60*24
const yesterday = new Date(countYesterday)
export const latestTime = yesterday.toLocaleDateString()