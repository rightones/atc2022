import Control from "control";
import React from "react";
import { Route, Routes } from "react-router";
import TestPage from "test";
import TestResultPage from "test/result";
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
            <Route path="/test" element={<TestPage />} />
            <Route path="/test/result" element={<TestResultPage />} />
        </Routes>
    );
}

export default App;
