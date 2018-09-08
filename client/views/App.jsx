import React from 'react';
// import { Link } from 'react-router-dom';
import Routers from '../config/route';
import AppBar from './layout/app-bar';

export default class App extends React.Component {
    render() {
        return [
            <AppBar key="appBars" />,
            <Routers key="routers" />,
        ];
    }
}
