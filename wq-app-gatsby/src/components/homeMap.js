import React, { Component } from "react"
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl"
import mapStyles from "../styles/map.module.css"
import pinTWP from "../images/marker-stroked-15.svg"
import pinCEDEN from "../images/marker-stroked-15-ceden.svg"
import { navigate } from "gatsby"

const TOKEN = process.env.GATSBY_MapboxAccessToken

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
        <div style={{position: 'absolute', left: 0}}>
          <NavigationControl />
        </div>
        {this.props.pts.map((pt, key) => (
          pt.source === 'The Watershed Project' ? (
          <Marker latitude={parseFloat(pt.lat)} longitude={parseFloat(pt.long)} key={key}>
            <img
              className={mapStyles.locationIcon}
              src={pinTWP}
              onMouseEnter={() => this.setSelectedSite(pt)}
              onClick={() => navigate(`/site/${pt.site_id}`)}
              alt=""
            ></img>
          </Marker>
          ) : (
            <Marker latitude={parseFloat(pt.lat)} longitude={parseFloat(pt.long)} key={key}>
            <img
              className={mapStyles.locationIcon}
              src={pinCEDEN}
              onMouseEnter={() => this.setSelectedSite(pt)}
              onClick={() => navigate(`/ceden-site/${pt.site_id}`)}
              alt=""
            ></img>
          </Marker>
          )
        ))}
        {this.state.selectedSite !== null ? (
          <Popup
            latitude={parseFloat(this.state.selectedSite.lat)}
            longitude={parseFloat(this.state.selectedSite.long)}
            onClose={this.closePopup}
            closeOnClick={false}
          >
            <div>
              {this.state.selectedSite.source === 'CEDEN' ? (
                <p>{`CEDEN - ${this.state.selectedSite.name}`}</p>
              ) : (
                <p>{`TWP - ${this.state.selectedSite.name}`}</p>
              )}
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    )
  }
}

export default Mapbox
