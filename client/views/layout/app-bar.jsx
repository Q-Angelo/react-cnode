import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

const styles = {
    root: {
        width: '100%',
    },
    flex: {
        flex: 1,
    },
}

@inject(stores => {
    return {
        appState: stores.appState,
    }
}) @observer
class MainAppBar extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    constructor() {
        super();

        // 进行this绑定，如果不进行this绑定，在调用的时候，this的调用者是window，就不是class 这个上下文
        this.onHomeIconClick = this.onHomeIconClick.bind(this);
        this.createButtonClick = this.createButtonClick.bind(this);
        this.loginButton = this.loginButton.bind(this);
    }

    onHomeIconClick() {
        this.context.router.history.push({
            pathname: '/list',
            search: '?tab=all',
        })
    }

    createButtonClick() {
        this.context.router.history.push('/topic/create');
    }

    loginButton() {
        console.log('this.props.appState.user.isLogin', this.props.appState.user.isLogin);

        if (this.props.appState.user.isLogin) {
            this.context.router.history.push('/user/info');
        } else {
            this.context.router.history.push('/user/login');
        }
    }

    render() {
        const { user } = this.props.appState;
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <AppBar position="fixed" >
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.onHomeIconClick}>
                            <HomeIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            JNode 作者: qufei
                        </Typography>
                        <Button variant="raised" color="primary" onClick={this.createButtonClick}>
                            新建话题
                        </Button>
                        <Button color="inherit" onClick={this.loginButton}>
                            {
                                user.isLogin ? user.info.loginName : '登录'
                            }
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

MainAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
}

MainAppBar.wrappedComponent.propTypes = {
    appState: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar);
