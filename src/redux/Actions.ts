export const ADD_PROJECT = "ADD_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";
export const SET_SELECTED_PROJECT = "SET_SELECTED_PROJECT";
export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const HANDLE_DRAG_END = "HANDLE_DRAG_END";
export const MOVE_TASK = "MOVE_TASK";
export const REORDER_TASKS = "REORDER_TASKS";
export const SET_PROJECTS = "SET_PROJECTS";
export const EDIT_TASK = "EDIT_TASK";
export const ADD_SUBTASK = "ADD_SUBTASK";
export const ADD_FILE = "ADD_FILE";
export const ADD_COMMENT = "ADD_COMMENT";

export interface Task {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  workTime: number;
  endDate: string;
  priority: string;
  attachments: any;
  status: string;
  subtasks: Subtask[];
  comments: Comment[];
}

export interface Subtask {
  checked: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  tasks: Task[];
}

export interface FileData {
  name: string;
  data: string;
}

export interface Comment {
  commentId: string;
  text: string;
  subComments: Comment[];
}

export interface AddProjectAction {
  type: typeof ADD_PROJECT;
  payload: Project;
}

export const addProjectAC = (
  id: string,
  title: string,
  tasks: Task[]
): AddProjectAction => ({
  type: ADD_PROJECT,
  payload: { id, title, tasks },
});

export interface DeleteProjectAction {
  type: typeof DELETE_PROJECT;
  payload: string;
}

export const deleteProjectAC = (id: string): DeleteProjectAction => ({
  type: DELETE_PROJECT,
  payload: id,
});

export interface SetSelectedProjectAction {
  type: typeof SET_SELECTED_PROJECT;
  payload: string | null;
}

export const setSelectedProjectAC = (
  title: string | null
): SetSelectedProjectAction => ({
  type: SET_SELECTED_PROJECT,
  payload: title,
});

export interface AddTaskAction {
  type: typeof ADD_TASK;
  payload: { projectId: string; task: Task };
}

export const addTaskAC = (projectId: string, task: Task): AddTaskAction => ({
  type: ADD_TASK,
  payload: { projectId, task },
});

export interface MoveTaskAction {
  type: typeof MOVE_TASK;
  payload: {
    projectId: string | undefined;
    taskId: string;
    newStatus: string;
  };
}

export const moveTaskAC = (
  projectId: string | undefined,
  taskId: string,
  newStatus: string
): MoveTaskAction => {
  return {
    type: MOVE_TASK,
    payload: {
      projectId,
      taskId,
      newStatus,
    },
  };
};

export interface ReorderTaskAction {
  type: typeof REORDER_TASKS;
  payload: {
    projectId: string;
    columnId: string;
    startIndex: number;
    endIndex: number;
  };
}

export const reorderTasksAC = (
  projectId: string,
  columnId: string,
  startIndex: number,
  endIndex: number
): ReorderTaskAction => {
  return {
    type: REORDER_TASKS,
    payload: {
      projectId,
      columnId,
      startIndex,
      endIndex,
    },
  };
};

export interface SetProjectsAction {
  type: typeof SET_PROJECTS;
  payload: {
    projects: Project;
  };
}
export const setProjectsAC = (projects: Project): SetProjectsAction => ({
  type: SET_PROJECTS,
  payload: {
    projects: projects,
  },
});

export interface EditTaskAction {
  type: typeof EDIT_TASK;
  payload: {
    taskId: string;
    newTitle: string;
    newDescription: string;
    newEndDate: any;
    subtasks: any;
    comments: any;
    attachments: any;
  };
}

export const editTaskAC = (
  taskId: string,
  newTitle: string,
  newDescription: string,
  newEndDate: any,
  subtasks: any,
  comments: any,
  attachments: any
): EditTaskAction => ({
  type: EDIT_TASK,
  payload: {
    taskId,
    newTitle,
    newDescription,
    newEndDate,
    subtasks,
    comments,
    attachments,
  },
});

export interface DeleteTaskAction {
  type: typeof DELETE_TASK;
  payload: { projectId: string; taskId: string };
}

export const deleteTaskAC = (
  projectId: string,
  taskId: string
): DeleteTaskAction => ({
  type: DELETE_TASK,
  payload: {
    projectId,
    taskId,
  },
});

export interface AddSubtaskAction {
  type: typeof ADD_SUBTASK;
  payload: {
    taskId: string;
    subtask: Subtask;
  };
}

export const addSubtaskAC = (
  taskId: string,
  subtask: Subtask
): AddSubtaskAction => ({
  type: ADD_SUBTASK,
  payload: {
    taskId,
    subtask,
  },
});

export interface AddFileAction {
  type: typeof ADD_FILE;
  payload: FileData;
}

export const addFileAC = (name: string, data: string): AddFileAction => ({
  type: ADD_FILE,
  payload: { name, data },
});

let nextCommentId = 1;
export interface AddComment {
  type: typeof ADD_COMMENT;
  payload: {
    taskId: string;
    nextCommentId: typeof nextCommentId;
    text: string;
  };
}

export const addCommentAC = (taskId: string, text: string): AddComment => ({
  type: ADD_COMMENT,
  payload: {
    taskId,
    nextCommentId: nextCommentId++,
    text,
  },
});


