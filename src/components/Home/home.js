import {Link} from 'react-router-dom'
import Navbar from '../Navbar/nav'

import './home.css'

const Home = () => {
  return(
		<>
		<Navbar/>
			<div className="home-container d-flex justify-content-center align-items-center">
				<div className='home-card-div text-center'>
					<h1 className='home-heading'>Track Your Project Progress without Effort</h1>
					<p className='home-tag'>Know what you've finished and what’s coming up.Stay organized, focused, and keep moving forward.</p>
					<Link to='/projects'><button className='add-btn'>Create Project</button></Link>
				</div>
			</div>
		</>
  )
}

export default Home