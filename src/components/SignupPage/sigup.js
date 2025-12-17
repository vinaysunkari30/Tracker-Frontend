import {Component} from 'react';
import {Link, Redirect} from 'react-router-dom'
import Select from 'react-select';
import countryList from 'react-select-country-list'
import Cookies from 'js-cookie';
import './signup.css'

class SignupPage extends Component{
  state={
    options: countryList().getData(),
    name: '',
    email:'',
    password: '',
		country: null,
    errorMsg: '',
    isErr: false,
    isNameEmpty: false,
    isEmailEmpty: false,
    isPasswordEmpty: false,
    isAllEmpty: false,
  }

  validateName = () => {
    const {name} = this.state
    if(name===""){
      this.setState({
        isNameEmpty: true,
      })
    }
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
  
  getName = (event)=> {
    this.setState({
      name: event.target.value,
      isAllEmpty: false,
      isNameEmpty: false,
      isErr: false,
    })
  }
  getEmail = (event)=> {
    this.setState({
      email: event.target.value,
      isAllEmpty: false,
      isEmailEmpty: false,
      isErr: false,
    })
  }
  getPassword = (event)=> {
    this.setState({
      password: event.target.value,
      isAllEmpty: false,
      isPasswordEmpty: false,
      isErr: false,
    })
  }
	changeHandler = (value) => {
		this.setState({ 
			country: value,
			isCountryEmpty: false,
			isAllEmpty: false,
      isErr: false,
		 });
	}
	validateCountry = () => {
		const {country} = this.state
    if(country===""){
      this.setState({
        isCountryEmpty: true,
      })
    }
	}
  onSignUp = (event) => {
    event.preventDefault()
    const {name, email, password, country, isEmailEmpty, isNameEmpty, isPasswordEmpty} = this.state
    if(name===""&&email===""&&password===""&&country.label===""){
      this.setState({
        isAllEmpty: true,
      })
    }else{
      this.setState({
        name: '',
        email: '',
        password: '',
        country: ''
      })
      this.onPostUser();
    }
    if(isEmailEmpty || isNameEmpty || isPasswordEmpty){
      this.setState({
        isAllEmpty: true,
      })
    }
  }

  onPostUser = async() => {
    const {name, email, password, country} = this.state
    const userDetails = {
      name: name,
      email: email,
      password: password,
      country: country.label,
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://tracker-backend-vg3b.onrender.com/signup', options);
    const jsonData = await response.json()
    const jwtToken = jsonData.jwtToken
    if(response.ok){
      Cookies.set('jwt_token', jwtToken, ({expires: 30}));
      const {history} = this.props
      history.replace('/')
    }else{
      this.setState({
        errorMsg: jsonData.error,
        isErr: true,
      })
    }
  }
  
  render(){
    const {isNameEmpty, isEmailEmpty, isPasswordEmpty,isAllEmpty, isErr, errorMsg, options,name, email,password, country} = this.state
    const jwtToken = Cookies.get('jwt_token');
    if(jwtToken !== undefined){
      return <Redirect to='/'/>
    }

    return(
      <div className='sign-in-container d-flex justify-content-center align-items-center'>
        <div className='container-fluid'>
           <div className='row'>
            <div className='col-md-7 d-none d-md-block p-0'>
              <img className='image' src="https://img.freepik.com/premium-photo/businessman-holding-pencil-complete-checklist-with-tick-marks-business-organization-achievements-goals-vector-concept_1029476-109496.jpg" alt='Task Tracker'/>
            </div> 
            <div className='col-md-5 d-flex justify-content-center align-items-center p-0'>
              <form onSubmit={this.onSignUp} className='sign-in-form col-sm-7 col-md-12 col-lg-10 col-xl-9 d-flex flex-column align-items-center pt-2 p-4'>
                <h1 className='sign-in-heading text-center'>Sign In</h1>
                <div className='d-flex flex-column mb-2 w-100'>
                  <label className='label'>Name</label>
                  <input type='text' className='input-field' onBlur={this.validateName} onChange={this.getName} value={name} placeholder='Name'/>
                  {isNameEmpty? <span className='error-msg'>Required*</span>:''}
                </div>
                <div className='d-flex flex-column mb-2 w-100'>
                  <label className='label'>Email</label>
                  <input type='text' className='input-field' onBlur={this.validateEmail} onChange={this.getEmail} value={email} placeholder='Email'/>
                  {isEmailEmpty? <span className='error-msg'>Required*</span>: ''}
                </div>
                <div className='d-flex flex-column mb-2 w-100'>
                  <label className='label'>Password</label>
                  <input type='password' className='input-field' onBlur={this.validatePassword} onChange={this.getPassword} value={password} placeholder='Password'/>
                  {isPasswordEmpty? <span className='error-msg'>Required*</span>: ''}
                </div>
                <div className='d-flex flex-column mb-3 w-100'>
                  <label className='label'>Country:</label>
                  <Select options={options}
										className='input-select-field'
										value={country}
										onChange={this.changeHandler}
										onBlur={this.validateCountry} 
										isSearchable
										menuPortalTarget={document.body}
										menuPosition="fixed"
										styles={{
											menuPortal: base => ({ ...base, zIndex: 9999 }),
										}}
									/>
                </div>
                {isAllEmpty? <p className='all-error text-center'>Please Enter all details</p>: ''}
                {isErr? <p className='all-error text-center'>{errorMsg}</p>: <button type='submit' className='button align-self-center'>Sign In</button>}
                <p className='msg text-center mt-2'>Already have an Account?<Link className='login-btn' to='/login'>Login</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      )
    }
}


export default SignupPage
