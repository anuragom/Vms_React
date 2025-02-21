


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [userType, setUserType] = useState('');
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     let data = JSON.stringify({
//       "USER_USER_TYPE": userType.toUpperCase(),
//       "USER_USER_ID": userId.toUpperCase(),
//       "USER_PASS_WORD": password
//     });

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://vmsnode.omlogistics.co.in/api/login',
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : data
//     };

//     try {
//       const response = await axios.request(config);
//       if (!response.data.error) {
//         toast.success('Login Successful!', { position: "top-right" });
//         localStorage.setItem('token', response.data.Authorization);
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 2000); // Delay navigation slightly to show toast
//       } else {
//         toast.error(response.data.message || response.data.msg || 'Invalid credentials', { position: "top-right" });
//       }
//     } catch (error) {
//       toast.error('Login Failed! Please try again.', { position: "top-right" });
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-cover bg-center p-4" 
//       style={{ backgroundImage: "url('/image/telecommunication-tower-with-beautiful-sky.png')" }}>
      
//       {/* Toast Container to enable notifications */}
//       <ToastContainer />

//       <div className="w-full max-w-md px-6 py-4 bg-gradient-to-t from-[#0c5683] to-white rounded-2xl shadow-lg border border-[#c3c3c3] flex flex-col items-center">
//         <img className="w-40" src="/image/Telecom__2_-removebg-preview 2.png" alt="Logo" />
//         <h2 className="text-[#01588e] text-2xl font-bold my-4">Login</h2>
        
//         <form onSubmit={handleSubmit} className="w-full  flex flex-col gap-4">
//           <div>
//             <label className="text-base font-semibold text-[#181818]">User Type</label>
//             <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded">
//               <option value="">Select your user type</option>
//               <option value="ADMIN">Admin</option>
//               <option value="BRANCH">Branch</option>
//               <option value="BILL VERIFY">Bill Verify</option>
//               <option value="ACCOUNTS">Accounts</option>
//               <option value="AUDIT">Audit</option>
//               <option value="VENDOR">Vendor</option>
//             </select>

//             <label className="text-base font-semibold text-[#181818] mt-3 block">User ID</label>
//             <input type="text" value={userId} onChange={(e) => setUserId(e.target.value.toUpperCase())} className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded" placeholder="Enter your user ID" />

//             <label className="text-base font-semibold text-[#181818] mt-3 block">Password</label>
//             <div className="relative">
//               <input 
//                 type={showPassword ? "text" : "password"} 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded" 
//                 placeholder="Enter your password" 
//               />
//               <button 
//                 type="button" 
//                 onClick={() => setShowPassword(!showPassword)} 
//                 className="absolute right-3 top-2 text-sm text-blue-600 hover:underline"
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-2">
//               {/* <input type="checkbox" id="remember" className="w-4 h-4 accent-[#2d8efc]" /> */}
//               {/* <label htmlFor="remember" className="text-base font-semibold text-[#181818]">Remember me</label> */}
//             </div>
//             <button type="submit" className="w-full py-2 bg-[#013f66] text-white text-base font-semibold uppercase rounded shadow-md hover:bg-blue-800 transition">
//               Login
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let data = JSON.stringify({
      "USER_USER_TYPE": userType.toUpperCase(),
      "USER_USER_ID": userId.toUpperCase(),
      "USER_PASS_WORD": password
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://vmsnode.omlogistics.co.in/api/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      if (!response.data.error) {
        toast.success('Login Successful!', { position: "top-right" });
        
        // Save token in sessionStorage
        sessionStorage.setItem('token', response.data.Authorization); 
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 700); // Delay navigation slightly to show toast
      } else {
        toast.error(response.data.message || response.data.msg || 'Invalid credentials', { position: "top-right" });
      }
    } catch (error) {
      toast.error('Login Failed! Please try again.', { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center p-4" 
      style={{ backgroundImage: "url('/image/telecommunication-tower-with-beautiful-sky.png')" }}>
      
      <ToastContainer />

      <div className="w-full max-w-md px-6 py-4 bg-gradient-to-t from-[#0c5683] to-white rounded-2xl shadow-lg border border-[#c3c3c3] flex flex-col items-center">
        <img className="w-40" src="/image/Telecom__2_-removebg-preview 2.png" alt="Logo" />
        <h2 className="text-[#01588e] text-2xl font-bold my-4">Login</h2>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="text-base font-semibold text-[#181818]">User Type</label>
            <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded">
              <option value="">Select your user type</option>
              <option value="ADMIN">Admin</option>
              <option value="BRANCH">Branch</option>
              <option value="BILL VERIFY">Bill Verify</option>
              <option value="ACCOUNTS">Accounts</option>
              <option value="AUDIT">Audit</option>
              <option value="VENDOR">Vendor</option>
              <option value="CORDINATOR">Cordinator</option>
            </select>

            <label className="text-base font-semibold text-[#181818] mt-3 block">User ID</label>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value.toUpperCase())} className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded" placeholder="Enter your user ID" />

            <label className="text-base font-semibold text-[#181818] mt-3 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#f9f9f9] border border-[#c7c7c7] rounded" 
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

          <button type="submit" className="w-full py-2 bg-[#013f66] text-white text-base font-semibold uppercase rounded shadow-md hover:bg-blue-800 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
