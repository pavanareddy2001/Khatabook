import { combineReducers } from "redux";
import  selectedBusinessReducer from "./Reducer/SelectedBusinessdataReducer"
import userDataReducer from "./Reducer/UserReducer"

const rootReducer=combineReducers({
BusinessData:selectedBusinessReducer,
userDataReducer:userDataReducer,
})

export default rootReducer