import React, {
  Dispatch,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { editTaskAC, Project, Subtask, Comment } from "../../redux/Actions";
import TFStyles from "../TaskForm/TaskForm.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, TextField } from "@mui/material";
import FileUploader from "../FileUploader/FileUploader";
import { useParams } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { v4 as uuid } from "uuid";

interface TaskFormProps {
  taskId: string;
  dispatch: Dispatch<any>;
}

const ChangeTaskForm: React.FC<TaskFormProps> = ({ taskId, dispatch }) => {
  const projects = useSelector((state: RootState) => state.projectsPage);
  const { projectId } = useParams();
  const defaultProjectId = projectId || "";
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState({
    checked: false,
    description: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newSubComment, setNewSubComment] = useState("");
  const [showReplyField, setShowReplyField] = useState(false);
  const [newTitle, setNewTitle] = useState(() => {
    const projectWithTask = projects.projects.find((project) =>
      project.tasks.some((task) => task.id === taskId)
    );
    if (projectWithTask) {
      const task = projectWithTask.tasks.find((task) => task.id === taskId);
      return task?.title || "";
    } else {
      return "";
    }
  });
  const [newDescription, setNewDescription] = useState(() => {
    const projectWithTask = projects.projects.find((project) =>
      project.tasks.some((task) => task.id === taskId)
    );
    if (projectWithTask) {
      const task = projectWithTask.tasks.find((task) => task.id === taskId);
      return task?.description || "";
    } else {
      return "";
    }
  });
  const [attachments, setAttachments] = useState<File[]>([]);
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

  useEffect(() => {
    const projectWithSubtask = projects.projects.find((project) =>
      project.tasks.some((task) => task.id === taskId)
    );

    const task = projectWithSubtask?.tasks.find((task) => task.id === taskId);

    if (task) {
      setSubtasks(task.subtasks || []);
    }
  }, [taskId, projects.projects]);

  useEffect(() => {
    const projectWithComments = projects.projects.find((project) =>
      project.tasks.some((task) => task.id === taskId)
    );

    const task = projectWithComments?.tasks.find((task) => task.id === taskId);

    if (task) {
      setComments(task.comments);
    }
  }, [taskId, projects.projects]);

  const handleReplyButtonClick = () => {
    setShowReplyField(true);
  };

  const handleReplySubmit = () => {
    if (newSubComment) {
      const updatedComments = comments.map((comment) => {
        if (comment.commentId === comment.commentId) {
          const updatedSubComment = {
            commentId: uuid(),
            text: newSubComment,
          };
          return {
            ...comment,
            subComments: [...comment.subComments, updatedSubComment],
          };
        } else if (comment.subComments) {
          const updatedSubComments = comment.subComments.map((subComment) => {
            if (subComment.commentId === comment.commentId) {
              const updatedReply = {
                commentId: uuid(),
                text: newSubComment,
              };
              return {
                ...subComment,
                subComments: [...subComment.subComments, updatedReply],
                showReplyField: true,
              };
            }
            return subComment;
          });
          return {
            ...comment,
            subComments: updatedSubComments,
          };
        }
        return comment;
      });

      setComments(updatedComments as Comment[]);

      setNewSubComment("");
    }

    setShowReplyField(false);
  };

  const handleSubCommentDelete = (
    event: React.MouseEvent<HTMLButtonElement>,
    commentId: Comment,
    subCommentId: Comment
  ) => {
    event.stopPropagation();

    const updatedComments = comments.map((comment) => {
      if (comment.commentId === commentId.commentId) {
        const updatedSubComments = comment.subComments.filter(
          (subComment) => subComment.commentId !== subCommentId.commentId
        );
        return {
          ...comment,
          subComments: updatedSubComments,
        };
      }
      return comment;
    });

    setComments(updatedComments as Comment[]);
  };

  useEffect(() => {
    const savedAttachments = localStorage.getItem(
      `myAppData.projects.${projectId}.tasks.${taskId}.attachments`
    );
    if (savedAttachments) {
      try {
        const parsedAttachments = JSON.parse(savedAttachments);

        setAttachments(parsedAttachments);
      } catch (error) {
        console.error("Error parsing saved attachments:", error);
      }
    }
  }, []);
  const handleAttachFile = (file: File) => {
    setAttachments([...attachments, file]);
  };
  const handleAttachFileWithIds = (
    projectId: string,
    taskId: string,
    files: File[]
  ) => {
    files.forEach((file) => {
      handleAttachFile(file);
    });
  };

 
  const saveDataToLocalStorage = (data: Project[]) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem("myAppData", serializedData);
    } catch (error) {
      console.error("Error saving data to local storage:", error);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setNewEndDate(date);
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.target.value);
    },
    []
  );

  const handleSubtaskCheckboxChange = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = {
      ...updatedSubtasks[index],
      checked: !updatedSubtasks[index].checked,
    };

    setSubtasks(updatedSubtasks);
  };

  const handleNewSubtaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubtask({
      ...newSubtask,
      description: e.target.value,
    });
  };

  const handleAddSubtask = () => {
    if (newSubtask.description) {
      let updatedSubtasks = [...subtasks, { ...newSubtask, checked: false }];

      setSubtasks(updatedSubtasks);
      setNewSubtask({ checked: false, description: "" });
    }
  };

  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = () => {
    const updatedComments = [
      ...comments,
      { commentId: uuid(), text: newComment, subComments: [] },
    ];
    setComments(updatedComments);
    setNewComment("");
    setSavedProjects(projects.projects);
    saveDataToLocalStorage(projects.projects);
  };

  const handleDeleteComment = (
    event: React.MouseEvent<HTMLButtonElement>,
    commentId: Comment
  ) => {
    event.preventDefault();
    const updatedComments = comments.filter(
      (comment) => comment.commentId !== commentId.commentId
    );
    setComments(updatedComments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedEndDate = format(newEndDate, "dd.MM.yyyy HH:mm:ss");

    dispatch(
      editTaskAC(
        taskId,
        newTitle,
        newDescription,
        formattedEndDate,
        subtasks,
        comments,
        attachments
      )
    );
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSavedProjects(projects.projects);
    saveDataToLocalStorage(projects.projects);
  }, [handleSubmit]);

  const openModal = useCallback(() => {
    setIsModalVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setNewEndDate(new Date());
  }, []);

  return (
    <>
      {isModalVisible ? (
        <div>
          <div className={TFStyles.mwOverlay}>
            <div className={TFStyles.closeButtonContainer}>
              <span onClick={closeModal}>
                <CancelIcon></CancelIcon>
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={TFStyles.labelAndInputContainer}>
                <label>
                  <TextField
                    type="text"
                    value={newTitle}
                    onChange={handleInputChange}
                    ref={inputRef}
                    required
                    label="Enter new task title"
                    sx={{
                      input: { color: "white" },
                      borderRadius: "30px",
                      marginTop: "10px",
                    }}
                    variant="filled"
                    InputLabelProps={{ style: { color: "white" } }}
                  />
                </label>
              </div>
              <div className={TFStyles.labelAndInputContainer}>
                <label>
                  <TextField
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    InputLabelProps={{ style: { color: "white" } }}
                    sx={{
                      input: { color: "white" },
                      borderRadius: "30px",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                    variant="filled"
                    label="Enter new task description"
                    color="primary"
                  ></TextField>
                </label>
              </div>
              <div className={TFStyles.labelAndInputContainer}>
                <label className={TFStyles.endDataLabelContainer}>
                  {"Pick end data:" + " "}
                  <DatePicker
                    selected={newEndDate}
                    onChange={handleEndDateChange}
                    dateFormat="dd.MM.yyyy HH:mm:ss"
                    showTimeInput
                  />
                </label>
              </div>

              <div className={TFStyles.subtasksContainer}>
                {subtasks?.map((subtask: Subtask, index: number) => (
                  <div key={index} className={TFStyles.subtaskContainer}>
                    <input
                      type="checkbox"
                      checked={subtask.checked}
                      onChange={() => handleSubtaskCheckboxChange(index)}
                      className={TFStyles.checkboxInput}
                    />
                    {subtask.description}
                  </div>
                ))}
                <div>
                  <TextField
                    type="text"
                    value={newSubtask.description}
                    onChange={handleNewSubtaskChange}
                    label="Enter subtask text"
                    className={TFStyles.input}
                    variant="filled"
                    sx={{
                      input: { color: "white" },
                      borderRadius: "30px",
                      marginTop: "10px",
                    }}
                    InputLabelProps={{ style: { color: "white" } }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      position: "initial",
                      marginBottom: "10px",
                      marginTop: "10px",
                    }}
                    onClick={handleAddSubtask}
                  >
                    add subtask
                  </Button>
                </div>
              </div>
              <h3>Комментарии:</h3>
              {comments.map((comment, index) => (
                <div key={index}>
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <li
                      style={{
                        color: "green",
                        marginLeft: "20px",
                        wordBreak: "break-all",
                      }}
                    >
                      {comment.text}
                    </li>
                    {!showReplyField && (
                      <Button onClick={handleReplyButtonClick}>
                        <ReplyIcon fontSize="small" sx={{ minWidth: "16px" }} />
                      </Button>
                    )}
                    <Button
                      sx={{ minWidth: "16px" }}
                      onClick={(event) => handleDeleteComment(event, comment)}
                    >
                      <DeleteForeverIcon
                        fontSize="small"
                        sx={{ minWidth: "16px" }}
                      />
                    </Button>

                    {comment.subComments.map((subComment) => (
                      <div
                        style={{
                          justifyContent: "center",
                        }}
                      >
                        <li
                          style={{
                            color: "red",
                            marginLeft: "80px",
                            wordBreak: "break-all",
                          }}
                        >
                          {subComment.text}
                        </li>
                        {!showReplyField && (
                          <Button onClick={handleReplyButtonClick}>
                            <ReplyIcon
                              fontSize="small"
                              sx={{ minWidth: "16px" }}
                            />
                          </Button>
                        )}
                        <Button
                          sx={{ minWidth: "16px" }}
                          onClick={(event) =>
                            handleSubCommentDelete(event, comment, subComment)
                          }
                        >
                          <DeleteForeverIcon
                            fontSize="small"
                            sx={{ minWidth: "16px" }}
                          />
                        </Button>
                      </div>
                    ))}

                    {showReplyField && comment.commentId && (
                      <div>
                        <textarea
                          value={newSubComment}
                          onChange={(e) => setNewSubComment(e.target.value)}
                        />
                        <button onClick={() => handleReplySubmit()}>
                          Send reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div>
                <input
                  type="text"
                  value={newComment}
                  onChange={handleNewCommentChange}
                />
                <button onClick={handleAddComment}>add comment</button>
              </div>
              <FileUploader
                taskId={taskId}
                projectId={defaultProjectId}
                onAttachFile={handleAttachFileWithIds}
                attachments={attachments}
                setAttachments={setAttachments}
              />
              <p>Downloaded files:</p>
              <ul>
                {attachments?.map((attachment: any, index: number) => (
                  <li key={index}>
                    <a href={attachment.data} download={attachment.name}>
                      {attachment.name}
                    </a>
                  </li>
                ))}
              </ul>
              <Button
                variant="contained"
                sx={{ position: "initial" }}
                type="submit"
              >
                Confirm edit
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Button
          variant="contained"
          sx={{ position: "initial" }}
          onClick={openModal}
        >
          Edit task
        </Button>
      )}
    </>
  );
};

export default ChangeTaskForm;
