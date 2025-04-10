import React from "react"
import ReactDOM from "react-dom/client"
import ActionProgress from "./ActionProgress"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <ActionProgress/>
  </React.StrictMode>
)
