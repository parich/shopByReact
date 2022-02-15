import React, { useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';

const libs = ['places'];
const defaultLocation = { lat: 45.516, lng: -73.56 };

export default function MapScreen() {
    const [googleApiKey, setGoogleApiKey] = useState('');

    const [center, setCenter] = useState(defaultLocation);
    const [location, setLocation] = useState(center);

    const mapRef = useRef(null);
    const placeRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios('/api/config/google');
            setGoogleApiKey(data);
        };
        fetch();
    }, []);

    const onLoad = (map) => {
        mapRef.current = map;
    };
    const onMarkerLoad = (marker) => {
        markerRef.current = marker;
    };
    const onLoadPlaces = (place) => {
        placeRef.current = place;
    };

    const onIdle = () => {
        setLocation({
            lat: mapRef.current.center.lat(),
            lng: mapRef.current.center.lng(),
        });
    };

    const onPlacesChanged = () => {
        const place = placeRef.current.getPlaces()[0].geometry.location;
        setCenter({ lat: place.lat(), lng: place.lng() });
        setLocation({ lat: place.lat(), lng: place.lng() });
    };

    return googleApiKey ? (
        <div className='full-container'>
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap
                    id='samaple-map'
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onIdle={onIdle}
                >
                    <StandaloneSearchBox
                        onLoad={onLoadPlaces}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <div>
                            <input type='text' placeholder='Enter your address'></input>
                            <button type='button' className='primary' onClick={onConfirm}></button>
                        </div>
                    </StandaloneSearchBox>
                    <Marker position={location} onLoad={onMarkerLoad}></Marker>
                </GoogleMap>
            </LoadScript>
        </div>
    ) :
        <LoadingBox>

        </LoadingBox>
}
