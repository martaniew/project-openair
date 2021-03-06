import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

// displaying footer

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>Copyright &copy; OpenAir</Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
