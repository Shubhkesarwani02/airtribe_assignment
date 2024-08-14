import { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";

const statuses = ["Not started", "In progress", "Completed"];

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10");
        const fetchedTasks = response.data.map((task) => ({
          id: task.id.toString(),
          title: task.title,
          status: statuses[task.completed ? 2 : 0],
          description: "",
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };

  const addTask = (status) => {
    const newTask = {
      id: Date.now().toString(),
      title: `New Task`,
      status,
      description: "",
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="d-flex justify-content-around">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="card p-3 m-2"
                style={{ width: "250px", minHeight: "400px" }}
              >
                <h5>
                  {status} ({tasks.filter((task) => task.status === status).length})
                </h5>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="card mb-2 p-2"
                        >
                          <Link to={`/task/${task.id}`}>{task.title}</Link>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
                <button className="btn btn-primary mt-2" onClick={() => addTask(status)}>
                  + New
                </button>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
