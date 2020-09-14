import React from 'react'

export default function EventTags(props) {
    const { tags } = props
    let tagsArr
    if (typeof tags === 'string') {
        tagsArr = tags.split(',')
    }
    else tagsArr = tags

    return (<div className="event-tags">
        <ul className="clean-list flex justify-">
            {tagsArr.map(tag => { return <li className="event-tag" key={tag}>{tag}</li> })}
        </ul>
    </div>

    )
}
