import React from 'react'
import UserPreview from './UserPreview'

export function AttendeesList(props) {

    const { membersNum, capacity } = props;

    let str;

    if (membersNum === 0) str = 'Be for the first one to join...'
    if (!capacity && membersNum > 0) str = `${membersNum}  had joined`
    if (capacity) {
        if (membersNum === capacity) str = `Event Full with ${membersNum} people`
        if (membersNum < capacity) str = `${membersNum} / ${capacity} had joined`
        if (membersNum === 0) str = 'Be for the first one to join...'
    }

    return (
        <section className="follow-list-container user-details-list">

            <div className="list-header flex align-center space-between">
                <h4>Attending</h4>
                <h5 className="attendees-state">{str}</h5>
            </div>
            <div className="list">
                {props.followers && <div className="followers-grid">
                    {props.followers.map(follower => <UserPreview key={follower._id} minimalUser={follower} />)}
                </div>}
            </div>
        </section>
    )
}
