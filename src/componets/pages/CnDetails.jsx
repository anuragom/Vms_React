import React from 'react';

const CnDetails = () => {
  const cnDetails = [
    { id: 1, consignmentNo: 'CN12345', origin: 'New York', destination: 'Los Angeles', weight: '500 kg', status: 'Delivered' },
    { id: 2, consignmentNo: 'CN67890', origin: 'Chicago', destination: 'Houston', weight: '300 kg', status: 'In Transit' },
    { id: 3, consignmentNo: 'CN54321', origin: 'Seattle', destination: 'Miami', weight: '700 kg', status: 'Pending' },
  ];

  return (
    <div className="mt-12 bg-gradient-to-r from-[#00578e] via-white  p-10 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-center text-black mb-8 drop-shadow-lg">CN Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-md">
          <thead>
            <tr className="bg-[#00578e] text-white">
              <th className="py-3 px-4">Consignment No</th>
              <th className="py-3 px-4">Origin</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Weight</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {cnDetails.map((cn) => (
              <tr key={cn.id} className="hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-4 text-center">{cn.consignmentNo}</td>
                <td className="py-3 px-4 text-center">{cn.origin}</td>
                <td className="py-3 px-4 text-center">{cn.destination}</td>
                <td className="py-3 px-4 text-center">{cn.weight}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-white ${
                    cn.status === 'Delivered' ? 'bg-green-500' : 
                    cn.status === 'In Transit' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}>
                    {cn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CnDetails;
