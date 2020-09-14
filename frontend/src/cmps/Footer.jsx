import React from "react";
import history from '../history.js'

import { SocialShare } from './SocialShare'

export default function Footer() {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-middle flex justify-center space-around">
                    <div className="content flex justify-center space-around wrap">
                        <div className="">
                            <h2 className="">About</h2>
                            <ul className="clean-list">
                                <li className="">
                                    <p><button onClick={() => history.push('/')}> eventer </button> is a one-stop-shop for all your social meetups and events, whether you're an event organiser, who wants to publish and promote events, or you're just looking to socialise with others on your free time.</p>
                                </li>
                                <li className="social-share">
                                    <SocialShare  />
                                </li>
                            </ul>
                        </div>
                        <div >
                            <h2 className="">Categories</h2>
                            <ul className="clean-list">
                                <li className="">
                                    <a href="#!">Sports</a>
                                </li>
                                <li className="">
                                    <a href="#!">Live Music</a>
                                </li>
                                <li className="">
                                    <a href="#!">Parties</a>
                                </li>
                                <li className="">
                                    <a href="#!">Lectures</a>
                                </li>
                                <li className="">
                                    <a href="#!">Stand-up Comedy</a>
                                </li>
                                <li className="">
                                    <a href="#!">Workshops</a>
                                </li>
                            </ul>
                        </div>
                        <div >
                            <h2 className="">Quick Links</h2>
                            <ul className="clean-list">
                                <li className="">
                                    <a href="#!">About</a>
                                </li>
                                <li className="">
                                    <a href="#!">Home</a>
                                </li>
                                <li className="">
                                    <a href="#!">Events</a>
                                </li>
                                <li className="">
                                    <a href="#!">Log-in/out</a>
                                </li>
                                <li className="">
                                    <a href="#!">Create Event</a>
                                </li>
                            </ul>
                        </div>
                        <div >
                            <h2 className="">Contact</h2>
                            <ul className="clean-list">
                                <li className="">
                                    <a href="mailto:service@eventer.com">service@eventer.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div >
                <div className="footer-bottom flex space-around align-center">
                    <div className="terms-privacy flex space-around">
                        <div >
                            Terms & Conditions
                        </div>

                        <div>
                            Privacy Policy
                        </div>
                    </div>

                    <div>
                        &copy; {new Date().getFullYear()} Copyright: <button onClick={() => history.push('/')}> eventer </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
