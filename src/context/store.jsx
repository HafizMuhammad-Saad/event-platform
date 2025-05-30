import { createContext, useState } from "react";

const AuthContext = createContext({
    user: true,
    admin: false
    
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    // const [isAdmin, setIsAdmin] = useState(false);
    const [admin, setAdmin] = useState(false);

    return (
        <AuthContext.Provider value={{user, admin}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };