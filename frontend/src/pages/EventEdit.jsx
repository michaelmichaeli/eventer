import React from 'react';
import { saveEvent, loadEvent } from '../store/actions/eventActions.js';
import { connect } from "react-redux";
import eventService from '../services/eventService.js';
import googleService from '../services/googleService.js';
import EventDetails from '../pages/EventDetails';
import ImagePreview from '../cmps/ImagePreview'
import utilService from '../services/utilService'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import socketService from '../services/socketService';





class EventEdit extends React.Component {

    constructor(props) {
        super(props);
        this.priceInput = React.createRef();
        this.capacityInput = React.createRef();
    }


    state = {
        validationMsg: '',
        category: 'Choose Category',
        title: '',
        description: '',
        imgUrl: '',
        startDate: '',
        startTime: '20:00',
        startAt: '',
        address: 'Tel Aviv',
        price: 0,
        isActive: true,
        capacity: '',
        tags: [],
        _id: '',
        enablePrice: false,
        enableMaxCapacity: false,
        selectedTab: 'form',
        images: [],
        widget: ''

    }

    componentDidMount() {
        // TODO: mb try switching to React cloudinary
        let widget = window.cloudinary.createUploadWidget({
            cloudName: 'dsqh7qhpg',
            uploadPreset: 'lh8fyiqe',
            maxFiles: 5
        }, (error, result) => { this.checkUploadResult(result) });
        this.setState({ widget })
        var todayDate = new Date(); //Getting current date (default date) in the right format
        const todayDateString = todayDate.getFullYear() + '-' +
            ('0' + (todayDate.getMonth() + 1)).slice(-2) + '-' +
            ('0' + todayDate.getDate()).slice(-2)
        this.setState({
            startDate: todayDateString,
        })
        this.loadEvent();
    }

    loadEvent = async () => {
        const { id } = this.props.match.params;
        if (!id) return; // As it is s a new event, nothing to load... 
        const event = await eventService.get(id) //Making sure only event creator can edit
        if (this.props.minimalLoggedInUser._id !== event.createdBy._id) {
            return this.props.history.push('/')
        }
        else {  // Price check-box status
            let enablePrice = event.price ? true : false
            let enableMaxCapacity = event.capacity ? true : false  // Max-capacity check-box status
            this.setState({
                ...event,
                address: event.location.address,
                enablePrice,
                enableMaxCapacity
            });
        }
    }

    handleChange = (ev) => {
        let { name, value } = ev.target;
        value = ev.target.type === 'number' ? parseInt(value) : value;
        this.setState(prevState => (
            { ...prevState.filter, [name]: value }
        ));
    }

    handleSubmit = async (ev) => {
        ev.preventDefault();
        const validForm = this.isFormValid()
        if (!validForm) return

        let event = this.state

        let isNewEvent = event._id ? false : true

        const startAtString = `${event.startDate} ${event.startTime}`
        const startAt = Math.round(new Date(startAtString).getTime() / 1000)
        event.startAt = startAt

        //handle tags
        let tagsArr;
        if (event.tags && (typeof event.tags === 'string')) {
            tagsArr = event.tags.split(',')
            event.tags = tagsArr
        } else {
            tagsArr = []
        }

        event.imgUrl = this.state.imgUrl ? this.state.imgUrl : `../assets/imgs/${event.category.replace(/\s+/g, '')}.jpg`

        if (isNewEvent) { //additions to new event
            event.createdBy = this.props.minimalLoggedInUser
            event.createdAt = Math.round(Date.now() / 1000)
            event.members = []
            event.posts = []
        } else {
            event.updatedAt = Math.round(Date.now() / 1000)
        }

        //handle getting lat/lng
        const location = await this.translateAddressToLatLng(event.address)
        event.location = location

        delete event.validationMsg;
        delete event.address;
        delete event.enablePrice;
        delete event.enableMaxCapacity;
        delete event.selectedTab;
        delete event.widget;

        event = await this.props.saveEvent(event)
        if (isNewEvent) { //New event
            this.socketNewEvent(event)
        }
        else {              //Update existing event
            this.socketUpdateEvent()
        }
        this.props.history.push(`/event/${event._id}`)
    }

    togglePrice = () => {
        this.setState((prevState) => {
            return {
                enablePrice: !prevState.enablePrice,
                price: 0
            }
        })
    }

    toggleMaxCapacity = () => {
        this.setState((prevState) => {
            return {
                enableMaxCapacity: !prevState.enableMaxCapacity,
                capacity: ''
            }
        })
    }

