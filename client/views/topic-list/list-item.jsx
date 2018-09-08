import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { tabs } from '../../util/schema';
import { topicPrimaryStyle, topicSecondaryStyles } from './styles.js'

const Primary = ({ classes, topic }) => {
    const classNames = cx({
        [classes.tab]: true,
        [classes.top]: topic.top,
    })

    return (
        <div className={classes.root}>
            <span className={classNames}>{topic.top ? '置顶' : tabs[topic.tab]}</span>
            <span className={classes.title}>{topic.title}</span>
        </div>
    )
}

const Secondary = ({ classes, topic }) => (
    <span className={classes.root}>
        <span className={classes.userName}>{topic.author.loginname}</span>
        <span>
            <span className={classes.accentColor}>{topic.reply_count}</span>
            <span>/</span>
            <span className={classes.count}>{topic.visit_count}</span>
        </span>
        <span>创建时间: {topic.create_at}</span>
    </span>
)


Primary.propTypes = {
    topic: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

Secondary.propTypes = {
    topic: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const StylePrimary = withStyles(topicPrimaryStyle)(Primary);
const StyleSecondary = withStyles(topicSecondaryStyles)(Secondary);

const TopicListItem = ({ onClick, topic }) => (
    <ListItem button onClick={onClick}>
        <ListItemAvatar>
            <Avatar src={topic.author.avatar_url} />
        </ListItemAvatar>
        <ListItemText
          primary={<StylePrimary topic={topic} />}
          secondary={<StyleSecondary topic={topic} />}
        />
    </ListItem>
)

TopicListItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    topic: PropTypes.object.isRequired,
}

export default TopicListItem;
