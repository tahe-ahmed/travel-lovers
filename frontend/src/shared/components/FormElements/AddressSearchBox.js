import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import './AddressSearchBox.css'

function AddressSearchBox(props) {
  const boxRef = useRef();
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoib21lcmJrazA2IiwiYSI6ImNrNThqeGRxbDBlcDIzam11eDIzaDRsamYifQ.P8GSW1O3dRj59x7v9l7FqA";
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      type: 'country'
    });

    geocoder.addTo(boxRef.current);

  }, [])

  return (
    <div>
      <label className='address-label'>Address</label>
      <div id={props.id} ref={boxRef}></div>
    </div>
  );
}

export default AddressSearchBox;
