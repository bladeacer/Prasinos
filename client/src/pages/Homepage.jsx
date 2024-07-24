import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import background from '../assets/background.jpeg';
import first from '../assets/06-habitat-singapore.jpg';
import second from '../assets/thirdimg.jpg';

function Homepage() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/eventfeedback');
    };
    return (
        <>
            <div style={{ paddingTop: "100px", width: "99vw", paddingBottom: "100px"}}>
                <div style={{ width: "100%", height: "200px"}}>
                    <img src={background} alt="Hello" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    <p style={{ color: "white", fontSize: "80px", fontWeight: "bold", marginTop: "-150px", textAlign: "center" }}>Cultivating Green Futures.</p>
                </div>
                <Container fluid style={{ marginTop: "30px", marginTop: "40px"}}>
                    <Row style={{ }}>
                        <Col md={6} style={{  height: "260px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <div style={{ width: "70%" }}>
                                <Card.Title style={{ fontWeight: "bold"}}>Participate in Events</Card.Title>
                                <Card.Text>
                                    There is a role for everyone to play. 
                                    We must work together so that future generations 
                                    can enjoy the green island we call home.
                                </Card.Text>
                                <Button variant="primary" onClick={handleButtonClick} >Go somewhere</Button>
                            </div>
                        </Col>
                        <Col md={6} style={{ paddingLeft: "4%", height: "260px"}}>
                            <Card.Img variant="top" src={first} style={{ width: "80%", height: "100%"}} />
                        </Col>
                        <Col md={6} style={{ paddingLeft: "8%", height: "260px", marginTop: "10px"}}>
                            <Card.Img variant="top" src={second} style={{ width: "90%", height: "100%"}} />
                        </Col>
                        <Col md={6} style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px"}}>
                            <div style={{  width: "70%", marginLeft: "-16%" }}>
                                <Card.Title style={{ fontWeight: "bold"}}>Participate in Events</Card.Title>
                                <Card.Text>
                                    There is a role for everyone to play. 
                                    We must work together so that future generations 
                                    can enjoy the green island we call home.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Homepage;
