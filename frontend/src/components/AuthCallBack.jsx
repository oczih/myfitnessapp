import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function completeAuth() {
      try {
        const response = await fetch("http://localhost:3000/auth/session", {
          credentials: "include"
        });
        
        if (!response.ok) throw new Error("Auth failed");
        
        const userData = await response.json();
        console.log("User data from /auth/session:", userData);
        localStorage.setItem("loggedFitnessappUser", JSON.stringify(userData));
        setUser(userData);
        navigate("/");
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login", { state: { error: "Login failed" } });
      }
    }
    completeAuth();
  }, [navigate, setUser]);

  return <div>Loading...</div>;
}