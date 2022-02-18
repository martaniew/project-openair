import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, InputGroup, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";


const SENDING_STEPS = {
  NONE: "NONE",

  VALIDATION: "VALIDATION",

  SEND_DATA: "SEND_DATA",
};

const RegisterScreen = ({ location, history }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [name, setName] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
  });
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState(SENDING_STEPS.NONE);

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  useEffect(() => {
    if (step !== SENDING_STEPS.VALIDATION) return;
    let valid = true;

    if (!name.value) {
      setName({
        value: name.value,
        error: "Vous devez saisir votre nom",
      });
      valid = false;
    }

    if (!email.value) {
      setEmail({
        value: email.value,
        error: "Vous devez saisir votre email",
      });
      valid = false;
    }

    if (email.value) {
      if (!/^[^@]+@[^.]+\.[a-zA-Z0-9]+/.test(email.value)) {
        setEmail({
          value: email.value,
          error: "Vous devez saisir un email valide",
        });

        valid = false;
      }

    }

    if (!password.value) {
      setPassword({
        value: password.value,
        error: "Vous devez saisir votre mot de passe",
      });

      valid = false;
    }

  
     
    

    if (!confirmPassword.value) {
      setConfirmPassword({
        value: confirmPassword.value,
        error: "Vous devez confirmer un mot de passe",
      });

      valid = false;
    }

    if (password.value !== confirmPassword.value) {
      setPassword({
        value: password.value,
        error: "Les deux mots de passe ne correspondent pas",
      });

      valid = false;
    }

    if (password.value && password.value === confirmPassword.value) {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
          password.value
        )
      ) {
        setPassword({
          value: password.value,
          error:
            'Le champ "Mot de passe" doit comporter au moins 8 caractères, une majuscule et un caractère spécial (@$!%*?&).',
        });

        valid = false;
      }
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
    dispatch(register(name.value, email.value, password.value));
  }, [step]);

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
        <h1>Créez un compte</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Nom</Form.Label>
            {!!name.error && <Message variant="danger">{name.error}</Message>}
            <Form.Control
              type="text"
              placeholder="Saisissez votre nom"
              value={name.value}
              onChange={changeField(setName)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Addresse Email</Form.Label>
            {!!email.error && <Message variant="danger">{email.error}</Message>}
            <Form.Control
              type="email"
              placeholder="Saisissez votre adresse email"
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

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirmation de mot de passe</Form.Label>
            {!!confirmPassword.error && (
              <Message variant="danger">{confirmPassword.error}</Message>
            )}
            <Form.Control
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword.value}
              onChange={changeField(setConfirmPassword)}
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
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
