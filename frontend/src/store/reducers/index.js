import { combineReducers } from 'redux';
import appReducer from './appReducer';
import eventReducer from './eventReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  userStore: userReducer,
  eventsStore: eventReducer,
  appStore: appReducer
})

export default rootReducer;