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

  const extractUrlComponents = (string) => {
    const url = new URL(string);
    return {
      projectId: url.searchParams.get('p'),
      eventId: url.searchParams.get('e'),
    };
  }

  const { projectId: urlProjectId, eventId: urlEventId } = extractUrlComponents(window.location.href);
  const [projectId, setProjectId] = useState(urlProjectId || '5e231287-bce9-40b0-bc13-af3932d6262c');
  const [eventId, setEventId] = useState(urlEventId || '');
  const [autoresizesHeight, setAutoresizesHeight] = useState(true)
  const [hidesHeadersAndFooters, setHidesHeadersAndFooters] = useState(true)
  configure({ host: 'cdn-dev.monterosa.cloud', projectId });

  const experience = getExperience({
    experienceUrl: 'https://apps.monterosa.cloud/fankit/v24.37.0-qa-3/index.html',
    eventId,
    autoresizesHeight,
    hidesHeadersAndFooters
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
        <h1>SDK PARENT DEMO</h1>
        <span>Paste you project and event Id into the url as follows</span>
        <code>https://sdk-test-devinedanielwork.vercel.app/?p=projectId&e=eventId</code>
      
        <div className="buttons">
        <button type="button" onClick={() => setAutoresizesHeight(!autoresizesHeight)}>turn auto resize {autoresizesHeight ? 'off' : 'on'}</button>
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
