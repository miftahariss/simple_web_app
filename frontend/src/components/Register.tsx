// src/components/Register.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm_password) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/register', {
        first_name,
        last_name,
        age,
        email,
        password,
        confirm_password,
      });
      navigate('/');
    } catch (error) {
      console.error('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <br />
        <input
          type="text"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <br />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          placeholder="Age"
          required
        />
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br />
        <input
          type="password"
          value={confirm_password}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>

      {/* Tambahkan link ke halaman Login */}
      <p>Already have an account? <Link to="/">Login here</Link></p>
    </div>
  );
};

export default Register;
