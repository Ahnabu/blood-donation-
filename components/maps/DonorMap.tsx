"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in Next.js
const defaultIcon = L.icon({
    iconUrl: '/red-marker.png', // We'll add a simple svg or use default leaflet if we fix paths
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

const defaultCenter: [number, number] = [23.8150, 90.3950]; // Dhaka Cantonment

export default function DonorMap() {
    const [markers, setMarkers] = useState<[number, number][]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Simulated donor locations around Dhaka Cantonment
        setMarkers([
            [23.8151, 90.3952],
            [23.8140, 90.3970],
            [23.8180, 90.3920],
        ]);
    }, []);

    if (!isMounted) return <div className="w-full h-[400px] flex items-center justify-center bg-white/5 rounded-lg text-gray-500">Loading Map...</div>;

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden relative z-0 border border-white/10">
            <MapContainer center={defaultCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {markers.map((pos, idx) => (
                    <Marker key={idx} position={pos} />
                ))}
            </MapContainer>
        </div>
    );
}
