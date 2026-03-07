"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in Next.js
const defaultIcon = L.icon({
    iconUrl: '/red-marker.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

const defaultCenter: [number, number] = [23.8150, 90.3950]; // Dhaka Cantonment

interface LocationMapPickerProps {
    value: [number, number] | null;
    onChange: (coords: [number, number]) => void;
}

function LocationMarker({ position, onChange }: { position: [number, number] | null, onChange: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            onChange([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function LocationMapPicker({ value, onChange }: LocationMapPickerProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="w-full h-[300px] flex items-center justify-center bg-white/5 rounded-lg border border-white/10 text-gray-500">Loading Map...</div>;

    return (
        <div className="w-full h-[300px] rounded-lg overflow-hidden relative z-0 border border-white/10">
            <MapContainer center={value || defaultCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <LocationMarker position={value} onChange={onChange} />
            </MapContainer>
        </div>
    );
}
