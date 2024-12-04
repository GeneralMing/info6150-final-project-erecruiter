// src/App.js
import './App.css';
import AppRouter from './routes/routes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router future={{ v7_startTransition: true }}>
        <AppRouter />
      </Router>
    </div>
  );
}

export default App;
