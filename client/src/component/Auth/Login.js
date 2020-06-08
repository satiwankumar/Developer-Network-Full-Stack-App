import React,{useState} from 'react'
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from'prop-types'

import {login} from '../../actions/auth'

const Login = ({login,isAuthenticated}) => {

    const [formData,setFormData] = useState({
      
        email:'',
        password:''
    });

    const {email,password,} = formData
    const onchange=(e)=>{
        console.log(e.target.name)
        console.log(e.target.value)
        setFormData({...formData,[e.target.name]:e.target.value})

    }
    const onSubmit= async(e)=>{
        e.preventDefault()
        console.log("email,password component")
        console.log(email,password)
        login(email,password)
     

    }

    //Redirect if logged int
    if(isAuthenticated){
      return <Redirect to="/dashboard" />
    }
    return (
        <div>
        <h1 className="large text-primary">Log in</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={e=>onSubmit(e)}>
         
          <div className="form-group">
            <input type="email" placeholder="Email Address" value={email} onChange={e=>onchange(e)} name="email" />
            <small className="form-text"
              >This site uses Gravatar so if you want a profile image, use a
              Gravatar email</small
            >
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={e=>onchange(e)}
              minLength="6"
            />
          </div>
          
         
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
  
        </div>
    )
}


Login.propTypes={
 login:PropTypes.func.isRequired,
 isAuthenticated:PropTypes.bool 
}
const mapStateToProps = state =>({
isAuthenticated : state.auth.isAuthenticated
})


export default connect(mapStateToProps,{login})(Login)
