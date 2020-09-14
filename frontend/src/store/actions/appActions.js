export function setHomePage(isHomePage) {
    
    return (dispatch) => {
        dispatch({ type: 'SET_HOME_PAGE', isHomePage });
        return Promise.resolve();
    };
}