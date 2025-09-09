// ✅ DoctorProfile.jsx (components/DoctorProfile.jsx)
import { useState } from 'react';
import { Phone, MapPin, DollarSign } from 'lucide-react';

const DoctorProfile = ({ doctor, onBack, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* <button onClick={onBack} className="mb-4 text-blue-600 hover:text-blue-700 font-medium">
        ← Back to doctors
      </button> */}

      <div className="flex items-start space-x-6 mb-8">
        <img
          src={doctor.image || '/doctor.jpg'}
          alt={`${doctor.first_name} ${doctor.last_name}`}
          className="w-24 h-24 rounded-full object-cover bg-gray-100"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {doctor.first_name} {doctor.last_name}
          </h2>
          <p className="text-blue-600 font-semibold text-lg mb-4">{doctor.spec}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{doctor.phone}</span>
            </div> */}
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 font-semibold">LKR {doctor.price?.toLocaleString()}</span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{doctor.city}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{doctor.street}</span>
            </div> */}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Select Appointment Date</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => onDateSelect(selectedDate)}
            className="mt-7 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Find Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;