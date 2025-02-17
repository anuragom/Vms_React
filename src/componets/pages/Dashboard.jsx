// import React from 'react'

// const Dashboard = () => {
//   return (
//     <div>Dashboard</div>
//   )
// }

// export default Dashboard

import React from 'react';
import { FaCar, FaUsers, FaRoad, FaGasPump, FaTruck, FaMapMarkedAlt } from 'react-icons/fa';

const stats = [
  { id: 1, title: 'Total Vehicles', count: 150, icon: <FaTruck className="text-4xl text-[#00578e]" />, bgColor: 'bg-white' },
  { id: 2, title: 'Active Drivers', count: 87, icon: <FaUsers className="text-4xl text-[#da1b11]" />, bgColor: 'bg-white' },
  { id: 3, title: 'Completed Trips', count: 1_245, icon: <FaRoad className="text-4xl text-green-600" />, bgColor: 'bg-white' },
  { id: 4, title: 'Fuel Consumption', count: '12,345 L', icon: <FaGasPump className="text-4xl text-yellow-500" />, bgColor: 'bg-white' },
  { id: 5, title: 'In Transit', count: 45, icon: <FaCar className="text-4xl text-purple-600" />, bgColor: 'bg-white' },
  { id: 6, title: 'Service Locations', count: 32, icon: <FaMapMarkedAlt className="text-4xl text-indigo-700" />, bgColor: 'bg-white' },
];

const Dashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-r from-[#00578e]   via-white  min-h-screen">
      <h1 className="text-5xl font-extrabold mt-32 text-center text-black mb-10 drop-shadow-lg">VMS Dashboard</h1>

     

      
    </div>
  );
};

export default Dashboard;