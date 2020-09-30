import React from 'react';
import { Link } from 'react-router-dom';
import Links from './Links';

class Navbar extends React.Component {

    render() {
        return (
            <nav className="nav-wrapper grey darken-3">
                <div className="container">
                    <Link to="/" className="brand-logo">Redistrictor</Link>
                    <Links/>
                </div>
            </nav>
        );
    };
}

export default Navbar;

