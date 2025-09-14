import '../../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function PartnerSignIn() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/foodpartner/login", {
        email: e.target.email.value,
        password: e.target.password.value
      }, {
        withCredentials: true
      });
      console.log(res.data.user["id"]);
      const id = res.data.user["id"]
      navigate(`/store/${id}`);
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
        <h2>Food Partner Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input name='email' type="email" placeholder="Email" className="auth-input" />
          <input name='password' type="password" placeholder="Password" className="auth-input" />
          <button className="auth-btn" type="submit">Sign In</button>
        </form>
        <div className="auth-links">
          <a href="/partner/register">Don't have an account? Register</a>
          <a href="/user/login">Sign in as User</a>
        </div>
      </div>
    </div>
  );
}
