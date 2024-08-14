import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskBoard from "./components/TaskBoard";
import TaskDetail from "./components/TaskDetail";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10");
        const fetchedTasks = response.data.map((task) => ({
          id: task.id.toString(),
          title: task.title,
          status: task.completed ? "Completed" : "Not started",
          description: "",
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskBoard tasks={tasks} setTasks={setTasks} />} />
        <Route path="/task/:id" element={<TaskDetail tasks={tasks} setTasks={setTasks} />} />
      </Routes>
    </Router>
  );
};

export default App;
