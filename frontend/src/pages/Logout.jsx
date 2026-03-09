// src/components/Logout.jsx

const Logout = (navigate) => {
  localStorage.clear();
  navigate("/");   // yoki "/login"
};

export default Logout;