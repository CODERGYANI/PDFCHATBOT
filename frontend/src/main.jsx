import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import Login from "./components/Login"
import Register from "./components/Register"
import Chat from "./components/chat"
import History from "./components/History"
import Upload from "./components/Upload"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 👇 Set basename for GitHub Pages */}
    <BrowserRouter basename="/PDFCHATBOT">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/history" element={<History />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
