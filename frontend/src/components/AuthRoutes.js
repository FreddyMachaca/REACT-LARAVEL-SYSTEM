
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "hooks/useAuth";
function AuthRoutes() {
	const { isLoggedIn } = useAuth();
	if (isLoggedIn) {
		return <Outlet />
	}
	else {
		return <Navigate to="/" replace />;
	}
}

export default AuthRoutes;
