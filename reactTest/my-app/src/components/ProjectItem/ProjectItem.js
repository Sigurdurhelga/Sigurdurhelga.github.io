import React from 'react';
import './ProjectItem.css'

const ProjectItem = (props) => {
    const { index } = props
    const { name, description, link, image} = props.project;
    const { href, text } = link;
    console.log(image)
    return (
        <div className="projectItemWrapper">
            <div className="projectItemName">
                {name}
            </div>
            <div className="contentSeparator" />
            <div className="projectItemDescription">
                {description}
            </div>
            <img className="projectItemImage" src={image} alt={name+" image"}/>
            <a className="projectItemLink" href={href}>
                { text }
            </a>
        </div>
    )
};

export default ProjectItem;