const express = require('express')
const favicon = require('serve-favicon')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
const serverRender = require('./util/server-render')

const isDev = process.env.NODE_ENV === 'development'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false, // 每次请求是否要重新生成一个新的id
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

if (isDev) {
  const devStatic = require('./util/dev-static')

  devStatic(app)
} else {
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')

  app.use('/public/', express.static(path.join(__dirname, '../dist')))

  app.get('*', (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next)
  })
}

/**
 * express错误捕获，req, res, next这几个参数用不到，也要传，因为express会判断参数的长度，来确认是否是异常错误捕获
 */
app.use((error, req, res, next) => {
  console.log(error)

  res.status(500).send(error)
})

app.listen(3333, () => {
  console.log('server is listening on 3333')
})
