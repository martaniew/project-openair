import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Container,
  ListGroupItem,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { defaultProps } from "../constants/mapConstant";
import GoogleMapReact from "google-map-react";
import Marker from "../components/Marker";
import Favourits from "../components/Favourits";

import {
  listActivityDetails,
  createActivityReview,
} from "../actions/activityActions";
import { ACTIVITY_CREATE_REVIEW_RESET } from "../constants/activityConstants";
import { addToFavourite } from "../actions/userActions";

const ActivityScreen = ({ history, match }) => {
  const activityDetails = useSelector((state) => state.activityDetails);
  const [contactClicked, setContactClicked] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState({
    lat: 60.955413,
    lng: 30.337844,
  });

  const dispatch = useDispatch();

  const { loading, error, activity } = activityDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const activityReviewCreate = useSelector(
    (state) => state.activityReviewCreate
  );
  const {
    success: successActivityReview,
    loading: loadingActivityReview,
    error: errorActivityReview,
  } = activityReviewCreate;

  console.log(activityDetails);

  useEffect(() => {
    if (activity.location != undefined) {
      setLocation(activity.location);
    }
  }, [activity.location]);

  useEffect(() => {
    if (successActivityReview) {
      setRating(0);
      setComment("");
    }
    if (!activity._id || activity._id !== match.params.id) {
      dispatch(listActivityDetails(match.params.id));
      dispatch({ type: ACTIVITY_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, successActivityReview]);

  console.log(userInfo);
  console.log(activity);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createActivityReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={activity.discipline} />

          <Row>
            <Col>
              <div className="mapactivity">
                <GoogleMapReact
                  defaultZoom={defaultProps.zoom}
                  defaultCenter={location}
                  bootstrapURLKeys={{ key: defaultProps.key }}
                >
                  <Marker
                    key={activity._id}
                    lat={location.lat}
                    lng={location.lng}
                    activity={activity}
                    show={false}
                    activity={activity}
                  />
                </GoogleMapReact>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Image src={activity.image} alt={activity.discipline} fluid className="activityimage"/>
            </Col>
            <Col md={6}>
              <Card
                border="secondary"
                style={{
                  width: "18rem",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                className="fixed rounded"
              >
                <Card.Header>Contacter l'auter</Card.Header>
                <Card.Body>
                  {activity.user && (
                    <Card.Title>
                      Contacter {activity.user.name} pour faire activité
                      ensemble
                    </Card.Title>
                  )}
                  {!contactClicked ? (
                    <Button
                      variant="primary"
                      onClick={() => setContactClicked(true)}
                    >
                      Contact
                    </Button>
                  ) : (
                    <Card.Text>{activity.contact}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              {activity && (
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>A propos de l'activité</h3>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Rating
                      value={activity.rating}
                      text={`${activity.numReviews} reviews`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Ajouter aux favoris: <Favourits activityId={activity._id} />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Type d'activité: {activity.discipline}
                  </ListGroup.Item>
                  <ListGroup.Item>Adresse : {activity.adress}</ListGroup.Item>
                  <ListGroup.Item>{activity.description}</ListGroup.Item>
                </ListGroup>
              )}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Avis</h2>
                </ListGroup.Item>
                {activity.reviews.length === 0 && <Message>No Reviews</Message>}

                {activity.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Rédiger un avis </h2>
                  {successActivityReview && (
                    <Message variant="success">
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingActivityReview && <Loader />}
                  {errorActivityReview && (
                    <Message variant="danger">{errorActivityReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Commentaires</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingActivityReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ActivityScreen;
