import {Component} from 'react';
import {Link,Redirect} from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import Cookies from 'js-cookie';
import './login.css'

class LoginPage extends Component{
  state={
    email:'',
    password: '',
    isEmailEmpty: false,
    isPasswordEmpty: false,
    isAllEmpty: false,
    errorMsg: '',
    isErrTrue: false,
  }
  
  validateEmail = () => {
    const {email} = this.state
    if(email===""){
      this.setState({
        isEmailEmpty: true,
      })
    }
  }
  validatePassword = () => {
        const {password} = this.state
        if(password===""){
          this.setState({
            isPasswordEmpty: true,
          })
        }
  }
  
  getEmail = (event)=> {
        this.setState({
          email: event.target.value,
          isAllEmpty: false,
					isEmailEmpty: false,
          isErrTrue: false,
        })
  }
  getPassword = (event)=> {
        this.setState({
          password: event.target.value,
          isAllEmpty: false,
					isPasswordEmpty: false,
          isErrTrue: false,
        })
  }
    
  onLogin = (event) => {
        event.preventDefault();
        const {email, password, isEmailEmpty, isPasswordEmpty} = this.state
        if(email===""&&password===""){
          this.setState({
            isAllEmpty: true,
          })
        }else{
          this.setState({
            email: '',
            password: '',
          })
          this.onLoginUser();
        }
        if(isEmailEmpty || isPasswordEmpty){
          this.setState({
            isAllEmpty: true,
          })
        }
  }
    
  onLoginUser = async() => {
        const {email, password} = this.state
        const userDetails = {
          email: email,
          password: password,
        }
        const jwtToken = Cookies.get('jwt_token');
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDetails),
        }
        const response = await fetch('https://tracker-backend-vg3b.onrender.com/login', options);
        const jsonData = await response.json();
        const loginjwtToken = jsonData.jwtToken
        if(response.ok){
            Cookies.set('jwt_token', loginjwtToken, ({expires: 30}))
            const {history} = this.props;
            history.replace('/');
        }else{
          this.setState({
            isErrTrue: true,
            errorMsg: jsonData.error,
          });
        }
  }

  render(){
    const {isEmailEmpty, isPasswordEmpty, isAllEmpty, isErrTrue, errorMsg, email, password} = this.state
    const jwtToken = Cookies.get('jwt_token');
    if(jwtToken !== undefined){
      return <Redirect to='/'/>
    }
  
    return(
      <div className='sign-in-container d-flex justify-content-center align-items-center'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-7 d-none d-md-block'>
              <img className='image' src="https://img.freepik.com/premium-photo/businessman-holding-pencil-complete-checklist-with-tick-marks-business-organization-achievements-goals-vector-concept_1029476-109496.jpg" alt='Task Tracker'/>
            </div>
            <div className='col-md-5 d-flex align-items-center justify-content-center p-0'>
              <form onSubmit={this.onLogin} className='sign-in-form col-sm-7 col-md-12 col-lg-10 col-xl-9 d-flex flex-column align-items-center pt-4'>
                <h1 className='sign-in-heading text-center mb-3'>Login In</h1>
                <FaUserCircle className='user-icon align-self-center' />
                <div className='d-flex flex-column w-100 mb-2'>
                  <label className='label'>Email</label>
                  <input type='text' className='input-field' onBlur={this.validateEmail} onChange={this.getEmail} value={email} placeholder='Email'/>
                  {isEmailEmpty? <span className='error-msg'>Required*</span>: ''}
                </div>
                <div className='d-flex flex-column w-100 mb-3'>
                  <label className='label'>Password</label>
                  <input type='password' className='input-field' onBlur={this.validatePassword} onChange={this.getPassword} value={password} placeholder='Password'/>
                  {isPasswordEmpty? <span className='error-msg'>Required*</span>: ''}
                </div>
                {isAllEmpty? <p className='all-error text-center mb-2'>Please Enter all details</p>: ''}
                {isErrTrue? <p className='error-msg fs-5 text-center mb-2'>{errorMsg}</p>: <button type='submit' className='button align-self-center'>Login In</button>}
                <p className='msg text-center mt-3'>Don't have an Account?<Link className='login-btn' to='/signup'>Sign up</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      )
    }

}


export default LoginPage
