import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useRef,
} from "react";

type ConnectionTypes = "client" | "business" | "";

interface LoginContextType {
    email: string;
    setEmail: (email: string) => void;

    connectionType: React.RefObject<ConnectionTypes>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string>("");

    const connectionType = useRef<ConnectionTypes>("");

    return (
        <LoginContext.Provider value={{ email, setEmail, connectionType }}>
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
