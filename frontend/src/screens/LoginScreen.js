import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'
import Card from '../components/Card'

const SENDING_STEPS = {
  /**
   * Correspond à l'état initial, pas d'enscription envoyéc
   */
  NONE: 'NONE',

  /**
   * On demande la validation des données
   */
  VALIDATION: 'VALIDATION',

  /**
   * On envoie les données à firebase
   */
  SEND_DATA: 'SEND_DATA',
}



const LoginScreen = ({ location, history }) => {
 
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [formError, setFormError] = useState('')
  const [step, setStep] = useState(SENDING_STEPS.NONE)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  console.log(location)

  const redirect = location.search ? location.search.split('=')[1] : '/'
  console.log(redirect)

  useEffect(() => {
    // Cette effet se déclenche uniquement lors de la step "VALIDATION"
    if (step !== SENDING_STEPS.VALIDATION) return
      let valid = true
      if (!email.value) {
        setEmail({
          value: email.value,
          error: 'Vous devez renseigner email',
        })
        valid = false
      }
      if (!password.value) {
        setPassword({
          value: password.value,
          error: 'Vous devez renseigner password',
        })

        valid = false
      }

    // On vide l'erreur de formulaire
    setFormError('')
    
      if (valid === true) {
        setStep(SENDING_STEPS.SEND_DATA)
      } else {
        // On retourne à l'étape NONE
        setStep(SENDING_STEPS.NONE)
      }
  }, [step])

  // Second effet, l'envoie des données à firebase
  useEffect(() => {
    // On éxécute l'effet uniquement si l'étape est SEND_DATA
    if (step !== SENDING_STEPS.SEND_DATA) return

    dispatch(login(email.value, password.value))
    
  }, [step])


  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

 console.log(userInfo); 

  const submitHandler = (e) => {
    e.preventDefault()
    
  }

  const changeField = setField => e =>
    setField({
      error: '',
      value: e.target.value,
    })


  return (
    <>
    {error && <Message variant='danger'>{error}</Message>}
    {loading && <Loader />}
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          {!!email.error && (
          
          <Message  variant='danger'>{email.error}</Message>
        )}
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email.value}
            onChange={changeField(setEmail)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          {!!password.error && (
          
          <Message  variant='danger'>{password.error}</Message>
        )}
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password.value}
            onChange={changeField(setPassword)}
          ></Form.Control>
        </Form.Group>

        <Button 
      variant='primary'
      onClick={() => {
        setStep(SENDING_STEPS.VALIDATION)
      }}
      >
        Create
      </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
    </>
  )
}

export default LoginScreen
