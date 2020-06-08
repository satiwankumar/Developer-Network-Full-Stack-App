 import axios from 'axios'

 import {REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOG_OUT,CLEAR_PROFILE} from './types'
 import SetAlert from '../actions/alert'
 import setAuthToken from '../utils/setAuthToken'
  //load User
export const loadUser =()=>async dispatch=>{
        if(localStorage.token){
            setAuthToken(localStorage.token)
        } 
        try {
            const res = await axios.get('http://localhost:5000/api/auth');
            console.log("res")
            console.log(res)
            
            dispatch({
                type:USER_LOADED,
                payload:res.data
            })
        } catch (error) {
            dispatch({
                type:AUTH_ERROR,
               
            })
            
        }   


}
 //Regsiter User
export const Register =({name,email,password})=>async dispatch=>{
     console.log("params")
     console.log(name,email,password)
     const config ={
         headers:{
             'Content-Type':'application/json'
         }
     }

     const body = JSON.stringify({name,email,password});
     console.log(body)
     try {
         const res = await axios.post('http://localhost:5000/api/users/register',body,config)
         console.log("response")
         console.log(res)
         dispatch({
             type:REGISTER_SUCCESS,
             payload:res.data
         })
     } catch (err) {
         console.log(err)
         const errors=err.response.data.errors
         if(errors){
             errors.forEach(error=>dispatch(SetAlert(error.msg,'danger')))
         }
         dispatch(
             {
                 type:REGISTER_FAIL
             }
         )
     }



    }

    
//Login Users
export const login = (email,password)=> async dispatch=>{
    console.log("params")
    console.log(email,password)
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({email,password})
    console.log("body")
    console.log(body)
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login',body,config)
        console.log("response")
        console.log(res)
        dispatch({
            type:LOGIN_SUCCESS,
            payload:res.data
        })
        dispatch(loadUser())


    } catch (err) {

        console.log(err)
        const errors=err.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(SetAlert(error.msg,'danger')))
        }
        dispatch(
            {
                type:LOGIN_FAIL
            }
        )
    }

}

//log out 
export const logout=()=>dispatch=>{
   dispatch({
       type:CLEAR_PROFILE
   })
    dispatch ({
        type:LOG_OUT
    })
    

}

