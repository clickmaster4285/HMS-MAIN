import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

/* Lazy imports */
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const Unauthorized = lazy(() => import("../pages/auth/Unauthorized"));
const Profiles = lazy(() => import("../pages/auth/ProfileModel"));

const AuthRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <Routes>

        {/* Default redirect (optional but recommended) */}
        <Route index element={<Navigate to="login" replace />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="profiles" element={<Profiles />} />

      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
