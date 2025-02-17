


// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
 
//     navigate('/dashboard');
//   };
//   return (
//     <div className="h-[100vh] flex justify-center items-center  bg-cover bg-center" 
//       style={{ backgroundImage: "url('/image/telecommunication-tower-with-beautiful-sky.png')" }}>
      
//       {/* Form Container - 60% of Screen Height */}
//       <div className="w-[30%] h-[84vh] px-10 py-2 bg-gradient-to-t from-[#0c5683] to-white rounded-[18px] shadow-lg border border-[#c3c3c3] flex flex-col justify-between items-center">
        
//         {/* Logo */}
//         <img className="w-[60%] max-h-[100vh] " src="/image/Telecom__2_-removebg-preview 2.png" alt="Logo" />
        
//         {/* Login Title */}
//         <h2 className="text-[#01588e] text-3xl font-bold">Login</h2>
        
//         {/* Form Fields */}
//         <form  onSubmit={handleSubmit} className="w-full flex h-auto flex-col flex-grow justify-between">
//           <div>
//             <label className="text-lg font-semibold text-[#181818]">User Type</label>
//             <select className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded text-[#4b4b4b]">
//               <option>Select your user type</option>
//               <option>Admin</option>
//               <option>Branch</option>
//               <option>Bill Verify</option>
//               <option>Accounts</option>
//               <option>Audit</option>
//               <option>Vendor</option>
//             </select>

//             <label className="text-lg font-semibold text-[#181818] mt-3 block">User ID</label>
//             <input type="text" className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded text-[#4b4b4b]" placeholder="Enter your user ID" />
            
//             <label className="text-lg font-semibold text-[#181818] mt-3 block">Password</label>
//             <input type="password" className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded text-[#4b4b4b]" placeholder="Enter your password" />
//           </div>

//           {/* Remember Me & Login Button */}
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" id="remember" className="w-5 h-4 accent-[#2d8efc]" />
//               <label htmlFor="remember" className="text-lg font-semibold text-[#181818]">Remember me</label>
//             </div>

//             <button type="submit" className="w-full py-2 mb-6 bg-[#013f66] text-white text-lg font-semibold uppercase rounded shadow-md hover:bg-blue-800 transition">
//               Login
//             </button>
//           </div>
//         </form>

//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center p-4" 
      style={{ backgroundImage: "url('/image/telecommunication-tower-with-beautiful-sky.png')" }}>

      {/* Form Container */}
      <div className="w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-6 py-4 bg-gradient-to-t from-[#0c5683] to-white rounded-2xl shadow-lg border border-[#c3c3c3] flex flex-col items-center">

        {/* Logo */}
        <img className="w-40 sm:w-32 md:w-48 max-h-full" src="/image/Telecom__2_-removebg-preview 2.png" alt="Logo" />

        {/* Login Title */}
        <h2 className="text-[#01588e] text-2xl sm:text-xl md:text-3xl font-bold my-4">Login</h2>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="text-base sm:text-sm font-semibold text-[#181818]">User Type</label>
            <select className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded text-[#4b4b4b]">
              <option>Select your user type</option>
              <option>Admin</option>
              <option>Branch</option>
              <option>Bill Verify</option>
              <option>Accounts</option>
              <option>Audit</option>
              <option>Vendor</option>
            </select>

            <label className="text-base sm:text-sm font-semibold text-[#181818] mt-3 block">User ID</label>
            <input type="text" className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded text-[#4b4b4b]" placeholder="Enter your user ID" />

            <label className="text-base sm:text-sm font-semibold text-[#181818] mt-3 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded text-[#4b4b4b]" 
                placeholder="Enter your password" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-2 text-sm text-blue-600 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me & Login Button */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-[#2d8efc]" />
              <label htmlFor="remember" className="text-base sm:text-sm font-semibold text-[#181818]">Remember me</label>
            </div>

            <button type="submit" className="w-full py-2 bg-[#013f66] text-white text-base sm:text-sm font-semibold uppercase rounded shadow-md hover:bg-blue-800 transition">
              Login
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;
