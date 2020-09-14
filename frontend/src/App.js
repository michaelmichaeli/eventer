// json-server --watch db.json --id=_id --port 3030

import React from 'react';
import './styles/global.scss';
import HomePage from './pages/HomePage'
import NavBar from './cmps/NavBar'
import Footer from './cmps/Footer'
import EventIndex from './pages/EventIndex'
import EventEdit from './pages/EventEdit'
import UserDetails from './pages/UserDetails'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'

import './styles/global.scss';
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import { login } from './store/actions/userActions.js'

class App extends React.Component {

    componentDidMount() {
        if (this.props.loggedInUser === {} || !this.props.loggedInUser) {
            this.props.login({ userName: "Guest", password: "1" })
        }
    }
    render() {
        return (
            <section className="events-app full-height flex column space-between ">
                <NavBar />
                <Switch>
                    <Route component={HomePage} exact path="/" />
                    <Route component={EventEdit} exact path="/event/edit/:id?" />
                    <Route component={EventIndex} exact path="/event" />
                    <Route component={UserDetails} exact path="/user/:id" />
                    <Route component={EventDetails} exact path="/event/:id?" />
                    <Route component={Login} exact path="/login" />
                </Switch>
                <Footer  />
            </section>
        )
    }
}


const mapStateToProps = state => {
    return {
        loggedInUser: state.userStore.loggedInUser,
        events: state.eventsStore.events
    };
};
const mapDispatchToProps = {
    login
};

export default connect(mapStateToProps, mapDispatchToProps)(App);



