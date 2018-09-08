import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react'
import { JssProvider } from 'react-jss';
import { MuiThemeProvider } from '@material-ui/core/styles'

import App from './views/App.jsx'
import { createStoreMap } from './store/store'

/**
 * StaticRouter 专门用于服务端优化
 * useStaticRendering 用于服务端渲染时mobx-react为我们提供的一个工具
 */

// 让mobx在服务端渲染的时候不会重复数据变换
useStaticRendering(true)

/**
 * @param {Object} stores 服务端渲染时候会有不少请求进来，不能同一个store在不同的请求里面去使用它，
 *  一个store第一次请求可能已经初始化一些数据了，第二次在去使用这个数据会造成数据来回修改，每次store都去重新创建一个，从外面传入一个store.
 *
 * @param {} routerContext 用于静态渲染时对StaticRouter这个对象进行一些操作，返回给我们一些有用的信息
 *
 * @param {} url
 */
export default (stores, routerContext, sheetsRegistry, jss, theme, url) => (
    <Provider {...stores} >
        <StaticRouter context={routerContext} location={url} >
            <JssProvider registry={sheetsRegistry} jss={jss}>
                <MuiThemeProvider theme={theme}>
                    <App />
                </MuiThemeProvider>
            </JssProvider>
        </StaticRouter>
    </Provider>
)

export { createStoreMap }