    isFormValid = () => {
        const clearValidationMsg = () => this.setState({ validationMsg: '' })
        if (this.state.category === 'Choose Category') {
            this.setState({ validationMsg: 'You need to choose a category!' }, () => {
                setTimeout(clearValidationMsg, 2000)
            })
            return false
        }
        if (this.state.address === '') {
            this.setState({
                validationMsg: 'You need to choose an address!'
            }, () => {
                setTimeout(clearValidationMsg, 2000)
            })
            return false;
        }
        return true;
    }

    translateAddressToLatLng = async (address) => {
        const latlng = await googleService.getLatLng(address)
        try {
            const location = { address: this.state.address }
            if (latlng) {
                location.lat = latlng.lat ? latlng.lat : ''
                location.lng = latlng.lng ? latlng.lng : ''
            }
            else {
                location.lat = 0
                location.lng = 0
            }
            return location
        }
        catch (err) {
            console.log('Error in google geocode request: ', err)
        }
    }

    onTabSelect = async (type) => {
        if (type === 'form') {
            this.setState({ selectedTab: 'form' })
            return
        }

        const validForm = this.isFormValid()
        if (!validForm) return

        if (!this.state.createdBy) { // setup preview mode
            this.setState({
                createdBy: this.props.minimalLoggedInUser,
                members: [
                    {
                        "_id": "u105",
                        "fullName": "Dummy User",
                        "imgUrl": "https://data.whicdn.com/images/327969838/original.jpg",
                    }
                ]
            })
        }

        const location = await this.translateAddressToLatLng(this.state.address)
        this.setState({
            location,
            selectedTab: 'preview'
        })
    }

    onToggleActive = async () => {
        this.setState((prevState) => {
            return {
                isActive: !prevState.isActive,
            }
        })
    }

    showWidget = (widget) => {
        widget.open()
    }

    checkUploadResult = (resultEvent) => {
        if (resultEvent.event === 'success') {
            const img = {
                src: resultEvent.info.url,
                thumbnail: resultEvent.info.url,
                thumbnailWidth: resultEvent.info.width,
                thumbnailHeight: resultEvent.info.height,
                _id: utilService.makeId(),
                caption: "Your image"
            }
            this.setState((prevState) => {
                return {
                    imgUrl: img.src,
                    images: [...prevState.images, img]
                }
            })
        }
    }

    socketNewEvent = (event) => {
        console.log('socketNewEvent', event)
        //Send notification for all user followers about the new event
        const minimalEvent = {
            _id: event._id,
            title: this.state.title,
            imgUrl: this.state.imgUrl
        }
        const minimalUser = this.props.minimalLoggedInUser
        // console.log('minimalUser',minimalUser)
        this.props.loggedInUser.followers.forEach(follower => {
            const payload = {
                userId: follower._id,
                minimalEvent,
                minimalUser,
                type: 'new_event'
            }
            console.log('follower._id,', follower._id)
            socketService.emit('new event created', payload)
        })
    }

    socketUpdateEvent = () => {
        //Send notification for all event members about the event update
        const minimalEvent = {
            _id: this.state._id,
            title: this.state.title,
            imgUrl: this.state.imgUrl
        }
        const minimalUser = this.props.minimalLoggedInUser

        this.state.members.forEach(member => {
            const payload = {
                userId: member._id,
                minimalEvent,
                minimalUser,
                type: 'update_event_details'
            }
            socketService.emit('event got updated', payload)
        })
    }

    onDeleteImg = (imgId) => {
        this.setState(prevState => (
            {
                ...prevState,
                images: this.state.images.filter(img => img._id !== imgId)
            }
        ));
    }

