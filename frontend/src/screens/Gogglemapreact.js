
import React, { useEffect } from "react";
import { useState } from "react";
import GoogleMapReact from 'google-map-react'
import PropTypes from 'prop-types';
import Marker from "../components/Marker";
import Product from "../components/Product";
import { useDispatch, useSelector } from 'react-redux'



const Gogglemapreact  = () => {
    
    const [places, setPlaces] = useState([]); 
  
    const productList = useSelector((state) => state.productList)
    const { loading, error, products, page, pages } = productList
    const defaultProps = {
        center: {
          lat: 60.955413,
          lng: 30.337844
        },
        zoom: 11
      };

   
    console.log(products); 
    products.map((product) => {
        console.log(product.location.lat)
        console.log(product._id)
    }
   
        
    )

    const onChildClickCallback = (key) => {
        this.setState((state) => {
          const index = state.places.findIndex((e) => e.id === key);
          state.places[index].show = !state.places[index].show; // eslint-disable-line no-param-reassign
          return { places: state.places };
        });
      };
    



  
    // onChildClick callback can take two arguments: key and childProps
   
  
      return (
        <>
        <div style={{ height: '100vh', width: '100%'  }}>
          
            <GoogleMapReact
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            bootstrapURLKeys={{ key: "AIzaSyA5HtsM-i9Oe_GT_Bp0M-YBy08PTkyJfi0",
            language: 'en' }}
            onChildClick={onChildClickCallback}
            >
              {products.map((product) => (
                <Marker
                  key={product._id}
                  lat={product.location.lat}
                  lng={product.location.lng}
                  product={product}
                  
                />
              ))}
            </GoogleMapReact>
          
          </div>
        </>
      );
    }
  

  
  export default Gogglemapreact;