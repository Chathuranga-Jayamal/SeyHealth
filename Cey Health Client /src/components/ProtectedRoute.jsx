import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

/**
 * Usage:
 * <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
 *   <Route path="/booking" element={<Booking />} />
 * </Route>
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;  // if the person is a public user
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {   // For the  doctor and the patient
    // Optionally send to a “Not authorized” page
    return <Navigate to="/login" replace />;  
  }

  return <Outlet />;
}
