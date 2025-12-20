import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import login_back from "../../assets/images/login_back.jpg";

const API_URL =import.meta.env.VITE_REACT_APP_API_URL;

const SignupFormWithCode = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_Email: "",
    user_Password: "",
    user_Contact: "",
    user_Address: "",
    user_Access: "",
  });

  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/user/sign-up`, formData);
      if (response.data.success) {
        setMessage("✅ Verification code sent to your email.");
        setStep(2);
      } else {
        setError(response.data.message || "Signup failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error during signup.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/user/verify-email`, { code });
      if (response.data.success) {
        setMessage("🎉 Email verified successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(response.data.message || "Verification failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error during verification.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${login_back})` }}
    >
      <div className="w-full max-w-lg p-8 bg-white border border-primary-100 shadow-2xl rounded-3xl transition-all">
        <h2 className="text-3xl font-bold text-center text-primary-600 mb-6 tracking-tight">
          {step === 1 ? "Create Your Account" : "Email Verification"}
        </h2>

        {message && <div className="text-green-600 font-medium text-sm mb-4">{message}</div>}
        {error && <div className="text-red-600 font-medium text-sm mb-4">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <InputField label="Email" type="email" name="user_Email" value={formData.user_Email} onChange={handleChange} />
            <InputField label="Password" type="password" name="user_Password" value={formData.user_Password} onChange={handleChange} />
            <InputField label="Contact" type="text" name="user_Contact" value={formData.user_Contact} onChange={handleChange} />
            <InputField label="Address" type="text" name="user_Address" value={formData.user_Address} onChange={handleChange} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="user_Access"
                value={formData.user_Access}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
              >
                <option value="Admin">Admin</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Lab">Lab</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-purple-500 to-primary-500 hover:from-primary-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all"
            >
              Register & Send Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter the verification code sent to your email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
              placeholder="e.g., 123456"
            />
            <button
              type="submit"
              className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all"
            >
              Verify Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ✅ Reusable Input Component
const InputField = ({ label, type, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none bg-white"
    />
  </div>
);

export default SignupFormWithCode;
