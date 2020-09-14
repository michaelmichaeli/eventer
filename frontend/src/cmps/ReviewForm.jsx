import React, { Component } from 'react'
import UserPreview from './UserPreview'

export class ReviewForm extends Component {

    state = {
        txt: '',
        rating: 0,
        inactiveClr: '#d3d3d3',
        activeClr: '#ffbf00'
    }

    rate = (value) => {
        if (value === this.state.rating) value = 0;
        this.setState({ rating: value });
    }

    handleChange = ({ target }) => {
        this.setState({ txt: target.value })
    }

    onSubmitReview = () => {
        const { minimalUser } = this.props;
        const newReview = {
            createdAt: Date.now(),
            creator: {
                _id: minimalUser._id,
                fullName: minimalUser.fullName,
                imgUrl: minimalUser.imgUrl
            },
            text: this.state.txt,
            rate: this.state.rating
        };
        this.props.submitReview(newReview)
        this.setState({ txt: '' })
        this.setState({ rating: 0 })
    }

    render() {

        const { rating, inactiveClr, activeClr } = this.state;

        return (
            <section className="review-form flex column justify-center align-items-center">
                <div className="user-preview-container">
                    <UserPreview minimalUser={this.props.minimalUser} />
                </div>
                <form onSubmit={this.onSubmitReview}>
                    <textarea style={{ resize: "none" }} placeholder="Say something..." onChange={this.handleChange} value={this.state.txt}></textarea>
                    <button hidden></button>
                </form>
                <section className="rate-post flex space-between align-items-center">
                    <div className="rate-icns flex justify-center align-items-center">
                        <svg className="star-btn" viewBox="0 0 576 512">
                            <path fill={rating > 0 ? activeClr : inactiveClr} onClick={() => { this.rate(1) }} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                        </svg>
                        <svg className="star-btn" viewBox="0 0 576 512">
                            <path fill={rating > 1 ? activeClr : inactiveClr} onClick={() => { this.rate(2) }} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                        </svg>
                        <svg className="star-btn" viewBox="0 0 576 512">
                            <path fill={rating > 2 ? activeClr : inactiveClr} onClick={() => { this.rate(3) }} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                        </svg>
                        <svg className="star-btn" viewBox="0 0 576 512">
                            <path fill={rating > 3 ? activeClr : inactiveClr} onClick={() => { this.rate(4) }} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                        </svg>
                        <svg className="star-btn" viewBox="0 0 576 512">
                            <path fill={rating > 4 ? activeClr : inactiveClr} onClick={() => { this.rate(5) }} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                        </svg>
                    </div>
                    <button onClick={this.onSubmitReview} className="post-review-btn">Post</button>
                </section>
            </section>
        )
    }
}
