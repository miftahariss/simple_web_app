// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';
import HobbyList from './components/HobbyList';
import HobbyForm from './components/HobbyForm';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/hobbies"
          element={
            <PrivateRoute>
              <HobbyList />
            </PrivateRoute>
          }
        />
        <Route
          path="/hobbies/new"
          element={
            <PrivateRoute>
              <HobbyForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/hobbies/edit/:id"
          element={
            <PrivateRoute>
              <HobbyForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/add"
          element={
            <PrivateRoute>
              <AddUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <PrivateRoute>
              <EditUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
