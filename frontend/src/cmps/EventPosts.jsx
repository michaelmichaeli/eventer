import React, { Component } from 'react'
import { connect } from "react-redux";
import { addPost, removePost, updateEventLocal } from '../store/actions/eventActions.js'
import UserPreview from './UserPreview'
import Moment from 'moment';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import socketService from '../services/socketService';


class EventPosts extends Component {
    state = {
        post: '',
    }

    componentDidMount() {
        //  socketService.setup();
        // socketService.emit('viewEventDetails', this.props.event._id);
        socketService.on('newEventPost', this.socketAddPost);
        socketService.on('removeEventPost', this.socketRemovePost);
    }


    componentWillUnmount() {
        socketService.off('newEventPost', this.socketAddPost);
        socketService.off('removeEventPost', this.socketRemovePost);
    }

    socketAddPost = event => {
        this.props.updateEventLocal(event)
    };

    socketRemovePost = (event, postId) => {
        this.props.updateEventLocal(event)
    };

    onRemovePost = async (postId) => {
        this.props.removePost(this.props.event, postId)
        socketService.emit('removeEventPost', this.props.event);
    }

    handleInput = ({ target }) => {
        const value = (target.type === 'number') ? +target.value : target.value
        this.setState({ post: value })
    }

    handleSubmit = async (ev) => {
        ev.preventDefault();
        const event = await this.props.addPost(this.props.event, this.props.minimalLoggedInUser, this.state.post)
        socketService.emit('newEventPost', event);
        this.setState({ post: '' });
    }


    render() {
        return <section className="event-posts">
            <form onSubmit={this.handleSubmit}>
                <div className="post-input flex justify-center align-center">
                    <TextField variant="outlined" label="What's on your mind?" type="text" placeholder="Your line goes here" name="post" value={this.state.post} onChange={this.handleInput} />
                    <SendIcon className="send-post-icon" style={{ fontSize: 35 }} onClick={this.handleSubmit} color="primary" />
                </div>
            </form>
            <div className="posts-container">
                <ul className="posts">
                    {this.props.event.posts.map((post, idx) => (
                        <div className="post flex space-between align-center relative" key={idx}>
                            <div>
                                {post.author && <UserPreview key={idx} minimalUser={post.author} starred={false} />}
                                <p className="post-text">{post.text}</p>
                                {/* <p className="post-time">{Moment.unix(post.createdAt / 1000).format("DD/MM,HH:mm")} </p>   */}
                                <p className="post-time">{Moment(post.createdAt).fromNow()} </p>
                            </div>
                            {/* <DeleteIcon style={{ fontSize: 25 }} color="action" className="delete-post-icon" onClick={() => this.onRemovePost(post._id)} /> */}
                            {(this.props.isLoggedUserAdmin || this.props.minimalLoggedInUser._id === post.author._id || this.props.minimalLoggedInUser._id === this.props.event.createdBy._id)
                                && <DeleteIcon style={{ fontSize: 25 }} color="action" className="delete-post-icon" onClick={() => this.onRemovePost(post._id)} />}
                        </div>
                    ))}
                </ul>
            </div>
        </section>
    }
}

const mapStateToProps = (state) => {
    return {
        minimalLoggedInUser: state.userStore.minimalLoggedInUser,
        event: state.eventsStore.currEvent
    };
};

const mapDispatchToProps = {
    addPost, removePost, updateEventLocal
}
export default connect(mapStateToProps, mapDispatchToProps)(EventPosts);