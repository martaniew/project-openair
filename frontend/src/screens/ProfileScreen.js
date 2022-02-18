import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile} from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const SENDING_STEPS = {
  
  NONE: 'NONE',

  
  VALIDATION: 'VALIDATION',

  
  SEND_DATA: 'SEND_DATA',
}



const ProfileScreen = ({ location, history }) => {
 
 
  const [message, setMessage] = useState(null)

  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  })
  const [formError, setFormError] = useState('')
  const [step, setStep] = useState(SENDING_STEPS.NONE)


  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { loading: userLoading, error: userError, userInfo } = userLogin
  
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name || success ) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
      } else {
        setName({
          error: '',
          value: user.name,
          })
        setEmail({
          error: '',
          value: user.email,
          })
      }
    }
  }, [dispatch, history, userInfo, user, success])


  useEffect(() => {

    let valid = true
   
    if (step !== SENDING_STEPS.VALIDATION) return

    if (!name.value) {
      setName({
        value: name.value,
        error: 'Vous devez renseigner un nom',
      })

      valid = false
    }
    const validateEmail = () => {
     

      if (!email.value) {
        setEmail({
          value: email.value,
          error: 'Vous devez renseigner un email',
        })

        valid = false
      }

      if (!/^[^@]+@[^.]+\.[a-zA-Z0-9]+/.test(email.value)) {
        setEmail({
          value: email.value,
          error: 'Vous devez renseigner un email valide',
        })

        valid = false
      }

      return valid
    }

    // Validation des mots de passe
    const validatePasswords = () => {
      let valid = true

      if (!password.value) {
        setPassword({
          value: password.value,
          error: 'Vous devez renseigner un mot de passe',
        })

        valid = false
      }

      if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password.value)) {
        setPassword({
          value: password.value, 
          error: 'Le champ "Mot de passe" doit comporter au moins 8 caractères, une majuscule et un caractère spécial'
        })
        valid = false
      }

      if (!confirmPassword.value) {
        setConfirmPassword({
          value: confirmPassword.value,
          error: 'Vous devez répéter le mot de passe',
        })

        valid = false
      }

      if (password.value !== confirmPassword.value) {
        setFormError('Vos deux mots de passe doivent correspondre')

        valid = false
      }

      return valid
    }

    // On vide l'erreur de formulaire
    setFormError('')

    
      // On valid l'email et le mot de passe
      let validEmail = validateEmail()
      let validPassword = validatePasswords()

      // Si c'est valid on passe à l'étape SEND_DATA
      if (validEmail && validPassword) {
        setStep(SENDING_STEPS.SEND_DATA)
      } else {
        // On retourne à l'étape NONE
        setStep(SENDING_STEPS.NONE)
      }
  }, [step])

  
  useEffect(() => {
    // On éxécute l'effet uniquement si l'étape est SEND_DATA
    if (step !== SENDING_STEPS.SEND_DATA) return
    dispatch(updateUserProfile(user._id, name.value, email.value, password.value))
        setStep(SENDING_STEPS.NONE)

  }, [step])

  const changeField = setField => e =>
  setField({
    error: '',
    value: e.target.value,
  })

  const submitHandler = (e) => {
    e.preventDefault()
  }


  return (
    <Container style={{ width: '25rem' }}>
        <h2>Mettre à jour Profil</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {}
        {success && <Message variant='success'>Mise à jour du profil réussie</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Nom</Form.Label>
              {!!name.error && (
          
          <Message  variant='danger'>{name.error}</Message>
        )}
              <Form.Control
                type='name'
                placeholder='Saisissez votre nom'
                value={name.value}
                onChange={changeField(setName)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Addresse email</Form.Label>
              {!!email.error && (
          
          <Message  variant='danger'>{email.error}</Message>
        )}
              <Form.Control
                type='email'
                placeholder='Saisissez votre adresse email'
                value={email.value}
                onChange={changeField(setEmail)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Mot de passe</Form.Label>
              {!!password.error && (
          
          <Message  variant='danger'>{password.error}</Message>
        )}
              <Form.Control
                type='password'
                placeholder='Saisissez votre mot de passe'
                value={password.value}
                onChange={changeField(setPassword)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPasswordd'>
              <Form.Label>Confirmation de mot de passe</Form.Label>
              {!!confirmPassword.error && (
          
          <Message  variant='danger'>{confirmPassword.error}</Message>
        )}
              <Form.Control
                type='password'
                placeholder='Confirmez votre mot de passe'
                value={confirmPassword.value}
                onChange={changeField(setConfirmPassword)}
              ></Form.Control>
            </Form.Group>

            <Button onClick={() => {
        setStep(SENDING_STEPS.VALIDATION)
      }} variant='primary'>
              Mettre à jour
            </Button>
          </Form>
        )}
    </Container>
  )
}

export default ProfileScreen
