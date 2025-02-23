"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    financialYear: "",
    branch: "",
  });

  useEffect(() => {
    // Fetch branches and financial years
    const fetchData = async () => {
      try {
        const [branchRes, yearRes] = await Promise.all([
          fetch('/api/branches'),
          fetch('/api/financial-years')
        ]);
        const branchData = await branchRes.json();
        const yearData = await yearRes.json();
        setBranches(branchData);
        setYears(yearData);
        setFormData(prev => ({
          ...prev,
          financialYear: yearData[0]?.year || "",
          branch: ""
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        
        // Redirect based on role without the 3-second timeout
        if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl rounded-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image
                  src="/logo.jpg"
                  alt="Company Logo"
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">J&K TRANSPORT</h1>
            <p className="text-cyan-400 text-sm">Transportation That Never Fails</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <select 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                value={formData.financialYear}
                onChange={(e) => setFormData({...formData, financialYear: e.target.value})}
              >
                {years.map((year) => (
                  <option key={year.id} value={year.year} className="bg-gray-800">
                    {year.year}
                  </option>
                ))}
              </select>

              <select 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
              >
                <option value="" className="bg-gray-800">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.name} className="bg-gray-800">
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} Quivonex Solutions
      </footer>
    </div>
  );
}