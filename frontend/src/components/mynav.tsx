import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ConnectButton } from '@rainbow-me/rainbowkit'; 
import Link from 'next/link'; // Import Link from Next.js
import Image from 'next/image';

const MyNav = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand className='nav-brand' href="/home">                 
                <Image
                src="/swan_logo.jpg"
                alt="Logo"
                width={30} // Set your desired width
                height={30} // Set your desired height
                style={{ marginRight: '10px' }} // Add some space between the image and text
            />
                    Anti Swan
                </Navbar.Brand>
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
