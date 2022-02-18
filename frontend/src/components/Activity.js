import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

//display single activity thumbnail
const Activity = ({ activity }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/activity/${activity._id}`}>
        <Card.Img src={activity.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/activity/${activity._id}`}>
          <Card.Title as='div'>
            <h3>{activity.discipline}</h3>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={activity.rating}
            text={`${activity.numReviews} avis`}
          />
        </Card.Text>

        <Card.Text>{activity.adress}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Activity
