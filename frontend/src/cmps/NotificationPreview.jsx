import React from 'react'
import UserPreview from './UserPreview'
import Moment from 'moment';

export function NotificationPreview(props) {
    // console.log(props.msg.type)
    let notificationTxt
    let notificationTopic
    switch (props.msg.type) {
        case 'update_event_details':
            notificationTxt = 'had updated '
            notificationTopic = 'event';
            break;
        case 'user_join_event':
            notificationTxt = 'had joined '
            notificationTopic = 'event';
            break;
        case 'user_left_event':
            notificationTxt = 'had left '
            notificationTopic = 'event';
            break;
        case 'new_event':
            notificationTxt = 'had created a new event'
            notificationTopic = 'event';
            break;
        case 'user_follow':
            notificationTxt = 'is following you now'
            notificationTopic = 'user';
            break;
        case 'user_unfollow':
            notificationTxt = 'had stopped following you'
            notificationTopic = 'user';
            break;
        case 'user_review':
            notificationTxt = 'had ranked you'
            notificationTopic = 'user';
            break;
        default:
            break;
    }

    return (
        <section className={`notification-preview flex align-items-end ${props.msg.isRead ? 'read' : ''}`}>

            <div onClick={() => { props.notificationClicked('user preview', null, null, props.msg._id) }}>
                <UserPreview minimalUser={props.msg.user} />
            </div>

            <div className="msg-body flex column align-items-end">

                <h4 onClick={() => { props.notificationClicked(notificationTopic, props.msg.user._id, props.msg.event._id, props.msg._id) }}>{props.msg.user.fullName + ' '}
                    {notificationTxt} {notificationTopic === 'event' ? props.msg.event.title : ' '}</h4>

                <p>{Moment(props.msg.createdAt).fromNow()} </p>
            </div>
        </section>
    )
}

