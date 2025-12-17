import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie';

import './nav.css'

const navTabs = [
  {navTabId: 'HOME', navTab: 'Home', path:'/'},
  {navTabId: 'PRODUCTS', navTab: 'Products', path: '/api/products'},
  {navTabId: 'ORDERS', navTab: 'My Orders', path: '/api/orders/:id'}
]

class Navbar extends Component{
  state={
    isNavOpen: false,
    activeNavTab: navTabs[0].navTabId, 
  }

  toggleNavbar = () => {
    this.setState((prevState) => ({
      isNavOpen: !prevState.isNavOpen,
    }));
  };

  closeNavbar = () => {
    this.setState({ isNavOpen: false });
  };

  onLogout = () => {
    Cookies.remove('jwt_token');
    const {history} = this.props;
    history.replace('/login');
  }

  render(){
    return(
      <>
        <div className="navbar-container fixed-top">
          <div className="container-fluid">
            <div className="row">
              <nav className="navbar navbar-expand-md nav d-none d-md-block">
                <div className="container-fluid">
                  <Link to='/'className="navbar-brand nav-link" id='full-name'>Task Tracker</Link>
                  <button className="navbar-toggler" id='ham-btn' type="button" onClick={this.toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className={`collapse navbar-collapse tabs-container ${this.state.isNavOpen ? "show" : ""}`}>
                    <div className="navbar-nav nav-link-container d-flex justify-content-evenly">
                      <button className='link-btn'><Link to='/' className='link m-md-1 m-lg-2'>Home</Link></button>
                      <button className='link-btn'><Link to='/projects' className='link m-md-1 m-lg-2'>Projects</Link></button>
                    </div>
                  </div>
                  <button className='logout-btn' onClick={this.onLogout}>Logout</button>
                </div> 
              </nav>
              <nav className="navbar navbar-expand-lg nav d-md-none">
                <div className="container-fluid div">
                  <div className='d-flex justify-content-between w-100'>
                    <Link to='/'className="navbar-brand nav-link" id='full-name'>Task Tracker</Link>
                    <div className='button-container d-flex justify-content-evenly align-items-center'>
                      <button className="navbar-toggler" id='ham-btn' type="button" onClick={this.toggleNavbar}>
                        <span className="navbar-toggler-icon"></span>
                      </button>
                    </div>
                  </div>
                  <div className={`collapse navbar-collapse tabs-container p-0 ${this.state.isNavOpen ? "show" : ""}`}>
                    <div className="navbar-nav nav-link-container d-flex justify-content-evenly">
                      <Link to='/' className="link" onClick={this.closeNavbar}><p>Home</p></Link>
                      <Link to='/projects' className="link" onClick={this.closeNavbar}><p>Projects</p></Link>
                      <button className='logout' onClick={this.onLogout}>Logout</button>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Navbar)
