import React from 'react';
import {
    observer,
    inject,
} from 'mobx-react';
import PropTypes from 'prop-types';
import { AppState } from '../../store/app-state';

/**
 * inject拿到定义在provider上面的东西
 * 声明observer，store里面的内容更新之后，组建中的值也将更新
 */
@inject('appState') @observer
class TopicList extends React.Component {
    constructor() {
        super();
        this.onChangeName = this.onChangeName.bind(this);
    }

    componentDidMount() {
        // todo:
    }

    onChangeName(event) {
        this.props.appState.changeName(event.target.value)
    }

    render() {
        return (
            <div>
                {
                    this.props.appState.count > 0 ?
                        <div>
                            <input type="text" defaultValue={this.props.appState.name} style={{ border: '1px solid #000' }} onChange={this.onChangeName} />
                            <span> {this.props.appState.msg} </span>
                        </div>
                        :
                        '倒计时结束！'
                }
            </div>
        )
    }
}

export default TopicList;

/**
 * react开发中有一个强烈的建议， 我们写的组件用到的props都要去声明它的类型，以防在写代码时候乱用props出现的一些问题。
 */
/* TopicList.proptypes = {
    appState: PropTypes.object.isRequired,
} */

/**
 * js中万物皆对象，所以采用以下方法验证appState是不是class AppState的实例
 */

TopicList.propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
}
