import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/ui/Spinner";

const GuestOnlyRoute = () => {
  const { isAdmin, isTeacher, loading } = useAuth();

  if (loading) return <Spinner fullScreen size="lg" />;

  if (isAdmin) return <Navigate to="/admin" replace />;

  if (isTeacher) return <Navigate to="/teacher" replace />;

  return <Outlet />;
};

export default GuestOnlyRoute;
