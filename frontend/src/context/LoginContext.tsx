import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useRef,
} from "react";

type ConnectionType = "client" | "business" | "";

interface LoginContextType {
    email: string;
    setEmail: (email: string) => void;

    connection: React.RefObject<ConnectionType>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string>("");
    // const [connection, setConnection] = useState<ConnectionType | "">("");
    const connection = useRef<ConnectionType>("");

    return (
        <LoginContext.Provider value={{ email, setEmail, connection }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = (): LoginContextType => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
};
