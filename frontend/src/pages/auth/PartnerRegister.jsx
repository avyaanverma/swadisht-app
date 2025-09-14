import '../../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PartnerRegister() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
          const response = await axios.post("http://localhost:3000/api/auth/foodpartner/register", {
              fullName: e.target.fullName.value,
              businessName : e.target.businessName.value,
              contactNumber: e.target.contactNumber.value,
              address: e.target.address.value,
              email: e.target.email.value,
              password: e.target.password.value
          },{
            withCredentials: true
          })
          console.log(response.data);
          navigate("/create-food")

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
  }
  return (
    <div className="auth-container" style={{ background: 'var(--background, #f8f9fa)' }}>
      <div className="auth-card" style={{ maxWidth: 400, width: '100%', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', padding: '2.5rem 2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.01em', marginBottom: '2rem', color: 'var(--primary-color, #119f3a)', textAlign: 'center' }}>
          Register as Food Partner
        </h2>
        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleSubmit}>
          <input name = "businessName" type="text" placeholder="Restaurant Name" className="auth-input" required />
          <input name = "fullName" type="text" placeholder="Owner Name" className="auth-input" required />
          <input name = "email" type="email" placeholder="Business Email" className="auth-input" required />
          <input name = "contactNumber" type="tel" placeholder="Contact Number" className="auth-input" pattern="[0-9]{10,}" required />
          <input name = "address" type="text" placeholder="Restaurant Address" className="auth-input" required />
          <input name = "password" type="password" placeholder="Password" className="auth-input" required />
          <button className="auth-btn" type=" " style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '1.08rem', letterSpacing: '0.01em' }}>
            Register
          </button>
        </form>
        <div className="auth-links" style={{ marginTop: '1.5rem', alignItems: 'center' }}>
          <a href="/partner/login">Already have an account? <span style={{ fontWeight: 600 }}>Sign In</span></a>
          <a href="/user/register">Register as User</a>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .auth-card {
            padding: 1.2rem 0.5rem !important;
            max-width: 98vw !important;
          }
          .auth-input {
            font-size: 0.98rem !important;
          }
        }
      `}</style>
    </div>
  );
}
