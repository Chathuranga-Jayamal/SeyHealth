import axios from 'axios';
import {Calendar, Clock, Users, Video, X, Check, Bell} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';

export default function BookingDashboard(){
 const { user } = useAuth(); // expect { userId, ... }
console.log("User from AuthContext: ", user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const patientId = user.role == "patient" && user.id; //Check whether the user is a patient

  const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return {
    formattedDate: date.toLocaleDateString(),     // e.g., 8/20/2025 Convert to proper date format
    formattedTime: date.toLocaleTimeString(),     // e.g., 7:47:05 AM  Convert to proper time format
  };
};


  useEffect(() => {
    if(!patientId) return; // if a doctor exists

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        // Go via gateway (3000) -> proxies to appointment service (4500)
        const url = `http://localhost:3000/api/v1/booking/book/appointments/user/${patientId}`;
        const {data} = await axios.get(url, { withCredentials: true });


        const normalized = (Array.isArray(data) ? data : []).map((r) => { 
        // const { formattedDate:bookedDate, formattedTime: bookedTime } = formatDateTime(r.booked_time);
     
        return{
        aid: r.aid,
        firstName: r.doctorFirstName,
        lastName: r.doctorLastName,
        puid: r.puid,
        tsbookedDate: r.timeSlotDate,
        tsbookedTime: r.timeSlotStartTime,
        status: r.pay_status,
        zoomLink: r.zoom_id,
            
        };    
       
      });

       const paidOnly = normalized.filter(
        (a) => String(a.status).toLowerCase() === "paid"
      );
        setAppointments(paidOnly);
      } catch (err) {
        console.error("Fetch appointments failed:", err);
        setError(
          err?.response?.data?.message ||
          "Unable to load appointments. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);



 return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Appointments</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        {patientId && loading && <p className="text-gray-600">Loading appointments…</p>}
        {patientId && error && <p className="text-red-600">{error}</p>}

        {patientId && !loading && !error && (
          <div className=" rounded-xl shadow-lg border  border-blue-500 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Appointments</h2>
              <p className="text-md text-gray-600">View your scheduled doctor consultations</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Time</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Meeting Link</th>
                  
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((a) => (
                    <tr key={a.aid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{a.aid}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{a.firstName} {a.lastName}
                       
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{a.tsbookedDate} </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-900">{a.tsbookedTime}</td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {a.zoomLink ? (
                          <a 
                            href={a.zoomLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline break-all"
                          >
                            Join Meeting
                          </a>
                        ) : (
                          <span className="text-gray-400">Await meeting Link</span>
                        )}
                      </td>
                     
                    </tr>
                  ))}

                   {appointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}