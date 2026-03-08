"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [23.8150, 90.3950]; // Dhaka Cantonment

// Inline SVG red pin — no external file needed
const redPinIcon = L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 9.5 14 26 14 26S28 23.5 28 14C28 6.27 21.73 0 14 0z" fill="#e63946"/>
        <circle cx="14" cy="14" r="6" fill="#fff"/>
    </svg>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
});

interface LocationMapPickerProps {
    value: [number, number] | null;
    onChange: (coords: [number, number]) => void;
}

function ClickHandler({ onChange }: { onChange: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            onChange([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function LocationMapPicker({ value, onChange }: LocationMapPickerProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted) return (
        <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', color: '#6e7681' }}>
            Loading Map…
        </div>
    );

    return (
        <div style={{ width: '100%', height: 300, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 0 }}>
            <MapContainer
                center={value ?? DEFAULT_CENTER}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`}
                    maxZoom={20}
                />
                <ClickHandler onChange={onChange} />
                {value && <Marker position={value} icon={redPinIcon} />}
            </MapContainer>
        </div>
    );
}
