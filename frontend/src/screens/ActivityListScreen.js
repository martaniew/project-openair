import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  listActivities,
  listMyActivities,
  deleteActivity,
  createActivity,
} from "../actions/activityActions";
import { ACTIVITY_CREATE_RESET } from "../constants/activityConstants";

//get list of all activities from admin or user activities for user 

const ActivityListScreen = ({ location, history, match }) => {
  const [activitiesList, setActivitiesList] = useState([]);

// get number of actual page if search results from url
  const pageNumber = match.params.pageNumber || 1;
  console.log(pageNumber);

// get user type (admin or user) from url
  const user = new URLSearchParams(location.search).get("user");
  console.log(user);

  const dispatch = useDispatch();

//get list of all activities and user activities from store 
  const activityList = useSelector((state) => state.activityList);
  const { loading, error, activities, page, pages } = activityList;

  const activitiesListMy = useSelector((state) => state.activitiesListMy);
  console.log(activitiesListMy);
  const {
    loading: loadingActivities,
    error: errorActivities,
    activities: activitiesMy,
  } = activitiesListMy;

  // get delate state 

  const activityDelete = useSelector((state) => state.activityDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = activityDelete;

// get information about user
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  console.log(history);
  

// get list activities in case of parametrs change   
  useEffect(() => {
    dispatch(listMyActivities());
    dispatch(listActivities({}, pageNumber));
  }, [
    dispatch,
    history,
    location,
    userInfo,
    successDelete,
    pageNumber,
    user,
  ]);

  // depending of user type get all activities or user activities  
  useEffect(() => {
    if (user === "user") {
      if (!userInfo) {
        history.push("/login");
      }
      setActivitiesList(activitiesMy);
    } else {
      if (!userInfo || !userInfo.isAdmin) {
        history.push("/login");
      }

      setActivitiesList(activities);
    }
  }, [activities, activitiesMy]);

  // delate activity handler 
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteActivity(id));
    }
  };

  
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Activities</h1>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading || loadingActivities ? (
        <Loader />
      ) : error || errorActivities ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DISCIPLINE</th>
                <th>ADDRESS</th>
                <th>CONTACT</th>
                <th>DIFFICULTIE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activitiesList &&
                activitiesList.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity._id}</td>
                    <td>{activity.discipline}</td>
                    <td>${activity.adress}</td>
                    <td>{activity.contact}</td>
                    <td>{activity.difficultie}</td>
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
          {user != "user" && (
            <Paginate pages={pages} page={page} isAdmin={true} />
          )}
        </>
      )}
    </>
  );
};

export default ActivityListScreen;
