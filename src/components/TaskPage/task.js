import { Component } from "react";
import Navbar from "../Navbar/nav";
import { FaPencil } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import { SpinnerCircularFixed } from "spinners-react";
import Cookies from "js-cookie";
import { RxCross2 } from "react-icons/rx";
import "./task.css";

const statusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class TaskPage extends Component {
  state = {
    taskData: {},
    errorMsg: "",
    apiStatus: statusConstants.initial,
    newStatus: "",
    isStatusEmpty: false,
  };

  componentDidMount() {
    this.getTaskData();
  }

  getTaskData = async () => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const { projectId, taskId } = this.props.match.params;
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    // https://tracker-backend-vg3b.onrender.com
    const response = await fetch(
      `http://localhost:5000/projects/${projectId}/tasks/${taskId}`,
      options
    );
    const jsonData = await response.json();
    const taskData = jsonData[0];
    let completedAt = null;
    if (taskData.status === "Done") {
      const completedAtDate = taskData.completed_at.split(" ")[0];
      const [year, month, day] = completedAtDate.split("-");
      completedAt = `${day}-${month}-${year}`;
    } else {
      completedAt = taskData.completed_at;
    }
    const createdAt = taskData.created_at.split(" ")[0];
    const [year, month, day] = createdAt.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    const updatedTaskData = {
      id: taskData.id,
      projectId: taskData.project_id,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      createdAt: formattedDate,
      completedAt: completedAt,
    };
    if (response.ok) {
      this.setState({
        taskData: updatedTaskData,
        apiStatus: statusConstants.success,
      });
    } else {
      this.setState({
        errorMsg: jsonData.error,
        apiStatus: statusConstants.failure,
      });
    }
  };

  onDeleteTask = async () => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const { projectId } = this.props.match.params;
    const { location } = this.props;
    const task = location.state?.task;
    const { taskId } = task;
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `http://localhost:5000/projects/${projectId}/tasks/${taskId}`,
      options
    );
    const jsonData = await response.json();
    if (response.ok) {
      this.setState({
        apiStatus: statusConstants.success,
      });
      const { history } = this.props;
      history.replace("/projects/1/tasks");
    } else {
      this.setState({
        errorMsg: jsonData.error,
        apiStatus: statusConstants.failure,
      });
    }
  };
  onGetStatus = (event) => {
    this.setState({
      newStatus: event.target.value,
    });
  };
  validateStatus = () => {
    const { status } = this.state;
    if (status === "") {
      this.setState({
        isStatusEmpty: true,
      });
    }
  };

  toUpdateTask = async () => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const { newStatus } = this.state;
    const { projectId } = this.props.match.params;
    const { location } = this.props;
    const task = location.state?.task;
    const { taskId } = task;
    const newStatusObject = {
      status: newStatus,
    };
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newStatusObject),
    };
    const response = await fetch(
      `http://localhost:5000/projects/${projectId}/tasks/${taskId}`,
      options
    );
    const jsonData = response.json();
    if (response.ok) {
      await this.getTaskData();
      this.setState({
        apiStatus: statusConstants.success,
      });
    } else {
      this.setState({
        errorMsg: jsonData.error,
        apiStatus: statusConstants.failure,
      });
    }
  };

  onUpdateTask = () => {
    const { status } = this.state;
    if (status === "") {
      this.setState({
        isAllFilled: false,
      });
    } else {
      this.toUpdateTask();
      this.setState({
        isAllFilled: true,
        newStatus: "",
      });
    }
  };

  renderSuccessView = () => {
    const { taskData, isStatusEmpty, newStatus } = this.state;
    const { id, title, description, status, createdAt, completedAt } = taskData;
    let isTaskCompleted = false;
    if (status === "Done") {
      isTaskCompleted = true;
    }
    let isDisabled = true;
    if (newStatus !== "") {
      isDisabled = false;
    }
    return (
      <>
        <div className="task-page ps-3 pe-3">
          <div className="container-fluid">
            <div className="row">
              <div className="d-flex justify-content-center mt-4">
                <div className="task-container p-3 ps-4 pe-4">
                  <h1 className="task-sub-main-heading text-center">
                    Task Details
                  </h1>
                  <div className="d-flex mb-0 task-btn-div justify-content-between">
                    <h1 className="task-heading text-center">Task Id - {id}</h1>
                    <div>
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#myModal"
                        className="task-btns me-1 me-sm-3"
                      >
                        <FaPencil className="text-white" />
                      </button>
                      <button
                        className="task-btns ms-2"
                        onClick={this.onDeleteTask}
                      >
                        <FaTrashCan className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <h2 className="task-sub-heading">Task</h2>
                    <h2 className="task-colon ms-1">:</h2>
                    <h1 className="task-name ms-2">{title}</h1>
                  </div>
                  <h1 className="desc-heading">
                    Description <span className="colon">:</span>{" "}
                    <span className="description ms-1">{description}</span>
                  </h1>
                  <h1 className="status-heading">
                    Status <span className="colon">:</span>
                    <span className="status-text"> {status}</span>
                  </h1>
                  <h1 className="status-heading">
                    Created at <span className="colon">:</span>
                    <span className="date"> {createdAt}</span>
                  </h1>
                  {isTaskCompleted ? (
                    <h1 className="status-heading">
                      Completed at <span className="colon">:</span>{" "}
                      <span className="date"> {completedAt}</span>
                    </h1>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="myModal"
          tabindex="-1"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-3">
              <div className="d-flex justify-content-between">
                <h2 className="modal-title" id="myModalLabel">
                  Update Task
                </h2>
                <button
                  type="button"
                  className="close-btn me-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <RxCross2 />
                </button>
              </div>
              <div class="modal-body">
                <div class="d-flex flex-column">
                  <label className="modal-label">
                    Status{" "}
                    <span className="msg">
                      (Only Todo, In Progress, Done values are accepted)
                    </span>
                  </label>
                  <input
                    className="modal-input-field"
                    onChange={this.onGetStatus}
                    onBlur={this.validateStatus}
                    value={newStatus}
                    type="text"
                    placeholder="New Status"
                  />
                  {isStatusEmpty ? <p className="error-msg">Required*</p> : ""}
                </div>
              </div>
              <div className="d-flex justify-content-end mt-1 pe-3 pb-2">
                <button
                  onClick={this.onUpdateTask}
                  disabled={isDisabled}
                  type="button"
                  class="create-btn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  renderFailureView = () => {
    const { errorMsg } = this.state;
    return (
      <div className="failure-page d-flex justify-content-center align-items-center">
        <div className="fail-card d-flex flex-column justify-content-center align-items-center p-3">
          <h1 className="api-status">401</h1>
          <h1 className="err-msg">{errorMsg}...!</h1>
        </div>
      </div>
    );
  };

  renderProgressView = () => (
    <div className="spinners-page d-flex justify-content-center align-items-center">
      <SpinnerCircularFixed
        size={65}
        thickness={90}
        speed={160}
        color="rgb(3, 171, 238)"
        secondaryColor="rgb(102, 227, 249)"
      />
    </div>
  );

  renderTaskDetails = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case statusConstants.success:
        return this.renderSuccessView();
      case statusConstants.failure:
        return this.renderFailureView();
      case statusConstants.inProgress:
        return this.renderProgressView();
      default:
        return null;
    }
  };

  render() {
    return (
      <>
        <Navbar />
        {this.renderTaskDetails()}
      </>
    );
  }
}

export default TaskPage;
