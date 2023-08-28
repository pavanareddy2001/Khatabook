import { combineReducers } from "redux";
import  selectedBusinessReducer from "./Reducer/SelectedBusinessdataReducer"

const rootReducer=combineReducers({
BusinessData:selectedBusinessReducer,
})

export default rootReducer