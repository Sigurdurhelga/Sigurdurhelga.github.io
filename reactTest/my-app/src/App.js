import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar'
import Profile from './components/Profile/Profile'
import Projects from './components/Projects/Projects'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="contentWrapper">
        <Profile />
        <div className="contentSeparator" />
        <Projects />
        </div>
      </div>
    );
  }
}

export default App;
