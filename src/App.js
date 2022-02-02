import './App.scss';
import React from "react";
import { Mint } from './components/mint';


function App() {


  return (
    <>
      <div className='screen' >
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      
        <div className='main'>
        
            <Mint />
        </div>
      </div>
    </>
  );
}
export default App;