import {SET_LIST} from '../actions/user.action'

export default (state = {list: []}, action) => {
  switch (action.type) {
    case SET_LIST:
      return {list: action.payload};
    default:
        return state;
  }
}