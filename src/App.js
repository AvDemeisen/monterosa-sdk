  import React, { useLayoutEffect, useEffect, useState } from 'react';
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
  const [projectId, setProjectId] = useState(urlProjectId || '08002f4c-d98b-4ec0-bf5f-896ccbaf3940');
  const [eventId, setEventId] = useState(urlEventId || '3c265554-e05d-4236-bca6-e1b5097e907e');
  const [autoresizesHeight, setAutoresizesHeight] = useState(true)
  const [hidesHeadersAndFooters, setHidesHeadersAndFooters] = useState(false)
  configure({ host: 'cdn-dev.monterosa.cloud', projectId });

  const experience = getExperience({
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
        <button type="button" onClick={() => setHidesHeadersAndFooters(!hidesHeadersAndFooters)}>header/footer is {hidesHeadersAndFooters ? 'hidden' : 'displayed'}</button>
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
