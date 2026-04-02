import { useAuthStore } from "../store/auth.store";
import Authentication from "../pages/Authentication";
import type { ProtectedRouteProps } from "../types";


const AdminRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuthStore()
    if (!user || user.role !== "admin") {
        return <Authentication />;
    }

    return children;
};

export default AdminRoute