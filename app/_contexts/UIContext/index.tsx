import type * as T from "./types";
import { createContext, useCallback, useContext, useReducer, useMemo } from "react";

const initialState: T.UIState = {
  dialogs: {
    walletConnection: false,
    walletAccount: false,
    stakingProcedure: false,
    unstakingProcedure: false,
    redelegatingProcedure: false,
    claimingProcedure: false,
    importHelp: false,
    sendingTransactions: false,
    txSent: false,
  },
};

const UIReducer: T.UIReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_DIALOG":
      return {
        ...state,
        dialogs: { ...state.dialogs, [action.name]: action.value },
      };
    default:
      return state;
  }
};

const UIContext = createContext<T.UIContextProps>({
  ...initialState,
  toggleDialog: () => {},
});

export const UIContextProvider = ({ children }: T.UIContextProviderProps) => {
  const [state, dispatch] = useReducer(UIReducer, initialState);

  const toggleDialog = useCallback<T.UIContextProps["toggleDialog"]>((name, value) => {
    dispatch({ type: "TOGGLE_DIALOG", name, value });
  }, []);

  const values = useMemo(() => ({ dialogs: state.dialogs, toggleDialog }), [state.dialogs, toggleDialog]);

  return <UIContext.Provider value={values}>{children}</UIContext.Provider>;
};

export const useDialog: T.UseDialog = (name) => {
  const { dialogs, toggleDialog } = useContext(UIContext);

  return {
    open: dialogs[name],
    toggleOpen: useCallback((value) => toggleDialog(name, value), []),
  };
};
