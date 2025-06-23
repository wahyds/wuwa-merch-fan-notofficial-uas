'use client'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'

// Fix default marker icon (tanpa error di browser)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

function LocationSelector({ setLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setLocation({ lat, lng })
    },
  })
  return null
}

export default function Map({ location, setLocation }) {
  const [position, setPosition] = useState([ -6.2, 106.8 ]) // default Jakarta

  useEffect(() => {
    if (location) {
      setPosition([location.lat, location.lng])
    }
  }, [location])

  return (
    <MapContainer center={position} zoom={13} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && <Marker position={[location.lat, location.lng]} />}
      <LocationSelector setLocation={setLocation} />
    </MapContainer>
  )
}
