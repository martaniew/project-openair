import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopActivities } from '../actions/activityActions'

const ActivityCarousel = () => {
  const dispatch = useDispatch()

  const activityTopRated = useSelector((state) => state.activityTopRated)
  const { loading, error, activities } = activityTopRated

  useEffect(() => {
    dispatch(listTopActivities())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-dark'>
      {activities.map((activity) => (
        <Carousel.Item key={activity._id}>
          <Link to={`/activity/${activity._id}`}>
            <Image src={activity.image} alt={activity.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2>
                {activity.name} (${activity.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ActivityCarousel
