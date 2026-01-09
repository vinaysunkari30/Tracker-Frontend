import { Component } from "react";
import Navbar from "../Navbar/nav";
import { FaPlus } from "react-icons/fa6";
import ProjectPage from "../ProjectPage/project";
import { RxCross2 } from "react-icons/rx";
import { SpinnerCircularFixed } from "spinners-react";
import Cookies from "js-cookie";
import "./projects.css";

const statusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class ProjectsPage extends Component {
  state = {
    apiStatus: statusConstants.initial,
    projectsList: [],
    errorMsg: "",
    projectName: "",
    responseStatus: "",
  };

  componentDidMount() {
    this.getProjectsList();
  }

  getProjectsList = async () => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      "http://localhost:5000/projects",
      options
    );
    const jsonData = await response.json();
    if (response.ok) {
      const formattedList = jsonData.map((eachUser) => {
        return {
          serialId: eachUser.serial_id,
          id: eachUser.id,
          userId: eachUser.user_id,
          projectName: eachUser.project_name,
          createdAt: eachUser.created_at,
        };
      });
      this.setState({
        apiStatus: statusConstants.success,
        projectsList: formattedList,
      });
    } else {
      this.setState({
        apiStatus: statusConstants.failure,
        errorMsg: jsonData.error,
      });
    }
  };

  onGetProjectName = (event) => {
    this.setState({
      projectName: event.target.value,
    });
  };

  onCreateProject = async () => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const { projectName } = this.state;
    const projectData = {
      projectName: projectName,
    };
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    };

    const response = await fetch(
      "http://localhost:5000/projects",
      options
    );
    const jsonData = await response.json();
    if (response.ok) {
      await this.getProjectsList();
      this.setState({
        apiStatus: statusConstants.success,
        projectName: "",
      });
    } else {
      this.setState({
        apiStatus: statusConstants.failure,
        errorMsg: jsonData.error,
      });
    }
  };

  onDeleteProject = async (id) => {
    this.setState({
      apiStatus: statusConstants.inProgress,
    });
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    // https://tracker-backend-vg3b.onrender.com
    const response = await fetch(
      `http://localhost:5000/projects/${id}`,
      options
    );
    const jsonData = await response.json();
    if (response.ok) {
      await this.getProjectsList();
      this.setState({
        apiStatus: statusConstants.success,
      });
    } else {
      this.setState({
        apiStatus: statusConstants.failure,
        errorMsg: jsonData.error,
      });
    }
  };

  renderSuccessView = () => {
    const { projectsList, projectName } = this.state;
    let isValid = false;
    if (projectName.length >= 5) {
      isValid = true;
    }
    return (
      <>
        <div className="projects-page">
          <div className="container-fluid">
            <div className="row">
              {projectsList.length === 0 ? (
                <div className="no-projects-div d-flex justify-content-center align-items-center">
                  <div className="d-flex flex-column justify-content-center p-4">
                    <h1 className="empty-projects-heading text-center">
                      No projects found. Create your first project!
                    </h1>
                    <div className="d-flex justify-content-center">
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#myModal"
                        className="new-project-btn d-flex justify-content-center align-items-center mt-4"
                      >
                        <FaPlus className="icon" />
                        <h2 className="btn-text">New Project</h2>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="filled-projects-page">
                  <h1 className="text-center projects-heading">
                    Your Projects
                  </h1>
                  <div className="d-flex justify-content-center">
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                      className="new-project-btn d-flex justify-content-center align-items-center mt-4"
                    >
                      <FaPlus className="icon" />
                      <h2 className="btn-text">New Project</h2>
                    </button>
                  </div>
                  <ul className="d-flex flex-wrap list-unstyled p-0 mt-2">
                    {projectsList.map((eachSite) => (
                      <ProjectPage
                        key={eachSite.id}
                        siteData={eachSite}
                        onDeleteProject={this.onDeleteProject}
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
                <h2 class="modal-title" id="myModalLabel">
                  New Project
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
              <div class="modal-body d-flex flex-column">
                <label className="modal-label">Project Name</label>
                <input
                  className="modal-input-field"
                  onChange={this.onGetProjectName}
                  value={projectName}
                  type="text"
                  placeholder="Project Name"
                />
              </div>
              <div className="d-flex justify-content-end mt-1 pe-3 pb-2">
                {isValid ? (
                  <button
                    onClick={this.onCreateProject}
                    type="button"
                    class="create-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Create
                  </button>
                ) : (
                  ""
                )}
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

  renderProjectsDetails = () => {
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
        {this.renderProjectsDetails()}
      </>
    );
  }
}

export default ProjectsPage;
