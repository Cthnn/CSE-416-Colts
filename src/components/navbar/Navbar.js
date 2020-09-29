import React from 'react';
import { Link } from 'react-router-dom';
import Links from './Links';

class Navbar extends React.Component {

    render() {
        return (
            <nav>
                <div className="nav-wrapper grey darken-3 row">
                    <Link to="/" className="col s6 m3 brand-logo center-align">Redistrictor</Link>
                    <Links></Links>
                </div>
            </nav>
        );
    };
}

export default Navbar;

