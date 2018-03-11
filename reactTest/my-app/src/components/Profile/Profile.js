import React from 'react';
import { profile } from '../../resources/Profile';
import profileImage from '../../resources/images/profileImage.png';
import FontAwesome from 'react-fontawesome';

import 'font-awesome/css/font-awesome.css';
import './Profile.css';

const Profile = () => {
    const { Name, Title, Email, Phone, Links, AboutHeading, About} = profile;
    const listLinks = Links.map((link, index) => {
        const { href, text, icon } = link;
        let textIcon = "";
        if(icon){
            textIcon = <FontAwesome name={icon} />
        }
        return (
            <a key={"link"+index} className="profileLink" href={href}>{textIcon} {text}</a>
        )
    })
    return (
        <div className="profileSection">
        <div className="profileInfoWrapper">
            <img className="profileImage" src={profileImage} alt="profileImage" />
            <div className="profileName">{Name}</div>
            <div className="profileTitle">{Title}</div>
            <div className="profileEmail">{Email}</div>
            <div className="profilePhone">{Phone}</div>
            <div className="profileLinkWrapper">
                {listLinks}
            </div>
        </div>
        <div className="profileAbout">
            <div className="profileAboutHeading">{AboutHeading}</div>
            {About}
        </div>
        </div>
    )
};

export default Profile;