import React from 'react';
import { Link } from 'react-router-dom';
import Links from './Links';

class Navbar extends React.Component {

    render() {
        const navStyle = {
            margin: "0px",
        }

        return (
            <nav style={navStyle} className="nav-wrapper grey darken-3 row">
                    <Link to="/" style={{paddingLeft: '15px'}}className="brand-logo">Redistrictor</Link>
                    <Links/>
            </nav>
        );
    };
}

export default Navbar;

