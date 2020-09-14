import userService from '../../services/userService.js';

export function signup(credentials, loadingStatus) {
    return async dispatch => {
        try {
            toggleLoad(credentials, loadingStatus)
            const user = await userService.signup(credentials)
            dispatch(setUser(user), () => { toggleLoad(loadingStatus) });
        }
        catch (err) {
            console.log('userService: err in signup', err);
        }
    }
}


export function login(credentials, loadingStatus) {
    return async dispatch => {
        try {
            toggleLoad(credentials, loadingStatus)
            const user = await userService.login(credentials)
            dispatch(setLoggedInUser(user), () => { toggleLoad(loadingStatus) });
            return user
        }
        catch (err) {
            console.log('userService: err in login', err);
        }
    }
    // }
}

export function logout() {
    return async dispatch => {
        await userService.logout();
        dispatch(setUser(null));
    };
}



export function loadUser(id) {
    return async dispatch => {
        try {
            const user = await userService.get(id)
            dispatch(setUser(user));
            return user

        }
        catch (err) {
            console.log('userService: err in loading user', err);
        }
    }
}

export function loadUserLocal(id) {
    return async dispatch => {
        try {
            const user = await userService.get(id)
            dispatch(setLocalUser(user));
            return user
        }
        catch (err) {
            console.log('userService: err in loading user', err);
        }
    }
}

export function saveUser(user) {
    return async dispatch => {
        try {
            const type = user._id ? 'UPDATE_USER' : 'ADD_USER';
            await userService.save(user)
            dispatch(_saveUser(type, user));
        }
        catch (err) {
            console.log('userService: err in saving user', err);
        }
    }
}


export function removeUser(userId) {
    return async dispatch => {
        try {
            await userService.remove(userId)
            dispatch(_removeUser(userId));
        }
        catch (err) {
            console.log('userService: err in removeUser', err);
        }
    }
}

export function addReview(review, user) {
    return async dispatch => {
        try {
            const updatedUser = await userService.addReview(review, user)
            dispatch(_saveUser('UPDATE_LOCAL_USER', updatedUser));
            return updatedUser
        }
        catch (err) {
            console.log('eventService: err in subsscribe action', err);
        }
    }
}

export function addFollower(user, follower) {
    // console.log(follower);
    
    return async dispatch => {
        try {
            const updatedUser = await userService.addFollower(user, follower)
            // console.log('updatedUser', updatedUser);
            
            dispatch(_saveUser('UPDATE_LOCAL_USER', updatedUser));
            return updatedUser
        }
        catch (err) {
            console.log('eventService: err in subsscribe action', err);
        }
    }
}
export function removeFollower(user, follower) {
    // console.log(follower);
    
    return async dispatch => {
        try {
            const updatedUser = await userService.removeFollower(user, follower)
            // console.log('updatedUser', updatedUser);
            
            dispatch(_saveUser('UPDATE_LOCAL_USER', updatedUser));
            return updatedUser
        }
        catch (err) {
            console.log('eventService: err in subsscribe action', err);
        }
    }
}


export function addNotification(notification) {
    return async dispatch => {
        try {
            const updatedUser = await userService.addNotification(notification) 
            // console.log('updated user in actions',updatedUser )
            dispatch(_saveUser('UPDATE_USER', updatedUser));
            return updatedUser
        }
        catch (err) {
            console.log('eventService: err in addNotification action', err);
        }
    }
}


export function toggleNotifications(status) {
    return async (dispatch) => {
        dispatch({ type: 'TOGGLE_NOTIFICATIONS', status });
    };
}


export function toggleLoad(loadingStatus) {
    return (dispatch) => {
        dispatch({ type: 'TOGGLE_LOAD', loadingStatus });
    };
}

export function clearUser() {
    return async dispatch => {
        try {
            await dispatch(_clear());
        }
        catch (err) {
            console.log('eventService: err in clearing event', err);
        }
    }
}


function _clear() {
    return {
        type: 'CLEAR_USER'
    };
}



function setLoggedInUser(user) {
    return {
        type: 'SET_LOGGED_IN_USER',
        user
    };
}

export function setUser(user) {
    return {
        type: 'SET_USER',
        user
    };
}

function setLocalUser(user) {
    return {
        type: 'SET_LOCAL_USER',
        user
    };
}

function _removeUser(userId) {
    return {
        type: 'REMOVE_USER',
        userId
    };
}

function _saveUser(type, user) {
    return {
        type,
        user
    };
}