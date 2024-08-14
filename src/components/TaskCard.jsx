/* eslint-disable react/prop-types */

const TaskCard = ({ task }) => (
  <div>
    <h4>{task.title}</h4>
    <p>{task.description}</p>
  </div>
);

export default TaskCard;
