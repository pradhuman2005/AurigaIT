import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';

function App() {
  const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="members" element={
            <PrivateRoute><Members /></PrivateRoute>
          } />
          <Route path="members/:id" element={
            <PrivateRoute><MemberDetail /></PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
