import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ConnectButton } from '@rainbow-me/rainbowkit'; 
import Link from 'next/link'; // Import Link from Next.js

const MyNav = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/home">Anti Swan</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    
                        <Nav.Link href='/dashboard'>Dashboard</Nav.Link>
                    
                        <Nav.Link href='/deposit'>Deposit</Nav.Link>
                                                       
                    </Nav>
                    <div className="ms-auto">
                        <ConnectButton />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNav;
