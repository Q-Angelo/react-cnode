const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  const url = `${baseUrl}/accesstoken`
  const params = {
    accesstoken: req.body.accessToken
  }

  // console.log('request login params: ', JSON.stringify(url, params));

  axios.post(url, params).then(result => {
    if (result.status === 200 && result.data.success) {
      req.session.user = {
        accessToken: req.body.accessToken,
        loginName: result.data.loginname,
        id: result.data.id,
        avatarUrl: result.data.avatar_url
      }

      result.data.loginName = result.data.loginname
      result.data.avatarUrl = result.data.avatar_url

      console.log(JSON.stringify(result.data))

      res.json({
        success: true,
        data: result.data
        /* data: {
                    success: result.data.success,
                    loginName: result.data.loginName,
                    avatarUrl: result.data.avatarUrl,
                    id: result.data.id,
                } */
      })
    }
  }).catch(err => {
    if (err.response) {
      res.json({
        success: false,
        data: err.response.data
      })
    } else {
      next(err)
    }
  })
})

module.exports = router
