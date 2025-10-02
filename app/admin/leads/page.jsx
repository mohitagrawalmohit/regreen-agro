"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState([{ field: "name", operator: "contains", value: "" }]);
  const [dateFilter, setDateFilter] = useState({
    operator: "thisMonth",
    startDate: "",
    endDate: "",
  });

  // Fetch Leads (from backend)
  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data.leads || []);
    setFilteredLeads(data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter Logic
  const applyFilters = () => {
    let result = [...leads];

    filters.forEach((filter) => {
      const { field, operator, value } = filter;
      result = result.filter((lead) => {
        const fieldValue = lead[field] ? lead[field].toString().toLowerCase() : "";
        const val = value.toLowerCase();
        switch (operator) {
          case "equals":
            return fieldValue === val;
          case "notEquals":
            return fieldValue !== val;
          case "contains":
            return fieldValue.includes(val);
          case "notContains":
            return !fieldValue.includes(val);
          case "isEmpty":
            return !fieldValue || fieldValue.trim() === "";
          case "isNotEmpty":
            return fieldValue && fieldValue.trim() !== "";
          default:
            return true;
        }
      });
    });

    // Date Filter
    const now = dayjs();
    let start = null;
    let end = null;

    switch (dateFilter.operator) {
      case "thisMonth":
        start = now.startOf("month");
        end = now.endOf("month");
        break;
      case "lastMonth":
        start = now.subtract(1, "month").startOf("month");
        end = now.subtract(1, "month").endOf("month");
        break;
      case "thisWeek":
        start = now.startOf("week");
        end = now.endOf("week");
        break;
      case "lastWeek":
        start = now.subtract(1, "week").startOf("week");
        end = now.subtract(1, "week").endOf("week");
        break;
      case "today":
        start = now.startOf("day");
        end = now.endOf("day");
        break;
      case "between":
        if (dateFilter.startDate && dateFilter.endDate) {
          start = dayjs(dateFilter.startDate);
          end = dayjs(dateFilter.endDate);
        }
        break;
      case "on":
        start = dayjs(dateFilter.startDate);
        end = dayjs(dateFilter.startDate).endOf("day");
        break;
      case "before":
        end = dayjs(dateFilter.startDate);
        break;
      case "after":
        start = dayjs(dateFilter.startDate);
        break;
      default:
        break;
    }

    if (start || end) {
      result = result.filter((lead) => {
        const created = dayjs(lead.created_at);
        if (start && end) return created.isBetween(start, end, "day", "[]");
        if (start && !end) return created.isAfter(start);
        if (!start && end) return created.isBefore(end);
        return true;
      });
    }

    setFilteredLeads(result);
    setSidebarOpen(false);
  };

  const addFilter = () => setFilters([...filters, { field: "name", operator: "contains", value: "" }]);
  const removeFilter = (index) => setFilters(filters.filter((_, i) => i !== index));
  const clearFilters = () => {
    setFilters([{ field: "name", operator: "contains", value: "" }]);
    setDateFilter({ operator: "thisMonth", startDate: "", endDate: "" });
    setFilteredLeads(leads);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 transition-opacity md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 bg-white border-r shadow-lg transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:w-80 w-72 h-full p-5 overflow-y-auto rounded-r-2xl md:rounded-none`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-emerald-700">Filters</h2>
          <button
            className="text-gray-500 text-lg md:hidden hover:text-red-500"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Filter Rows */}
        {filters.map((filter, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50 shadow-sm transition hover:shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Filter {index + 1}</span>
              {filters.length > 1 && (
                <button
                  onClick={() => removeFilter(index)}
                  className="text-red-500 text-xs font-medium"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={filter.field}
              onChange={(e) => {
                const updated = [...filters];
                updated[index].field = e.target.value;
                setFilters(updated);
              }}
              className="border rounded p-2 w-full mb-2 text-sm focus:ring-2 focus:ring-emerald-400"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="state">State</option>
              <option value="machinery">Machinery</option>
              <option value="message">Message</option>
            </select>

            <select
              value={filter.operator}
              onChange={(e) => {
                const updated = [...filters];
                updated[index].operator = e.target.value;
                setFilters(updated);
              }}
              className="border rounded p-2 w-full mb-2 text-sm focus:ring-2 focus:ring-emerald-400"
            >
              <option value="equals">Equals</option>
              <option value="notEquals">Not Equals</option>
              <option value="contains">Contains</option>
              <option value="notContains">Not Contains</option>
              <option value="isEmpty">Is Empty</option>
              <option value="isNotEmpty">Is Not Empty</option>
            </select>

            {filter.operator !== "isEmpty" && filter.operator !== "isNotEmpty" && (
              <input
                type="text"
                placeholder="Value"
                value={filter.value}
                onChange={(e) => {
                  const updated = [...filters];
                  updated[index].value = e.target.value;
                  setFilters(updated);
                }}
                className="border rounded p-2 w-full text-sm focus:ring-2 focus:ring-emerald-400"
              />
            )}
          </div>
        ))}

        <button
          onClick={addFilter}
          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm py-2 rounded mb-5 transition"
        >
          + Add Filter
        </button>

        {/* Date Filter */}
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm mb-5">
          <label className="block text-sm font-medium mb-1 text-gray-700">Created Date</label>
          <select
            value={dateFilter.operator}
            onChange={(e) => setDateFilter({ ...dateFilter, operator: e.target.value })}
            className="border rounded p-2 w-full mb-2 text-sm focus:ring-2 focus:ring-emerald-400"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="today">Today</option>
            <option value="on">On</option>
            <option value="before">Before</option>
            <option value="after">After</option>
            <option value="between">Between</option>
          </select>

          {dateFilter.operator === "between" && (
            <div className="flex gap-2">
              <input
                type="date"
                className="border rounded p-2 flex-1 text-sm"
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, startDate: e.target.value })
                }
              />
              <input
                type="date"
                className="border rounded p-2 flex-1 text-sm"
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, endDate: e.target.value })
                }
              />
            </div>
          )}

          {["on", "before", "after"].includes(dateFilter.operator) && (
            <input
              type="date"
              className="border rounded p-2 w-full text-sm"
              onChange={(e) =>
                setDateFilter({ ...dateFilter, startDate: e.target.value })
              }
            />
          )}
        </div>

        <button
          onClick={applyFilters}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded mb-2 transition"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded transition"
        >
          Clear Filters
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Leads</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-sm font-medium transition"
          >
            ☰ Filters
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-emerald-100 text-gray-700">
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Phone</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">State</th>
                  <th className="border p-2 text-left">Machinery</th>
                  <th className="border p-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition">
                    <td className="border p-2">{lead.name}</td>
                    <td className="border p-2">{lead.phone}</td>
                    <td className="border p-2">{lead.email}</td>
                    <td className="border p-2">{lead.state}</td>
                    <td className="border p-2">{lead.machinery}</td>
                    <td className="border p-2">
                      {dayjs(lead.created_at).format("DD MMM YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <p className="text-center py-8 text-gray-500">No leads found</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
