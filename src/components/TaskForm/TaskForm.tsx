import React, { Dispatch, useCallback, useRef, useState } from "react";
import { addTaskAC, Task } from "../../redux/Actions";
import { v4 as uuid } from "uuid";
import TFStyles from "./TaskForm.module.css";
import moment from "moment";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface TaskFormProps {
  projectId: string;
  dispatch: Dispatch<any>;
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, dispatch }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Urgent");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: uuid(),
      title,
      description,
      priority,
      createdDate: moment().format("DD.MM.YYYY HH:mm:ss"),
      attachments: [""],
      comments: [],
      endDate: moment().format("DD.MM.YYYY HH:mm:ss"),
      status: "queue-column",
      subtasks: [],
      workTime: 0,
    };
    dispatch(addTaskAC(projectId, newTask));

    setTitle("");
    setDescription("");
    setPriority("");
    setIsModalVisible(false);
  };

  const openModal = useCallback(() => {
    setIsModalVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  return (
    <>
      {isModalVisible ? (
        <div>
          <div className={TFStyles.mwOverlay}>
            <span
              className={TFStyles.closeButtonContainer}
              onClick={closeModal}
            >
              <CancelIcon></CancelIcon>
            </span>
            <form onSubmit={handleSubmit} className={TFStyles.form}>
              <div className={TFStyles.formContentContainer}>
                <label className={TFStyles.label}>
                  <TextField
                    value={title}
                    onChange={handleInputChange}
                    ref={inputRef}
                    required
                    label="Enter task title"
                    sx={{ input: { color: "white" } }}
                    variant="standard"
                    InputLabelProps={{ style: { color: "white" } }}
                  />
                </label>
                <label className={TFStyles.label}>
                  <TextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    label="Enter task description"
                    maxRows={4}
                    variant="standard"
                    InputLabelProps={{ style: { color: "white" } }}
                    sx={{ input: { color: "white" } }}
                  />
                </label>
                <label className={TFStyles.label}>
                  {/* @ts-ignore */}
                  <InputLabel
                    id="demo-simple-select-label"
                    xs={{ color: "white" }}
                  >
                    Choose priority:
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={priority}
                    label="Choose priority"
                    onChange={(e) => setPriority(e.target.value)}
                    required
                    sx={{ color: "white", borderColor: "white" }}
                    inputProps={{ color: "white" }}
                  >
                    <MenuItem value={"Urgent"}>Urgent</MenuItem>
                    <MenuItem value={"Can wait"}>Can wait</MenuItem>
                  </Select>
                </label>
                <Button
                  variant="contained"
                  sx={{ position: "initial" }}
                  type="submit"
                >
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Button
          variant="contained"
          sx={{ position: "initial" }}
          onClick={openModal}
        >
          Add Task
        </Button>
      )}
    </>
  );
};

export default TaskForm;
