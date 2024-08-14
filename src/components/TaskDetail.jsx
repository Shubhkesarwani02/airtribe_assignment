/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const statuses = ["Not started", "In progress", "Completed"];

const TaskDetail = ({ tasks, setTasks }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task ? task.title : "");
  const [status, setStatus] = useState(task ? task.status : statuses[0]);
  const [description, setDescription] = useState(task ? task.description : "");

  useEffect(() => {
    if (!task) {
      alert("Task not found!");
      navigate("/");
    }
  }, [task, navigate]);

  const saveChanges = async () => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, title, status, description } : t
    );

    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title,
        completed: status === "Completed",
      });
      console.log("Task updated on server (simulation).");
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setTasks(updatedTasks);
    navigate("/");
  };

  const deleteTask = async () => {
    const updatedTasks = tasks.filter((t) => t.id !== id);

    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      console.log("Task deleted from server (simulation).");
    } catch (error) {
      console.error("Error deleting task:", error);
    }

    setTasks(updatedTasks);
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Task Details</h2>
      <div className="mb-3">
        <label className="form-label">Title:</label>
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Status:</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Description:</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button className="btn btn-success me-2" onClick={saveChanges}>
        Save
      </button>
      <button className="btn btn-danger" onClick={deleteTask}>
        Delete
      </button>
    </div>
  );
};

export default TaskDetail;
