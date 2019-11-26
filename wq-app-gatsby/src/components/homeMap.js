import React, { Component } from "react"
import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl"
import mapStyles from "../styles/map.module.css"
import pinTWP from "../images/marker-stroked-15.svg"
import pinCEDEN from "../images/marker-stroked-15-ceden.svg"
import { navigate } from "gatsby"
import watershedPolygons from "../data/watershedPolygons.js"

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
      selectedWatershed: null,
    }
  }

  setSelectedSite = site => {
    this.setState({
      selectedSite: site,
    })
  }

  closePopup = () => {
    this.setState({
      selectedSite: null,
    })
  }

  onHover = event => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event

    const selectedWatershed =
      features && features.find(f => f.layer.id === "data")

    this.setState({ selectedWatershed, x: offsetX, y: offsetY })
  }

  renderTooltip() {
    const { selectedWatershed, x, y } = this.state
    return (
      selectedWatershed && (
        <div className={mapStyles.tooltip} style={{ left: x, top: y }}>
          <div>{selectedWatershed.properties.ws_name}</div>
        </div>
      )
    )
  }

  // mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true"
  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken={TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9?optimize=true"
        {...this.state.viewport}
        onViewportChange={viewport => this.setState({ viewport })}
        onHover={this.onHover}
        onClick={e => {
          const watershed =
            e.features && e.features.find(f => f.layer.id === "data")
          return watershed.properties.twp_monito === 1
            ? navigate(`/creek/${watershed.properties.creek_id}`)
            : null
        }}
      >
        <div style={{ position: "absolute", left: 0 }}>
          <NavigationControl />
        </div>
        {this.props.pts.map((pt, key) =>
          pt.source === "The Watershed Project" ? (
            <Marker
              latitude={parseFloat(pt.lat)}
              longitude={parseFloat(pt.long)}
              key={key}
            >
              <img
                className={mapStyles.locationIcon}
                src={pinTWP}
                onMouseEnter={() => this.setSelectedSite(pt)}
                onMouseLeave={() => this.setSelectedSite(null)}
                onClick={() => navigate(`/site/${pt.site_id}`)}
                alt=""
              ></img>
            </Marker>
          ) : (
            <Marker
              latitude={parseFloat(pt.lat)}
              longitude={parseFloat(pt.long)}
              key={key}
            >
              <img
                className={mapStyles.locationIcon}
                src={pinCEDEN}
                onMouseEnter={() => this.setSelectedSite(pt)}
                onMouseLeave={() => this.setSelectedSite(null)}
                onClick={() => navigate(`/ceden-site/${pt.site_id}`)}
                alt=""
              ></img>
            </Marker>
          )
        )}
        {this.state.selectedSite !== null ? (
          <Popup
            latitude={parseFloat(this.state.selectedSite.lat)}
            longitude={parseFloat(this.state.selectedSite.long)}
            onClose={this.closePopup}
            closeOnClick={false}
          >
            <div>
              {this.state.selectedSite.source === "CEDEN" ? (
                <p>{`CEDEN - ${this.state.selectedSite.name}`}</p>
              ) : (
                <p>{`TWP - ${this.state.selectedSite.name}`}</p>
              )}
            </div>
          </Popup>
        ) : null}
        <Source type="geojson" data={watershedPolygons}>
          <Layer
            type="fill"
            id="data"
            paint={{
              "fill-color": {
                property: "twp_monito",
                stops: [[0, "#fff"], [1, "#999"]],
              },
              "fill-opacity": 0.2,
              "fill-outline-color": "#000",
            }}
          />
        </Source>
        {this.renderTooltip()}
      </ReactMapGL>
    )
  }
}

export default Mapbox
