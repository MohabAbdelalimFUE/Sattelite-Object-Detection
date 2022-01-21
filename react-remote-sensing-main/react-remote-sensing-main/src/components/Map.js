import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-easybutton";
import "leaflet-easybutton/src/easy-button.css";
// import Style from "./MapSearch.css";
const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

const MapSearch = (props) => {
    const [layers, setLayers] = useState([]);
    const [results, setResults] = useState([]); //Not used
    const [map, setMap] = useState({});
    const [editableFG, setEditableFG] = useState(null);
    const mapRef = useRef();


    useEffect(() => {
        console.log("mounted");
        console.log(mapRef)
        if (mapRef && mapRef.current) {
            const map = mapRef.current.leafletElement;
            console.log(map)
            /** Add the feature group and draw control to the map. */
            let drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            const drawControl = new L.Control.Draw({
                position: "topright",
                draw: {
                    polyline: false,
                    rectangle: false,
                    circlemarker: false,
                    polygon: false,
                    circle: true,
                    marker: true
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true
                }
            });
            map.addControl(drawControl);

            /** On shape drawn, add the new layer to the map. */
            map.on(L.Draw.Event.CREATED, (e) => {
                const type = e.layerType;
                const layer = e.layer;
                if (type === "marker") {
                    layer.bindPopup("popup");
                }
                console.log("LAYER ADDED:", layer);
                drawnItems.addLayer(layer);

                console.log("GEO JSON", drawnItems.toGeoJSON());
                console.log(" LAYERS", drawnItems.getLayers());
            });

            L.easyButton(
                "fa-search",
                () => {
                    // isWithinPolygon(props); //Removed because not relevant to question
                },
                "Search Current Results within drawn layers",
                { position: "topright" }
            ).addTo(map);

            map.on(L.Draw.Event.EDITED, (e) => {
                const layers = e.layers;
                let countOfEditedLayers = 0;
                console.log("LAYER EDITED:", layers);
                layers.eachLayer((layer) => {
                    countOfEditedLayers++;
                });
            });

            setMap(map); //hook to set map
            //this.setState({map: map});

            console.log("map:", { map });
        }

    }, []);
    const position = [30.02197637153885, 31.48435491397395];

    return (
        <MapContainer center={position} zoom={13} style={{ height: "100vh" }} >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

            // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            // attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
            <Marker position={position} icon={icon}>
                <Popup>
                    A pretty CSS3 popup.
                    <br />
                    Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapSearch;