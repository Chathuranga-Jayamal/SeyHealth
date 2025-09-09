// components/PopUpBox.jsx
import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

// NOTE: This looks like an email, but I'm wiring it exactly as requested.
// Replace with the real HTTPS endpoint URL when you have it.
const APPOINTMENT_ENDPOINT = 'http://localhost:3000/api/v1/booking/book/appointments/';

const BookingPopup = ({ userId, doctor, slot, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!userId || !doctor?.id || !slot?.tsid) return;
    setSubmitting(true);
    try {
      // POST { puid, duid, tsid } as requested
      const result = await axios.post(
        APPOINTMENT_ENDPOINT,
        {
          puid: userId,        // patient user id (current signed-in user)
          duid: doctor.id,     // selected doctor id
          tsid: slot.tsid,     // selected timeslot id
        },
        { withCredentials: true } // keep if your server expects cookies
      );
      const payment_payload = result.data;
      console.log('Appointment created:', payment_payload);
      
        const form = document.createElement('form');
        form.action = "https://sandbox.payhere.lk/pay/checkout";
        form.method = 'POST';

        for (const key in payment_payload) {
            if (payment_payload.hasOwnProperty(key)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = payment_payload[key];
            form.appendChild(input);
        }


    document.body.appendChild(form);
    form.submit();
    // Optionally remove the form after submission
    }


      // Optional: notify parent so it can reset/close, etc.
      onSuccess && onSuccess();
    } catch (err) {
      console.error('Failed to create appointment:', err);
      // You can show a toast/snackbar here if you want.
    } finally {
      setSubmitting(false);
    }
  };

  const doctorName =
    `${doctor.first_name ?? doctor.firstName ?? ''} ${doctor.last_name ?? doctor.lastName ?? ''}`.trim();
  const displayDate = slot?.date ? new Date(slot.date).toLocaleDateString() : '';
  const displayTime = `${slot.start_time ?? slot.startTime} - ${slot.end_time ?? slot.endTime}`;
  const displayPrice = `LKR ${Number(doctor?.price ?? 0).toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
            <input
              type="text"
              disabled
              value={doctorName}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="text"
                disabled
                value={displayDate}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="text"
                disabled
                value={displayTime}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="text"
              disabled
              value={displayPrice}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={submitting}
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? 'Processing…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;
