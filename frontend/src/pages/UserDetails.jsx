import React, { Component } from 'react'
import { connect } from 'react-redux'

import { UserDesc } from '../cmps/UserDesc'
import { ReviewForm } from '../cmps/ReviewForm'
import { ReviewList } from '../cmps/ReviewList'
import { MinimalEventList } from '../cmps/MinimalEventList'
import { FollowUserList } from '../cmps/FollowUserList'

import { addReview, loadUser, loadUserLocal, addFollower, removeFollower, login, clearUser } from '../store/actions/userActions'
import { loadEvents, setFilter } from '../store/actions/eventActions'

import socketService from '../services/socketService';
import eventBusService from "../services/eventBusService.js";



class UserDetails extends Component {

    state = {
        isLoggedInUser: false,
        currUserId: '',
        followers: null,
        loggedInUser: ''
    }

    componentDidMount() {
        this.unsubscribeFromEventBus = eventBusService.on('user-preview-click', (userId) => {
            this.initPage(userId)
        })
        this.initPage()
    }

    initPage = async (userId) => {
        let id = (userId) ? userId : this.props.match.params.id
        this.props.loadUserLocal(id)
        let filter = { ...this.props.filterBy, futureOnly: false, isActive: 'show all' };
        // let filter = { ...this.props.filterBy, futureOnly: false, userId: id, isActive: 'show all' }; //Need all events, as we show also the subscribed events...
        this.props.setFilter(filter)
            .then(() => { this.props.loadEvents(this.props.filterBy) })

        const { loggedInUser } = this.props;

        if (loggedInUser) {
            if (id === loggedInUser._id) { // logged-in user opens his own details pages
                this.setState({ isLoggedInUser: true });
            } else {   // logged-in user opens other user page
                this.setState({ isLoggedInUser: false });
            }
        }

    }

    componentWillUnmount() {
        this.props.clearUser()
        this.unsubscribeFromEventBus()
    }




    submitReview = async (newReview) => {
        const user = await this.props.addReview(newReview, this.props.currUser)
        //Send notification to the user that got the review
        const minimalUser = this.props.minimalLoggedInUser
        const payload = {
            userId: user._id,
            minimalEvent: {},
            minimalUser,
            type: 'user_review'
        }
        socketService.emit('user rank', payload)
    }
    checkFollowing = () => {
        const loggedInUser = this.props.loggedInUser
        const followerIdx = this.props.currUser.followers.findIndex(follower => follower._id === loggedInUser._id)
        if (followerIdx >= 0) return true;
        return false;
    }

    addFollower = async (loggedInUser) => {
        const user = this.props.currUser;
        await this.props.addFollower(user, loggedInUser);
        const payload = {
            userId: user._id,
            minimalEvent: {},
            minimalUser: this.props.minimalLoggedInUser,
            type: 'user_follow'
        }
        socketService.emit('user follow', payload)

    }
    removeFollower = async (loggedInUser) => {
        const user = this.props.currUser;
        await this.props.removeFollower(user, loggedInUser);
        const payload = {
            userId: user._id,
            minimalEvent: {},
            minimalUser: this.props.minimalLoggedInUser,
            type: 'user_unfollow'
        }
        socketService.emit('user unfollow', payload)
    }



    render() {
        const { loggedInUser, events } = this.props;
        const { isLoggedInUser } = this.state;
        const user = this.props.currUser;

        const createdEvents = events.filter(event => event.createdBy._id === this.props.currUser._id)
        const subscribedEvents = events.filter(event => event.members.find(member => member._id === this.props.currUser._id))

        if (!loggedInUser) return <div>Loading...</div>
        return (
            <React.Fragment>
                <main className="user-grid-container">
                    {user && <section className="user-details-container">

                        {user && <UserDesc checkFollowing={this.checkFollowing} createdEvents={createdEvents} subscribedEvents={subscribedEvents}  isLoggedInUser={this.state.isLoggedInUser} user={user} addFollower={this.addFollower} removeFollower={this.removeFollower} loggedInUser={loggedInUser} />}

                        {!isLoggedInUser && this.props.currUser._id !== this.props.minimalLoggedInUser._id &&
                            <ReviewForm
                                submitReview={this.submitReview}
                                minimalUser={this.props.minimalLoggedInUser} />}

                        <ReviewList reviews={user.reviews} />

                        <div className="user-lists">
                            <MinimalEventList createdEvents={createdEvents} subscribedEvents={subscribedEvents} loggedInUser={loggedInUser} />
                            {user.followers && <FollowUserList followers={user.followers} />}
                        </div>

                    </section>}
                    <img className="user-details-bg" src={require('../assets/imgs/user-details-bg-2.jpg')} alt="" />    
                </main>

                

            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    const { loggedInUser, minimalLoggedInUser, currUser } = state.userStore;

    return {
        loggedInUser,
        minimalLoggedInUser,
        currUser,
        events: state.eventsStore.events,
        filterBy: state.eventsStore.filterBy
    };
};



const mapDispatchToProps = {
    addReview,
    loadUser,
    loadUserLocal,
    loadEvents,
    setFilter,
    addFollower,
    removeFollower,
    login,
    clearUser
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);