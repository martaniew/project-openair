import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, InputGroup, Container, FormGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {createActivity} from '../actions/activityActions'
import axios from 'axios'
import { ACTIVITY_CREATE_RESET } from '../constants/activityConstants'

//const FILE_SIZE = 250
//const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']

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

const ActivityCreateScreen = ({location, history, match}) => {
  
  const [uploading, setUploading] = useState(false)
  const [discipline, setDiscipline] = useState({ value: '', error: '' })
  const [description, setDescription] = useState({ value: '', error: '' })
  const [contact, setContact] = useState({value: '', error: '',})
  const [adress, setAdress] = useState({value: '', error: '',})
  const [image, setImage] = useState("")
  const [imageError, setImageError] = useState("")
  const [difficulty, setDifficulty] = useState({value: '', error: '',})
  const [formError, setFormError] = useState('')
  const [step, setStep] = useState(SENDING_STEPS.NONE)
  

  
  const dispatch = useDispatch()

  const activityCreate = useSelector((state) => state.activityCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    activity: createdActivity
  } = activityCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    
      if (!userInfo) {
        history.push('/login')
      }  
  }, [
    dispatch,
    history,
    location, 
    userInfo,
  ])




  useEffect(() => {
    if (successCreate) {
      dispatch({ type: ACTIVITY_CREATE_RESET })
      history.push(`/activity/${createdActivity._id}`)
    }
  }, [successCreate])
   
  
  
  useEffect(() => {
    // Cette effet se déclenche uniquement lors de la step "VALIDATION"
    if (step !== SENDING_STEPS.VALIDATION) return
      let valid = true
      if (!discipline.value) {
        setDiscipline({
          value: discipline.value,
          error: 'Vous devez renseigner discipline',
        })
        valid = false
      }
      if (!contact.value) {
        setContact({
          value: contact.value,
          error: 'Vous devez renseigner contact',
        })

        valid = false
      }

      if (!description.value) {
        setDescription({
          value: description.value,
          error: 'Vous devez renseigner description',
        })

        valid = false
      }

      if (!adress.value) {
        setAdress({
          value: adress.value,
          error: 'Vous devez renseigner adress',
        })

        valid = false
      }

      if (!difficulty.value || difficulty.value === "") {
        setDifficulty({
          value: difficulty.value,
          error: 'Vous devez renseigner difficulty',
        })
        valid = false
      }

      if (!image) {
         setImageError('Vous devez renseigner un image')
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

    dispatch(
      createActivity(
      discipline.value,
      adress.value,
      image,
      description.value,
      difficulty.value,
      contact.value
      ))
    
  }, [step])

  const changeField = setField => e =>
    setField({
      error: '',
      value: e.target.value,
    })

    const ImageChangeHandler = (e) => {
      setImage(e.target.value)
    
    }

  
  const uploadFileHandler = async (e) => {
    setImageError("")
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

 
  return (
    <FormContainer>
    <h1>Sign In</h1>
    <Form>
      <Form.Group controlId='disipline'>
        <Form.Label>Discipline</Form.Label>
        {!!discipline.error && (
          
          <Message  variant='danger'>{discipline.error}</Message>
        )}
        <Form.Control
          type='text'
          value={discipline.value}
          onChange={changeField(setDiscipline)}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId='description'>
      {!!description.error && (
          <Message  variant='danger'>{description.error}</Message>
        )}
        <Form.Label>Description</Form.Label>
        <Form.Control
          type='text'
          value={description.value}
          onChange={changeField(setDescription)}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId='contact'>
      {!!contact.error && (
          <Message variant='danger'>{contact.error}</Message>
        )}
        <Form.Label>Contact</Form.Label>
        <Form.Control
          type='text'
          value={contact.value}
          onChange={changeField(setContact)}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId='adress'>
      {!!adress.error && (
          <Message  variant='danger'>{adress.error}</Message>
        )}
        <Form.Label>Adress</Form.Label>
        <Form.Control
          type='text'
          name='adress'
          value={adress.value}
          onChange={changeField(setAdress)}
        ></Form.Control>
      </Form.Group>
      <Form.Group controlId='difficulty'>
      {!!difficulty.error && (
          <Message  variant='danger'>{difficulty.error}</Message>
        )}
        <Form.Label>Difficulty</Form.Label>
          <Form.Control
            as='select'
            value={difficulty.value}
            onChange={changeField(setDifficulty)}
            >
            <option value=''>Select...</option>
            <option value='begginer'>1 - Begginer</option>
            <option value='intermediete'>2 - Intermediete</option>
            <option value='proffesionel'>3 - Proffesionel</option>
          </Form.Control>
          </Form.Group> 
          <Form.Group controlId='image'>
          {!!imageError && (
          <Message  variant='danger'>{imageError}</Message>
        )}
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={ImageChangeHandler}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>  
            {errorCreate && (
                    <Message variant='danger'>{errorCreate}</Message>
                  )}             
      <Button 
      variant='primary'
      onClick={() => {
        setStep(SENDING_STEPS.VALIDATION)
      }}
      >
        Create
      </Button>
    </Form>
  </FormContainer>

  )
}

export default ActivityCreateScreen
