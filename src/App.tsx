import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectsPage from "./components/ProjectsPage/ProjectsPage";
import ProjectPage from "./components/ProjectPage/ProjectPage";

function App() {
  
  return (
    <div className="App">
      <Routes>
         <Route path="/" element={<ProjectsPage  />}></Route> 
        <Route path="/project/:projectId" element={<ProjectPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
