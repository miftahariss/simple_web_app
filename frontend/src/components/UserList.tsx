// src/components/UserList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/users', {
          headers: { Authorization: token },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/logout', {}, {
        headers: { Authorization: token }
      });
      localStorage.removeItem('token');  // Remove the token from local storage
      navigate('/');                // Redirect the user to login page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div>
      <h1><Link to={`/users`}>User List</Link> || <Link to={`/hobbies`}>Hobby List</Link></h1>
      <button onClick={handleLogout}>Logout</button>
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.first_name + user.last_name}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.age}</td>
              <td><Link to={`/users/edit/${user.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>


      <p>Add User <Link to="/users/add">Add</Link></p>
    </div>
  );
};

export default UserList;
