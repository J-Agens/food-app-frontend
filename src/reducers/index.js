import { combineReducers } from "redux";
import usersReducer from './usersReducer'

const rootReducer = combineReducers({
  usersReducer // { usersReducer: usersReducer }
})

// const reducer = (state = {init: 'inital state'}, action ) = {
//   switch action.type:
//     case 'login':
//       return state
//     default:
//       return state

// }  WHAT OUR CURRENT SATTE WOUDL LOOK LIKE = {init: 'initial state'}
export default rootReducer
