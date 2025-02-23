
// app/register/page.js

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    selectedYear: "",
    selectedBranch: "",
  });
  const [financialYears, setFinancialYears] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yearsRes, branchesRes] = await Promise.all([
          fetch("/api/financial-years"),
          fetch("/api/branches"),
        ]);
        const years = await yearsRes.json();
        const branches = await branchesRes.json();
        setFinancialYears(years);
        setBranches(branches);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        router.push("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold mb-6">Register New Branch User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              className="mt-1 w-full px-3 py-2 border rounded-lg"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 border rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Financial Year</label>
            <select
              className="mt-1 w-full px-3 py-2 border rounded-lg"
              value={formData.selectedYear}
              onChange={(e) => setFormData({...formData, selectedYear: e.target.value})}
              required
            >
              <option value="">Select Financial Year</option>
              {financialYears.map((year) => (
                <option key={year.id} value={year.year}>{year.year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Branch</label>
            <select
              className="mt-1 w-full px-3 py-2 border rounded-lg"
              value={formData.selectedBranch}
              onChange={(e) => setFormData({...formData, selectedBranch: e.target.value})}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>{branch.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}