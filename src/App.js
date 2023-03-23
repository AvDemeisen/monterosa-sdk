  import { useLayoutEffect, useEffect, useState } from 'react'
  import { configure } from '@monterosa-sdk/core';
  import {
    embed,
    unmount,
    requestMoreData,
    getExperience
  } from "@monterosa-sdk/launcher-kit";
  import './App.css';

const App = () => {
  const [projectId, setProjectId] = useState('a8edfdd7-fcdc-428c-a287-4bc93f3100bc');
configure({ host: 'cdn-dev.monterosa.cloud', projectId });

const experience = getExperience({
  experienceUrl: 'https://apps.monterosa.cloud/fankit/epic/element-scaffold/index.html',
  autoresizesHeight: true
})

const handleInputChange = (event) => {
  setProjectId(event.target.value);
};

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
        <span>paste your project ID into the input below</span>
        <input type="text" value={projectId} onChange={handleInputChange} />
      </header>
      <div id="container-id" />
      <footer className="App-footer">
        <span>some footer text</span>
      </footer>
    </div>
  );
}

export default App;
