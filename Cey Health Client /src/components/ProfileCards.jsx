// components/Profilecards.jsx
const ProfileCard = ({ doctor, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-md border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition"
    onClick={() => onClick?.(doctor)}
  >
    <div className="flex items-center space-x-4">
      <img
        src={doctor.image || '/doctors.png'}
        alt={`${doctor.first_name} ${doctor.last_name}`}
        className="w-16 h-16 rounded-full object-cover bg-gray-100"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {doctor.first_name} {doctor.last_name}
        </h3>
        <p className="text-blue-600 font-medium">{doctor.spec}</p>
        <p className="text-sm text-gray-500">{doctor.qualification_title}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-green-600">
          LKR {doctor.price?.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

export default ProfileCard;
