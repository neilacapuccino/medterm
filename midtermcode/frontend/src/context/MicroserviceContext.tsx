// STEP F2 - global state (Context + useReducer), same shape as Discord's PieContext
import { createContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { State, Action } from "../types";

const initialState: State = {
    user: null,
    token: localStorage.getItem("token"), // still logged in after a page refresh
    services: [],
    loading: false,
    error: null,
    selectedEnvironment: "DEVELOPMENT"
};

const microserviceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_AUTH":
      return { ...state, user: action.payload.user, token: action.payload.token, error: null };

    case "LOGOUT":
      return { ...state, user: null, token: null, services: [], error: null };

    case "FETCH_SERVICES_SUCCESS":
      return { ...state, loading: false, services: action.payload };

    case "CREATE_SERVICE_SUCCESS":
      // new service goes on top of the list
      return { ...state, services: [action.payload, ...state.services], error: null };

    case "UPDATE_SERVICE_SUCCESS":
      // replace the one with the same id, keep the others
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        ),
        error: null,
      };

    case "DELETE_SERVICE_SUCCESS":
      // keep every service EXCEPT the deleted id
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
        error: null,
      };

    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }

};

export const MicroserviceContext = createContext<
  { state: State; dispatch: Dispatch<Action> } | undefined
>(undefined);

export const MicroserviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(microserviceReducer, initialState);

  return (
    <MicroserviceContext.Provider value={{ state, dispatch }}>
      {children}
    </MicroserviceContext.Provider>
  );
};
