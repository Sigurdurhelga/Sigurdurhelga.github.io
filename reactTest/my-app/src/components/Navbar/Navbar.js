import React from 'react';
import NavbarButton from '../NavbarButton/NavbarButton';
import './Navbar.css'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='navbarWrapper'>
                <NavbarButton text='Profile' target='profileSection' />
                <NavbarButton text='Projects' target='projectsSection' />
            </div>
        </div>
    );
};

export default Navbar