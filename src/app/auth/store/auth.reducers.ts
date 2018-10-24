import * as AuthActions from './auth.actions';


export interface State {
  token: string;
  authenticated: boolean;
  error: any;
}

const initialState: State = {
  token: null,
  authenticated: false,
  error: null
};

export function authReducers(state = initialState, action: AuthActions.AuthActions) {
  console.log('Auth State: ', state);
  console.log('Auth Action: ', action);
  switch (action.type) {
    case AuthActions.SIGNUP:
    case AuthActions.SIGNIN:
      return {
        ...state,
        authenticated: true
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        token: null,
        authenticated: false
      };
    case AuthActions.SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case AuthActions.AUTH_FAIL:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
