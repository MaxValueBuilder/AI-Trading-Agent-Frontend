import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSignals from "@/components/admin/AdminSignals";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminConfig from "@/components/admin/AdminConfig";
import AdminLogs from "@/components/admin/AdminLogs";
import AdminCMS from "@/components/admin/AdminCMS";

export default function Admin() {

  const { userProfile } = useAuth();
  // Check if user is admin
  if (!userProfile) {
    return <div>Loading...</div>;
  }

  if (userProfile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-crypto-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-crypto-text-primary">Admin Console</h1>
            <p className="text-crypto-text-secondary mt-2">
              Manage signals, users, and system configuration
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-crypto-border text-crypto-text-primary">
              Back to Site
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="signals" className="space-y-4">
            <AdminSignals />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <AdminConfig />
          </TabsContent>

          <TabsContent value="cms" className="space-y-4">
            <AdminCMS />
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <AdminLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

