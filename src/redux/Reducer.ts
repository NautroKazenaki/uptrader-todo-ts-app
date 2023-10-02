import { AnyAction, Reducer } from "@reduxjs/toolkit";

import {
  ADD_PROJECT,
  DELETE_PROJECT,
  SET_SELECTED_PROJECT,
  Project,
  ADD_TASK,
  Task,
  MOVE_TASK,
  REORDER_TASKS,
  EDIT_TASK,
  DELETE_TASK,
  SET_PROJECTS,
  ADD_FILE,
} from "./Actions";

export interface ProjectsPageState {
  projects: Project[];
  selectedProjectId: string | null;
}

const initialState: ProjectsPageState = {
  projects: JSON.parse(localStorage.getItem("myAppData") || "[]"),
  selectedProjectId: null,
};

const projectsPageReducer: Reducer<ProjectsPageState, AnyAction> = (
  state = initialState,
  action: AnyAction
): ProjectsPageState => {
  switch (action.type) {
    case ADD_PROJECT: {
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    }
    case DELETE_PROJECT: {
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== action.payload
        ),
      };
    }
    case SET_SELECTED_PROJECT: {
      return {
        ...state,
        selectedProjectId: action.payload,
      };
    }
    case ADD_TASK: {
      const newState = {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              tasks: [...project.tasks, action.payload.task],
            };
          }
          return project;
        }),
      };

      localStorage.setItem("myAppData", JSON.stringify(newState.projects));

      return newState;
    }
    case DELETE_TASK: {
      const { projectId, taskId } = action.payload;
      const projectIndex = state.projects.findIndex(
        (project) => project.id === projectId
      );

      if (projectIndex === -1) {
        return state;
      }

      const project = { ...state.projects[projectIndex] };
      const updatedTasks = project.tasks.filter((task) => task.id !== taskId);

      const updatedProjects = [...state.projects];
      updatedProjects[projectIndex] = {
        ...project,
        tasks: updatedTasks,
      };

      return {
        ...state,
        projects: updatedProjects,
      };
    }

    case MOVE_TASK: {
      const { projectId, taskId, newStatus } = action.payload;
      const projectIndex = state.projects.findIndex(
        (project: Project) => project.id === projectId
      );
      if (projectIndex !== -1) {
        const updatedProjects = [...state.projects];
        const updatedProject = { ...updatedProjects[projectIndex] };
        const taskIndex = updatedProject.tasks.findIndex(
          (task: Task) => task.id === taskId
        );
        if (taskIndex !== -1) {
          const updatedTasks = [...updatedProject.tasks];
          const updatedTask = { ...updatedTasks[taskIndex], status: newStatus };
          updatedTasks.splice(taskIndex, 1, updatedTask);
          updatedProject.tasks = updatedTasks;
          updatedProjects.splice(projectIndex, 1, updatedProject);
          return {
            ...state,
            projects: updatedProjects,
          };
        }
      }
      return state;
    }
    case REORDER_TASKS: {
      const { projectId, columnId, startIndex, endIndex } = action.payload;
      const projectIndex = state.projects.findIndex(
        (project) => project.id === projectId
      );

      if (projectIndex === -1) {
        return state;
      }
      const project = { ...state.projects[projectIndex] };
      const newTasks = [...project.tasks];
      const tasks = newTasks.filter((task) => task.status === columnId);
      const [removedTask] = tasks.splice(startIndex, 1);
      tasks.splice(endIndex, 0, removedTask);
      project.tasks = tasks;
      const updatedProjects = [...state.projects];
      updatedProjects[projectIndex] = project;

      return {
        ...state,
        projects: updatedProjects,
      };
    }
    case EDIT_TASK: {
      const {
        taskId,
        newTitle,
        newDescription,
        newEndDate,
        subtasks,
        attachments,
        comments,
      } = action.payload;
      const projectIndex = state.projects.findIndex(
        (project) =>
          project.tasks.findIndex((task) => task.id === taskId) !== -1
      );
      if (projectIndex === -1) {
        return state;
      }
      const project = { ...state.projects[projectIndex] };

      const updatedTasks = project.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            title: newTitle,
            description: newDescription,
            endDate: newEndDate,
            subtasks: subtasks,
            comments: comments,
            attachments: attachments.map(
              (attachment: { name: any; size: any; type: any }) => ({
                name: attachment.name,
                size: attachment.size,
                type: attachment.type,
              })
            ),
          };
        }
        return task;
      });

      const updatedProjects = [...state.projects];
      updatedProjects[projectIndex] = {
        ...project,
        tasks: updatedTasks,
      };

      return {
        ...state,
        projects: updatedProjects,
      };
    }
    case SET_PROJECTS: {
      return {
        ...state,
        projects: action.payload,
      };
    }
    case ADD_FILE: {
      const { projectId, attachment } = action.payload;
      const updatedProjects = state.projects.map((project) => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map((task) => {
            return {
              ...task,
              attachments: [...task.attachments, attachment],
            };
          });

          return {
            ...project,
            tasks: updatedTasks,
          };
        }
        return project;
      });

      return {
        ...state,
        projects: updatedProjects,
      };
    }
    default:
      return state;
  }
};

export default projectsPageReducer;
