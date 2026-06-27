import { createContext } from "react";

// shared bag of app state + handlers so extracted screens dont need giant prop lists
export const AppContext = createContext(null);
