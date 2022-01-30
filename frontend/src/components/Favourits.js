


import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails} from '../actions/userActions'

import {addToFavourite}  from '../actions/userActions'

const Favourits = ({ activityId }) => {

    const dispatch = useDispatch()
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
    
   
  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails
    
  const userFavourites = useSelector((state) => state.userFavourites)
    const {
    success: successAddToFavourite,
  } = userFavourites
   
  const [isFavourite, setIsFavourite] = useState(false)

    useEffect(() => {

      if(userInfo) {dispatch(getUserDetails(userInfo._id))}
    
    }, [userInfo, dispatch, successAddToFavourite])

    useEffect(()=> {
      if(user.favs) {

        if(user.favs.includes(activityId))
        {setIsFavourite(true); 
        }
        else{
          setIsFavourite(false)
        }}
    
    }, [user])

    console.log(user);
    console.log(isFavourite); 

    
  

   
  
   

    
    
  

     

      const addRemoveFavouritsHandler = () => {
        dispatch(
          addToFavourite(activityId))
      }
 
 
 
    return (
        <i
        className='favourits'
          onClick={addRemoveFavouritsHandler}
          style={{ color: isFavourite ? 'red' : 'grey' }}
          className={
            'fas fa-star'
          }
        ></i>
  )
}

Favourits.defaultProps = {
  color: '#f8e825',
}

export default Favourits
