import { Link, withRouter } from 'react-router-dom';
import { FaTrashAlt } from "react-icons/fa";
import './project.css';

const ProjectPage = (props) => {
	const { siteData, onDeleteProject } = props;
	const {id, projectName, createdAt } = siteData;
	const date = createdAt.split(' ');
	const toDelete = () => {
		onDeleteProject(id);
	};

	const toSendProjectName = () => {
		const {history} = props;
		const data = {
      projectName: projectName,
    };
    history.push({
      pathname: `/projects/${id}/tasks`,
      state: data
    });
	}

	return (
		<li className='col-6 col-md-4 col-lg-3 mt-3 p-2'>
			<button className='projects-div w-100 d-flex flex-column justify-content-center p-3' onClick={toSendProjectName}>
				<button onClick={toDelete} className='trash-icon align-self-end'>
					<FaTrashAlt />
				</button>
				<Link to={`/projects/${id}/tasks`} className='text-decoration-none text-dark'>
					<h2 className='title text-center fs-4'>{projectName}</h2>
				</Link>
				<p className='date'>{date[0]}</p>
			</button>
		</li>
	);
};

export default withRouter(ProjectPage);