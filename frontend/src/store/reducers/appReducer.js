// import { findAllByAltText } from "@testing-library/react";

const initialState = {
    isHomePage: false,
}



export default function EventReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_HOME_PAGE':
            return {
                ...state,
                isHomePage: action.isHomePage
            }
        default:
            return state;
    }
}
