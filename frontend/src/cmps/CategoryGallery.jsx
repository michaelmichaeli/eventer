import React, { Component } from 'react'

import sports from '../assets/imgs/main-gallery-sports.jpg'
import liveMusic from '../assets/imgs/main-gallery-live-music.jpg'
import parties from '../assets/imgs/main-gallery-paries.jpg'
import standUp from '../assets/imgs/main-gallery-stand-up.jpg'
import workshops from '../assets/imgs/main-gallery-workshops.jpg'
import lectures from '../assets/imgs/main-gallery-lectures.jpg'

import { setFilter } from '../store/actions/eventActions'
import { connect } from 'react-redux'

class CategoryGallery extends Component {
    render() {
        return (
            <section className="category-gallery-container main-container">
                <div className="categoriy-grid-container">
                    <div onClick={() => { this.props.chooseCategory('Sports') }} className="gallery-item sports">
                        <h2>Sports</h2>
                        <h2 className="see-more">See more</h2>
                        <div className="overlay"></div>
                        <img src={sports} alt="" />
                    </div>
                    <div onClick={() => { this.props.chooseCategory('Live Music') }} className="gallery-item live-music">
                        <h2>Live Music</h2>
                        <h2 className="see-more">See more</h2>
                        <div className="overlay"></div>
                        <img src={liveMusic} alt="" />
                    </div>
                    <div onClick={() => { this.props.chooseCategory('Parties') }} className="gallery-item parties">
                        <h2>Parties</h2>
                        <h2 className="see-more">See more</h2>
                        <div className="overlay"></div>
                        <img src={parties} alt="" />
                    </div>
                    <div onClick={() => { this.props.chooseCategory('Stand-up Comedy') }} className="gallery-item stand-up">
                        <h2>Stand-Up Comedy</h2>
                        <h2 className="see-more">See more</h2>
                        <div className="overlay"></div>
                        <img src={standUp} alt="" />
                    </div>
                    <div onClick={() => { this.props.chooseCategory('Workshops') }} className="gallery-item workshops">
                        <h2>Workshops</h2>
                        <h2 className="see-more">See more</h2>
                        <div className="overlay"></div>
                        <img src={workshops} alt="" />
                    </div>
                    <div onClick={() => { this.props.chooseCategory('Lectures') }} className="gallery-item lectures">
                        <h2>Lectures</h2>
                        <h2 className="see-more">See more</h2>
                        <div className="overlay"></div>
                        <img src={lectures} alt="" />
                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        filterBy: state.eventsStore.filterBy
    };
};

const mapDispatchToProps = {
    setFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryGallery);