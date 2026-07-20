import { decryptUserData, setDataInLocalStorage } from "./local-storage";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = decryptUserData() || null;
    if (storedUser) {
      setAuthUser(storedUser);
    }
  }, []);

  const login = (data) => {
    const defaultUserData = {
      name: data.name,
      token: data.token,
      email: data.email,
      mobile: data.mobile,
      isAdmin: data.isAdmin,
      isCustomerLevelHierarchyCompleted: data.isCustomerLevelHierarchyCompleted,
      isOnBoardingCompleted: data.isOnBoardingCompleted,
      isLeastLevelUser: data.isLeastLevelUser,
      customerName: data.customerName,
      roleName: data.roleName,
      webPages: data.webPages,
      isShowRole: data.isAdmin,
    };

    const userData =
      data.webPages?.reduce((access, page) => {
        switch (page.name) {
          case "Dashboard":
            access.isShowDashboard = true;
            break;
          case "Access":
            access.isShowAccess = true;
            break;
          case "Users":
            access.isShowUsers = true;
            break;
          case "Locations":
            access.isShowLocation = true;
            break;
          case "Trips":
            access.isShowTrips = true;
            break;
          case "Vehicles":
            access.isShowVehicles = true;
            break;
          case "Gateways":
            access.isShowGateways = true;
            break;
          case "Reports":
            access.isShowReports = true;
            break;
          case "UserKeyManagement":
            access.isShowUserKey = true;
            break;
          default:
            break;
        }
        return access;
      }, defaultUserData) || defaultUserData;

    setAuthUser(userData);
    setDataInLocalStorage(userData);
  };

  const logout = () => {
    localStorage.clear();
    setAuthUser(null);
    navigate("/signin");
  };

  const getUser = () => authUser;

  const isUserAuthenticated = () => {
    const token = decryptUserData()?.token || "";
    return token !== "";
  };

  return (
    <AuthContext.Provider
      value={{ isUserAuthenticated, login, logout, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
