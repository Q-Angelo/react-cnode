import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles';
import UserIcon from '@material-ui/icons/AccountCircle'

import Container from '../layout/container'
import { userStyle } from './style'

@inject(stores => {
    return {
        user: stores.appState.user,
    }
}) @observer
class User extends React.Component {
    componentDidMount() {
        // todo:
    }

    render() {
        const { classes } = this.props;
        const {
            info,
            // isLogin,
        } = this.props.user;

        return (
            <Container>
                <div className={classes.avatar}>
                    <div className={classes.bg} />
                    {
                        info.avatar_url ?
                            <Avatar className={classes.avatarImg} src={info.avatar_url} />
                        :
                            <Avatar className={classes.avatarImg}>
                                <UserIcon />
                            </Avatar>
                    }
                    <span className={classes.userName}>{info.loginName || '未登录'}</span>
                </div>
                {this.props.children}
            </Container>
        )
    }
}

User.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
}

User.wrappedComponent.propTypes = {
    user: PropTypes.object.isRequired,
}

export default withStyles(userStyle)(User);
