import React,{useEffect} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import Register from "./Register";
import Dashboard from "./Dashboard";
import FinishPage from "./FinishPage";
import Leaderboard from "./Leaderboard";

import './index.css';
import './fonts.css';


const App = () => {
  useEffect(() => {
    if (window.location.protocol !== 'https:') {
      window.location.href = window.location.href.replace('http', 'https');
    }
  }, []);
  return (
    <Router>
      <div className="App" >
        <Routes>
          <Route index element={<WelcomePage />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/finish" element={<FinishPage/>}/>
          <Route path="/leaderboard" element={<Leaderboard/>}/>



          

        </Routes>
      </div>
    </Router>
  );

};

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";

document.head.appendChild(styleLink);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
