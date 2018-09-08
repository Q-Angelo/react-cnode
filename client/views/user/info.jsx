import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import dateFormat from 'dateformat';

import UserWrapper from './user'
import { userInfoStyle } from './style'

const TopicItem = ({ topic, onClick }) => {
    return (
        <ListItem button onClick={onClick}>
            <Avatar src={topic.author.avatar_url} />
            <ListItemText
              primary={topic.title}
              secondary={`最新回复：${dateFormat(topic.last_reply_at, 'yy-mm-dd')}`}
            />
        </ListItem>
    )
}

TopicItem.propTypes = {
    topic: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}

@inject(stores => {
    return {
        appState: stores.appState,
        user: stores.appState.user,
    }
}) @observer
class UserInfo extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    constructor() {
        super();

        this.goToTopic = this.goToTopic.bind(this);
    }

    componentDidMount() {
        if (!this.props.appState.user.isLogin) {
            this.context.router.history.replace('/user/login');
        } else {
            this.props.appState.getUserDetail();
            this.props.appState.getCollections();
        }

        /* this.props.appState.getUserDetail();
        this.props.appState.getCollections(); */
    }

    goToTopic(id) {
        this.context.router.history.push(`/detail/${id}`);
    }

    render() {
        const { classes, user } = this.props;
        const topics = user.detail.recentTopics;
        const replies = user.detail.recentReplies;
        const collections = user.detail.recentCollections;

        return (
            <UserWrapper>
                <div className={classes.root}>
                    <Grid container spacing={6} align="stretch">
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2}>
                                <Typography className={classes.partTitle}>
                                    <span>最近发布的话题</span>
                                </Typography>
                                <List>
                                    {
                                        topics.length > 0 ?
                                        topics.map(topic => <TopicItem
                                          topic={topic}
                                          key={topic.id}
                                          onClick={() => this.goToTopic(topic.id)}
                                        />) :
                                        <Typography align="center">
                                            最近没有发布过话题
                                        </Typography>
                                    }
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2}>
                                <Typography className={classes.partTitle}>
                                    <span>新的回复</span>
                                </Typography>
                                <List>
                                    {
                                        replies.length > 0 ?
                                        replies.map(topic => <TopicItem
                                          topic={topic}
                                          key={topic.id}
                                          onClick={() => this.goToTopic(topic.id)}
                                        />) :
                                        <Typography align="center">
                                            最近没有新的回复
                                        </Typography>
                                    }
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2}>
                                <Typography className={classes.partTitle}>
                                    <span>收藏的话题</span>
                                </Typography>
                                <List>
                                    {
                                        collections.length > 0 ?
                                        collections.map(topic => <TopicItem
                                          topic={topic}
                                          key={topic.id}
                                          onClick={() => this.goToTopic(topic.id)}
                                        />) :
                                        <Typography align="center">
                                            还么有收藏话题哦
                                        </Typography>
                                    }
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </UserWrapper>
        )
    }
}

UserInfo.propTypes = {
    classes: PropTypes.object.isRequired,
}

UserInfo.wrappedComponent.propTypes = {
    appState: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
}

export default withStyles(userInfoStyle)(UserInfo)
