import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'

const TOKEN = process.env.MapboxAccessToken


class Mapbox extends Component {


  state = {
    viewport: {
      width: '100%',
      height: 600,
      latitude: 37.929787,
      longitude: -122.076019,
      zoom: 10
    }
  };

  // mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true"
  render() {
    return (
      <ReactMapGL mapboxApiAccessToken={TOKEN}
      mapStyle="mapbox://styles/mapbox/light-v9?optimize=true"
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
      />
    );
  }
}

export default Mapbox