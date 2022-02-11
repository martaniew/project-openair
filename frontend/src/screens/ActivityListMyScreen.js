import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listMyActivities, deleteActivity } from "../actions/activityActions";

// List activities added by user

const ActivityListMyScreen = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading: userLoading, error: userError, userInfo } = userLogin;

  // get state of delate from store

  const activityDelete = useSelector((state) => state.activityDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = activityDelete;

  //  get activities from store
  const activitiesListMy = useSelector((state) => state.activitiesListMy);
  const {
    loading: loadingActivities,
    error: errorActivities,
    activities,
  } = activitiesListMy;

  // if user is not login in redirect to login page if not get list of user activities
  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    dispatch(listMyActivities());
  }, [dispatch, history, userInfo, successDelete]);

  // if activity is sucesfully delated  disptach list of user activities
  useEffect(() => {
    if (successDelete) {
      dispatch(listMyActivities());
    }
  }, [successDelete]);

  // delate activity handler
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteActivity(id));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>My activities</h2>
        {loadingActivities ? (
          <Loader />
        ) : errorActivities ? (
          <Message variant="danger">{errorActivities}</Message>
        ) : (
          activities && (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity._id}</td>
                    <td>{activity.createdAt.substring(0, 10)}</td>
                    <td>
                      <LinkContainer
                        to={`/admin/activity/${activity._id}/edit`}
                      >
                        <Button variant="light" className="btn-sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(activity._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        )}
      </Col>
    </Row>
  );
};

export default ActivityListMyScreen;