    render() {
        const { category, title, description,
            startDate, startTime, address, price,
            capacity, tags, _id, imgUrl, images } = this.state;

        return (
            <div className="main-container">
                {this.state.selectedTab === "form" && <div className="bg-img-container">
                    <img className="bg-img" src={require("../assets/imgs/form-background.jpg")} alt="" />
                </div>}
                <section className="form-container">
                    <Tabs>
                        <TabList>
                            <Tab onClick={() => this.onTabSelect('form')}> Setup your event</Tab>
                            <Tab onClick={() => this.onTabSelect('preview')}>See event's draft</Tab>
                        </TabList>
                        <TabPanel />
                        <TabPanel />
                    </Tabs>
                    {this.state.selectedTab === 'form' &&
                        <div>
                            <form className="event-edit flex justify-center" onSubmit={this.handleSubmit}>
                                <div className="event-desc flex column align-start">
                                    <FormControl required>
                                        <InputLabel>Cateogry</InputLabel>
                                        <Select name="category" value={category} onChange={this.handleChange} label="Category">
                                            <MenuItem value="Choose Category">Choose Category</MenuItem>
                                            <MenuItem value="Stand-up Comedy">Stand-up Comedy</MenuItem>
                                            <MenuItem value="Sports">Sports</MenuItem>
                                            <MenuItem value="Live Music">Live Music</MenuItem>
                                            <MenuItem value="Parties">Parties</MenuItem>
                                            <MenuItem value="Lectures">Lectures</MenuItem>
                                            <MenuItem value="Workshops">Workshops</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField label="Title" type="text" name="title" value={title} onChange={this.handleChange} />
                                    <TextField className="textarea-input" label="Description" multiline rows={8} name="description" variant="outlined" onChange={this.handleChange} value={description} />
                                    <TextField label="Tags" placeholder="Comma seperated" type="text" name="tags" value={tags} onChange={this.handleChange} />
                                </div>
                                <div className="flex column">
                                    <TextField className="address" label="Where?" type="text" name="address" value={address} onChange={this.handleChange} required />
                                    <label className="time-label">When?
                                <div className="time-input-container flex">
                                            <input className="date-input" type="date" name="startDate" onChange={this.handleChange} value={startDate} />
                                            <input className="time-input" type="time" name="startTime" onChange={this.handleChange} value={startTime} />
                                        </div>
                                    </label>
                                    <FormGroup>
                                        <FormControlLabel className="switch"
                                            control={<Switch onChange={this.togglePrice} checked={this.state.enablePrice} color="primary" />}
                                            label="Enternece fee?"
                                        />
                                        {this.state.enablePrice &&
                                            <TextField className="text-switch" label="How much?" type="number" name="price" value={price} onChange={this.handleChange} ref={this.priceInput} />}
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControlLabel className="switch"
                                            control={<Switch onChange={this.toggleMaxCapacity} checked={this.state.enableMaxCapacity} color="primary" />}
                                            label="Limit guests?"
                                        />
                                        {this.state.enableMaxCapacity &&
                                            <TextField className="text-switch-capacity" label="How many?" type="number" name="capacity" value={capacity} onChange={this.handleChange} ref={this.capacityInput} />}
                                    </FormGroup>
                                    <FormGroup >
                                        <FormControlLabel className="switch"
                                            control={<Switch onChange={this.onToggleActive} checked={this.state.isActive} color="primary" />}
                                            label="Event active and visible"
                                        />
                                    </FormGroup>
                                    <input
                                        type="hidden"
                                        name="_id"
                                        value={_id}
                                    />
                                    <Button className="upload-button" variant="contained" color="primary" onClick={() => this.showWidget(this.state.widget)}>Upload images</Button>
                                    <Button onClick={this.handleSubmit} className="save-button" variant="contained" color="primary"> Save Event </Button>
                                    <h3>{this.state.validationMsg}</h3>
                                </div>
                            </form >
                            <div className="images-container flex justify-center align-center">
                                {images.length === 0 && category === 'Choose Category' && < h3 > Waiting for your images...</h3>}
                                {images.length === 0 && category !== 'Choose Category' && <div className="img-container">
                                    {category && !imgUrl.includes('http') && <img className="img-preview" src={require(`../assets/imgs/${category.replace(/\s+/g, '')}.jpg`)} alt=""></img>}
                                </div>}
                                {images.length > 0 && <div className="img-upload-container flex wrap space-between">
                                    {/* {images.map((img, index) => { return <img className="img-preview" key={index} src={img.src} alt=""></img> })} */}
                                    {images.map((img, index) => { return <ImagePreview key={index} img={img} onDeleteImg={this.onDeleteImg} /> })}
                                </div>}
                            </div>
                        </div>}

                    {this.state.selectedTab === 'preview' && <EventDetails previewEvent={this.state} />}

                </section >

            </div>

        )
    }
}


const mapStateToProps = (state) => {
    return {
        minimalLoggedInUser: state.userStore.minimalLoggedInUser,
        loggedInUser: state.userStore.loggedInUser //todo this is quick-fix for the missing followers in the minimalLoggedin user
    };
};

const mapDispatchToProps = {
    saveEvent, loadEvent
}
export default connect(mapStateToProps, mapDispatchToProps)(EventEdit);