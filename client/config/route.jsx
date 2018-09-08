import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import TopicList from '../views/topic-list';
import TopicDetail from '../views/topic-detail';
import TestApi from '../views/test/api-test';
import UserLogin from '../views/user/login';
import UesrInfo from '../views/user/info';
import TopicCreate from '../views/topic-create';

/**
 * PrivateRouter
 * @param {*} param0
 * 是一个Pure Function（纯函数组建）对于mobx不能使用@方式
 */
const PrivateRouter = ({ isLogin, component: Component, ...rest }) => (
    <Route
      {...rest}
      render={
          props => (
            isLogin ?
                <Component {...props} /> :
                <Redirect
                  to={{
                    pathname: '/user/login',
                    search: `?from=${rest.path}`, // 保存跳转到登录之前的页面信息
                  }}
                />
          )
      }
    />
)

/**
 * 相当于 @inject() 这种写法
 */
const InjectedPrivateRoute = withRouter(inject((stores) => {
    return {
        isLogin: stores.appState.user.isLogin,
    }
})(observer(PrivateRouter)));

PrivateRouter.propTypes = {
    isLogin: PropTypes.bool,
    component: PropTypes.element.isRequired,
}

PrivateRouter.defaultProps = {
    isLogin: false,
}

export default () => [
    <Route path="/" render={() => <Redirect to="/list" />} exact key="/" />,
    <Route path="/list" component={TopicList} key="list" />,
    <Route path="/detail/:id" component={TopicDetail} key="detail" />,
    <Route path="/testApi" component={TestApi} key="testApi" />,
    <Route path="/user/login" component={UserLogin} key="login" />,
    <InjectedPrivateRoute path="/user/info" component={UesrInfo} key="user" />,
    <InjectedPrivateRoute path="/topic/create" component={TopicCreate} key="create" />,
]
