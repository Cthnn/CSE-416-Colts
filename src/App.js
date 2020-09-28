import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Navbar from './components/navbar/Navbar.js';
import HomeScreen from './components/home_screen/HomeScreen.js';
import SourcesScreen from './components/sources_screen/SourcesScreen';
import AboutScreen from './components/about_screen/AboutScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route exact path='/' component={HomeScreen} />
          <Route path='/sources' component={SourcesScreen} />
          <Route path='/about' component={AboutScreen} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
