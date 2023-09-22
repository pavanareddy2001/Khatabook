const initialState={
    userData:null
}
const userDataReducer=(State=initialState,action)=>{
    switch(action.type){
      case "UPDATE_USER_DATA":
          return {userData:action.payload};
    
       default:
          return State;
  
    }
  }
  export default userDataReducer;