const axios = require('axios')
const baseUrl = 'https://cnodejs.org/api/v1'
const querystring = require('query-string')

module.exports = function (req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  const needAccessToken = req.query.needAccessToken

  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    accessToken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })

  if (query.needAccessToken) {
    delete query.needAccessToken
  }

  /**
     * 需要进行querystring编码，这样cnode接收才不会报错
     */
  const data = querystring.stringify(Object.assign({}, req.body, {
    accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
  }))

  // console.log(data, req.method === 'POST', req.method, 'user.accessToken: ', user.accessToken)

  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(result => {
    if (result.status === 200) {
      res.send(result.data)
    } else {
      res.status(result.status).send(result.data)
    }
  }).catch(err => {
    if (err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: '未知错误'
      })
    }
  })
}
