import React from 'react'

import { ReviewPreview } from '../cmps/ReviewPreview'

export function ReviewList(props) {

    return (
        <section className="review-list-container">
            <div className="list-header flex align-center space-between">
                <h5>Reviews</h5>
            </div>
            {props.reviews.map(review => <ReviewPreview key={review.id} review={review} />)}
            {props.reviews.length === 0 && <h1>No Reviews yet</h1>}
        </section>
    )
}