import React from "react"
import mapboxgl from "mapbox-gl"
import mapStyles from "../styles/test.module.css"
import watershedPolygons from "../data/watershedPolygons.js"
import pinTWP from "../images/marker-stroked-15.svg"
import pinCEDEN from "../images/marker-stroked-15-ceden.svg"
import {navigate} from "gatsby"

const TOKEN = process.env.GATSBY_MapboxAccessToken

mapboxgl.accessToken = TOKEN

class MapBox extends React.Component {
  map

  constructor(props) {
    super(props)
    this.state = {
      lng: -122.076019,
      lat: 37.929787,
      zoom: 9,
      selectedSite: null,
      selectedWatershed: null,
    }

    this.navigateToPoint = this.navigateToPoint.bind(this)
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

  navigateToPoint = pointId => navigate(`/site/${pointId}`)

  // onHover = event => {
  //   const {
  //     features,
  //     srcEvent: { offsetX, offsetY },
  //   } = event

  //   const selectedWatershed =
  //     features && features.find(f => f.layer.id === "data")

  //   this.setState({ selectedWatershed, x: offsetX, y: offsetY })
  // }

  // renderTooltip() {
  //   const { selectedWatershed, x, y } = this.state
  //   return (
  //     selectedWatershed && (
  //       <div className={mapStyles.tooltip} style={{ left: x, top: y }}>
  //         <div>{selectedWatershed.properties.ws_name}</div>
  //       </div>
  //     )
  //   )
  // }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/light-v9?optimize=true",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    })

    this.map.on("load", () => {
      this.map.addSource("watersheds", {
        type: "geojson",
        data: watershedPolygons,
      })

      this.map.addLayer(
        {
          id: "watersheds",
          type: "fill",
          source: "watersheds",
          paint: {
            "fill-color": {
              property: "twp_monito",
              stops: [[0, "#fff"], [1, "#999"]],
            },
            "fill-opacity": 0.2,
            "fill-outline-color": "#000",
          },
        },
        "country-label-lg"
      ) // ID metches `mapbox/streets-v9`


      this.props.pts.map(pt => {
        var popup = new mapboxgl.Popup({ offset: 20 }).setHTML(
          pt.source === "The Watershed Project" ?
          `<a href="/site/${(pt.site_id)}">${pt.name}</a>`:
          `<a href="/ceden-site/${(pt.site_id)}">${pt.name}</a>`
        )
        var el = document.createElement("img")
        el.src = pt.source === "The Watershed Project" ? pinTWP : pinCEDEN
        // el.addEventListener("click", () => navigate(`/site/${pt.site_id}`))
        new mapboxgl.Marker(el).setLngLat([pt.long, pt.lat]).setPopup(popup).addTo(this.map)
      })
    })
  }

  render() {
    return (
      <div>
        <div
          ref={el => (this.mapContainer = el)}
          className={mapStyles.mapContainer}
        />
        <div
          style={{
            backgroundColor: "rgba(252, 252, 252, .7)",
            padding: "8px",
            width: "150px",
            position: "relative",
            top: 0,
            right: 0,
          }}
        >
          <div>
            <span>
              <img style={{ display: "inline-block" }} src={pinTWP}></img>
            </span>
            <span>
              <p style={{ display: "inline-block", paddingLeft: "4px" }}>
                TWP Site
              </p>
            </span>
          </div>
          <div>
            <span>
              <img style={{ display: "inline-block" }} src={pinCEDEN}></img>
            </span>
            <span>
              <p style={{ display: "inline-block", paddingLeft: "4px" }}>
                CEDEN Site
              </p>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default MapBox