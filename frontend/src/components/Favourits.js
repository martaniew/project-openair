import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/userActions";

import { addToFavourite } from "../actions/userActions";

// add to favourite functionality

const Favourits = ({ activityId }) => {
  
  const dispatch = useDispatch();

// getting information about user from strore 
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

// getting information about adding activity to favorits  
  const userFavourites = useSelector((state) => state.userFavourites);
  const { success: successAddToFavourite } = userFavourites;

// state variable   
  const [isFavourite, setIsFavourite] = useState(false);

// if adding to favourits succeed get information about user
  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails(userInfo._id));
    }
  }, [userInfo, dispatch, successAddToFavourite]);

  // if user object will change check if activity belongs to favourits
  useEffect(() => {
    if (user.favs) {
      if (user.favs.includes(activityId)) {
        setIsFavourite(true);
      } else {
        setIsFavourite(false);
      }
    }
  }, [user]);

// Event handler add or remove from favourits 
  const addRemoveFavouritsHandler = () => {
    dispatch(addToFavourite(activityId));
  };

  return (
    <i
      className="favourits"
      onClick={addRemoveFavouritsHandler}
      style={{ color: isFavourite ? "red" : "grey" }}
      className={"fa-solid fa-heart"}
    ></i>
  );
};

Favourits.defaultProps = {
  color: "#f8e825",
};

export default Favourits;
