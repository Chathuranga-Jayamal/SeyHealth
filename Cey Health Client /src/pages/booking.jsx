// pages/booking.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/searchbar';
import ProfileCard from '../components/ProfileCards';
import DoctorProfile from '../components/DoctorProfile';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import TimeSlotComponent from '../components/TimeSlotComponent';
import BookingPopup from '../components/PopupBox';
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Search,
  MapPin,
  Star,
  Award,
  UserCheck
} from 'lucide-react';

const Booking = () => {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch Doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/booking/book/doctors/',
        { withCredentials: true }
      );
      if (response.data?.success) {
        setAllDoctors(response.data.data);
        setDoctors(response.data.data);
      } else {
        console.error('Failed to fetch doctors:', response.data?.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  const handleSearch = () => {
    if (!searchQuery.trim()) return setDoctors(allDoctors);
    const query = searchQuery.toLowerCase();
    const filtered = allDoctors.filter(
      (doc) =>
        doc.spec?.toLowerCase().includes(query) ||
        doc.qualification_title?.toLowerCase().includes(query)
    );
    setDoctors(filtered);
  };

  // Handle Doctor Click
  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setView('profile');
  };

  // Back from profile to list
  const handleBack = () => {
    setView('list');
    setSelectedDoctor(null);
  };

  // Handle date selection and fetch timeslots
  const handleDateSelect = async (date) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/booking/book/timeslots/${selectedDoctor.id}`,
        { withCredentials: true }
      );

      const toYMD = (d) => new Date(d).toISOString().split('T')[0];
      const filtered = (res.data || []).filter(slot => toYMD(slot.date) === date);

      setTimeSlots(filtered);
      setSelectedDate(date);
      setView('slots');
    } catch (err) {
      console.error('Error fetching time slots', err);
    }
  };

  const handleBookingSuccess = () => {
    setShowPopup(false);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowPopup(true);
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Doctor</h1>
              <p className="text-gray-600 mt-1">Book appointments with qualified healthcare professionals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' && (
          <>
            {/* Enhanced Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Search Doctors</h2>
              </div>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{allDoctors.length}</p>
                    <p className="text-gray-600">Available Doctors</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                    <p className="text-gray-600">Booking Available</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">Verified</p>
                    <p className="text-gray-600">Qualified Professionals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Cards Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Available Doctors</h2>
                <div className="text-sm text-gray-500">
                  {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No doctors found matching your search.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDoctorClick(doc)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Doctor Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                          <UserCheck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Dr. {doc.first_name} {doc.last_name}
                          </h3>
                          <p className="text-blue-600 font-medium">{doc.spec}</p>
                        </div>
                      </div>

                      {/* Qualification */}
                      <div className="flex items-center space-x-2 mb-3">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{doc.qualification_title}</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">(4.8)</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Medical Center</span>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        View Profile & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === 'profile' && selectedDoctor && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to doctors</span>
              </button>
            </div>
            <DoctorProfile
              doctor={selectedDoctor}
              onBack={handleBack}
              onDateSelect={handleDateSelect}
            />
          </div>
        )}

        {view === 'slots' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={() => setView('profile')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to profile</span>
              </button>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Available Time Slots</h2>
              </div>
              <p className="text-gray-600 mt-1">Select your preferred appointment time</p>
            </div>
            
            <div className="p-6">
              <TimeSlotComponent
                slots={timeSlots}
                date={selectedDate}
                onSlotSelect={handleSlotSelect}
              />
            </div>

            {showPopup && selectedDoctor && selectedSlot && (
              <BookingPopup
                userId={user.id}
                doctor={selectedDoctor}
                slot={selectedSlot}
                onClose={() => setShowPopup(false)}
                onSuccess={handleBookingSuccess}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;