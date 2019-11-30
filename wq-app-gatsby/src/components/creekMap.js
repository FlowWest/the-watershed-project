import React from "react"
import mapboxgl from "mapbox-gl"
import mapStyles from "../styles/map.module.css"
import pinTWP from "../images/marker-stroked-15.svg"

const TOKEN = process.env.GATSBY_MapboxAccessToken

mapboxgl.accessToken = TOKEN

class MapBox extends React.Component {
  map

  constructor(props) {
    super(props)
    this.state = {
      lng: this.props.long,
      lat: this.props.lat,
      zoom: this.props.zoom,
    }
  }

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
        data: this.props.watershedPolygon,
      })

      this.map.addLayer(
        {
          id: "watersheds-layer",
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
          `<a href="/site/${pt.site_id}">${pt.name}</a>`
        )
        var el = document.createElement("div")
        el.className = mapStyles.marker1
        new mapboxgl.Marker(el)
          .setLngLat([pt.long, pt.lat])
          .setPopup(popup)
          .addTo(this.map)
      })
    })

    this.map.addControl(new mapboxgl.NavigationControl(), "top-left")
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        <div
          ref={el => (this.mapContainer = el)}
          className={mapStyles.mapContainer}
        />
        <div className={mapStyles.legend}>
          <div>
            <span>
              <img
                style={{ display: "inline-block" }}
                src={pinTWP}
                alt=""
              ></img>
            </span>
            <span>
              <p style={{ display: "inline-block", paddingLeft: "4px" }}>
                TWP Site
              </p>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default MapBox
