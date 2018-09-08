import {
    observable,
    toJS,
    computed,
    action,
    extendObservable,
} from 'mobx';

import { get, post } from '../util/http';
import { topicSchema, replySchema } from '../util/schema';

const createTopic = (topic) => {
    return Object.assign({}, topicSchema, topic);
}

const createdReply = reply => {
    return Object.assign({}, replySchema, reply);
}

class Topic {
    constructor(data) {
        // 让我们的数据使用mobx的react特性，如果直接给this上面附加值，没有使用observable这种类型的，它的值就不是react的，这样值更新之后，组建里面是不会去更新的
        extendObservable(this, data);
    }
    @observable syncing = false;
    @observable createdReplies = [];
    @action doReply(content) {
        return new Promise((resolve, reject) => {
            post(`/topic/${this.id}/replies`, {
                needAccessToken: true,
            }, {
                content,
            }).then(res => {
                if (res.success) {
                    this.createdReplies.push(createdReply({
                        id: res.reply_id,
                        content,
                        create_at: Date.now(),
                    }))

                    resolve();
                } else {
                    reject(res);
                }
            }).catch(reject);
        })
    }
}

class TopicStore {
    @observable topics
    @observable details // 对话题详情进行缓存
    @observable syncing
    @observable createdTopics = []
    @observable tab

    constructor({
        syncing,
        topics,
        tab,
        details,
    } = {
        syncing: false,
        topics: [],
        tab: null,
        details: [],
    }) {
        this.syncing = syncing;
        this.topics = topics.map(topic => new Topic(createTopic(topic)));
        this.details = details.map(topic => new Topic(createTopic(topic)))
        this.tab = tab;
    }

    addTopic(topic) {
        this.topics.push(new Topic(createTopic(topic)));
    }

    @computed get detailMap() {
        return this.details.reduce((result, detail) => {
            result[detail.id] = detail;

            return result;
        }, {});
    }

    @action fetchTopics(tab) {
        return new Promise((resolve, reject) => {
            console.log('tab: ', tab, 'this.tab: ', this.tab);

            if (tab === this.tab && this.topics.length > 0) {
                resolve();
            } else {
                this.tab = tab;
                this.syncing = true;
                this.topics = [];

                get('/topics', {
                    mdrender: false, // 是否进行markdown编译
                    tab,
                }).then(res => {
                    if (res.success) {
                        // 优化
                        /*  res.data.forEach(topic => {
                            this.addTopic(topic);
                        }) */

                        this.topics = res.data.map(topic => {
                            return new Topic(createTopic(topic));
                        });

                        resolve();
                    } else {
                        reject();
                    }

                    this.syncing = false;
                }).catch(err => {
                    reject(err);

                    this.syncing = false;
                })
            }
        })
    }

    @action fetchTopicDetail(id) {
        return new Promise((resolve, reject) => {
            if (this.details[id]) {
                resolve(this.detailMap[id]);
            } else {
                get(`/topic/${id}`, {
                    mdrender: false,
                }).then((resp) => {
                    if (resp.success) {
                        const topic = new Topic(createTopic(resp.data));

                        this.details.push(topic);

                        resolve(topic);
                    } else {
                        reject();
                    }
                }).catch(reject);
            }
        });
    }

    @action createTopic(title, tab, content) {
        return new Promise((resolve, reject) => {
            post('/topics', {
                needAccessToken: true,
            }, {
                title,
                tab,
                content,
            }).then(res => {
                if (res.success) {
                    const topic = {
                        title,
                        tab,
                        content,
                        id: res.topic_id,
                        create_at: Date.now(),
                    }

                    this.createdTopics.push(new Topic(createTopic(topic)));

                    resolve();
                } else {
                    reject();
                }
            }).catch(reject);
        })
    }

    toJson() {
        return {
            topics: toJS(this.topics),
            syncing: this.syncing,
            details: toJS(this.details),
            tab: toJS(this.tab),
        }
    }
}

export default TopicStore
