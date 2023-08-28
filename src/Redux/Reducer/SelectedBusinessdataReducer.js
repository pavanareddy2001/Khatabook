const initialState={
    BusinessId:"",
    BusinessName:"",
}
const selectedBusinessReducer=(State=initialState,action)=>{
  switch(action.type){
    case "UPDATE_BUSINESSDATA":
        return action.payload;
  
     default:
        return State;

  }
}
export default selectedBusinessReducer;