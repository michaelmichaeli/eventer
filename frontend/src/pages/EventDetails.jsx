import React from 'react';
import { loadEvent, subscribeEvent, unsubscribeEvent, setFilter, updateEvent, updateEventLocal, clearEvent } from '../store/actions/eventActions.js'
import { connect } from "react-redux";
import Moment from 'moment';
import EventTags from '../cmps/EventTags'
import { NavLink } from "react-router-dom";
import MapContainer from '../cmps/MapContainer';
import { AttendeesList } from '../cmps/AttendeesList';
import { SocialShare } from '../cmps/SocialShare'
import UserPreview from '../cmps/UserPreview'
import EventPosts from '../cmps/EventPosts'
import EventImagesGallery from '../cmps/EventImagesGallery'
import Button from '@material-ui/core/Button';

import socketService from '../services/socketService';



class EventDetails extends React.Component {

  constructor(props) {
    super(props);
    this.titleInput = React.createRef();
    this.descriptionInput = React.createRef();
  }

  state = {
    loggedUser: '',
    title: '',
    description: '',
    isActive: true,
    images: []
  }


  componentDidMount() {
    if (this.props.match) {  // "preview" mode doesn't use URL and params...
      const { id } = this.props.match.params;
      this.props.loadEvent(id)
        .then(() => {
          // console.log('componentDidMount')
          socketService.emit('viewEventDetails', this.props.event._id);
          socketService.on('memberJoin', this.socketAddMemebr);
          socketService.on('memberLeave', this.socketLeaveMember);
        })
    }
  }

