 import {GET_PROFILE,GET_REPOS,GET_PROFILES,PROFILE_ERROR,UPDATE_PROFILE} from '../actions/types'
 const initalState = {
     profile:null,
     profiles:[],
     repos:[],
     loading:true,
     error:{}
 }


 export default function(state=initalState,action){
     console.log("action")
     console.log(action)
     const{type,payload} = action
     switch(type){
      
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return{
                ...state,
                profile:payload,
                loading:false
            }
        case GET_PROFILES:
            return{
                ...state,
                profiles:payload,
                loading:false

            }

        
        case PROFILE_ERROR:
            return{
                ...state,
                error:payload,
                loading:false
            }
        case GET_REPOS:
            return{
                ...state,
                repos:payload,
                loading:false
            }
        default:
            return state
     }

 }