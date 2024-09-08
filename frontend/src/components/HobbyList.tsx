// src/components/HobbyList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Hobby {
  id: number;
  name: string;
  active: boolean;
}

const HobbyList = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/hobbies', {
          headers: { Authorization: token },
        });
        setHobbies(response.data);
      } catch (error) {
        console.error('Failed to fetch hobbies');
      }
    };

    fetchHobbies();
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
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {hobbies.map(hobby => (
            <tr key={hobby.name}>
              <td>{hobby.name}</td>
              <td>{hobby.active ? 'Active' : 'Inactive'}</td>
              <td><Link to={`/hobbies/edit/${hobby.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>


      <p>Add Hobby <Link to="/hobbies/new">Add</Link></p>
    </div>
  );
};

export default HobbyList;
