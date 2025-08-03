import { useContext } from "react";
import { Context } from "../context/ContextProvider";
import { Navigate } from "react-router-dom";

type RequireAuthType = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthType) {
  const { user } = useContext(Context);
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}
