import { Component } from "react";
import Navbar from "../Navbar/nav";
import { SpinnerCircularFixed } from "spinners-react";
import EachTask from "../EachTask/eachTask";
import Cookies from "js-cookie";
import { RxCross2 } from "react-icons/rx";
import "./tasks.css";

const statusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class TasksPage extends Component {
  state = {
    tasksList: [],
    apiStatus: statusConstants.initial,
    errorMsg: "",
    taskName: "",
    description: "",
    status: "",
    isAllFilled: false,
    isTaskNameEmpty: false,
    isDescriptionEmpty: false,
    isStatusEmpty: false,
  };

  componentDidMount() {
    this.getTasksList();
  }

  getTasksList = async () => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const jwtToken = Cookies.get("jwt_token");
    const { id } = this.props.match.params;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `https://tracker-backend-vg3b.onrender.com/projects/${id}`,
      options
    );
    const jsonData = await response.json();
    if (response.ok) {
      const formattedList = jsonData.map((eachTask, index) => {
        return {
          serialId: index + 1,
          taskId: eachTask.id,
          projectId: eachTask.project_id,
          title: eachTask.title,
          description: eachTask.description,
          status: eachTask.status,
          createdAt: eachTask.created_at,
          completedAt: eachTask.completed_at,
        };
      });
      this.setState({
        tasksList: formattedList,
        apiStatus: statusConstants.success,
      });
    } else {
      this.setState({
        errorMsg: jsonData.error,
        apiStatus: statusConstants.failure,
      });
    }
  };

  onGetTaskName = (event) => {
    this.setState({
      taskName: event.target.value,
    });
  };
  onGetDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };
  onGetStatus = (event) => {
    this.setState({
      status: event.target.value,
    });
  };
  validateTaskName = () => {
    const { taskName } = this.state;
    if (taskName === "") {
      this.setState({
        isTaskNameEmpty: true,
      });
    }
  };
  validateDescription = () => {
    const { description } = this.state;
    if (description === "") {
      this.setState({
        isDescriptionEmpty: true,
      });
    }
  };
  validateStatus = () => {
    const { status } = this.state;
    if (status === "") {
      this.setState({
        isStatusEmpty: true,
      });
    }
  };

  createNewTask = async () => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const { taskName, description, status } = this.state;
    const { id } = this.props.match.params;
    const jwtToken = Cookies.get("jwt_token");
    const taskDetails = {
      title: taskName,
      description: description,
      status: status,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(taskDetails),
    };
    const response = await fetch(`https://tracker-backend-vg3b.onrender.com/projects/${id}/tasks`,options);
    const jsonData = await response.json();
    if (response.ok) {
      await this.getTasksList();
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

  onCreateTask = () => {
    const { taskName, description, status } = this.state;
    if (taskName === "" && description === "" && status === "") {
      this.setState({
        isAllFilled: false,
      });
    } else {
      this.createNewTask();
    }
  };

  renderSuccessView = () => {
    const {
      tasksList,
      isTaskNameEmpty,
      isDescriptionEmpty,
      isStatusEmpty,
      taskName,
      description,
      status,
      isAllFilled,
    } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    let isDisabled = true;
    if (taskName !== "" && description !== "" && status !== "") {
      isDisabled = false;
    }
    const { projectName } = this.props.history.location.state;
    return (
      <>
        <div className="tasks-page">
          <div className="container-fluid">
            <div className="row">
              {tasksList.length === 0 ? (
                <div className="empty-tasks-page d-flex justify-content-center align-items-center">
                  <div className="d-flex flex-column justify-content-center align-items-center p-2">
                    <h1 className="empty-tasks-heading text-center">
                      No tasks available for this project. Create one to get
                      started!
                    </h1>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                      className="create-task-btn"
                    >
                      Create Task
                    </button>
                  </div>
                </div>
              ) : (
                <div className="filled-projects-page">
                  <div className="d-flex justify-content-center align-items-center project-name-div w-100 ps-md-5">
                    <h1 className="project-name mt-2">{projectName}</h1>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                      className="create-task-btn"
                    >
                      Create Task
                    </button>
                  </div>
                  <h3 className="project-task-heading text-center mt-4">
                    Project Tasks
                  </h3>
                  <ul className="list-styled-none mt-2">
                    {tasksList.map((eachTask) => (
                      <EachTask
                        key={eachTask.id}
                        projectId={id}
                        taskData={eachTask}
                      />
                    ))}
                  </ul>
                </div>
              )}
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
                  New Task
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
                <div class="d-flex flex-column mb-2">
                  <label className="modal-label">Task Name</label>
                  <input
                    className="modal-input-field"
                    onChange={this.onGetTaskName}
                    onBlur={this.validateTaskName}
                    type="text"
                    placeholder="Task Name"
                  />
                  {isTaskNameEmpty ? (
                    <p className="error-msg">Required*</p>
                  ) : (
                    ""
                  )}
                </div>
                <div class="d-flex flex-column mb-2">
                  <label className="modal-label">Description</label>
                  <textarea
                    className="textarea-modal-input-field"
                    rows={4}
                    onChange={this.onGetDescription}
                    onBlur={this.validateDescription}
                    type="text"
                    placeholder="Description"
                  />
                  {isDescriptionEmpty ? (
                    <p className="error-msg">Required*</p>
                  ) : (
                    ""
                  )}
                </div>
                <div class="d-flex flex-column">
                  <label className="modal-label">Status</label>
                  <input
                    className="modal-input-field"
                    onChange={this.onGetStatus}
                    onBlur={this.validateStatus}
                    type="text"
                    placeholder="Status"
                  />
                  {isStatusEmpty ? <p className="error-msg">Required*</p> : ""}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-1 pe-3 pb-2">
                <button
                  onClick={this.onCreateTask}
                  disabled={isDisabled}
                  type="button"
                  class="create-btn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Create
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

  renderTasksDetails = () => {
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
        {this.renderTasksDetails()}
      </>
    );
  }
}

export default TasksPage;
