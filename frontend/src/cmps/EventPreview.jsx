import React from 'react';
import UserPreview from './UserPreview';
import Moment from 'moment';
import history from '../history.js'


export default function EventPreview(props) {

    // const eventDesc = (props.event.description.length >= 100) ? props.event.description.slice(0, 100) + '...' : props.event.description
    const imgUrl = ((props.event.imgUrl.includes('http') ? props.event.imgUrl : require(`../assets/imgs/${props.event.category.replace(/\s+/g, '')}.jpg`)))
    const timeArr = Moment(props.event.startAt * 1000).toString().split(' ')
    let nth = 'th'
    let labelClass = ''
    let labelTxt = (props.event.capacity) ?
        `${props.event.members.length}/${props.event.capacity} JOINED` : `${props.event.members.length} JOINED`

    if (props.event.capacity) labelClass = 'capacity'
    if (props.event.capacity === props.event.members.length) {
        labelClass = 'muted'
        labelTxt = 'SOLD OUT'
    }

    switch (timeArr[2].split('')[timeArr[2].split('').length - 1]) {
        case '1':
            nth = 'st'
            break;
        case '2':
            nth = 'nd'
            break;
        case '3':
            nth = 'rd'
            break;
        default:
            break;
    }

    if (timeArr[2] === '11' || timeArr[2] === '12' || timeArr[2] === '13') nth = 'th'

    const dateDisp = `${timeArr[1]} ${timeArr[2]}`
    
    const timeDisp = timeArr[4].slice(0, 5)

    return (


        <section className="event-preview flex column space-between">
            <div className="event-link" onClick={() => { history.push(`/event/${props.event._id}`) }}>
                <div className="event-img-container">
                    <img className="event-img" src={imgUrl} alt="" />
                </div>
                <div className={`label ${labelClass} flex align-center justify-center`}>
                    <p>{labelTxt}</p>
                </div>
                <p className="event-time">{dateDisp}<span>{nth}</span> {timeArr[3]} - {timeDisp}</p>
                <p className="event-title" >{props.event.title}</p>

                {/* <p className="event-desc">{eventDesc}</p> */}
                <p className="address">{props.event.location.address}</p>
            </div>
            <div className="flex column bottom-container">
                <div className="event-preview-bottom flex space-between align-center">
                    <UserPreview ranking minimalUser={props.event.createdBy} />
                    <p className="price" onClick={() => { history.push(`/event/${props.event._id}`) }}>{(props.event.price) ? `$${props.event.price}` : 'Free'}</p>
                    {props.minimalLoggedInUser && props.minimalLoggedInUser.isAdmin && <button onClick={()=>{props.onDelete(props.event._id)}}>Remove</button>}
                </div>
            </div>


        </section>
    );
}