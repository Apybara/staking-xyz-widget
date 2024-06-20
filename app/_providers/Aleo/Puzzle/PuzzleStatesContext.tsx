import type * as T from "./types";
import { createContext, useContext, useReducer } from "react";

const PuzzleStatesContext = createContext({} as T.PuzzleStatesContext);

export const usePuzzleStates = () => useContext(PuzzleStatesContext);

export const PuzzleStatesProvider = ({ children }: T.PuzzleStatesProviderProps) => {
  const [states, setStates] = useReducer<T.UsePuzzleStatesReducer>(
    (prev, next) => ({ ...prev, ...next }),
    initialStates,
  );

  return (
    <PuzzleStatesContext.Provider
      value={{
        ...states,
        setStates,
      }}
    >
      {children}
    </PuzzleStatesContext.Provider>
  );
};

const initialStates: T.PuzzleStatesContextStates = {
  connectionStatus: "disconnected",
  setStates: () => {},
};
