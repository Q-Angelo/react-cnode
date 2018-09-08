import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio';
import IconReply from '@material-ui/icons/Reply'
import withStyles from '@material-ui/core/styles/withStyles'
import SimpleMDE from 'react-simplemde-editor';
import Snackbar from '@material-ui/core/Snackbar'

import topicCreateStyle from './style';
import Container from '../layout/container';
import { tabs } from '../../util/schema.js';

@inject(stores => {
    return {
        topicStore: stores.topicStore,
    }
}) @observer
class TopicCreate extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    constructor() {
        super();

        this.state = {
            title: '',
            content: '',
            tab: 'dev',
            open: false,
            message: '',
        }
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleTitleChange(e) {
        this.setState({
            title: e.target.value,
        })
    }

    handleContentChange(value) {
        this.setState({
            content: value,
        })
    }

    handleChangeTab(e) {
        this.setState({
            tab: e.currentTarget.value,
        })
    }

    handleCreate() {
        const { title, tab, content } = this.state;

        if (!title) {
            return this.showMessage('标题必须填写!');
        }

        if (!content) {
            return this.showMessage('内容必须填写!');
        }

        return this.props.topicStore.createTopic(title, tab, content).then(() => {
            this.context.router.history.push('/list');
        }).catch(err => {
            this.showMessage(err.message)
        })
    }

    showMessage(message) {
        this.setState({
            open: true,
            message,
        })
    }

    handleClose() {
        this.setState({
            open: false,
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <Container>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  message={this.state.message}
                  open={this.state.open}
                  onClose={this.handleClose}
                />
                <div className={classes.root}>
                    <TextField
                      className={classes.title}
                      label="标题"
                      value={this.state.title}
                      onChange={this.handleTitleChange}
                      fullWidth
                    />
                    <SimpleMDE
                      onChange={this.handleContentChange}
                      value={this.state.content}
                      options={{
                        toolbar: false,
                        spellChecker: false,
                        placeholder: '发表你的精彩意见',
                      }}
                    />
                    <div>
                        {
                            Object.keys(tabs).map(tab => {
                                if (tab !== 'all' && tab !== 'good') {
                                    return (
                                        <span className={classes.selectItem} key={tab}>
                                            <Radio
                                              value={tab}
                                              checked={tab === this.state.tab}
                                              onChange={this.handleChangeTab}
                                            />
                                            {tabs[tab]}
                                        </span>
                                    )
                                }

                                return null
                            })
                        }
                    </div>
                    <Button variant="fab" color="primary" onClick={this.handleCreate} className={classes.replyButton}>
                        <IconReply />
                    </Button>
                </div>
            </Container>
        )
    }
}

TopicCreate.wrappedComponent.propTypes = {
    topicStore: PropTypes.object.isRequired,
}

TopicCreate.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(topicCreateStyle)(TopicCreate)
