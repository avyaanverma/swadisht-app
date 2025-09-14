import { Navigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserRegister() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const response = await axios.post("http://localhost:3000/api/auth/user/register", {
          
            fullName: e.target.fullName.value,
            email: e.target.email.value,
            password: e.target.password.value
        },{
          withCredentials: true
        })
        console.log(response.data);

    }catch (error) {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.log('Backend error:', error.response.data);
    alert(error.response.data.message || JSON.stringify(error.response.data));
  } else if (error.request) {
    // Request was made but no response
    console.log('No response:', error.request);
  } else {
    // Something else happened
    console.log('Error:', error.message);
  }
}
    /*
    .then((msge)=>{
      console.log(msg);
    }).catch((err)=>{
      console.log(err);
      
    })
    */


    

    navigate("/")
    
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>User Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="fullName" type="text" placeholder="Full Name" className="auth-input" />
          <input name="email" type="email" placeholder="Email" className="auth-input" />
          <input name="password" type="password" placeholder="Password" className="auth-input" />
          <input  type="password" placeholder="Confirm Password" className="auth-input" />
          <button  className="auth-btn" type="submit">Register</button>
        </form>
        <div className="auth-links">
          <a href="/user/login">Already have an account? Sign In</a>
          <a href="/partner/register">Register as Food Partner</a>
        </div>
      </div>
    </div>
  );
}
