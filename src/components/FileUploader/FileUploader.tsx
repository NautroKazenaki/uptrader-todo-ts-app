import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  projectId: string;
  taskId: string;
  onAttachFile: (projectId: string, taskId: string, files: File[]) => void;
  attachments: any[];
  setAttachments: (attachments: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  projectId,
  taskId,
  onAttachFile,
  attachments,
  setAttachments,
}) => {
  useEffect(() => {
    const myAppDataString = localStorage.getItem("myAppData");
    if (!myAppDataString) {
      return;
    }

    const myAppData = JSON.parse(myAppDataString);

    if (myAppData?.projects?.[projectId]?.tasks?.[taskId]) {
      const storedAttachments =
        myAppData.projects[projectId].tasks[taskId].attachments;

      if (storedAttachments && storedAttachments.length > 0) {
        setAttachments(storedAttachments);
      }
    }
  });

  const saveAttachmentsToLocalStorage = (attachments: any[]) => {
    try {
      const serializedAttachments = JSON.stringify(attachments);
      localStorage.setItem("myAppData", serializedAttachments);
    } catch (error) {
      console.error("Error saving attachments to local storage:", error);
    }
  };

  const handleDrop = (acceptedFiles: any) => {
    const newAttachments = acceptedFiles.map((file: any) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    saveAttachmentsToLocalStorage([...attachments, ...newAttachments]);
    setAttachments([...attachments, ...newAttachments]);
    onAttachFile(projectId, taskId, newAttachments);
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments: File[] = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  useEffect(() => {
    const path = `myAppData.projects.${projectId}.tasks.${taskId}.attachments`;
    const attachmentsCopy = JSON.parse(JSON.stringify(attachments));
    localStorage.setItem(path, JSON.stringify(attachmentsCopy));
  }, [attachments, projectId, taskId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`file-uploader ${isDragActive ? "drag-active" : ""}`}
    >
      <input {...getInputProps()} />

      {attachments.map((attachment: any, index: number) => (
        <div className="attached-file" key={`attachment_${index}`}>
          <span>{attachment.name}</span>
          <button onClick={() => handleRemoveFile(index)}>Remove</button>
        </div>
      ))}

      {attachments.length === 0 && <p>Drag and drop files here</p>}
    </div>
  );
};

export default FileUploader;
