import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';


export default function ImagePreview(props) {
    return (
        <div className="img-container flex column justify-center align-center">
            <img className="img-preview" src={props.img.src} alt=""></img>
            <DeleteIcon  style={{ fontSize: 25 }} color="action"  onClick={() => props.onDeleteImg(props.img._id)} />
        </div>
    )
}

