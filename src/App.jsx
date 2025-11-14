import { AuthContextProvider } from "./context/AuthContext";
import { MyRoutes } from "./routes/MyRoutes";
import "./App.css";

function App() {
  return (
    <AuthContextProvider>
      <MyRoutes />
    </AuthContextProvider>
  );
}

export default App;
