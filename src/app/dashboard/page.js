"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package, ShoppingCart, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    shipments: 200,
    activeOrders: 40,
    completedOrders: 150,
    revenueData: [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 20000 },
      { month: 'Mar', revenue: 25000 },
      { month: 'Apr', revenue: 23000 },
      { month: 'May', revenue: 27000 },
      { month: 'Jun', revenue: 30000 },
    ]
  });

  useEffect(() => {
    // Verify authentication
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-cyan-500" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-between">
      <div className="flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="My Shipments"
            value={userData.shipments}
            icon={Package}
          />
          <StatCard
            title="Active Orders"
            value={userData.activeOrders}
            icon={ShoppingCart}
          />
          <StatCard
            title="Completed Orders"
            value={userData.completedOrders}
            icon={CheckCircle}
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <p className="text-sm text-gray-500">Monthly revenue trends</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData.revenueData}>
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
      </div>
    </div>
  );
}
