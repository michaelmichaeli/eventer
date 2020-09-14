import hero1 from '../assets/imgs/hero1.png'
import hero2 from '../assets/imgs/hero2.png'
import hero3 from '../assets/imgs/hero3.png'
import hero4 from '../assets/imgs/hero4.png'
import hero5 from '../assets/imgs/hero5.png'
import hero6 from '../assets/imgs/hero6.png'
import hero7 from '../assets/imgs/hero7.png'

import heroOverlay from '../assets/design/hero-overlay.png'

import React from 'react';

export default class HeroDissolve extends React.Component {


    render() {
        return (
            <main className="hero-container">
                {/* <img className="hero-overlay" src={heroOverlay} alt="" /> */}
                <img src={hero1} alt="" />
                <img src={hero2} alt="" />
                <img src={hero3} alt="" />
                <img src={hero4} alt="" />
                <img src={hero5} alt="" />
                <img src={hero6} alt="" />
                <img src={hero7} alt="" />
            </main>
        );
    }
}

