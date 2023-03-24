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
  const [experienceUrl, setExperienceUrl] = useState('https://apps.monterosa.cloud/fankit/v24.37.0-qa-3/index.html')
  const [projectId, setProjectId] = useState('5e231287-bce9-40b0-bc13-af3932d6262c');
  const [eventId, setEventId] = useState('');
  const [autoresizesHeight, setAutoresizesHeight] = useState(true)
  const [hidesHeadersAndFooters, setHidesHeadersAndFooters] = useState(false)
  configure({ host: 'cdn-dev.monterosa.cloud', projectId });

  const experience = getExperience({
    experienceUrl,
    eventId,
    autoresizesHeight,
    hidesHeadersAndFooters
  })

const handleExperienceChange = (event) => {
  setExperienceUrl(event.target.value);
};

const handleProjectChange = (event) => {
  setProjectId(event.target.value);
};

const handleEventChange = (event) => {
  setEventId(event.target.value);
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
        <h1>SDK PARENT DEMO</h1>
        <span>paste your details below</span>
        <div className="input-wrapper">
        <label for="experienceUrl">Experience URL</label>
        <input id="experienceUrl" type="text" value={experienceUrl} onChange={handleExperienceChange} />
        </div>
        <div className="input-wrapper">
        <label for="projectId">Project ID</label>
        <input id="projectId" type="text" value={projectId} onChange={handleProjectChange} />
        </div>
        <div className="input-wrapper">
        <label for="eventId">Event ID</label>
        <input id="eventId" type="text" value={eventId} onChange={handleEventChange} />
        </div>
        <div className="buttons">
        <button type="button" onClick={() => setAutoresizesHeight(!autoresizesHeight)}>auto resize {autoresizesHeight ? 'on' : 'off'}</button>
        <button type="button" disabled onClick={() => setHidesHeadersAndFooters(!hidesHeadersAndFooters)}>header/footer {hidesHeadersAndFooters ? 'hidden' : 'displayed'}</button>
        </div>

      </header>
      <div id="container-id" />
      <footer className="App-footer">
        <span>some footer text</span>
      </footer>
    </div>
  );
}

export default App;
