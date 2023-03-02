  import { useLayoutEffect, useEffect } from 'react'
  import { configure } from '@monterosa-sdk/core';
  import {
    embed,
    unmount,
    requestMoreData,
    getExperience
  } from "@monterosa-sdk/launcher-kit";
  import './App.css';

const App = () => {
configure({ host: 'cdn-dev.monterosa.cloud', projectId: 'e1940dd8-845c-49d0-82ee-f60d3e150370' });

const experience = getExperience({
  experienceUrl: '//localhost:3000/',
  autoresizesHeight: true
})

useLayoutEffect(() => {
  if (experience === undefined) return () => {};
  embed(experience, "container-id");

  return () => {
    unmount("container-id");
  };
}, [experience]);

useEffect(() => {
  let requestCooldown = false;

  const handleScroll = () => {
    const pageHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY + windowHeight + 20;
    
    if (!requestCooldown && scrollPosition >= pageHeight) {
      requestCooldown = true;
      requestMoreData(experience);
      
      setTimeout(() => {
        requestCooldown = false;
      }, 1000);
    }
  }

  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [experience]);


  return (
    <div className="App">
      <header className="App-header">
        <h1>WELCOME</h1>
      </header>
      <div id="container-id" />
      <footer className="App-footer">
        <span>some footer text</span>
      </footer>
    </div>
  );
}

export default App;
