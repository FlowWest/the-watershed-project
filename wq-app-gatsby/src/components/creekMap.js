import React, { Component } from "react"
import ReactMapGL, { Marker, Popup } from "react-map-gl"
import mapStyles from "../styles/map.module.css"
import pin from "../images/marker-stroked-15.svg"
import { navigate } from "gatsby"

const TOKEN = process.env.MapboxAccessToken

class Mapbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewport: {
        width: "100%",
        height: props.height,
        latitude: props.lat,
        longitude: props.long,
        zoom: props.zoom,
      },
      selectedSite: null,
    }
  }

  setSelectedSite = site => {
    this.setState({
      selectedSite: site
    })
  }

  closePopup = () => {
    this.setState({
      selectedSite: null,
    })
  }

  // mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true"
  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken={TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9?optimize=true"
        {...this.state.viewport}
        onViewportChange={viewport => this.setState({ viewport })}
      >
        {this.props.pts.map((pt, key) => (
          <Marker latitude={pt.lat} longitude={pt.long} key={key}>
            <img
              className={mapStyles.locationIcon}
              src={pin}
              onMouseEnter={() => this.setSelectedSite(pt)}
              onClick={() => navigate(`/site/${pt.site_id}`)}
            ></img>
          </Marker>
        ))}
        {this.state.selectedSite !== null ? (
          <Popup
            latitude={this.state.selectedSite.lat}
            longitude={this.state.selectedSite.long}
            onClose={this.closePopup}
            closeOnClick={false}
          >
            <div>
              <p>{`${this.state.selectedSite.name} (${this.state.selectedSite.site_id})`}</p>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    )
  }
}

export default Mapbox
