import React, { Component } from 'react';

import { connect } from 'react-redux'
import { removeEvent, loadEvents, setFilter } from '../store/actions/eventActions'

import EventList from '../cmps/EventList'
import FilterBar from '../cmps/FilterBar'
import { CategoryLinks } from '../cmps/CategoryLinks';


class EventIndex extends Component {

    state = {
        prevScrollpos: 0,
        filterBarClass: 'active',
    }

    componentDidMount() {
        window.addEventListener('scroll', this.listenToScrollFilter);
        let filter = { ...this.props.filterBy, futureOnly: true, userId:'' };
        this.props.setFilter(filter)
            .then(()=>{this.props.loadEvents(this.props.filterBy)})
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScrollFilter);
    };

    listenToScrollFilter = () => {
        const currScrollPos = document.body.scrollTop || document.documentElement.scrollTop
        if (currScrollPos > this.state.prevScrollpos) {
            this.setState({ filterBarClass: 'inactive' })
        } else {
            this.setState({ filterBarClass: 'active' })
        }
        this.setState({ prevScrollpos: currScrollPos })
    }

    setScrollPos = (currentScrollPos) => {
        this.setState({ prevScrollpos: currentScrollPos })
    }

    onDelete = (eventId) => {
        this.props.removeEvent(eventId)
    }

    changeFilter =  (filterBy) => {
        let filter = { ...filterBy, futureOnly: true,userId:''};
        this.props.setFilter(filter)
            .then(()=>{this.props.loadEvents(this.props.filterBy)})
    }

    chooseCategory = (chosenCategory) => {
        const originalObj = { arr: [] };
        const myobj = { ...originalObj }

        myobj.arr.push('1');
        let filter = { ...this.props.filterBy };

        filter = { ...filter, sortBy: 'startAt', limit: null , category: chosenCategory }
        // filter.limit = null;
        // filter.category = chosenCategory;

        this.changeFilter(filter)
        // this.props.setFilter(gFilter)
        // .then(res => this.props.history.push(`/event/`));
    };


    render() {

        const { filterBarClass } = this.state; 

        return (

            <div className="event-index main-container ">
                <CategoryLinks chooseCategory={this.chooseCategory} currCtg={this.props.filterBy.category} />
                <FilterBar filterBarClass={filterBarClass} changeFilter={this.changeFilter} gFilter={this.props.filterBy} handleChange={this.handleChange} />
                {this.props.events && <EventList onDelete={this.onDelete} events={this.props.events} minimalLoggedInUser={this.props.minimalLoggedInUser}   />}
                {this.props.events.length === 0 && <h1 className="no-events">No Events found</h1>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        events: state.eventsStore.events,
        filterBy: state.eventsStore.filterBy,
        minimalLoggedInUser : state.userStore.minimalLoggedInUser
    };
};

const mapDispatchToProps = {
    loadEvents,
    setFilter,
    removeEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(EventIndex);