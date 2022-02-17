import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  activityListReducer,
  activityDetailsReducer,
  activityDeleteReducer,
  activityCreateReducer,
  activityUpdateReducer,
  activityReviewCreateReducer,
  activityTopRatedReducer,
  activitiesListMyReducer, 
  
} from './reducers/activityReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  UserAddToFavouriteReducer, 
  
} from './reducers/userReducers'



const reducer = combineReducers({
  activityList: activityListReducer,
  activityDetails: activityDetailsReducer,
  activityDelete: activityDeleteReducer,
  activityCreate: activityCreateReducer,
  activityUpdate: activityUpdateReducer,
  activityReviewCreate: activityReviewCreateReducer,
  activityTopRated: activityTopRatedReducer,
  activitiesListMy: activitiesListMyReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  userFavourites: UserAddToFavouriteReducer, 
})


const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null


const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)


export default store
