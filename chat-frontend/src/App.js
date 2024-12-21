import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import "./assets/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "yet-another-react-lightbox/styles.css";
function App() {
  return (
    <>
      <ToastContainer theme="dark"/>
      <BrowserRouter>
        <AllRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
