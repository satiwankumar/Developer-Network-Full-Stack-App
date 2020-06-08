import React , {useEffect} from 'react'
import axios from 'axios'
import SetAlert from './alert'
import {GET_PROFILE,GET_REPOS,GET_PROFILES,PROFILE_ERROR,UPDATE_PROFILE, CLEAR_PROFILE, DELETE_ACCOUNT} from './types'

//get current users profile

export const getCurrentProfile=()=>async dispatch=>{
    
  
    try {
        const res = await axios.get('http://localhost:5000/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload : res.data
        })
    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }


  
}


//get all profiles
export const getProfiles=()=>async dispatch=>{
    dispatch({type:CLEAR_PROFILE})
  
    try {
        const res = await axios.get('http://localhost:5000/api/profile/');
        dispatch({
            type:GET_PROFILES,
            payload : res.data
        })
    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }


  
}
//get profile by id
export const getProfileByID=(userid)=>async dispatch=>{
   
  
    try {
        const res = await axios.get(`http://localhost:5000/api/profile/user/${userid}`);
        dispatch({
            type:GET_PROFILE,
            payload : res.data
        })
    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }


  
}





//get github repos
export const getGitHubRepos=(username)=>async dispatch=>{
    
  
    try {
        const res = await axios.get(`http://localhost:5000/api/profile/github/${username}`);
        dispatch({
            type:GET_REPOS,
            payload : res.data
        })
    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }


  
}



//Create or update Profile
export const createProfile = (FormData,history,edit= false)=> async dispatch=>{
    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }


        const res = await axios.post('http://localhost:5000/api/profile',FormData,config)

        dispatch({
            type:GET_PROFILE,
            payload : res.data
        })

        dispatch(SetAlert(edit ? 'Profile Updated':'Profile Created'))
        if(!edit){
            history.push('/dashboard')
        }
    } catch (err) {
        const error = err.response.data.errors
        if(error){
            error.forEach(error=>dispatch(SetAlert(error.msg,'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }
}

//ADD Experience
export const addExperience = (formData,history) =>async dispatch=>{
 
    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }


        const res = await axios.put('http://localhost:5000/api/profile/experience',formData,config)

        dispatch({
            type:UPDATE_PROFILE,
            payload : res.data
        })

        dispatch(SetAlert('Experience Added','success'))
       
            history.push('/dashboard')
        
    } catch (err) {
        console.log(err)
        const error = err.response.data.errors
        if(error){
            error.forEach(error=>dispatch(SetAlert(error.msg,'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            // payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }
}


//ADD Education
export const addEducation = (formData,history) =>async dispatch=>{
 
    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }


        const res = await axios.put('http://localhost:5000/api/profile/education',formData,config)

        dispatch({
            type:UPDATE_PROFILE,
            payload : res.data
        })

        dispatch(SetAlert('Education Added','success'))
       
            history.push('/dashboard')
        
    } catch (err) {
        const error = err.response.data.errors
        if(error){
            error.forEach(error=>dispatch(SetAlert(error.msg,'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }
}
//delete Experience

export const deleteExperience=(id)=>async dispatch=>{

    try {
        const res = await axios.delete(`http://localhost:5000/api/profile/experience/${id}`)
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        
        })
        dispatch(SetAlert('Experience removed','success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }

}

//delete Education

export const deleteEducation=(id)=>async dispatch=>{

    try {
        const res =await  axios.delete(`http://localhost:5000/api/profile/education/${id}`)
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        
        })
        dispatch(SetAlert('Education removed','success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }

}
//delete profile and account

export const deleteAccount=()=>async dispatch=>{

if(window.confirm('Are you sure ? This can Not be undone')){
    try {
        const res =await axios.delete(`http://localhost:5000/api/profile`)
        dispatch({
            type:CLEAR_PROFILE
        })
        dispatch({
            type:DELETE_ACCOUNT
        })
        dispatch(SetAlert(' Account permenantly Deleted','success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.Status}
        })
    }
}

    

}