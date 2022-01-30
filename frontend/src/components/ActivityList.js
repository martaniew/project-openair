import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  listActivities,
  deleteActivity,
} from '../actions/activityActions'
import ActivityList from '../components/ActivityList'

const Activities = ({activities}) => {

    const activityDelete = useSelector((state) => state.activityDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = activityDelete


  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteActivity(id))
    }
  }

return (
<>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DISCIPLINE</th>
                <th>ADDRESS</th>
                <th>CONTACT</th>
                <th>DIFFICULTY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity._id}</td>
                  <td>{activity.discipline}</td>
                  <td>{activity.address}</td>
                  <td>{activity.contact}</td>
                  <td>{activity.difficulty}</td>
                  <td>
                    <LinkContainer to={`/admin/activity/${activity._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(activity._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
    )
}

export default ActivityList