import React, { useState, useEffect } from "react";
import "./SignupForm.css"

const SignupForm = () => {
  useEffect(() => {
    console.log("signup")
  }, [])
  return <div className="signup-form-container">Signup</div>;
};

export default SignupForm;
