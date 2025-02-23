"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Users, Package, TrendingUp, ShoppingCart, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    totalShipments: 0,
    totalRevenue: 0,
    activeOrders: 0,
    revenueChange: 12.5,
    userChange: 8.2,
    shipmentsChange: -3.4,
    ordersChange: 15.7,
    revenueData: [
      { month: 'Jan', revenue: 35000 },
      { month: 'Feb', revenue: 45000 },
      { month: 'Mar', revenue: 42000 },
      { month: 'Apr', revenue: 50000 },
      { month: 'May', revenue: 48000 },
      { month: 'Jun', revenue: 55000 },
    ]
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 403) {
            router.push("/dashboard");
            return;
          }
          throw new Error("Failed to fetch admin dashboard data");
        }

        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error("Admin dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-cyan-500" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, change, changeLabel }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="flex items-center mt-2 text-sm">
        {change >= 0 ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
        <span className={`ml-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-gray-500 ml-1">{changeLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Get a comprehensive overview of your business metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={adminData.totalUsers}
            icon={Users}
            change={adminData.userChange}
            changeLabel="from last month"
          />
          
          <StatCard
            title="Total Shipments"
            value={adminData.totalShipments}
            icon={Package}
            change={adminData.shipmentsChange}
            changeLabel="from last month"
          />
          
          <StatCard
            title="Total Revenue"
            value={`₹${adminData.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            change={adminData.revenueChange}
            changeLabel="from last month"
          />
          
          <StatCard
            title="Active Orders"
            value={adminData.activeOrders}
            icon={ShoppingCart}
            change={adminData.ordersChange}
            changeLabel="from last month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Monthly revenue trends</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adminData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={{ fill: '#0EA5E9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Real-time Activity</h2>
              <p className="text-sm text-gray-500">Latest system updates</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-cyan-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">New order received from Mumbai branch</p>
                  <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-cyan-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Shipment delivered to Delhi warehouse</p>
                  <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-cyan-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">New user registration from Bangalore</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

