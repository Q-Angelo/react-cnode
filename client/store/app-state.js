import {
    observable,
    // computed,
    action,
    toJS,
} from 'mobx';

import { post, get } from '../util/http';

export default class Appstate {
    @observable user = {
        isLogin: false,
        info: {},
        detail: {
            recentTopics: [],
            recentReplies: [],
            recentCollections: [],
            syncing: false,
        },
    }

    init({ user }) {
        if (user) {
            this.user = user;
        }
    }

    @action login(accessToken) {
        return new Promise((resolve, reject) => {
            post('/user/login', {}, {
                accessToken,
            }).then((res) => {
                if (res.success) {
                    this.user.isLogin = true;
                    this.user.info = res.data;

                    console.log('---------->isLogin', this.user.isLogin);
                    console.log('---------->info.loginName', this.user.info.loginName);

                    resolve();
                } else {
                    reject(res);
                }
            }).catch(reject);
        })
    }

    @action getUserDetail() {
        this.user.detail.syncing = true;

        return new Promise((resolve, reject) => {
            get(`/user/${this.user.info.loginName}`).then(res => {
                if (res.success) {
                    this.user.detail.recentReplies = res.data.recent_replies;
                    this.user.detail.recentTopics = res.data.recent_topics;

                    resolve();
                } else {
                    reject();
                }

                this.user.detail.syncing = false;
            }).catch((err) => {
                this.user.detail.syncing = false;

                reject(err);
            });
        })
    }

    @action getCollections() {
        this.user.detail.syncing = true;

        return new Promise((resolve, reject) => {
            get(`/topic_collect/${this.user.info.loginName}`).then(res => {
                if (res.success) {
                    this.user.detail.recentCollections = res.data;

                    resolve();
                } else {
                    reject();
                }

                this.user.detail.syncing = false;
            }).catch((err) => {
                this.user.detail.syncing = false;

                reject(err);
            });
        })
    }

    toJson() {
        return {
            user: toJS(this.user),
        }
    }
}