  componentDidUpdate(prevProps) { // To properly allow moving between event details thru the notifications
    if (!this.props.match) return
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const { id } = this.props.match.params;
      this.props.loadEvent(id)
        .then(() => {
          socketService.emit('viewEventDetails', this.props.event._id);
          socketService.on('memberJoin', this.socketAddMemebr);
          socketService.on('memberLeave', this.socketLeaveMember);
        })
    }
  }

  componentWillUnmount() {
    this.props.clearEvent()
    socketService.off('memberJoin', this.socketAddPost);
    socketService.off('memberLeave', this.socketRemovePost);
  }

  socketAddMemebr = event => {
    this.props.updateEventLocal(event)
  };

  socketLeaveMember = (event) => {
    this.props.updateEventLocal(event)
  };


  onUnsubscribeEvent = async (userId) => {
    const event = await this.props.unsubscribeEvent(this.props.event, userId)
    this.setState({ event })
    //Show live update of event members
    socketService.emit('memberLeave', event)
    //Send notification for all event members that someone had left
    const minimalEvent = {
      _id: this.props.event._id,
      title: this.props.event.title,
      imgUrl: this.props.event.imgUrl
    }
    const minimalUser = this.props.minimalLoggedInUser
    event.members.forEach(member => {
      const payload = {
        userId: member._id,
        minimalEvent,
        minimalUser,
        type: 'user_left_event'
      }
      socketService.emit('user left event', payload)
    })
    //Send notification also to the event creator
    const payload = {
      userId: this.props.event.createdBy._id,
      minimalEvent,
      minimalUser,
      type: 'user_left_event'
    }
    socketService.emit('user left event', payload)
  }

  onSubscribeEvent = async () => {
    const event = await this.props.subscribeEvent(this.props.event, this.props.minimalLoggedInUser)
    this.setState({ event })
    //Show live update of event members
    socketService.emit('memberJoin', event)
    //Send notification for all event members that someone new has joined
    const minimalEvent = {
      _id: this.props.event._id,
      title: this.props.event.title,
      imgUrl: this.props.event.imgUrl
    }
    const minimalUser = this.props.minimalLoggedInUser
    event.members.forEach(member => {
      const payload = {
        userId: member._id,
        minimalEvent,
        minimalUser,
        type: 'user_join_event'
      }
      socketService.emit('user left event', payload)
    })
    //Send notification also to the event creator
    const payload = {
      userId: this.props.event.createdBy._id,
      minimalEvent,
      minimalUser,
      type: 'user_join_event'
    }
    socketService.emit('user joined event', payload)
  }

  onSetCategory = (category) => {
    let filter = this.props.filterBy;
    filter.category = category;
    this.props.setFilter(filter)
      .then(res => this.props.history.push(`/event/`));
  };

  handleChange = (ev, field) => {
    this.setState({ [field]: ev.target.innerText })
  }

  onUpdateContent = (field, refInput) => {
    this.props.updateEvent(this.props.event, this.state[field], field)
    refInput.current.contentEditable = false
    //Update all members of the event
    const minimalEvent = {
      _id: this.props.event._id,
      title: this.props.event.title,
      imgUrl: this.props.event.imgUrl
    }
    const minimalUser = this.props.event.createdBy

    this.props.event.members.forEach(member => {
      const payload = {
        userId: member._id,
        minimalEvent,
        minimalUser,
        type: 'update_event_details'
      }
      socketService.emit('event got updated', payload)
    })
  }

  onPublishEvent = () => {
    this.props.updateEvent(this.props.event, true, 'isActive')
  }

  toggleEdit = (refInput) => {
    refInput.current.contentEditable = true
    refInput.current.focus()
  }


  render() {

    const { event } = this.props;

    const activeProps = this.props.previewEvent ? this.props.previewEvent : this.props.event
    if (!activeProps || !this.props.minimalLoggedInUser) return <div>LOADING...</div>

    if (this.props.previewEvent) { // handle timestamp for preview mode
      const startAtString = `${this.props.previewEvent.startDate} ${this.props.previewEvent.startTime}`
      const startAt = Math.round(new Date(startAtString).getTime() / 1000)
      this.props.previewEvent.startAt = startAt
    }

    const { _id, isActive, createdAt, title, category, imgUrl, description, startAt, location, createdBy, tags, images, members, price, capacity } = activeProps

    const dateStr = Moment(startAt * 1000).toString()
    const createdDateStr = createdAt ? Moment(createdAt * 1000).toString() : Moment(undefined).toString()
    // const updatedAtStr = updatedAt ? Moment(updatedAt * 1000).toString() : Moment(undefined).toString()
    const eventCostStr = price ? `Join for only $${price}` : 'Join for free!'
    const eventFull = (members.length === capacity) ? true : false

    const userInEvent = members.findIndex(member => member._id === this.props.minimalLoggedInUser._id)

    return (

      <div className="event-details main-container">

        <div className="event-details-container flex">

          <div className="nav-title flex column">

            {event && <div className="navigator flex align-center">
              <NavLink to="/">Eventer</NavLink>
              <span> > </span>
              <button className="btn-link" onClick={() => { this.onSetCategory(category) }}>{category}</button>
            </div>}


            {event && !isActive && <div className="flex align-center justify-center">
              <img className="icon-inactive" src={require('../assets/imgs/exclamation-mark.png')} title="Click to edit event title" alt=""></img>
              <h3 className="inactive-notification">Event isn't published yet</h3>
              <Button variant="contained" color="primary" onClick={() => this.onPublishEvent()}>Publish</Button>
            </div>
            }


            <div className="event-title flex justify-center align-items-end">
              <h2 contentEditable={false}
                suppressContentEditableWarning
                ref={this.titleInput}
                onFocus={() => this.setState({ title })}
                onInput={(ev => this.handleChange(ev, 'title'))}
                onBlur={() => this.onUpdateContent('title', this.titleInput)}
              >{title}
              </h2>
              {!this.props.previewEvent && this.props.minimalLoggedInUser._id === event.createdBy._id && <img onClick={() => this.toggleEdit(this.titleInput)} className="icon-edit" src={require('../assets/imgs/pencil.png')} title="Click to edit event title" alt=""></img>}
            </div>

          </div>


          <div className="date-time-and-edit flex space-between">
            <p className="event-time-place">
              <span className="event-weekday">{dateStr.split(' ')[0]} </span>
              <span className="event-month">{dateStr.split(' ')[1]} </span>
              <span className="event-day">{dateStr.split(' ')[2]} </span>
              <span className="event-year"> {dateStr.split(' ')[3]}, </span>
              <span className="event-time">  at   {dateStr.split(' ')[4].substring(0, 5)} </span>
              <span className="event-address"> in {location.address}</span>
            </p>
          </div>



          <div className="user-and-created">
            <UserPreview ranking={true} minimalUser={activeProps.createdBy} />
            <div className="flex space-between">
              <small>Created at
  <span> {createdDateStr.split(' ')[1]} </span>
                <span>{createdDateStr.split(' ')[2]} , </span>
                <span>{createdDateStr.split(' ')[3]} , </span>
                <span>{createdDateStr.split(' ')[4].substring(0, 5)}</span>
              </small>
              {event && !this.props.previewEvent && this.props.minimalLoggedInUser._id === event.createdBy._id && <NavLink className="user-preview-name-link advanced" exact to={`/event/edit/${_id}`}>Advanced Edit </NavLink>}
            </div>
          </div>


          <div className="img-gallery" >
            {images && <EventImagesGallery images={images}></EventImagesGallery>}
          {images.length === 0 && category && !imgUrl.includes('http') && <img src={require(`../assets/imgs/${category.replace(/\s+/g, '')}.jpg`)} alt=""></img>}
          </div>


          <div className="desc-container flex">
            <div className="event-desc">
              <p contentEditable={false}
                suppressContentEditableWarning
                ref={this.descriptionInput}
                onFocus={() => this.setState({ description })}
                onInput={(ev => this.handleChange(ev, 'description'))}
                onBlur={() => this.onUpdateContent('description', this.descriptionInput)}
              >{description}
              </p>
            </div>
              {!this.props.previewEvent && this.props.minimalLoggedInUser._id === event.createdBy._id && <img onClick={() => this.toggleEdit(this.descriptionInput)} className="icon-edit" src={require('../assets/imgs/pencil.png')} title="Click to edit event description" alt=""></img>}
          </div>




          <div className="tags-container">
            {tags && <EventTags tags={tags} />}
          </div>



          <section className="user-lists">
            <AttendeesList membersNum={members.length} capacity={capacity} followers={this.props.event.members} />
            <div className="cta-btns">
              {!this.props.previewEvent && !eventFull && userInEvent === -1 && this.props.minimalLoggedInUser._id !== createdBy._id && <button onClick={() => { this.onSubscribeEvent(this.props.minimalLoggedInUser._id) }} className="cta-btn attend">{eventCostStr}</button>}
              {!this.props.previewEvent && userInEvent >= 0 && <button onClick={() => { this.onUnsubscribeEvent(this.props.minimalLoggedInUser._id) }} className="cta-btn leave">Leave</button>}

            </div>

            <div className="social-share-container flex align-center justify-center">
              <SocialShare eventId={_id} eventTitle={title} />
            </div>

          </section>


          {event && !this.props.previewEvent && <EventPosts eventCreatorId={this.props.event.createdBy._id} isLoggedUserAdmin={this.props.minimalLoggedInUser.isAdmin} />}

          <div className="map-container">
            <div className="map">
              <MapContainer loc={location} name={location.address} />
            </div>
          </div>

        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    event: state.eventsStore.currEvent,
    minimalLoggedInUser: state.userStore.minimalLoggedInUser,
    filterBy: state.eventsStore.filterBy

  };
};


const mapDispatchToProps = {
  loadEvent, unsubscribeEvent, subscribeEvent, setFilter, updateEvent, updateEventLocal, clearEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);