import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import logo from './assets/Logo.png';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { LinkContainer } from 'react-router-bootstrap';
import http from './http';
import UserContext from './contexts/UserContext';

function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get('/user/auth').then((res) => {
                setUser(res.data.user);
            });
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

    return (
        <>
            <UserContext.Provider value={{ user, setUser }}>
                <Navbar className="bg-body-tertiary fixed-top" bg="light" data-bs-theme="light" expand="lg" style={{ paddingTop: "0", paddingBottom: "0", paddingRight: "2%" }}>
                    <Container fluid>
                        <Navbar.Brand href="/" className="navbar-brand-custom" style={{ paddingLeft: "4%" }}>
                            <img alt="" src={logo} width="250" height="90" className="d-inline-block align-top" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav className="ml-auto">
                                <LinkContainer to="/" style={{ paddingRight: "3%" }}>
                                    <Nav.Link>Home</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/bookings" style={{ paddingRight: "3%" }}>
                                    <Nav.Link>Bookings</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/eventfeedback" style={{ paddingRight: "3%" }}>
                                    <Nav.Link>Events</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/rewards" style={{ paddingRight: "3%" }}>
                                    <Nav.Link>Rewards</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/websitefeedback" style={{ paddingRight: "3%" }}>
                                    <Nav.Link>Support</Nav.Link>
                                </LinkContainer>
                                {user && (
                                    <>
                                        <Typography style={{ marginTop: "2%", marginRight: "2%" }}>{user.name}</Typography>
                                        <Button className="sign" onClick={logout}>Logout</Button>
                                    </>
                                )
                                }
                                {!user && (
                                    <>
                                        <Link to="/register" >
                                            <Button variant="secondary"  className="sign2" style={{ marginRight: "15px" }} >Register</Button>
                                        </Link>
                                        <Link to="/login" >
                                            <Button variant="success" className="sign2" style={{ marginRight: "50px" }}>Login</Button>
                                        </Link>
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </UserContext.Provider>
        </>
    );
}

export default Header;
