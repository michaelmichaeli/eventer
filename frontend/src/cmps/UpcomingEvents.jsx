import React, { Component } from 'react'
import EventPreview from "./EventPreview";
import InfiniteCarousel from 'react-leaf-carousel';

export default class UpcomingEvents extends Component {

    state = {
        galleryItems: []
    }

    componentDidMount() {
        this.setState({ galleryItems: this.props.events })
    }

    render() {
        return (
            <main className="upcoming-container">
                {this.state.galleryItems.length > 0 && <InfiniteCarousel
                    breakpoints={[
                        {
                            breakpoint: 700,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            },
                        },
                        {
                            breakpoint: 900,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2,
                            },
                        },
                        {
                            breakpoint: 1400,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                            },
                        },
                        {
                            breakpoint: 1600,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4,
                            },
                        },
                    ]}
                    swipe={true}
                    dots={true}
                    showSides={false}
                    sideSize={.1}
                    slidesToScroll={5}
                    slidesToShow={5}
                    responsive={true}
                    slidesSpacing={10}
                >

                    {this.state.galleryItems.map(event => <EventPreview key={event._id} event={event} />)}

                </InfiniteCarousel>}
            </main>
        )
    }
}
