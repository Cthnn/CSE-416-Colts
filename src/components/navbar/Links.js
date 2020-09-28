import React from 'react';
import { NavLink } from 'react-router-dom';

class Links extends React.Component {

    render() {
        // const { profile } = this.props;
        //console.log(this.props)
        return (
            <ul className="right">
                <li><NavLink to="/sources">Sources</NavLink></li> {/* I left NavLink instead of anchor tag because I'm using airbnb eslint rules */}
                <li><NavLink to="/about">About</NavLink></li>
            </ul>
        );
    };
}

export default Links;