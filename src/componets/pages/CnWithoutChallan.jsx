import React from 'react';

const CnWithoutChallan = () => {
  const cnData = [
    { id: 1, consignmentNo: 'CN12345', sender: 'John Doe', receiver: 'Acme Corp.', date: '2024-02-12', status: 'In Transit' },
    { id: 2, consignmentNo: 'CN67890', sender: 'Jane Smith', receiver: 'Global Traders', date: '2024-02-10', status: 'Delivered' },
    { id: 3, consignmentNo: 'CN54321', sender: 'Mike Johnson', receiver: 'Quick Logistics', date: '2024-02-08', status: 'Pending' },
  ];

  return (
    <div className="mt-12 bg-gradient-to-r from-[#00578e] via-white  p-10 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-center text-black mb-8 drop-shadow-lg">CN Without Challan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-md">
          <thead>
            <tr className="bg-[#00578e] text-white">
              <th className="py-3 px-4">Consignment No</th>
              <th className="py-3 px-4">Sender</th>
              <th className="py-3 px-4">Receiver</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {cnData.map((cn) => (
              <tr key={cn.id} className="hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-4 text-center">{cn.consignmentNo}</td>
                <td className="py-3 px-4 text-center">{cn.sender}</td>
                <td className="py-3 px-4 text-center">{cn.receiver}</td>
                <td className="py-3 px-4 text-center">{cn.date}</td>
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

export default CnWithoutChallan;
