import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-easybutton";
import "leaflet-easybutton/src/easy-button.css";

function MyComponent() {
    const map = useMap()
    console.log('map center:', map)
    return null
}


const NewMap = (props) => {
    const position = [30.02197637153885, 31.48435491397395];
    return (
        <MapContainer center={position} zoom={13} style={{ height: "100vh" }} >
            <TileLayer
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
            <MyComponent />

        </MapContainer>
    );
};

export default NewMap;