import React, { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
        navigate('/eventlistpage');
    };
    const handleButtonClick2 = () => {
        navigate('/eventsproposal');
    };

    return (
        <>
            <div style={{ paddingBottom: "40px", width: "100vw", marginLeft: "-13%" }}>
                <div style={{ width: "100%", height: "200px" }}>
                    <img src={background} alt="Hello" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    <p style={{ color: "white", fontSize: "80px", fontWeight: "bold", marginTop: "-150px", textAlign: "center" }}>Cultivating Green Futures.</p>
                </div>
                <Container fluid style={{ marginTop: "30px", marginTop: "40px" }}>
                    <Row style={{ }}>
                        <Col md={6} style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "80%", paddingLeft: "8%" }}>
                                <Card.Title style={{ fontWeight: "bold" }}>Participate in Events</Card.Title>
                                <Card.Text>
                                    There is a role for everyone to play.
                                    We must work together so that future generations
                                    can enjoy the green island we call home.
                                </Card.Text>
                                <Button variant="primary" onClick={handleButtonClick} style={{ paddingTop: "8px", paddingBottom: "8px"}}>Join An Event Now!</Button>
                            </div>
                        </Col>
                        <Col md={6} style={{ paddingLeft: "4%", height: "260px" }}>
                            <Card.Img variant="top" src={first} style={{ width: "70%", height: "100%" }} />
                        </Col>
                        <Col md={6} style={{ paddingLeft: "10%", height: "260px", marginTop: "50px" }}>
                            <Card.Img variant="top" src={second} style={{ width: "80%", height: "100%" }} />
                        </Col>
                        <Col md={6} style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "50px" }}>
                            <div style={{ width: "80%", marginLeft: "-10%" }}>
                                <Card.Title style={{ fontWeight: "bold" }}>Create Event Proposal</Card.Title>
                                <Card.Text>
                                    There is a role for everyone to play.
                                    We must work together so that future generations
                                    can enjoy the green island we call home.
                                </Card.Text>
                                <Button variant="primary" onClick={handleButtonClick2} style={{ paddingTop: "8px", paddingBottom: "8px"}}>Create An Event Now!</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Homepage;
