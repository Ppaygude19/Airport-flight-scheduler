import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom gold icon for our airports
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Coordinates for our supported airports
const AIRPORT_COORDS = {
  JFK: [40.6413, -73.7781],
  LAX: [33.9416, -118.4085],
  ORD: [41.9742, -87.9073],
  SFO: [37.6213, -122.3790],
  DFW: [32.8998, -97.0403],
  MIA: [25.7959, -80.2870],
  DEL: [28.5562, 77.1000],
  BOM: [19.0896, 72.8656],
  BLR: [13.1986, 77.7066],
  CCU: [22.6520, 88.4467],
  HYD: [17.2405, 78.4294],
  AMD: [23.0734, 72.6266],
  PNQ: [18.5793, 73.9089],
  GOI: [15.3808, 73.8313],
  MAA: [12.9941, 80.1709],
  COK: [10.1518, 76.3930]
};

function MapUpdater({ pathCoordinates }) {
  const map = useMap();
  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length > 0) {
      const bounds = L.latLngBounds(pathCoordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pathCoordinates, map]);
  return null;
}

export default function RouteMap({ routePath = [] }) {
  // Center of US approximately
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 4;

  // Extract coordinates for the given path
  const pathCoordinates = routePath
    .filter(code => AIRPORT_COORDS[code])
    .map(code => AIRPORT_COORDS[code]);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(197, 168, 128, 0.2)' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0B120E' }}
        scrollWheelZoom={false}
      >
        {/* Dark theme luxury tile layer (CartoDB Dark Matter) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Draw all markers for the route */}
        {routePath.map((code) => {
          const coords = AIRPORT_COORDS[code];
          if (!coords) return null;
          return (
            <Marker key={code} position={coords} icon={goldIcon}>
              <Popup>
                <strong style={{ color: '#0A1128' }}>{code} Airport</strong>
              </Popup>
            </Marker>
          );
        })}

        {/* Draw the connecting line */}
        {pathCoordinates.length > 1 && (
          <Polyline 
            positions={pathCoordinates} 
            color="#C5A880" 
            weight={3} 
            opacity={0.8}
            dashArray="10, 10" // Make it a dashed line to look like a flight path
          />
        )}
        <MapUpdater pathCoordinates={pathCoordinates} />
      </MapContainer>
    </div>
  );
}
