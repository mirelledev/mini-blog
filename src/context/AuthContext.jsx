import { useContext, createContext } from "react";

//esse authContext é pra utilizar um contexto que será utilizado por todo
//app, que no caso é o user
const AuthContext = createContext();

export function AuthProvider({ children, value }) {
  return (
    <AuthContext.Provider value={[value]}>{children}</AuthContext.Provider>
  );
}

export function useAuthValue() {
  return useContext(AuthContext);
}
