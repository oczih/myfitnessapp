import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const id = params.get("id");

    if (token && id) {
      const user = { token, name, email, id };
      localStorage.setItem("loggedFitnessappUser", JSON.stringify(user));
      setUser(user);
      navigate("/");
    } else {
      navigate("/", { state: { error: "Login failed" } });
    }
  }, [navigate, setUser]);

  return <div>Logging you in...</div>;
}
