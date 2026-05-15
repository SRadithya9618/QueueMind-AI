import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
  import AIPredictions from "../pages/AIPredictions";
  import Register from "../pages/Register";
  import Login from "../pages/Login";
  import CustomerDashboard from "../pages/CustomerDashboard";
  import OwnerDashboard from "../pages/OwnerDashboard";
  import Home from "../pages/Home";
  import NotFound from "../pages/NotFound";
  import MyQueues from "../pages/MyQueues";
  import ProtectedRoute from "../components/ProtectedRoute";
  import Placeholder from "../pages/Placeholder";
  import AddQueue from "../pages/AddQueue";
  import LiveQueue from "../pages/LiveQueue";
  import Customers from "../pages/Customers";
  import OwnerAnalytics from "../pages/OwnerAnalytics";
  import QueueHistory from "../pages/QueueHistory";
  function AppRoutes() {
  
    return (
  
      <BrowserRouter>
  
        <Routes>  
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/owner"
            element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-queues"
            element={
              <ProtectedRoute>
                <MyQueues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nearby-businesses"
            element={<ProtectedRoute><Placeholder title="Nearby Businesses" /></ProtectedRoute>}
          />
          <Route
            path="/ai-predictions"
            element={<ProtectedRoute><AIPredictions title="AI Predictions" /></ProtectedRoute>}
          />
          <Route
            path="/notifications"
            element={<ProtectedRoute><Placeholder title="Notifications" /></ProtectedRoute>}
          />
          <Route
            path="/customer/queue-history"
            element={<ProtectedRoute><QueueHistory /></ProtectedRoute>}
          />
          <Route
            path="/live-queue"
            element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/customers"
            element={<ProtectedRoute><Placeholder title="Customers" /></ProtectedRoute>}
          />
          <Route
            path="/analytics"
            element={<ProtectedRoute><Placeholder title="Analytics" /></ProtectedRoute>}
          />
          <Route
            path="/owner/live-queue"
            element={<ProtectedRoute><LiveQueue /></ProtectedRoute>}
          />
          <Route
            path="/owner/customers"
            element={<ProtectedRoute><Customers /></ProtectedRoute>}
          />
          <Route
            path="/owner/analytics"
            element={<ProtectedRoute><OwnerAnalytics /></ProtectedRoute>}
          />
          <Route
            path="/owner/add-queue"
            element={<AddQueue />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
  
      </BrowserRouter>
  
    );
  }
  
  export default AppRoutes;