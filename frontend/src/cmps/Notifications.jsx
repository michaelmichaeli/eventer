import React from 'react'

import { NotificationPreview } from './NotificationPreview'

export function Notifications(props) {

    let unreadCount = 0;

    props.notification.msgs.forEach(msg => {
        if (!msg.isRead) unreadCount++;
    });

    return (
        <section className="notifications-container">
            <div className="not-header flex space-between">
                <h1>Notifications  </h1>
                {unreadCount > 0 && <p className="unread">{unreadCount} Unread</p>}
            </div>
            {/* <p>Total notifications {props.notification.msgs.length}</p> */}
            <div className="notifications-list">
                {props.notification.msgs.map(msg => <NotificationPreview notificationClicked={props.notificationClicked} key={msg._id} msg={msg} />)}
            </div>
        </section>
    )
}