import Control from "control";
import React from "react";
import { Route, Routes } from "react-router";
import Present from "./present";
import Main from "./Main";
import logo from "./logo.svg";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/present" element={<Present />} />
            <Route path="/control" element={<Control />} />
        </Routes>
    );
}

export default App;
