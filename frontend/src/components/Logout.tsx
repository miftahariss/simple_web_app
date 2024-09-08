import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
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
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
