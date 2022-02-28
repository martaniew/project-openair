import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listActivities,
  listMyActivities,
  listTopActivities,
} from "../actions/activityActions";
import { Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Activity from "../components/Activity";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import Search from "../components/Search";
import GoogleMapReact from "google-map-react";
import Marker from "../components/Marker";
import { defaultProps } from "../constants/mapConstant";
import Paginate from "../components/Paginate";

const Searchresults = ({ location, match, history }) => {
  const dispatch = useDispatch();

// get activities from store   
  const activityList = useSelector((state) => state.activityList);
  const { loading, error, activities, page, pages } = activityList;
  console.log(page);
  console.log(pages);

// get top rated activities from store 
  const activityTopRated = useSelector((state) => state.activityTopRated);
  const {
    loading: activityTopRatedLoading,
    error: activityTopRatedError,
    activities: topRatedActivities,
  } = activityTopRated;


// get number of  page of search results from url
  const pageNumber = match.params.pageNumber || 1;

// get search parameters from url 
const adress = new URLSearchParams(location.search).get("adress");
const discipline = new URLSearchParams(location.search).get("discipline");  

// create object with search parameters   
let searchParameters = {};
  if (adress) {
    searchParameters = { ...searchParameters, adress };
  }

  if (discipline) {
    searchParameters = { ...searchParameters, discipline };
  }


// state variables 
  const [markerToShow, setMarkertoShow] = useState("");
  const [searchResultsMessage, setSearchResultsMessage] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsNumber, setSearchResultsNumber] = useState(null);

  
//redirect to activity page after cliking on marker 
  const onChildClickCallback = (key) => {
    history.push(`/activity/${key}`);
  };


  useEffect(() => {
    dispatch(listTopActivities());
  }, []);

  //disptaching activities after new search 
  useEffect(() => {
    dispatch(listActivities(searchParameters, pageNumber));
    dispatch(listTopActivities());
  }, [adress, discipline, dispatch, pageNumber]);

  
  // auto-center map depending on activities location
  const handleApiLoaded = (map, maps) => {
    var latlngbounds = new maps.LatLngBounds();

    searchResults.map((activity) => {
      var myLatlng = new maps.LatLng(
        activity.location.lat,
        activity.location.lng
      );
      console.log(myLatlng);
      latlngbounds.extend(myLatlng);
    });
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);
  };

// if there is no activities meeting the criteria display top rated activities 
  useEffect(() => {
    if (activities.length === 0) {
      setSearchResults(topRatedActivities);
      setSearchResultsMessage(true);
    } else {
      setSearchResults(activities);
      setSearchResultsMessage(false);
      setSearchResultsNumber(activities.length);
    }
  }, [activities]);

  // show thumbnail after hovering the mouse over marker
  const onChildMouseEnter = (key) => {
    const index = searchResults.findIndex((activity) => activity._id === key);
    console.log(searchResults[index]);

    searchResults[index].show = true;
    console.log(searchResults[index].show);
  };

  // hide thumbnail after leaving the mouse over marker
  const onChildMouseLeave = (key) => {
    const index = searchResults.findIndex((activity) => activity._id === key);
    console.log(searchResults[index]);

    searchResults[index].show = false;
    console.log(searchResults[index]);
  };

// single out marker when mouse hovering appropriate activity from the list 
  const onMouseOverhandle = (id) => {
    setMarkertoShow(id);
    console.log(id);
  };

  return (
    <>
      <Meta />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {searchResultsMessage === true && (
            <Message>
              Il n’y a pas de résultat qui correspond à vos critères de recherches. Veuillez modifier vos critères ou sélectionner une des activités les mieux notées.
            </Message>
          )}
          <div className="searchresults">
            <Route render={({ history }) => <Search history={history} />} />
          </div>

          <div className="searchresultslist">
            <div className="thumbnaillist">
              {searchResults.map((activity) => (
                <div
                  onMouseOver={() => onMouseOverhandle(activity._id)}
                  onMouseOut={() => setMarkertoShow("")}
                >
                  <Activity activity={activity} />
                </div>
              ))}
            </div>

            <div className="map">
              <GoogleMapReact
                defaultZoom={defaultProps.zoom}
                defaultCenter={defaultProps.center}
                bootstrapURLKeys={{
                  key: "AIzaSyA5HtsM-i9Oe_GT_Bp0M-YBy08PTkyJfi0",
                }}
                onChildClick={onChildClickCallback}
                onChildMouseEnter={onChildMouseEnter}
                onChildMouseLeave={onChildMouseLeave}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) =>
                  handleApiLoaded(map, maps)
                }
              >
                {searchResults.map((activity) => (
                  <Marker
                    key={activity._id}
                    lat={activity.location.lat}
                    lng={activity.location.lng}
                    activity={activity}
                    show={activity.show}
                    enlarged={activity._id === markerToShow}
                  />
                ))}
              </GoogleMapReact>
            </div>
          </div>
        </>
      )}
      <Paginate pages={pages} page={page} />
    </>
  );
};

export default Searchresults;
