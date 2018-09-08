const ReactDomServer = require('react-dom/server')
const bootstrap = require('react-async-bootstrapper')
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default

const SheetsRegistry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName
const colors = require('@material-ui/core/colors')

const getStoreState = stores => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()

    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  const user = req.session.user
  const routerContext = {}
  const stores = bundle.createStoreMap()

  console.log(JSON.stringify({ user }))

  if (user) {
    stores.appState.user.isLogin = true
    stores.appState.user.info = user
  }

  const sheetsRegistry = new SheetsRegistry()
  const jss = create(preset())
  jss.options.createGenerateClassName = createGenerateClassName
  const theme = createMuiTheme({
    palette: {
      primary: colors.pink,
      accent: colors.lightBlue,
      type: 'light'
    }
  })
  const createApp = bundle.default
  const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)

  return new Promise((resolve, reject) => {
    bootstrap(app).then(() => {
      // 如果有redirect，react-router会在routerContext上加一个属性url
      // console.log('routerContext.url: ', routerContext.url);

      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()

        return
      }

      const helmet = Helmet.rewind()
      const state = getStoreState(stores)
      const content = ReactDomServer.renderToString(app)

      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })

      res.send(html)

      resolve()
    }).catch(err => reject(err))
  })
}
