let localLoggedinUser = null;
let localMinimalLoggedInUser = null;
if (sessionStorage.user) {
    localLoggedinUser = JSON.parse(sessionStorage.user);
    localMinimalLoggedInUser = {
        _id: localLoggedinUser._id,
        fullName: localLoggedinUser.fullName,
        imgUrl: localLoggedinUser.imgUrl,
        rank: localLoggedinUser.rank,
        isAdmin: localLoggedinUser.isAdmin,
        followers: localLoggedinUser.followers
    }
}

const initialState = {
    loggedInUser: localLoggedinUser,
    minimalLoggedInUser: localMinimalLoggedInUser,
    isNotificationsOpen: false,
    currUser: ''
}

export default function UserReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_LOGGED_IN_USER':
            const minimalLoggedInUser = {
                _id: action.user._id,
                fullName: action.user.fullName,
                imgUrl: action.user.imgUrl,
                rank: action.user.rank,
                isAdmin: action.user.isAdmin,
                followers: action.user.followers
            }
            return {
                ...state,
                loggedInUser: { ...action.user },
                minimalLoggedInUser
            };
        case 'SET_USER':
            return {
                ...state,
                loggedInUser: { ...action.user }
            };
        case 'SET_LOCAL_USER':
            return {
                ...state,
                currUser: { ...action.user }
            };
        case 'REMOVE_USER':
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            };
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case 'UPDATE_USER':
            return {
                ...state,
                loggedInUser: { ...action.user }
            }
        case 'UPDATE_LOCAL_USER':
            return {
                ...state,
                currUser: { ...action.user }
            }
        case 'TOGGLE_NOTIFICATIONS':
            return {
                ...state,
                filterBy: { ...action.isNotificationOpen }
            }
        case 'CLEAR_USER':
            return {
                ...state,
                currUser: ''
            }
        case 'TOGGLE_LOAD':
            return {
                ...state,
                isLoading: action.loadingStatus
            }
        default:
            return state;
    }
}
