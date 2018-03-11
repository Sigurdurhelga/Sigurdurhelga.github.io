import React from 'react'
import './NavbarButton.css'

const NavbarButton = (props) => {
    const { text, target } = props

    return (
        <div className='navbarButton' onClick={() => {
            let targetNode = document.getElementsByClassName(target)
            if(targetNode){
                targetNode[0].scrollIntoView()
            }
        }}> {text} </div>
    )
}

export default NavbarButton