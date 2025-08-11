import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import About from "@/pages/about";
import WhyUs from "@/pages/why-us";
import Services from "@/pages/services";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminBlogCreate from "@/pages/admin-blog-create";
import AdminBlogEdit from "@/pages/admin-blog-edit";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/why-us" component={WhyUs} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      
      {/* Admin Routes */}
      <AdminAuthProvider>
        <Route path="/admin/login" component={AdminLogin} />
        <AdminProtectedRoute 
          path="/admin-dashboard" 
          component={AdminDashboard} 
        />
        <AdminProtectedRoute 
          path="/admin-blog-create" 
          component={AdminBlogCreate} 
        />
        <AdminProtectedRoute 
          path="/admin-blog-edit/:id" 
          component={AdminBlogEdit} 
        />
      </AdminAuthProvider>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
