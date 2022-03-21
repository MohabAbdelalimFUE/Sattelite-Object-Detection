import React, { Component } from 'react';
import { MapContainer, TileLayer, FeatureGroup, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import download from "downloadjs";
import { fetchSegmentationMask } from '../services'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
});

//

export class MapOverlayPage extends Component {
    // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            maskImage: '',
            bounds: [[37.802273929613634, -122.456784725091],
            [37.803570589851, -122.45458745943327]]
        }
    }
    async componentDidMount() {
        const segmentationMask = await fetchSegmentationMask();
        console.log("HERE:", segmentationMask)
        const maskURL = segmentationMask.request.responseURL
        console.log("HERE222:", maskURL)
        // create an image
        this.setState({ maskImage: maskURL })
    }

    render() {
        const bBox = localStorage.getItem('Bbox').split("[")[1].split(']')[0].split(',')
        const BboxBounds = [[parseFloat(bBox[1]), parseFloat(bBox[0])], [parseFloat(bBox[3]), parseFloat(bBox[2])]]
        console.log(this.state, BboxBounds, "STATE")
        return (
            <MapContainer center={[37.8189, -122.4786]} zoom={13} zoomControl={false} style={{ height: "90vh" }} >
                <TileLayer
                    // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    // url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                <ImageOverlay
                    bounds={BboxBounds}
                    url={this.state.maskImage}
                    opacity={0.5}
                />
            </MapContainer>
        );
    }
}

