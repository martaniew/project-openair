import React from "react";
import {Card} from 'react-bootstrap'
import Activity from "./Activity";
const InfoWindow = (props) => {
    const { activity } = props;
    const infoWindowStyle = {
      position: 'relative',
      width: 220,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 14,
      zIndex: 100,
    };
  
    return (

<Card style={{ width: '6rem' }} className='rounded'>
  <Card.Img variant="top" src={activity.image} alt={activity.discipline}/>
  <Card.Body>
    <Card.Text>{activity.discipline}</Card.Text>
  </Card.Body>
</Card>
    );
  };

  export default InfoWindow;  