import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, listTopProducts } from '../actions/productActions'
import { Route } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Search from '../components/Search'
import GoogleMapReact from 'google-map-react'
import Marker from '../components/Marker'
import { defaultProps } from '../constants/mapConstant'
import Paginate from '../components/Paginate'



const Searchresults = ({location, match, history}) => {

    
    const dispatch = useDispatch()
    const productList = useSelector((state) => state.productList)
    const { loading, error, products, page, pages } = productList

    const name = new URLSearchParams(location.search).get("name"); 
    const description = new URLSearchParams(location.search).get("description");  
    const pageNumber = match.params.pageNumber || 1

    let searchParameters = {}
    if(name) {
        searchParameters = {...searchParameters, name}
    }

    if(description) {
        searchParameters = {...searchParameters, description}
    }

    console.log(searchParameters); 


    const onChildClickCallback = (key) => {
      history.push(`/product/${key}`)
    };

    useEffect(() => {
        dispatch(listProducts(searchParameters, pageNumber))
        dispatch(listTopProducts())
      }, [name, description, dispatch, pageNumber])


      const handleApiLoaded = (map, maps) => {
        var latlngbounds = new maps.LatLngBounds();

        products.map((product)=>{
          var myLatlng = new maps.LatLng(product.location.lat, product.location.lng); 
          console.log(myLatlng); 
          latlngbounds.extend(myLatlng);

        })

      map.setCenter(latlngbounds.getCenter())
      map.fitBounds(latlngbounds);


    }

   const onChildMouseEnter = (key)=> {
    const index = products.findIndex((product) => product._id === key)
    console.log(products[index]);

   products[index].show = true; 
   console.log(products[index].show)
   ; 
   }

   const onChildMouseLeave = (key) => {
    const index = products.findIndex((product) => product._id === key)
    console.log(products[index]);

   products[index].show = false; 
   console.log(products[index])
   }
    
        
    
      





    return ( <>
        <Meta />
          <Link to='/' className='btn btn-light'>
            Go Back
          </Link>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
          
          <Row>
                <Col>
                <Route render={({ history }) => <Search history={history} />} />
                </Col>
          </Row>

            <Row>
                <Col>
                <div className='searchresultmap' >
            <GoogleMapReact
            defaultZoom={defaultProps.zoom}
            defaultCenter={defaultProps.center}
            bootstrapURLKeys={{ key: "AIzaSyA5HtsM-i9Oe_GT_Bp0M-YBy08PTkyJfi0"}}
            onChildClick={onChildClickCallback}
            style={{  width:"90%", height: "100%" }}
            onChildMouseEnter={onChildMouseEnter}
            onChildMouseLeave={onChildMouseLeave} 
            
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
              {products.map((product) => (
                <Marker
                  key={product._id}
                  lat={product.location.lat}
                  lng={product.location.lng}
                  product={product}
                  show={product.show}
                />
              ))}
            </GoogleMapReact>
          </div>
                
                </Col>
            </Row>
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            { <Paginate
              pages={pages}
              page={page}
            /> }
          </>
        )}
      </>)
}

export default Searchresults; 