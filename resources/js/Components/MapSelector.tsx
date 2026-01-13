import { useTrans } from '@/Hooks/useTrans';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapSelectorProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialPos?: [number, number];
}

export default function MapSelector({
    onLocationSelect,
    initialPos,
}: MapSelectorProps) {
    const { t } = useTrans();

    const defaultPos: [number, number] = [-18.9186, -48.2772];

    const center: [number, number] = useMemo(
        () => initialPos || defaultPos,
        [initialPos],
    );

    const [position, setPosition] = useState<[number, number]>(center);

    useEffect(() => {
        if (initialPos) {
            setPosition(initialPos);
        }
    }, [initialPos]);

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                onLocationSelect(lat, lng);
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        useEffect(() => {
            if (initialPos) {
                map.setView(initialPos, map.getZoom());
            }
        }, [initialPos, map]);

        return <Marker position={position} />;
    }

    return (
        <div className="group relative h-[350px] w-full overflow-hidden rounded-[2rem] border border-slate-200 shadow-inner">
            <style>
                {`
                    .custom-grayscale-map .leaflet-tile-container {
                        filter: grayscale(100%) invert(5%) contrast(90%);
                    }
                    .custom-grayscale-map .leaflet-control-attribution {
                        display: none !important;
                    }
                    .custom-grayscale-map .leaflet-control-zoom {
                        border: none !important;
                        margin: 10px !important;
                    }
                    .custom-grayscale-map .leaflet-control-zoom-in, 
                    .custom-grayscale-map .leaflet-control-zoom-out {
                        background-color: #0f172a !important;
                        color: white !important;
                        border: none !important;
                        border-radius: 8px !important;
                        margin-bottom: 5px !important;
                        width: 34px !important;
                        height: 34px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                    /* Ajuste para Mobile: evita scroll infinito ao tentar rolar a página */
                    .leaflet-container {
                        touch-action: pan-x pan-y;
                    }
                `}
            </style>

            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={true}
                dragging={true}
                tapHold={true}
                className="custom-grayscale-map"
                style={{ height: '100%', width: '100%', background: '#f8fafc' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
            </MapContainer>

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-[1000] w-full -translate-x-1/2 px-4 text-center">
                <span className="inline-block rounded-full bg-slate-900/80 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-2xl backdrop-blur-md sm:text-[10px]">
                    {t('PROFILE.MAP_HELP_TEXT') ||
                        'Clique para marcar a localização'}
                </span>
            </div>
        </div>
    );
}
