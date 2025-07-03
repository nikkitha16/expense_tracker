import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Inputs from "../../components/Inputs/Inputs";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
const SignUp = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {updateUser}= useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    if(!fullName){
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");
    try{
      if (profileImage){
        const imgUploadRes=await uploadImage(profileImage);
        profileImageUrl=imgUploadRes.imageUrl|| "";
      }
      const response= await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl,
      });
       const{token,user}=response.data;
      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
    }catch(err){
      if(err.response&&err.response.data.message){
        setError(err.response.data.message);
      }else{
        setError("Something went wrong.Please try again.")
      }
    }
    
  }
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6 ">
          Join us today by entering you details below
        </p>
        <form onSubmit={handleSubmit}>
          <ProfilePhotoSelector image={profileImage} setImage={setProfileImage}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <Inputs
              type="text"
              placeholder="jone@example.com"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Inputs
              type="password"
              placeholder="Min 8 characters"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          </div>
            {error && (
                  <p className='text-red-500 text-xs pb-2.5'>{error}</p>
                )}
                
                <button type="submit" className='btn-primary'>SIGN UP </button>
                <p className='text-[13px] text-slate-800 mt-3'>Already have an Account?{" "}
                  <Link to="/login" className='text-primary font-medium underline'>Login</Link>
                </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;

