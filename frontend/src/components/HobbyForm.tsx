import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface HobbyFormProps {
  hobby?: {
    id: number;
    name: string;
    active: boolean;
  };
}

const HobbyForm: React.FC<HobbyFormProps> = ({ hobby }) => {
  const [name, setName] = useState(hobby?.name || '');
  const [active, setActive] = useState(hobby?.active || false);
  const navigate = useNavigate();
  const { id } = useParams();  // Get hobby ID from URL if provided

  useEffect(() => {
    const fetchHobby = async () => {
      if (id) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/hobbies/${id}`, {
            headers: { Authorization: ` ${token}` }
          });
          
          // Set the form fields with the hobby details
          setName(response.data.name);
          setActive(response.data.active);
        } catch (error) {
          console.error('Failed to fetch hobby details:', error);
        }
      }
    };

    fetchHobby();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      if (id) {
        // Update existing hobby
        await axios.put(`http://localhost:5000/hobbies/${id}`, { name, active }, {
          headers: { Authorization: token },
        });
      } else {
        // Create new hobby
        await axios.post('http://localhost:5000/hobbies', { name, active }, {
          headers: { Authorization: token },
        });
      }
      navigate('/hobbies');
    } catch (error) {
      console.error('Failed to add or update hobby');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Hobby Name"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={active}
          onChange={e => setActive(e.target.checked)}
        />
        Active
      </label>
      <button type="submit">{id ? 'Update' : 'Add'} Hobby</button>
    </form>
  );
};

export default HobbyForm;
