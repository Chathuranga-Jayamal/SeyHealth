import axios from 'axios';
import {Calendar, Clock, Users, Video, X, Check, Bell} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';

export default function DoctorDashboard(){
    const { user } = useAuth(); // expect { userId, ... }
    console.log("User from AuthContext: ", user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doctorId = user?.id;

  // meeting-related UI state you already have…
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [meetingDetails, setMeetingDetails] = useState({
    topic: "",
    startTime: "",
    agenda: "",
    duration: "30",
  });
  const[submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const[creatingMeeting, setCreatingMeeting] = useState({});

  const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return {
    formattedDate: date.toLocaleDateString(),     // e.g., 8/20/2025
    formattedTime: date.toLocaleTimeString(),     // e.g., 7:47:05 AM
  };
};


  useEffect(() => {
    if(!doctorId) return; // if a doctor exists

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        // Go via gateway (3000) -> proxies to appointment service (4500)
        const url = `http://localhost:3000/api/v1/booking/book/appointments/user/${doctorId}`;
        const {data} = await axios.get(url, { withCredentials: true });


        const normalized = (Array.isArray(data) ? data : []).map((r) => { 
        // const { formattedDate:bookedDate, formattedTime: bookedTime } = formatDateTime(r.booked_time);
     
        return{
        aid: r.aid,
        firstName: r.patientFirstName,
        lastName: r.patientLastName,
        duid: r.duid,
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
  }, [doctorId]);

  // … your existing handlers (create meeting, etc.) can stay as-is
  const handleCreateMeeting = (appointment) => {
    setSelectedAppointment(appointment);
    setMeetingDetails({
      topic: `Medical Consultation - ${appointment.firstName}`, // or patient name if you include it
      startTime: appointment.tsbookedTime || "",
      agenda: `Medical consultation with patient ${appointment.firstName}`,
      duration: "30",
    });
    setShowModal(true);
  };
const handleMeetingSubmit = async () => {
  if (!meetingDetails.topic || !meetingDetails.startTime || !meetingDetails.agenda) return;

  setSubmitting(true);
  setCreatingMeeting(prev => ({ ...prev, [selectedAppointment.aid]: true }));

  try {
    const formattedStartTime = meetingDetails.startTime.includes("T")
      ? toRFC3339(meetingDetails.startTime)
      : meetingDetails.startTime;

    const meetingPayload = {
      topic: meetingDetails.topic,
      startTime: formattedStartTime,
      agenda: meetingDetails.agenda,
      duration: parseInt(meetingDetails.duration, 10),
      appointmentId: selectedAppointment.aid,
    };

    // 1. Create Zoom Meeting
    const meetingResponse = await axios.post(
      "http://localhost:3000/api/v1/communication/comm/zoom/create",
      meetingPayload,
      { withCredentials: true }
    );
    const zoomLink = meetingResponse?.data?.data?.join_url;
    if (!zoomLink) throw new Error("No Zoom link received");

    // 2. Update appointment with Zoom link (MUST use { link } in body)
    await axios.put(
      `http://localhost:3000/api/v1/booking/book/appointments/updateLink/${selectedAppointment.aid}`,
      { link: zoomLink },
      { withCredentials: true }
    );

    
    setAppointments(prev =>
      prev.map(apt => apt.aid === selectedAppointment.aid ? { ...apt, zoomLink } : apt)
    );

    setNotification({
      type: "success",
      title: "Zoom Link Created Successfully!",
      message: `Meeting created for appointment ${selectedAppointment.aid}`,
    });

    setShowModal(false);
    setSelectedAppointment(null);
    setMeetingDetails({ topic: "", startTime: "", agenda: "", duration: "30" });
    setTimeout(() => setNotification(null), 5000);
  } catch (err) {
    console.error("Meeting creation failed:", err);
    setNotification({
      type: "error",
      title: "Meeting Creation Failed",
      message: err?.response?.data?.message || "Something went wrong.",
    });
    setTimeout(() => setNotification(null), 5000);
  } finally {
    setSubmitting(false);
    setCreatingMeeting(prev => ({ ...prev, [selectedAppointment.aid]: false }));
  }
};


  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setMeetingDetails({
      topic: "",
      startTime: "",
      agenda: "",
      duration: "30",
    });
  };

  // (Render your table using `appointments` from state)
  // TIP: replace your mock array with this state and keep the rest of your JSX.

 return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className=" shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Status</p>
                <p className="text-2xl font-bold text-green-600">100%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* {!doctorId && (
          <p className="text-gray-600">
            Sign in as a doctor to view your appointments.
          </p>
        )} */}
        {doctorId && loading && <p className="text-gray-600">Loading appointments…</p>}
        {doctorId && error && <p className="text-red-600">{error}</p>}

        {doctorId && !loading && !error && (
          <div className=" rounded-xl shadow-lg border  border-blue-500 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Paid Appointments</h2>
              <p className="text-md text-gray-600">Manage your scheduled patient consultations</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Time</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Meeting Link</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                          <span className="text-gray-400">Not created</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleCreateMeeting(a)}
                          disabled={a.zoomLink || creatingMeeting[a.aid]}
                          className={`inline-flex items-center px-4 py-2 text-white rounded-lg ${
                            a.zoomLink || creatingMeeting[a.aid]
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          }`}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          {creatingMeeting[a.aid] ? 'Creating...' : a.zoomLink ? 'Meeting Created' : 'Create Meeting'}
                        </button>
                      </td>
                    </tr>
                  ))}


                   {appointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                        No paid appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Meeting Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Zoom Meeting</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={submitting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={meetingDetails.topic}
                  onChange={(e) => setMeetingDetails({...meetingDetails, topic: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={meetingDetails.startTime}
                  onChange={(e) => setMeetingDetails({...meetingDetails, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select
                  value={meetingDetails.duration}
                  onChange={(e) => setMeetingDetails({...meetingDetails, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={submitting}
                >
                  <option value="10">10 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="15">30 minutes</option>
                  <option value="30">45 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                <textarea
                  value={meetingDetails.agenda}
                  onChange={(e) => setMeetingDetails({...meetingDetails, agenda: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter meeting agenda..."
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMeetingSubmit}
                  disabled={submitting || !meetingDetails.topic || !meetingDetails.startTime || !meetingDetails.agenda}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create Meeting'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className={`rounded-lg shadow-lg border p-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`rounded-full p-2 ${
                  notification.type === 'success' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {notification.type === 'success' ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {notification.title}
                </p>
                <p className={`text-sm mt-1 ${
                  notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`ml-4 ${
                  notification.type === 'success' ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}