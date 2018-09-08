import React from 'react';
import axios from 'axios';

import Container from '../layout/container';

/* eslint-disable */
export default class TestApi extends React.Component {
    constructor() {
        super();

        this.getTopics = this.getTopics.bind(this);
    }

    getTopics() {
        axios.get('/api/topics')
            .then(result  => console.log(result))
    }

    getTopicDetail() {
        axios.get('/api/topic/5a9661ff71327bb413bbff5b')
            .then(result  => console.log(result))
    }

    login() {
        axios.post('/api/user/login', {
            accessToken: 'abcd4690-121d-498a-903e-4d5116fb2ea5'
        })
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    markAll() {
        axios.post('/api/message/mark_all?needAccessToken=true')
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <Container>
                <button onClick={this.getTopics}> topics </button>
                <button onClick={this.getTopicDetail}> topic detail </button>
                <button onClick={this.login}> login </button>
                <button onClick={this.markAll}> markAll </button>
            </Container>
        )
    }
}

/* eslint-enable */
