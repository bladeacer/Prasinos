import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/Logo.png';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


function Header() {
    return (
        <Navbar className="bg-body-tertiary fixed-top" bg="light" data-bs-theme="light" expand="lg" style={{ paddingTop: "0", paddingBottom: "0", paddingRight: "2%"}}>
            <Container fluid>
                <Navbar.Brand href="/" className="navbar-brand-custom" style={{ paddingLeft: "4%" }}>
                    <img alt="" src={logo} width="250" height="90" className="d-inline-block align-top"/>
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
                        <LinkContainer to="/chatbot" style={{ paddingRight: "3%" }}>
                            <Nav.Link>Support</Nav.Link>
                        </LinkContainer>
                        <Button variant="secondary" className="sign">Sign In</Button>
                        <Button variant="success" className="sign">Sign Up</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
