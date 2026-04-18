// DashboardPage — smart redirect based on the user's role
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

const DashboardPage = () => {
  const { isAdmin, isTechnician, isStaff, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    } else if (isAdmin) {
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } else if (isTechnician || isStaff) {
      navigate(ROUTES.STAFF_DASHBOARD, { replace: true });
    } else {
      navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
    }
  }, [isAdmin, isTechnician, isStaff, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
};

export default DashboardPage;
