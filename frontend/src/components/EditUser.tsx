import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Hobby {
    id: number;
    name: string;
    active: boolean;
  }

const EditUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    email: '',
    password: '',
    confirm_password: '',
    hobby: 0
  });
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`, {
          headers: { Authorization: ` ${localStorage.getItem('token')}` }
        });
        setUserData(response.data);
        setFormData({
            ...response.data,
            hobby: response.data.hobby_id || 0
          });
      } catch (error) {
        alert('Failed to fetch user data');
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/hobbies', {
          headers: { Authorization: ` ${localStorage.getItem('token')}` }
        });
        setHobbies(response.data.filter((hobby: Hobby) => hobby.active));
      } catch (error) {
        console.error('Failed to fetch hobbies:', error);
      }
    };
    fetchHobbies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/users/${id}`, formData, {
        headers: { Authorization: ` ${localStorage.getItem('token')}` }
      });
      alert('User updated successfully');
      navigate  ('/users');
    } catch (error) {
      alert('User update failed');
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
        <br />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
        <br />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        <br />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <br />
        <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} />
        <br />
        <select name="hobby" onChange={handleChange} value={formData.hobby}>
          <option value="">Select Hobby</option>
          {hobbies.map(hobby => (
            <option 
              key={hobby.id} 
              value={hobby.id} 
              selected={hobby.id === formData.hobby}
            >
              {hobby.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default EditUser;
