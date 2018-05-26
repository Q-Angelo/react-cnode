import React from 'react';
import { Link } from 'react-router-dom';
import Routers from '../config/route';

export default class App extends React.Component {
    componentDidMount() {
        // todo:
    }

    render() {
        return [
            <div key="1">
                <Link to="/"> 首页 </Link>
                <br />
                <Link to="/detail"> 详情页 </Link>
                <br />
                This is app 123
            </div>,
            <Routers key="2" />,
        ];
    }
}
