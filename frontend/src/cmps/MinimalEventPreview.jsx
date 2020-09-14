import React from 'react'
import {Link} from 'react-router-dom'

export default function MinimalEventPreview(props) {
    
    const imgUrl = ((props.event.imgUrl.includes('http') ? props.event.imgUrl : require(`../assets/imgs/${props.event.category.replace(/\s+/g, '')}.jpg`)))

    return (
        <React.Fragment> 
           <Link className="link" to={`/event/${props.event._id}`}><li className="flex align-center">
                <img className="avatar" src={imgUrl} alt="" />
                <h2>{props.event.title}</h2>
            </li></Link>

        </React.Fragment>
    )
}
