import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listActivities, listMyActivities, listTopActivities } from '../actions/activityActions'
import { Route } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Activity from '../components/Activity'
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
  const activityList = useSelector((state) => state.activityList)
  const {loading, error, activities, page, pages } = activityList
  console.log(page)
  console.log(pages)

  
    
    

    const activityTopRated = useSelector((state) => state.activityTopRated)
    const { loading: activityTopRatedLoading , error: activityTopRatedError , activities: topRatedActivities } = activityTopRated

    console.log(topRatedActivities)
  
    

    const adress = new URLSearchParams(location.search).get("adress"); 
    const discipline = new URLSearchParams(location.search).get("discipline");  
    const pageNumber = match.params.pageNumber || 1
    const [markerToShow, setMarkertoShow] = useState(""); 
    const [searchResultsMessage, setSearchResultsMessage] = useState(false)
    const [searchResults, setSearchResults] =useState([])
    const [searchResultsNumber, setSearchResultsNumber] =useState(null)
    

    let searchParameters = {}
    if(adress) {
        searchParameters = {...searchParameters, adress}
    }

    if(discipline) {
        searchParameters = {...searchParameters, discipline}
    }

    console.log(searchParameters); 
    console.log(pageNumber)


    const onChildClickCallback = (key) => {
      history.push(`/activity/${key}`)
    };

    useEffect(()=> {
      dispatch(listTopActivities())
    }, [])
    
    
    useEffect(() => {

      dispatch(listActivities(searchParameters, pageNumber))
      dispatch(listTopActivities())
      }, [adress, discipline, dispatch, pageNumber])

      const handleApiLoaded = (map, maps) => {
        var latlngbounds = new maps.LatLngBounds();

        searchResults.map((activity)=>{
          var myLatlng = new maps.LatLng(activity.location.lat, activity.location.lng); 
          console.log(myLatlng); 
          latlngbounds.extend(myLatlng);
        })
      map.setCenter(latlngbounds.getCenter())
      map.fitBounds(latlngbounds);
    }

    useEffect(()=> {
      if(activities.length === 0) {
        setSearchResults(topRatedActivities)
        setSearchResultsMessage(true)
      
      }
      else{
        setSearchResults(activities)
        setSearchResultsMessage(false)
        setSearchResultsNumber(activities.length)
      }
    }, [activities])

    

   const onChildMouseEnter = (key)=> {
    const index = searchResults.findIndex((activity) => activity._id === key)
    console.log(searchResults[index]);

    searchResults[index].show = true; 
   console.log(searchResults[index].show)
   ; 
   }

   const onChildMouseLeave = (key) => {
    const index = searchResults.findIndex((activity) => activity._id === key)
    console.log(searchResults[index]);

    searchResults[index].show = false; 
   console.log(searchResults[index])
   }

   const onMouseOverhandle = (id) => {
    setMarkertoShow(id); 
    console.log(id); 
   }
    
        
    
      



 
    
    return (
     <>
        <Meta />
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
         {searchResultsMessage === true && (
         <p className='text-center fixed'> We didnt find any activities witch match your cryteria. Change your serach criteria or chosse one of our best rated activity</p>) 
         }
      <div className='searchresults'>
                <Route render={({ history }) => <Search history={history} />} />
                </div>

            <div className='searchresultslist'>
            <div className='thumbnaillist'>
              {searchResults.map((activity) => (
                <div
                onMouseOver={()=> onMouseOverhandle(activity._id)}
                onMouseOut={()=> setMarkertoShow("")}>
                
                  <Activity activity={activity} />
                </div>
              ))}
              </div>
                
            <div className="map">
            <GoogleMapReact
            defaultZoom={defaultProps.zoom}
            defaultCenter={defaultProps.center}
            bootstrapURLKeys={{ key: "AIzaSyA5HtsM-i9Oe_GT_Bp0M-YBy08PTkyJfi0"}}
            onChildClick={onChildClickCallback}
            onChildMouseEnter={onChildMouseEnter}
            onChildMouseLeave={onChildMouseLeave} 
            
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
              {searchResults.map((activity) => (
                <Marker
                  key={activity._id}
                  lat={activity.location.lat}
                  lng={activity.location.lng}
                  activity={activity}
                  show={activity.show}
                  enlarged = {activity._id === markerToShow}
                />
              ))}
            </GoogleMapReact>
          </div>
                
          
            
           
            </div>
            </>)}
             <Paginate
              pages={pages}
              page={page}
            /> 
      </>)
}

export default Searchresults; 