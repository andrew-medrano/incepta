
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatResults from "./pages/ChatResults";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/chat" element={<ChatResults />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
