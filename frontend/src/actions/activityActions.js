import axios from 'axios'
import {
  ACTIVITY_LIST_REQUEST,
  ACTIVITY_LIST_SUCCESS,
  ACTIVITY_LIST_FAIL,
  ACTIVITY_DETAILS_REQUEST,
  ACTIVITY_DETAILS_SUCCESS,
  ACTIVITY_DETAILS_FAIL,
  ACTIVITY_DELETE_SUCCESS,
  ACTIVITY_DELETE_REQUEST,
  ACTIVITY_DELETE_FAIL,
  ACTIVITY_CREATE_REQUEST,
  ACTIVITY_CREATE_SUCCESS,
  ACTIVITY_CREATE_FAIL,
  ACTIVITY_UPDATE_REQUEST,
  ACTIVITY_UPDATE_SUCCESS,
  ACTIVITY_UPDATE_FAIL,
  ACTIVITY_CREATE_REVIEW_REQUEST,
  ACTIVITY_CREATE_REVIEW_SUCCESS,
  ACTIVITY_CREATE_REVIEW_FAIL,
  ACTIVITY_TOP_REQUEST,
  ACTIVITY_TOP_SUCCESS,
  ACTIVITY_TOP_FAIL,
  ACTIVITY_LIST_MY_FAIL, 
  ACTIVITY_LIST_MY_REQUEST, 
  ACTIVITY_LIST_MY_SUCCESS
} from '../constants/activityConstants'
import { logout } from './userActions'

export const listActivities = (searchParams={}, pageNumber = '') => async (
  dispatch
) => {
  try {
    dispatch({ type: ACTIVITY_LIST_REQUEST })

    // in req.body we send search parameters and a number of search results page from witch reqest were send

    const { data } = await axios.get(
      `/api/activities`, {
        params: {
        searchParams: searchParams, 
        pageNumber: pageNumber
       },
       headers: {
        'Content-Type': 'application/json'
      }
    }
    )
    dispatch({
      type: ACTIVITY_LIST_SUCCESS,
      payload: data,

    })
  } catch (error) {
    dispatch({
      type: ACTIVITY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
  
}

export const listActivityDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ACTIVITY_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/activities/${id}`)

    dispatch({
      type: ACTIVITY_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ACTIVITY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteActivity = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ACTIVITY_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    

    await axios.delete(`/api/activities/${id}`)

    dispatch({
      type: ACTIVITY_DELETE_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ACTIVITY_DELETE_FAIL,
      payload: message,
    })
  }
}

export const createActivity = (discipline, adress, image, description, difficulty, contact) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ACTIVITY_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    console.log(userInfo)

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/api/activities`, {discipline, adress, image, description, difficulty, contact}, config)

    dispatch({
      type: ACTIVITY_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ACTIVITY_CREATE_FAIL,
      payload: message,
    })
  }
}

export const updateActivity = (activityId, discipline, adress, image, description, difficulty, contact) => async (dispatch, getState) => {

  try {
    dispatch({
      type: ACTIVITY_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `/api/activities/${activityId}`,
      {discipline, adress, image, description, difficulty, contact},
      config
    )

    dispatch({
      type: ACTIVITY_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: ACTIVITY_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ACTIVITY_UPDATE_FAIL,
      payload: message,
    })
  }
}

export const createActivityReview = (activityId, review) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: ACTIVITY_CREATE_REVIEW_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    console.log(config); 

    await axios.post(`/api/activities/${activityId}/reviews`, review, config)

    dispatch({
      type: ACTIVITY_CREATE_REVIEW_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ACTIVITY_CREATE_REVIEW_FAIL,
      payload: message,
    })
  }
}

export const listTopActivities = () => async (dispatch) => {
  try {
    dispatch({ type: ACTIVITY_TOP_REQUEST })

    const { data } = await axios.get(`/api/activities/top`)

    dispatch({
      type: ACTIVITY_TOP_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ACTIVITY_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listMyActivities = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ACTIVITY_LIST_MY_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    console.log(userInfo)


    const { data } = await axios.get(`/api/activities/${userInfo._id}/myactivities`)

    dispatch({
      type: ACTIVITY_LIST_MY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Login first to access this resource.') {
      dispatch(logout())
    }
    dispatch({
      type: ACTIVITY_LIST_MY_FAIL,
      payload: message,
    })
  }
}
