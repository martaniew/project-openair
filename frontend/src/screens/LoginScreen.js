import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
import Card from "../components/Card";

const SENDING_STEPS = {
  NONE: "NONE",

  VALIDATION: "VALIDATION",

  SEND_DATA: "SEND_DATA",
};

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState(SENDING_STEPS.NONE);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  console.log(location);

  const redirect = location.search ? location.search.split("=")[1] : "/";
  console.log(redirect);

  useEffect(() => {
    if (step !== SENDING_STEPS.VALIDATION) return;
    let valid = true;
    if (!email.value) {
      setEmail({
        value: email.value,
        error: "Vous devez renseigner email",
      });
      valid = false;
    }
    if (!password.value) {
      setPassword({
        value: password.value,
        error: "Vous devez renseigner password",
      });

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
    if (step !== SENDING_STEPS.SEND_DATA) return;

    dispatch(login(email.value, password.value));
  }, [step]);

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  console.log(userInfo);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const changeField = (setField) => (e) =>
    setField({
      error: "",
      value: e.target.value,
    });

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <FormContainer>
        <h1>Se connecter</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Address Email</Form.Label>
            {!!email.error && <Message variant="danger">{email.error}</Message>}
            <Form.Control
              type="email"
              placeholder="Saisissez votre e-mail"
              value={email.value}
              onChange={changeField(setEmail)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            {!!password.error && (
              <Message variant="danger">{password.error}</Message>
            )}
            <Form.Control
              type="password"
              placeholder="Saisissez votre mot de passe"
              value={password.value}
              onChange={changeField(setPassword)}
            ></Form.Control>
          </Form.Group>

          <Button
            variant="primary"
            onClick={() => {
              setStep(SENDING_STEPS.VALIDATION);
            }}
          >
            Connectez vous
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
          Nouvel utilisateur? {" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Créez un compte
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginScreen;
