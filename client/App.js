import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import App from './views/App.jsx';
import appState from './store/app-state';

const root = document.getElementById('root');
const render = (Component) => {
    ReactDom.render(
        <AppContainer>
            <Provider appState={appState} >
                <BrowserRouter>
                    <Component />
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        root,
    );

    /* ReactDom.hydrate(
        <AppContainer>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
        </AppContainer>,
        root,
    ); */
}

render(App);

if (module.hot) {
    module.hot.accept('./views/App.jsx', () => {
    const NextApp = require('./views/App.jsx').default; // eslint-disable-line
        render(NextApp);
    });
}
