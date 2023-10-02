import React, { useState } from "react";
import TPStyles from "./ProjectPage.module.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import {
  deleteTaskAC,
  moveTaskAC,
  reorderTasksAC,
  Task,
} from "../../redux/Actions";
import TaskForm from "../TaskForm/TaskForm";
import ChangeTaskForm from "../ChangeTaskForm/ChangeTaskForm";
import TaskItem from "../TaskItem/TaskItem";
import { Button, TextField } from "@mui/material";

const ProjectPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
 
  
  const handleSearch = (e: any) => {
    setSearchValue(e.target.value);
  };
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [activeProjectId, setActiveProjectId] = useState(projectId);

  const projects = useSelector(
    (state: RootState) => state.projectsPage.projects
  );
  const selectedProject = projects.find((project) => project.id === activeProjectId);

  const tasks = selectedProject ? selectedProject.tasks : [];

  const queueTasks = tasks.filter(
    (task: Task) => task.status === "queue-column"
  );
  const developmentTasks = tasks.filter(
    (task: Task) => task.status === "development-column"
  );
  const doneTasks = tasks.filter((task: Task) => task.status === "done-column");

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskToMove = tasks?.find(
      (project: { id: string }) => project.id === draggableId
    );

    if (source.droppableId !== destination.droppableId) {
      if (taskToMove && typeof taskToMove !== "string") {
        const { id } = taskToMove;
        const newStatus = destination.droppableId;
        dispatch(moveTaskAC(projectId, id, newStatus));
      }
    }

    if (source.droppableId === destination.droppableId) {
      const columnId = source.droppableId;
      //@ts-ignore
      dispatch(reorderTasksAC(projectId, columnId, source.index, destination.index));
    }
  };

  const handleDeleteTask = (projectId: string, taskId: string) => {
    dispatch(deleteTaskAC(projectId, taskId));
  };

  return (
    <div className={TPStyles.container}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={TPStyles.columnContainer}>
          <div className={TPStyles.column}>
            <Droppable droppableId="queue-column">
              {(provided) => (
                <div
                  className={TPStyles.column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={TPStyles.title}>Queue</h2>
                  {queueTasks.length > 0 && (
                    <>
                  <TextField
                    type="text"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="Search by task title"
                  />
                  <ul className={TPStyles.list}>
                    {tasks
                      .filter((task: Task) => task.status === "queue-column")
                      .filter((task: Task) => task.title.toLowerCase().includes(searchValue.toLowerCase()))
                      .map(
                        (
                          task: {
                            id: string;
                            title: string;
                            description: string;
                            createdDate: string;
                            workTime: number;
                            endDate: string;
                            priority: string;
                            attachments: any;
                            status: string;
                            subtasks: any;
                            comments: any;
                          },
                          index: number
                        ) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className={TPStyles.task}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskItem task={task} taskId={task.id} />

                                <ChangeTaskForm
                                  taskId={task.id}
                                  dispatch={dispatch}
                                />
                                {/* @ts-ignore */}
                                <Button variant="contained" sx={{position: "initial", marginLeft: "10px"}} onClick={() =>handleDeleteTask(projectId, task.id)}
                                >
                                  delete task
                                </Button>
                              </li>
                            )}
                          </Draggable>
                        )
                      )}
                  </ul>
                  </>)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={TPStyles.column}>
            <Droppable droppableId="development-column">
              {(provided) => (
                <div
                  className={TPStyles.column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={TPStyles.title}>Development</h2>
                  {developmentTasks.length > 0 && (
                    <>
                  <TextField
                    type="text"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="Search by task title"
                  />
                  <ul className={TPStyles.list}>
                    {tasks
                      .filter(
                        (task: Task) => task.status === "development-column"
                      )
                      .filter((task: Task) => task.title.toLowerCase().includes(searchValue.toLowerCase()))
                      .map(
                        (
                          task: {
                            id: string;
                            title: string;
                            description: string;
                            createdDate: string;
                            workTime: number;
                            endDate: string;
                            priority: string;
                            attachments: any;
                            status: string;
                            subtasks: any;
                            comments: any;
                          },
                          index: number
                        ) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className={TPStyles.task}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskItem task={task} taskId={task.id} />

                                <ChangeTaskForm
                                  taskId={task.id}
                                  dispatch={dispatch}
                                />
                                {/* @ts-ignore */}
                                <Button variant="contained" sx={{position: "initial", marginLeft: "10px"}} onClick={() =>handleDeleteTask(projectId, task.id)}
                                >
                                  delete task
                                </Button>
                              </li>
                            )}
                          </Draggable>
                        )
                      )}
                  </ul>
                  </>)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={TPStyles.column}>
            <Droppable droppableId="done-column">
              {(provided) => (
                <div
                  className={TPStyles.column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={TPStyles.title}>Done</h2>
                  {doneTasks.length > 0 && (
                    <>
                  <TextField
                    type="text"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="Search by task title"
                  />
                  <ul className={TPStyles.list}>
                    {tasks
                      .filter((task: Task) => task.status === "done-column")
                      .filter((task: Task) => task.title.toLowerCase().includes(searchValue.toLowerCase()))
                      .map(
                        (
                          task: {
                            id: string;
                            title: string;
                            description: string;
                            createdDate: string;
                            workTime: number;
                            endDate: string;
                            priority: string;
                            attachments: any;
                            status: string;
                            subtasks: any;
                            comments: any;
                          },
                          index: number
                        ) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className={TPStyles.task}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskItem task={task} taskId={task.id}/>

                                <ChangeTaskForm
                                  taskId={task.id}
                                  dispatch={dispatch}
                                />
                                {/* @ts-ignore */}
                                <Button variant="contained" sx={{position: "initial", marginLeft: "10px"}} onClick={() => handleDeleteTask(projectId, task.id)}
                                >
                                  delete task
                                </Button>
                              </li>
                            )}
                          </Draggable>
                        )
                      )}
                  </ul>
                  </>)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* @ts-ignore  */}
      <TaskForm projectId={projectId} dispatch={dispatch} />

      <Link to="/">
        <Button variant="contained" sx={{position: "initial", marginLeft: "10px"}}>Back to Projects</Button>
      </Link>
    </div>
  );
};

export default ProjectPage;
