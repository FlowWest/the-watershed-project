import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';
import Home from './components/Home.jsx';
import Map from './components/Map.jsx';
import Creek from './components/Creek.jsx';
import Site from './components/Site.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/map">Map</NavLink>
          <NavLink to="/creek">Creek</NavLink>
          <NavLink to="/site">Site</NavLink>
        </div>

        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/map">
          <Map />
        </Route>
        <Route path="/creek">
          <Creek />
        </Route>
        <Route path="/site">
          <Site />
        </Route>
    </div>
    </Router>
      );
}
    
export default App;
    
    
    /* 
    
    possibly migriate to normal React config with Webpack/Babel
    home page
    water features modal
    map page
    creek page
    site page
    
*/