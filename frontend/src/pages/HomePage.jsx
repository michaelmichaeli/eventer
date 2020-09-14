import React, { Component } from 'react'

import { connect } from 'react-redux'
import { setFilter, loadEvents } from '../store/actions/eventActions'
import { setHomePage } from '../store/actions/appActions'

import SearchBar from '../cmps/SearchBar'
import { CategoryLinks } from '../cmps/CategoryLinks'
import UpcomingEvents from '../cmps/UpcomingEvents'
import CategoryGallery from '../cmps/CategoryGallery'

class HomePage extends Component {

    state = {
        isSearchBar: true
    }

    componentDidMount() {
        window.addEventListener('scroll', this.listenToScrollHome)
        this.props.setHomePage(true);

        let filter = { ...this.props.filterBy, futureOnly: true, userId: '' };
        this.props.setFilter(filter)
            .then(() => { this.props.loadEvents(this.props.filterBy) })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScrollHome)
        this.props.setHomePage(false);
    };


    listenToScrollHome = () => {
        const winScroll =
            document.body.scrollTop || document.documentElement.scrollTop;
        if (winScroll > 240) {
            this.setState({ isSearchBar: false })
        } else {
            this.setState({ isSearchBar: true })
        }
    };

    chooseCategory = async (chosenCategory) => {
        let filter = { ...this.props.filterBy }

        filter = { ...filter, sortBy: 'startAt' }
        filter = { ...filter, category: chosenCategory }

        await this.props.setFilter(filter);
        this.props.history.push('/event');
    };

    render() {
        // console.log(this.props.events)
        // console.log(this.props.filterBy)
        const { isSearchBar } = this.state;
        // if (this.props.filterBy.userId !== '') return <div>Loading</div>
        return (
            <div className="home-page-container">
                <header className="main-header-container flex justify-center align-items-center">
                    <div className="header flex column align-center">
                        <h1>Enter a World of Events</h1>
                        {isSearchBar && <SearchBar />}
                    </div>
                    <div className="hero-dissolve">
                        <div className="hero-image"></div>
                        <div className="hero-image"></div>
                        <div className="hero-image"></div>
                        <div className="hero-image"></div>
                        <div className="hero-image"></div>
                        <div className="hero-image"></div>
                        <div className="hero-image"></div>
                    </div>
                </header>
                <CategoryLinks homePage chooseCategory={this.chooseCategory} />
                <h2>Upcoming Events</h2>
                {this.props.events.length > 0 && <UpcomingEvents events={this.props.events} />}
                < CategoryGallery chooseCategory={this.chooseCategory} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        events: state.eventsStore.events,
        filterBy: state.eventsStore.filterBy
    };
};

const mapDispatchToProps = {
    setFilter,
    setHomePage,
    loadEvents
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);