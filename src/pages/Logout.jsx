
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    toast.success("You have been logged out successfully.", {
    });

   
    setTimeout(() => {
      navigate("/"); 
    }, 2000);
  };

 
  React.useEffect(() => {
    handleLogout();
  }, []); 

  return (
    <>
      <ToastContainer />
    </>
  );
};

export default Logout;
