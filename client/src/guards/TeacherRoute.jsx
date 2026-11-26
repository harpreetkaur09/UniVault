import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/ui/Spinner";

const TeacherRoute = () => {
  const { isTeacher, isAdmin, loading } = useAuth();

  if (loading) return <Spinner fullScreen size="lg" />;

  if (isAdmin) return <Navigate to="/admin" replace />;

  if (!isTeacher) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default TeacherRoute;
