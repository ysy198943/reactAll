import express from 'express'
const app = express()

// 服务器端实现静态资源访问
app.use(express.static('public'));

app.listen('3000', () => {
  console.log('app is running')
})
export default app;