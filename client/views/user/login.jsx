import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'

import UserWrapper from './user'
import { loginStyle } from './style'

@inject(stores => {
    return {
        appState: stores.appState,
        user: stores.appState.user,
    }
}) @observer
class UserLogin extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    constructor() {
        super();

        this.state = {
            accesstoken: '',
            helpText: '',
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.getFrom = this.getFrom.bind(this);
    }

    componentDidMount() {
        if (this.props.user.isLogin) {
            this.context.router.history.replace('/user/info');
        }
    }


    handleInput(e) {
        this.setState({
            accesstoken: e.target.value.trim(),
        })
    }

    getFrom(location) {
        location = location || this.props.location;

        const query = queryString.parse(location.search);

        return query.from || '/user/info'; // 直接进入登录页面没有from给一个默认的
    }

    handleLogin() {
        if (!this.state.accesstoken || !this.state.accesstoken.length) {
            return this.setState({
                helpText: '必须填写',
            })
        }

        this.setState({
            helpText: '',
        })

        return this.props.appState.login(this.state.accesstoken)
            .then(() => {})
            .catch(err => {
                this.setState({
                    helpText: err.data && err.data.error_msg,
                })

                console.log(err);
            });
    }

    render() {
        const { classes } = this.props;
        const from = this.getFrom();
        const { isLogin } = this.props.user;

        console.log('this.props.user: ', this.props.user);
        console.log('this.props.user.isLogin: ', isLogin);
        console.log('this.props.user.info.loginName: ', this.props.user.info.loginName);

        if (isLogin && this.props.user.info.loginName) {
            return <Redirect to={from} />
        }

        return (
            <UserWrapper>
                <div className={classes.root}>
                    <TextField
                      label="请输入Cnode AccessToken"
                      placeholder="请输入Cnode AccessToken"
                      required
                      helperText={this.state.helpText}
                      value={this.state.accesstoken}
                      onChange={this.handleInput}
                      className={classes.input}
                    />
                    <Button
                      variant="raised"
                      color="primary"
                      onClick={this.handleLogin}
                      className={classes.loginButton}
                    >
                        登 录
                    </Button>
                </div>
            </UserWrapper>
        )
    }
}

UserLogin.wrappedComponent.propTypes = {
    appState: PropTypes.object.isRequired, // eslint-disable-line
    user: PropTypes.object.isRequired, // eslint-disable-line
}

UserLogin.propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
}

export default withStyles(loginStyle)(UserLogin);
