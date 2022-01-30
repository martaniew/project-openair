import React, { useState } from 'react'
import { Form, Button, Container, InputGroup } from 'react-bootstrap'
import FormContainer from './FormContainer'

const Search = ({ history }) => {
  const [adress, setAdress] = useState('')
  const [discipline, setDiscipline] = useState('')


  

  const submitHandler = (e) => {
    e.preventDefault()
      history.push(`/searchresults?adress=${adress}&discipline=${discipline}`)
  }

  return (
    <form onSubmit={submitHandler} className='searchform'>
      <input
      className='firstsearchdinput'
      type='text'
      name='q'
      onChange={(e) => setAdress(e.target.value)}
      placeholder='Search Activities..wxjckwxjhckwxjhckwjhckwxjch.'/>

      <div className="vl"></div>
  
      <input
      className='seconsearchdinput'
       type='text'
       name='q'
       onChange={(e) => setDiscipline(e.target.value)}
       placeholder='Search Activities..,nwxb,wbc,wnbxc,wnbxcn,.'/>

       <button type="submit" className='searchbutton' >
         search</button> 
      </form>
  
  )
}

export default Search
