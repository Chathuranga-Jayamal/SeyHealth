// ✅ TimeSlotComponent.jsx (components/TimeSlotComponent.jsx)
import { Clock } from 'lucide-react';


const TimeSlotComponent = ({ slots, date, onSlotSelect }) => {
return (
<div className="bg-white rounded-xl shadow-lg p-6">
<h3 className="text-lg font-semibold mb-4">
Available Time Slots - {new Date(date).toLocaleDateString()}
</h3>
{slots.length === 0 ? (
<div className="text-center py-8">
<Clock className="mx-auto w-12 h-12 text-gray-400 mb-4" />
<p className="text-gray-500">Not available on this date</p>
</div>
) : (
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
{slots.map((slot, index) => (
<button
key={index}
onClick={() => onSlotSelect(slot)}
className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
>
<Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
<div className="text-sm font-medium">
{slot.start_time} - {slot.end_time}
</div>
</button>
))}
</div>
)}
</div>
);
};


export default TimeSlotComponent;