import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import { Row, Col, Container } from 'react-bootstrap'
import Activity from '../components/Activity'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import { listActivities } from '../actions/activityActions'
import Search from '../components/Search'


const HomeScreen = ({ match }) => {
 

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const activityList = useSelector((state) => state.activityList)
  const { loading, error, activities, page, pages } = activityList

  useEffect(() => {
    dispatch(listActivities({}, pageNumber))
  }, [])

  return (
    <>
    <Meta />
    <div className='background'>

      <div className='search' >

    <Route render={({ history }) => <Search history={history} />} />

    </div>
 







              
        </div>
        </>
  
  )
}

export default HomeScreen
