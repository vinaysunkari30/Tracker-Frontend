import { Link } from "react-router-dom";
import "./eachTask.css";

const EachTask = (props) => {
  const { taskData, projectId } = props;
  const { taskId, serialId, title, status } = taskData;
  return (
    <>
      <li className="d-flex justify-content-center">
        <div className="task-div text-white list-unstyled">
          <Link
            className="task-link text-center"
            to={`/projects/${projectId}/tasks/${taskId}`}
          >
            <div className="container-fluid">
              <div className="row">
                <h3 className="id col-1 col-sm-1">{serialId}.</h3>
                <h1 className="task-title col-7 col-sm-8">{title}</h1>
                <p className="status col-4 col-sm-3 mb-0 p-0">{status}</p>
              </div>
            </div>
          </Link>
        </div>
      </li>
    </>
  );
};

export default EachTask;
