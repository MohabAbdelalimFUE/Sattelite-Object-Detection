import React, { Component, Fragment } from 'react';
import axios from 'axios';
import MapSearch from './components/Map'
import NewMap from './components/newMap'

import DrawMap from './components/drawMap'
import './App.css';

class App extends Component {
  state = {
    incidents: [],
  }
  render() {
    return (
      // <MapSearch />
      // <NewMap />
      <DrawMap />

    );
  }
}
export default App;