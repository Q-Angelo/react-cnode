import AppState from './app-state';
import TopicStore from './topic-store';

export { AppState, TopicStore };

export default {
    AppState,
    TopicStore,
}

// createStoreMap 专门用于服务端渲染
export const createStoreMap = () => ({
    appState: new AppState(),
    topicStore: new TopicStore(),
})
