import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

export default function UserSignIn() {

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/user/login", {
        email: e.target.email.value,
        password: e.target.password.value
      }, {
        withCredentials: true
      });
      console.log(res);
      navigate("/");
    } catch (err) {
      if (err.response) {
        console.log('Backend error:', err.response.data);
        alert(err.response.data.message || JSON.stringify(err.response.data));
      } else if (err.request) {
        console.log('No response:', err.request);
      } else {
        console.log('Error:', err.message);
      }
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>User Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" className="auth-input" />
          <input name="password" type="password" placeholder="Password" className="auth-input" />
          <button className="auth-btn" type="submit">Sign In</button>
        </form>
        <div className="auth-links">
          <a href="/user/register">Don't have an account? Register</a>
          <a href="/partner/login">Sign in as Food Partner</a>
        </div>
      </div>
    </div>
  );
}
