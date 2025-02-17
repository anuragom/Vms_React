import React from 'react';
import { FaBuilding, FaPhone, FaEnvelope } from 'react-icons/fa';

const VendorDetails = () => {
  const vendors = [
    { id: 1, name: 'Global Transport Co.', contact: '+1 234 567 890', email: 'contact@globaltransport.com' },
    { id: 2, name: 'Rapid Logistics', contact: '+1 987 654 321', email: 'info@rapidlogistics.com' },
    { id: 3, name: 'Eco Freight Services', contact: '+1 456 789 123', email: 'support@ecofreight.com' },
  ];

  return (
    <div className="mt-12 bg-gradient-to-r from-[#00578e] via-white  p-10 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-center text-black mb-8 drop-shadow-lg">Vendor Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold text-[#00578e] flex items-center gap-3 mb-3">
              <FaBuilding className="text-3xl text-[#da1b11]" /> {vendor.name}
            </h3>
            <p className="text-gray-700 mt-2 flex items-center gap-3 text-lg">
              <FaPhone className="text-green-600" /> {vendor.contact}
            </p>
            <p className="text-gray-700 flex items-center gap-3 text-lg">
              <FaEnvelope className="text-blue-500" /> {vendor.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDetails;