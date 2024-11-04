import React, { useState, useEffect, useCallback, useRef } from 'react';  
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';  

interface GoogleMapProps {  
  onLocationSelect: (location: string, latitude: string, longitude: string) => void;  
}  

const MyGoogleMap: React.FC<GoogleMapProps> = ({ onLocationSelect }) => {  
  const [map, setMap] = useState<google.maps.Map | null>(null);  
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);  
  const [clickedLocation, setClickedLocation] = useState<{  
    latitude: string;  
    longitude: string;  
  }>({ latitude: '-6.21462', longitude: '106.84513' });  
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);  
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);  
  const [showConfirmation, setShowConfirmation] = useState(false);  
  const autocompleteInputRef = React.createRef<HTMLInputElement>();  
  const { isLoaded } = useJsApiLoader({  
    googleMapsApiKey: 'AIzaSyC3np82jBuQ10QjCxwQtbNTZtSQ2aDgDOc',  
    libraries: ['places']  
  });  

  const handleMapClick = useCallback(  
    (event: google.maps.MapMouseEvent) => {  
      const latitude = event.latLng?.lat().toString() || '';  
      const longitude = event.latLng?.lng().toString() || '';  
      const location = `Latitude: ${latitude}, Longitude: ${longitude}`;  
      setClickedLocation({ latitude, longitude });  
      marker?.setPosition(event.latLng!);  
      setSelectedPlace(null);  
      setShowConfirmation(true);  
      if (autocompleteInputRef.current) {  
        autocompleteInputRef.current.value = location;  
      }  
    },  
    [marker, autocompleteInputRef]  
  );  

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {  
    setSelectedPlace(place);  
    setClickedLocation({  
      latitude: place.geometry?.location?.lat()?.toString() || '',  
      longitude: place.geometry?.location?.lng()?.toString() || ''  
    });  
    marker?.setPosition(place.geometry?.location!);  
    setShowConfirmation(true);  
    if (autocompleteInputRef.current) {  
      autocompleteInputRef.current.value = `${place.name}, ${place.formatted_address}`;  
    }  
  };  

  const handleLocationSelect = () => {  
    if (selectedPlace) {  
      onLocationSelect(  
        `${selectedPlace.name}, ${selectedPlace.formatted_address}`,  
        selectedPlace.geometry?.location?.lat()?.toString() || '',  
        selectedPlace.geometry?.location?.lng()?.toString() || ''  
      );  
      setShowConfirmation(false);  
    }  
  };  

  useEffect(() => {  
    if (map && marker) {  
      google.maps.event.addListener(map, 'click', handleMapClick);  
      return () => {  
        google.maps.event.clearListeners(map, 'click');  
      };  
    }  
  }, [map, marker, handleMapClick]);  

  return isLoaded ? (  
    <>  
      <GoogleMap  
        mapContainerStyle={{ width: '100%', height: '60vh' }}  
        center={{  
          lat: parseFloat(clickedLocation.latitude),  
          lng: parseFloat(clickedLocation.longitude)  
        }}  
        zoom={10}  
        onLoad={(map) => {  
          setMap(map);  
          const marker = new google.maps.Marker({  
            map,  
            position: {  
              lat: parseFloat(clickedLocation.latitude),  
              lng: parseFloat(clickedLocation.longitude)  
            }  
          });  
          setMarker(marker);  
        }}  
      >  
        {marker && (  
          <Marker  
            position={{  
              lat: parseFloat(clickedLocation.latitude),  
              lng: parseFloat(clickedLocation.longitude)  
            }}  
          />  
        )}  
        {isLoaded && (  
          <Autocomplete  
            onLoad={(autocomplete) => setAutocomplete(autocomplete)}  
            onPlaceChanged={() => {  
              if (autocomplete !== null) {  
                const place = autocomplete.getPlace();  
                handlePlaceSelect(place);  
              }  
            }}  
          >  
            <input  
              type="text"  
              placeholder="Search a location"  
              ref={autocompleteInputRef}  
              style={{  
                boxSizing: `border-box`,  
                border: `1px solid transparent`,  
                width: `240px`,  
                height: `32px`,  
                padding: `0 12px`,  
                borderRadius: `3px`,  
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,  
                fontSize: `14px`,  
                outline: `none`,  
                // textOverflowL: `ellipses`,  
                position: 'absolute',  
                left: '50%',  
                marginLeft: '-120px',  
                top: '10px'  
              }}  
            />  
          </Autocomplete>  
        )}  
      </GoogleMap>  
      {showConfirmation && (  
        <div  
          style={{  
            position: 'fixed',  
            top: 0,  
            left: 0,  
            width: '100%',  
            height: '100%',  
            backgroundColor: 'rgba(0, 0, 0, 0.5)',  
            display: 'flex',  
            justifyContent: 'center',  
            alignItems: 'center'  
          }}  
        >  
          <div  
            style={{  
              backgroundColor: 'white',  
              padding: '20px',  
              borderRadius: '5px',  
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'  
            }}  
          >  
            <h2>Confirm Location</h2>  
            <p>  
              You have selected: {selectedPlace?.name}, {selectedPlace?.formatted_address}  
            </p>  
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>  
              <button onClick={() => setShowConfirmation(false)}>Cancel</button>  
              <button onClick={handleLocationSelect} style={{ marginLeft: '10px' }}>  
                OK  
              </button>  
            </div>  
          </div>  
        </div>  
      )}  
    </>  
  ) : (  
    <div>Loading...</div>  
  );  
};  

export default MyGoogleMap;