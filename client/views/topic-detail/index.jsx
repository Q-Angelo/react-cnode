import React from 'react';
import {
    observer,
    inject,
} from 'mobx-react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import dateFormat from 'dateformat';
import SimpleMDE from 'react-simplemde-editor';
import Button from '@material-ui/core/Button'
import IconReply from '@material-ui/icons/Reply'

import Container from '../layout/container';
import { tabs } from '../../util/schema'
import Reply from './reply';
import { topicDetailStyle } from './styles'

@inject(stores => {
    return {
        user: stores.appState.user,
        topicStore: stores.topicStore,
    }
}) @observer
class TopicDetail extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    constructor() {
        super();

        this.state = {
            newReplyVal: '',
        }
        this.handleNewReplyChange = this.handleNewReplyChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSubmitReply = this.handleSubmitReply.bind(this);
    }

    componentDidMount() {
        this.props.topicStore.fetchTopicDetail(this.getId())
    }

    getId() {
        return this.props.match.params.id;
    }

    handleNewReplyChange(value) {
        this.setState({
            newReplyVal: value,
        });
    }

    handleLogin() {
        this.context.router.history.push('/user/login');
    }

    handleSubmitReply() {
        const topic = this.props.topicStore.detailMap[this.getId()];

        topic.doReply(this.state.newReplyVal).then(() => {
            this.setState({
                newReplyVal: '',
            });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const { classes, user } = this.props;
        const topic = this.props.topicStore.detailMap[this.getId()];

        if (!topic) {
            return (
                <Container>
                    <CircularProgress color="primary" size={100} />
                </Container>
            )
        }

        return (
            <div>
                <Container>
                    <header className={classes.header}>
                        <h3>{topic.title}</h3>
                        <p>
                            <span className={classes.header.spanKey}>发布时间: </span>
                            <span>{dateFormat(topic.create_at, 'yyyy-mm-dd')}</span>
                            <span>作者: </span>
                            <span className={classes.header.spanKey}>{topic.author.loginname}</span>
                            <span>浏览次数: </span>
                            <span>{topic.visit_count}</span>
                            <span className={classes.header.spanKey}>最近一次编辑时间: </span>
                            <span>{dateFormat(topic.last_reply_at, 'yyyy-mm-dd')}</span>
                            <span className={classes.header.spanKey}>来自: </span>
                            <span>{tabs[topic.tab]}</span>
                        </p>
                    </header>
                    <section className={classes.body}>
                        <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
                    </section>
                </Container>
                {
                    topic.createdReplies && topic.createdReplies.length > 0 ?
                        (
                            <Paper elevation={4} className={classes.replies}>
                                <header className={classes.replyHeader} >
                                    <span>我的最新回复</span>
                                    <span>{`${topic.createdReplies.length} 条`}</span>
                                </header>
                                {
                                    topic.createdReplies.map((reply) => (
                                        <Reply
                                          key={reply.id}
                                          reply={Object.assign({}, reply, {
                                              author: {
                                                  avatar_url: user.info.avatarUrl,
                                                  loginname: user.info.loginName,
                                              },
                                          })}
                                        />
                                    ))
                                }
                            </Paper>
                        ) : null
                }
                <Paper elevation={4} className={classes.replies} >
                    <header className={classes.replyHeader} >
                        <span>{`${topic.reply_count}回复`}</span>
                        <span>{`最新回复 ${dateFormat(topic.last_reply_at, 'yyyy-mm-dd')}`}</span>
                    </header>
                    {
                        user.isLogin ? (
                            <section className={classes.replyEditor}>
                                <SimpleMDE
                                  onChange={this.handleNewReplyChange}
                                  value={this.state.newReplyVal}
                                  options={{
                                    toolBar: false,
                                    autoFocus: false,
                                    spellChecker: false,
                                    placeholder: '请回复您的精彩评论',
                                  }}
                                />
                                <Button
                                  variant="fab"
                                  color="primary"
                                  onClick={this.handleSubmitReply}
                                  className={classes.replyButton}
                                >
                                    <IconReply />
                                </Button>
                            </section>
                        ) : null
                    }
                    {
                        !user.isLogin ?
                            <section className={classes.notLoginButton}>
                                <Button variant="raised" color="primary" onClick={this.handleLogin}>
                                    登陆并评价
                                </Button>
                            </section>
                        :
                            null
                    }
                    <section className={classes.replyBody}>
                        { topic.replies.map(replie => <Reply key={replie.id} reply={replie} />) }
                    </section>
                </Paper>
            </div>
        )
    }
}

TopicDetail.wrappedComponent.propTypes = {
    topicStore: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
}

TopicDetail.propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyle)(TopicDetail);
