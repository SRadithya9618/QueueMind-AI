import {
  createContext,
  useEffect,
  useState,
} from "react";


// CREATE CONTEXT
export const AuthContext =
  createContext();


// PROVIDER COMPONENT
function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(null);

  // LOAD USER FROM STORAGE
  useEffect(() => {

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);

  // LOGIN FUNCTION
  const login = (userData) => {

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

  };

  // LOGOUT FUNCTION
  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
}

export default AuthProvider;