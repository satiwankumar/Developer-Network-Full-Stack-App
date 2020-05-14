import React,{useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {setAlert} from '../../actions/alert'
const Signup = (props) => {

    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });

    const {name,email,password,password2} = formData
    const onchange=(e)=>{
        console.log(e.target.name)
        console.log(e.target.value)
        setFormData({...formData,[e.target.name]:e.target.value})

    }
    const onSubmit= async(e)=>{
        e.preventDefault()
        if(password!==password2){
           props.setAlert('Password donot match')
        }else{
        //     const newUser = {
        //         name,
        //         email,
        //         password,
            
        //     }
        //     try {
                
        //         const config={
        //             headers:{
        //                 'Content-Type':'application/json'
        //             }
        //         }
        //         const body = JSON.stringify(newUser)
        //         const res = await axios.post('/api/users/register',body,config)
        //         console.log(res.data)

        //     } catch (error) {
        //         console.error(error.response.data)
                
        //     }
        console.log("success")
        }
    }
    return (
        <div>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={e=>onSubmit(e)}>
          <div className="form-group">
            <input type="text" placeholder="Name" name="name" value={name} onChange={e=>onchange(e)} required />
          </div>
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
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={e=>onchange(e)}
              minLength="6"
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
  
        </div>
    )
}

export default connect(null,{setAlert})(Signup)
