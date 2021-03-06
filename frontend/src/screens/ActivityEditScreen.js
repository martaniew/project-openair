import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  listActivityDetails,
  updateActivity,
} from "../actions/activityActions";
import { ACTIVITY_UPDATE_RESET } from "../constants/activityConstants";

const SENDING_STEPS = {
  NONE: "NONE",

  VALIDATION: "VALIDATION",

  SEND_DATA: "SEND_DATA",
};

const ActivityEditScreen = ({ match, history }) => {
  const activityId = match.params.id;

  const [discipline, setDiscipline] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [contact, setContact] = useState({ value: "", error: "" });
  const [adress, setAdress] = useState({ value: "", error: "" });
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [difficulty, setDifficulty] = useState({ value: "", error: "" });
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState(SENDING_STEPS.NONE);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const activityDetails = useSelector((state) => state.activityDetails);
  const { loading, error, activity } = activityDetails;

  const activityUpdate = useSelector((state) => state.activityUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
    activity: updatedActivity,
  } = activityUpdate;

  console.log(updatedActivity);

  useEffect(() => {
    if (step !== SENDING_STEPS.VALIDATION) return;
    let valid = true;
    if (!discipline.value) {
      setDiscipline({
        value: discipline.value,
        error: "Vous devez renseigner discipline",
      });
      valid = false;
    }
    if (!contact.value) {
      setContact({
        value: contact.value,
        error: "Vous devez renseigner contact",
      });

      valid = false;
    }

    if (!description.value) {
      setDescription({
        value: description.value,
        error: "Vous devez renseigner description",
      });

      valid = false;
    }

    if (!adress.value) {
      setAdress({
        value: adress.value,
        error: "Vous devez renseigner adress",
      });

      valid = false;
    }

    if (!difficulty.value || difficulty.value === "") {
      setDifficulty({
        value: difficulty.value,
        error: "Vous devez renseigner difficulty",
      });
      valid = false;
    }

    if (!image) {
      setImageError("Vous devez renseigner un image");
      valid = false;
    }

    setFormError("");

    if (valid === true) {
      setStep(SENDING_STEPS.SEND_DATA);
    } else {
      setStep(SENDING_STEPS.NONE);
    }
  }, [step]);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: ACTIVITY_UPDATE_RESET });
      history.push(`/activity/${updatedActivity._id}`);
    } else {
      if (!activity._id || activity._id !== activityId) {
        dispatch(listActivityDetails(activityId));
      } else {
        setDiscipline({
          value: activity.discipline,
          error: "",
        });
        setDescription({ value: activity.description, error: "" });
        setContact({ value: activity.contact, error: "" });
        setAdress({ value: activity.adress, error: "" });
        setImage(activity.image);
        setDifficulty({ value: activity.image, error: "" });
      }
    }
  }, [dispatch, history, activityId, activity, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (step !== SENDING_STEPS.SEND_DATA) return;

    dispatch(
      updateActivity(
        activityId,
        discipline.value,
        adress.value,
        image,
        description.value,
        difficulty.value,
        contact.value
      )
    );
  }, [step]);

  const changeField = (setField) => (e) =>
    setField({
      error: "",
      value: e.target.value,
    });

  const ImageChangeHandler = (e) => {
    setImage(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateActivity({
        _id: activityId,
        discipline,
        description,
        contact,
        adress,
        image,
        difficulty,
      })
    );
  };

  return (
    <>
      <FormContainer>
        <h1>Mettre ?? jour activit??</h1>
        {loadingUpdate && <Loader />}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="disipline">
              <Form.Label>Type d'activit??</Form.Label>
              {!!discipline.error && (
                <Message variant="danger">{discipline.error}</Message>
              )}
              <Form.Control
                type="text"
                placeholder="Enter discipline"
                value={discipline.value}
                onChange={changeField(setDiscipline)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              {!!description.error && (
                <Message variant="danger">{description.error}</Message>
              )}
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description.value}
                onChange={changeField(setDescription)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="contact">
              {!!contact.error && (
                <Message variant="danger">{contact.error}</Message>
              )}
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={contact.value}
                onChange={changeField(setContact)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="adress">
              {!!adress.error && (
                <Message variant="danger">{adress.error}</Message>
              )}
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="adress"
                value={adress.value}
                onChange={changeField(setAdress)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="difficulty">
              {!!difficulty.error && (
                <Message variant="danger">{difficulty.error}</Message>
              )}
              <Form.Label>Niveau de difficult??</Form.Label>
              <Form.Control
                as="select"
                value={difficulty.value}
                onChange={changeField(setDifficulty)}
              >
                <option value="">Choisir...</option>
                <option value="begginer">1 - D??butant</option>
                <option value="intermediete">2 - Avanc??</option>
                <option value="proffesionel">3 - Professionnel</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              {!!imageError && <Message variant="danger">{imageError}</Message>}
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Image"
                value={image}
                onChange={ImageChangeHandler}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="S??lectionner un fichier"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

            <Button
              variant="primary"
              onClick={() => {
                setStep(SENDING_STEPS.VALIDATION);
              }}
            >
              Mettre ?? jour
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ActivityEditScreen;
