import React, { useState } from "react";

import { Task } from "../../redux/Actions";

interface TaskItemProps {
  task: Task;
  taskId: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, taskId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="task-item" onClick={handleOpenModal}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>

      {isOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content">
            <h2>Task Details</h2>
            <p> Task start at: {task.createdDate}</p>
            <p> Task in work for:{task.workTime}</p>
            <p> Task will end:{task.endDate}</p>
            <p> Task priority:{task.priority}</p>
            <p> Task status:{task.status}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;
