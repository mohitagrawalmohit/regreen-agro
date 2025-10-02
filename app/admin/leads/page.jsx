"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });

  const [filters, setFilters] = useState([{ field: "name", operator: "contains", value: "" }]);
  const [dateFilter, setDateFilter] = useState({ operator: "", startDate: "", endDate: "" });
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Fetch Leads
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

  // Sorting Logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    else if (sortConfig.key === key && sortConfig.direction === "desc") direction = null;

    setSortConfig({ key, direction });
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!sortConfig.direction) return 0;
    if (sortConfig.key === "created_at") {
      const av = a.created_at ? dayjs(a.created_at).valueOf() : 0;
      const bv = b.created_at ? dayjs(b.created_at).valueOf() : 0;
      return sortConfig.direction === "asc" ? av - bv : bv - av;
    }
    const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : "";
    const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Date Range Helper
  const getDateRange = ({ operator, startDate, endDate }) => {
    const now = dayjs();
    switch (operator) {
      case "today":
        return [now.startOf("day"), now.endOf("day")];
      case "thisWeek":
        return [now.startOf("isoWeek"), now.endOf("isoWeek")];
      case "lastWeek": {
        const prev = now.subtract(1, "week");
        return [prev.startOf("isoWeek"), prev.endOf("isoWeek")];
      }
      case "thisMonth":
        return [now.startOf("month"), now.endOf("month")];
      case "lastMonth": {
        const prev = now.subtract(1, "month");
        return [prev.startOf("month"), prev.endOf("month")];
      }
      case "on":
        if (!startDate) return [null, null];
        return [dayjs(startDate).startOf("day"), dayjs(startDate).endOf("day")];
      case "before":
        if (!startDate) return [null, null];
        return [null, dayjs(startDate).endOf("day")];
      case "after":
        if (!startDate) return [null, null];
        return [dayjs(startDate).startOf("day"), null];
      case "between":
        if (!startDate || !endDate) return [null, null];
        return [dayjs(startDate).startOf("day"), dayjs(endDate).endOf("day")];
      default:
        return [null, null];
    }
  };

  // Apply Filters (with automatic reset)
  const applyFilters = () => {
    setFilteredLeads([]); // reset previous filters
    let result = [...leads];

    filters.forEach(({ field, operator, value }) => {
      result = result.filter((lead) => {
        const fieldValue = lead[field] ? lead[field].toString().toLowerCase() : "";
        const val = (value || "").toLowerCase();
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

    const [start, end] = getDateRange(dateFilter);
    if (dateFilter.operator && (start || end)) {
      result = result.filter((lead) => {
        const t = lead.created_at ? dayjs(lead.created_at).valueOf() : -Infinity;
        const s = start ? start.valueOf() : null;
        const e = end ? end.valueOf() : null;
        if (s !== null && e !== null) return t >= s && t <= e;
        if (s !== null && e === null) return t >= s;
        if (s === null && e !== null) return t <= e;
        return true;
      });
    }

    setFilteredLeads(result);
    setFiltersApplied(true);
    setSidebarOpen(false);
  };

  const addFilter = () =>
    setFilters([...filters, { field: "name", operator: "contains", value: "" }]);
  const removeFilter = (index) => setFilters(filters.filter((_, i) => i !== index));
  const clearFilters = () => {
    setFilters([{ field: "name", operator: "contains", value: "" }]);
    setDateFilter({ operator: "", startDate: "", endDate: "" });
    setFilteredLeads(leads);
    setFiltersApplied(false);
  };

  // CSV Download
  const downloadCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "Email",
      "State",
      "Machinery",
      "Landing Page URL",
      "Created At",
    ];
    const rows = sortedLeads.map((lead) => [
      lead.name || "",
      lead.phone || "",
      lead.email || "",
      lead.state || "",
      lead.machinery || "",
      lead.landing_page_url || "",
      lead.created_at ? dayjs(lead.created_at).format("DD MMM YYYY, hh:mm A") : "",
    ]);
    const csvContent =
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Leads_${dayjs().format("YYYYMMDD_HHmmss")}.csv`;
    link.click();
  };

  // Helpers
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <span className="opacity-30 ml-1">⇅</span>;
    if (sortConfig.direction === "asc") return <span className="ml-1">▲</span>;
    if (sortConfig.direction === "desc") return <span className="ml-1">▼</span>;
    return <span className="opacity-30 ml-1">⇅</span>;
  };

  const truncateUrl = (url, maxLength = 35) => {
    if (!url) return "-";
    return url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;
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
              <option value="landing_page_url">Landing Page URL</option>
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
            <option value="">All</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
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
                onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
              />
              <input
                type="date"
                className="border rounded p-2 flex-1 text-sm"
                onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
              />
            </div>
          )}

          {["on", "before", "after"].includes(dateFilter.operator) && (
            <input
              type="date"
              className="border rounded p-2 w-full text-sm"
              onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
            />
          )}
        </div>

        <button
          onClick={applyFilters}
          className={`w-full ${
            filtersApplied
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          } font-medium py-2 rounded mb-2 transition`}
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
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Leads</h1>

          <div className="flex gap-3">
            <button
              onClick={downloadCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm font-medium transition"
            >
              ⬇️ Download CSV
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-sm font-medium transition"
            >
              ☰ Filters
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-emerald-100 text-gray-700">
                <tr>
                  {[
                    { key: "name", label: "Name" },
                    { key: "phone", label: "Phone" },
                    { key: "email", label: "Email" },
                    { key: "state", label: "State" },
                    { key: "machinery", label: "Machinery" },
                    { key: "landing_page_url", label: "Landing Page URL" },
                    { key: "created_at", label: "Created At" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="border p-2 text-left cursor-pointer select-none hover:bg-emerald-200 transition"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {renderSortIcon(col.key)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition">
                    <td className="border p-2">{lead.name}</td>
                    <td className="border p-2">{lead.phone}</td>
                    <td className="border p-2">{lead.email}</td>
                    <td className="border p-2">{lead.state}</td>
                    <td className="border p-2">{lead.machinery}</td>
                    <td className="border p-2 text-blue-600 underline" title={lead.landing_page_url}>
                      {lead.landing_page_url ? (
                        <a href={lead.landing_page_url} target="_blank" rel="noreferrer">
                          {truncateUrl(lead.landing_page_url)}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border p-2">
                      {lead.created_at
                        ? dayjs(lead.created_at).format("DD MMM YYYY, hh:mm A")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedLeads.length === 0 && (
              <p className="text-center py-8 text-gray-500">No leads found</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
