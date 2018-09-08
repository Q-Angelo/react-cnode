import React from 'react';
import {
    observer,
    inject,
} from 'mobx-react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Tab, Tabs, List, CircularProgress } from '@material-ui/core';
import queryString from 'query-string';

import { AppState } from '../../store/app-state';
import Container from '../layout/container';
import TopicListItem from './list-item';
import { tabs } from '../../util/schema';

/**
 * inject拿到定义在provider上面的东西
 * 声明observer，store里面的内容更新之后，组建中的值也将更新
 */
@inject(stores => {
    return {
        appState: stores.appState,
        topicStore: stores.topicStore,
    }
}) @observer
class TopicList extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }

    constructor() {
        super();

        this.handleTab = this.handleTab.bind(this);
        this.handleListItem = this.handleListItem.bind(this);
    }

    componentDidMount() {
        this.props.topicStore.fetchTopics(this.getTab());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search));
        }
    }

    bootstrap() {
        const query = queryString.parse(this.props.location.search);
        const { tab } = query;

        return this.props.topicStore.fetchTopics(tab || 'all')
            .then(() => true)
            .catch(() => false);
    }

    handleTab(e, value) {
        this.context.router.history.push({
            pathname: '/list',
            search: `?tab=${value}`,
        });
    }

    getTab(search) {
        const query = queryString.parse(search || this.props.location.search);

        return query.tab || 'all';
    }

    /* eslint-disable */
    handleListItem(id) {
        this.context.router.history.push(`/detail/${id}`);
    }
    /* eslint-enable */

    render() {
        const { topicStore, appState } = this.props;
        const topicList = topicStore.topics;
        const syncingTopics = topicStore.syncing;
        const { createdTopics } = topicStore;
        const { user } = appState;
        const tab = this.getTab();

        return (
            <Container>
                <Helmet>
                    <title>this is a topic list</title>
                    <meta name="description" content="this is topic description" />
                </Helmet>
                <Tabs value={tab} onChange={this.handleTab}>
                    {
                        Object.keys(tabs).map(t => (
                            <Tab key={t} label={tabs[t]} value={t} />
                        ))
                    }
                </Tabs>
                {
                    createdTopics && createdTopics.length > 0 ?
                        <List style={{ backgroundColor: '#dfdfdf' }}>
                            {
                                createdTopics.map(topic => {
                                    topic = Object.assign({}, topic, {
                                        author: user.info,
                                    });

                                    return (
                                        <TopicListItem
                                          key={topic.id}
                                          onClick={() => this.handleListItem(topic.id)}
                                          topic={topic}
                                        />
                                    )
                                })
                            }
                        </List>
                    : null
                }
                <List>
                    {
                        topicList.map((topic) => (
                            <TopicListItem
                              key={topic.id}
                              onClick={() => this.handleListItem(topic.id)}
                              topic={topic}
                            />
                        ))
                    }
                </List>
                {
                    syncingTopics ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                        }}>
                            <CircularProgress color="primary" size={100} />
                        </div>
                    ) : null
                }
            </Container>
        )
    }
}

/**
 * react开发中有一个强烈的建议， 我们写的组件用到的props都要去声明它的类型，以防在写代码时候乱用props出现的一些问题。
 */
/* TopicList.proptypes = {
    appState: PropTypes.object.isRequired,
} */


/**
 * js中万物皆对象，所以采用以下方法验证appState是不是class AppState的实例
 */

TopicList.wrappedComponent.propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
    topicStore: PropTypes.object.isRequired,
}

TopicList.propTypes = {
    location: PropTypes.object.isRequired,
}

export default TopicList
