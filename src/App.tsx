import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProductFormPage from "./pages/ProductFormPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ScrollToTop from "./components/ScrollToTop";
import ReduxProvider from "@/store/ReduxProvider";
import PublicLayout from "@/components/layouts/PublicLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import AboutFormPage from "./pages/AboutFormPage";
import { AdminUsers } from "./pages/AdminUsers";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import UserAuth from "./pages/UserAuth";
import Packages from "./pages/Packages";
import AdminTickets from "./pages/AdminTickets";

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <ScrollToTop />

            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                <Routes>

                  {/* PUBLIC ROUTES (with footer) */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/properties/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-login" element={<UserAuth />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                  </Route>

                  {/* ADMIN ROUTES (NO footer) */}
                  <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/product-form" element={<ProductFormPage />} />
                      <Route path="/admin/about/edit" element={<AboutFormPage />} />
                      <Route path="/admin-users" element={<AdminUsers />} />
                      <Route path="/admin/tickets" element={<AdminTickets />} />
                    </Route>
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />

                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ReduxProvider>
);

export default App;
