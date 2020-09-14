import React  from 'react'

import UserPreview from './UserPreview'

export function ReviewPreview(props) {

    const { review } = props;
    const inactiveClr = '#d3d3d3';
    const activeClr = '#ffbf00';
    const createdAtDisplay = new Date(review.createdAt).toString().split(' ').slice(1, 5).join(' ');

    return (
        <div className="review-item flex column align-items-end space-between">
            <div className="flex column align-items-end">
                <p className="date">{createdAtDisplay}</p>
                <UserPreview className="creator" minimalUser={review.creator} />
                <p>{review.text}</p>
            </div>
            <div className="review-stars flex justify-center align-items-center">
                <svg className="review-star" viewBox="0 0 576 512">
                    <path fill={review.rate > 0 ? activeClr : inactiveClr} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                </svg>
                <svg className="review-star" viewBox="0 0 576 512">
                    <path fill={review.rate > 1 ? activeClr : inactiveClr} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                </svg>
                <svg className="review-star" viewBox="0 0 576 512">
                    <path fill={review.rate > 2 ? activeClr : inactiveClr} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                </svg>
                <svg className="review-star" viewBox="0 0 576 512">
                    <path fill={review.rate > 3 ? activeClr : inactiveClr} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                </svg>
                <svg className="review-star" viewBox="0 0 576 512">
                    <path fill={review.rate > 4 ? activeClr : inactiveClr} d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 
                        103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5
                         105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                </svg>
            </div>
        </div>
    )
}
