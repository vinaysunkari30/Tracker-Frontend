import {BrowserRouter as Routes, Switch, Route} from 'react-router-dom'
import SignupPage from './components/SignupPage/sigup'
import LoginPage from './components/LoginPage/login';
import Home from './components/Home/home';
import ProjectsPage from './components/ProjectsPage/projects';
import TasksPage from './components/TasksPage/tasks';
import TaskPage from './components/TaskPage/task';
import ProtectedRoute from './components/ProtectecRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const App = () => {
  return(
		<Routes>
			<Switch>
				<Route exact path='/signup' component={SignupPage}/>
				<Route exact path='/login' component={LoginPage}/>
				<ProtectedRoute exact path='/' component={Home}/>
				<ProtectedRoute exact path='/projects' component={ProjectsPage}/>
				<ProtectedRoute exact path='/projects/:id/tasks' component={TasksPage}/>
				<ProtectedRoute exact path='/projects/:projectId/tasks/:taskId' component={TaskPage}/>
			</Switch>
		</Routes>
  )
}

export default App