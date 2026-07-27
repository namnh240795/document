import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>App Home - Placeholder</div>} />
      <Route path="/settings" element={<div>Settings - Placeholder</div>} />
    </Routes>
  );
}

export default App;
