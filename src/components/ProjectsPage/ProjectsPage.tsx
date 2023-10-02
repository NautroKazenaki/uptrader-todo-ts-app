import { Button, ButtonGroup, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  addProjectAC,
  deleteProjectAC,
  Project,
  Task,
} from "../../redux/Actions";

import { RootState } from "../../redux/store";
import PPStyles from "./ProjectsPage.module.css";

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projectsPage);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [savedProjects, setSavedProjects] = useState<Project[]>(() => {
    const storedData = localStorage.getItem("myAppData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return parsedData;
      } catch (error) {
        console.error("Error parsing data from local storage:", error);
      }
    }
    return [];
  });

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value);
  };

  const saveDataToLocalStorage = (data: Project[]) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem("myAppData", serializedData);
    } catch (error) {
      console.error("Error saving data to local storage:", error);
    }
  };

  const handleAddProject = () => {
    if (title.trim() !== "") {
      const id = uuid();
      const tasks: Task[] = [];
      dispatch(addProjectAC(id, title, tasks));
      setTitle("");
      setShowModal(false);
      const existingProject = projects.projects.find(
        (project) => project.title === title
      );
      if (existingProject) {
        const updatedProjects = projects.projects.map((project) =>
          project.title === title
            ? { ...project, tasks: [...project.tasks, ...tasks] }
            : project
        );
        setShowModal(false);
        setSavedProjects(updatedProjects);
        saveDataToLocalStorage(updatedProjects);
      } else {
        const newProject = { id, title, tasks };
        const updatedProjects = [...projects.projects, newProject];
        setSavedProjects(updatedProjects);
        saveDataToLocalStorage(updatedProjects);
      }
    }
  };

  const handleDeleteProject = (projectId: string) => {
    dispatch(deleteProjectAC(projectId));
    const updatedProjects = savedProjects.filter(
      (project: Project) => project.id !== projectId
    );
    setSavedProjects(updatedProjects);
    saveDataToLocalStorage(updatedProjects);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("myAppData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSavedProjects(parsedData);
        parsedData.forEach((project: Project) => {
          if (!projects.projects.some((p: Project) => p.id === project.id)) {
            dispatch(addProjectAC(project.id, project.title, project.tasks));
          }
        });
      } catch (error) {
        console.error("Error parsing data from local storage:", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (savedProjects.length > 0) {
      saveDataToLocalStorage(savedProjects);
    }
  }, [savedProjects]);

  return (
    <div className={PPStyles.container}>
      <h1>Project Page</h1>

      {savedProjects && savedProjects.length > 0 ? (
        <div>
          <h2>Existing Projects:</h2>
          <TextField
            id="standard-search"
            label="Search by title"
            type="search"
            variant="standard"
            onChange={handleSearch}
            value={searchValue}
            color="primary"
            sx={{ input: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />
          <ul className={PPStyles.list}>
            {savedProjects
              .filter((project) => {
                return project.title
                  .toLowerCase()
                  .includes(searchValue.toLowerCase());
              })
              .map((project: Project, index: number) =>
                project.title !== "" ? (
                  <div key={index}>
                    <li>
                      <Link to={`/project/${project.id}`}>
                        <span>{project.title}</span>
                      </Link>
                      <Button
                        variant="contained"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </li>
                  </div>
                ) : null
              )}
          </ul>
        </div>
      ) : (
        <p>No projects found.</p>
      )}

      <Button variant="contained" onClick={() => setShowModal(true)}>
        Add Project
      </Button>

      {showModal && (
        <div>
          <TextField
            id="standard-basic"
            label="Enter project title"
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            color="primary"
            sx={{ input: { color: "white" }, marginTop: "10px" }}
            InputLabelProps={{ style: { color: "white" } }}
          />
          <div className={PPStyles.buttonGroupContainer}>
            <ButtonGroup variant="text" aria-label="text button group">
              <Button variant="contained" onClick={handleAddProject}>
                Save
              </Button>
              <Button variant="contained" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </ButtonGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
