import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Hobby {
  id: number;
  name: string;
  active: boolean;
}

const AddUser = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    email: '',
    password: '',
    confirm_password: '',
    hobby: ''
  });
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axios.get<Hobby[]>('http://localhost:5000/hobbies', {
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
      await axios.post('http://localhost:5000/users/add', formData, {
        headers: { Authorization: ` ${localStorage.getItem('token')}` }
      });
      alert('User added successfully');
      navigate('/users');
    } catch (error) {
      alert('User addition failed');
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
        <br />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <br />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} required />
        <br />
        <select name="hobby" onChange={handleChange} value={formData.hobby}>
          <option value="">Select Hobby</option>
          {hobbies.map(hobby => (
            <option key={hobby.id} value={hobby.id}>{hobby.name}</option>
          ))}
        </select>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddUser;
