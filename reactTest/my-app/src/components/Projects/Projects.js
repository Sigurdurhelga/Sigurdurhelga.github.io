import React from 'react';
import ProjectItem from '../ProjectItem/ProjectItem';
import { Portfolio } from '../../resources/Portfolio';
import './Projects.css'

const Projects = (props) => {
    const ProjectItems = Portfolio.map((projectItem, index) => <ProjectItem project={projectItem} key={"projectItem"+index} />)
    console.log(ProjectItems)
    return (
        <div className="projectsSection">
        {ProjectItems}
        </div>
     )
};

export default Projects;