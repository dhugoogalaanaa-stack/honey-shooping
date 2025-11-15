import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Dashboard = ({ token }) => {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesTrend: [],
    recentOrders: [],
    topSoldItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );
  const [timeRange, setTimeRange] = useState("This Year");
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async (
    range = timeRange,
    startDate = "",
    endDate = "",
    updateOnlySalesTrend = false
  ) => {
    try {
      // Only set loading for the entire dashboard on initial load
      if (!updateOnlySalesTrend) {
        setLoading(true);
      } else {
        setChartLoading(true);
      }

      // Build query parameters
      let queryParams = `range=${range}`;
      if (range === "Custom Range" && startDate && endDate) {
        queryParams += `&startDate=${startDate}&endDate=${endDate}`;
      }

      if (updateOnlySalesTrend) {
        // Only fetch sales trend data when changing time range
        try {
          const salesTrendRes = await axios.get(
            `${backendUrl}/api/order/sales-trend?${queryParams}`,
            {
              headers: { token },
            }
          );
          setDashboardData((prevData) => ({
            ...prevData,
            salesTrend: salesTrendRes.data.trend || [],
          }));
        } catch (error) {
          console.error("Error fetching sales trend:", error);
          setDashboardData((prevData) => ({
            ...prevData,
            salesTrend: [],
          }));
          toast.error("Failed to load sales trend data");
        }
      } else {
        // Create an object to store all the data
        const data = {
          totalCustomers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalSales: 0,
          salesTrend: [],
          recentOrders: [],
          topSoldItems: [],
        };

        // Try to fetch each endpoint individually and handle errors
        try {
          const customersRes = await axios.get(`${backendUrl}/api/user/count`, {
            headers: { token },
          });
          data.totalCustomers = customersRes.data.count || 0;
        } catch (error) {
          console.error("Error fetching customers count:", error);
          data.totalCustomers = 0;
        }

        try {
          const productsRes = await axios.get(
            `${backendUrl}/api/product/count`,
            {
              headers: { token },
            }
          );
          data.totalProducts = productsRes.data.count || 0;
        } catch (error) {
          console.error("Error fetching products count:", error);
          data.totalProducts = 0;
        }

        try {
          const ordersRes = await axios.get(`${backendUrl}/api/order/stats`, {
            headers: { token },
          });
          data.totalOrders = ordersRes.data.totalOrders || 0;
          data.totalSales = ordersRes.data.totalSales || 0;
        } catch (error) {
          console.error("Error fetching order stats:", error);
          data.totalOrders = 0;
          data.totalSales = 0;
        }

        try {
          // Pass time range as query parameter
          const salesTrendRes = await axios.get(
            `${backendUrl}/api/order/sales-trend?${queryParams}`,
            {
              headers: { token },
            }
          );
          data.salesTrend = salesTrendRes.data.trend || [];
        } catch (error) {
          console.error("Error fetching sales trend:", error);
          data.salesTrend = [];
        }

        try {
          const recentOrdersRes = await axios.get(
            `${backendUrl}/api/order/recent`,
            {
              headers: { token },
            }
          );
          data.recentOrders = recentOrdersRes.data.orders || [];
        } catch (error) {
          console.error("Error fetching recent orders:", error);
          data.recentOrders = [];
        }

        try {
          const topSoldRes = await axios.get(
            `${backendUrl}/api/order/top-sold`,
            {
              headers: { token },
            }
          );
          data.topSoldItems = topSoldRes.data.items || [];
        } catch (error) {
          console.error("Error fetching top sold items:", error);
          data.topSoldItems = [];
        }

        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      if (!updateOnlySalesTrend) {
        setLoading(false);
      } else {
        setChartLoading(false);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Handle time range change
  const handleTimeRangeChange = (range, event) => {
    if (event) {
      event.preventDefault(); // Prevent default form submission
    }
    setTimeRange(range);

    if (range === "Custom Range") {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      // Pass true to indicate we're only updating sales trend
      fetchDashboardData(range, "", "", true);
    }
  };

  // Handle custom date range submission
  const handleCustomRangeSubmit = () => {
    if (!customRange.startDate || !customRange.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(customRange.startDate) > new Date(customRange.endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    // Pass true to indicate we're only updating sales trend
    fetchDashboardData(
      "Custom Range",
      customRange.startDate,
      customRange.endDate,
      true
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${amount?.toLocaleString()}${currency}`;
  };

  // Format X-axis labels based on time range
  const formatXAxisLabel = (label) => {
    if (timeRange === "Today") {
      // Format hour label (e.g., "14:00")
      const [date, time] = label.split(" ");
      return time ? time.substring(0, 5) : label;
    } else if (timeRange === "This Week" || timeRange === "This Month") {
      // Format date label (e.g., "Jan 01")
      const date = new Date(label);
      return isNaN(date.getTime())
        ? label
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
    } else if (timeRange === "This Year") {
      // Format month label (e.g., "Jan 2023")
      const [year, month] = label.split("-");
      const date = new Date(year, month - 1);
      return isNaN(date.getTime())
        ? label
        : date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
    } else if (timeRange === "All Time") {
      // Format year label (e.g., "2023")
      return label;
    } else if (timeRange === "Custom Range") {
      // Try to parse as date first, then fallback to the original label
      const date = new Date(label);
      return isNaN(date.getTime()) ? label : date.toLocaleDateString();
    }
    return label;
  };

  // Format tooltip based on time range
  const formatTooltipLabel = (label) => {
    if (timeRange === "Today") {
      return `Hour: ${label}`;
    } else if (timeRange === "This Week" || timeRange === "This Month") {
      const date = new Date(label);
      return isNaN(date.getTime())
        ? label
        : `Date: ${date.toLocaleDateString()}`;
    } else if (timeRange === "This Year") {
      return `Month: ${label}`;
    } else if (timeRange === "All Time") {
      return `Year: ${label}`;
    } else if (timeRange === "Custom Range") {
      const date = new Date(label);
      return isNaN(date.getTime())
        ? label
        : `Date: ${date.toLocaleDateString()}`;
    }
    return label;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#d1fae5";
      case "Cancelled":
        return "#fee2e2";
      case "Order Placed":
        return "#dbeafe";
      case "Processing":
        return "#fef3c7";
      case "Shipped":
        return "#fce7f3";
      default:
        return "#f3f4f6";
    }
  };

  // Get status text color
  const getStatusTextColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#065f46";
      case "Cancelled":
        return "#991b1b";
      case "Order Placed":
        return "#1e40af";
      case "Processing":
        return "#92400e";
      case "Shipped":
        return "#9d174d";
      default:
        return "#374151";
    }
  };

  // Get abbreviated status for mobile view
  const getAbbreviatedStatus = (status) => {
    switch (status) {
      case "Delivered":
        return "Delivered";
      case "Cancelled":
        return "Cancelled";
      case "Order Placed":
        return "Ordered";
      case "Processing":
        return "Processing";
      case "Shipped":
        return "Shipped";
      default:
        return status;
    }
  };

  // Responsive grid columns for KPI cards
  const getKpiGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2, 1fr)";
    return "repeat(4, 1fr)";
  };

  // Responsive grid columns for bottom section
  const getBottomGridColumns = () => {
    if (isMobile) return "1fr";
    return "2fr 1fr";
  };

  if (loading) {
    return (
      <div
        style={{
          padding: isMobile ? "16px" : "24px",
          backgroundColor: "#fff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? "16px" : "24px",
        backgroundColor: "#fff",
        minHeight: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: isMobile ? "20px" : "30px" }}>
        <h1
          style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "600",
            color: "#2C2C2C",
            margin: 0,
          }}
        >
          Dashboard Overview
        </h1>
        <p
          style={{
            fontSize: isMobile ? "12px" : "14px",
            color: "#6b7280",
            margin: "4px 0 0 0",
          }}
        >
          Key metrics and performance indicators
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: getKpiGridColumns(),
          gap: isMobile ? "12px" : "20px",
          marginBottom: isMobile ? "20px" : "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: isMobile ? "16px" : "20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "15px",
            border: "1px solid #F5F5F5",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              width: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              backgroundColor: "#F5F5F5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "18px" : "20px",
              color: "#1E3A5F",
            }}
          >
            👥
          </div>
          <div>
            <div
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "bold",
                color: "#2C2C2C",
              }}
            >
              {dashboardData.totalCustomers.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: isMobile ? "12px" : "14px",
                color: "#6b7280",
              }}
            >
              Total Customers
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: isMobile ? "16px" : "20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "15px",
            border: "1px solid #F5F5F5",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              width: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              backgroundColor: "#F5F5F5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "18px" : "20px",
              color: "#1E3A5F",
            }}
          >
            🛍️
          </div>
          <div>
            <div
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "bold",
                color: "#2C2C2C",
              }}
            >
              {dashboardData.totalProducts.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: isMobile ? "12px" : "14px",
                color: "#6b7280",
              }}
            >
              Total Products
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: isMobile ? "16px" : "20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "15px",
            border: "1px solid #F5F5F5",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              width: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              backgroundColor: "#F5F5F5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "18px" : "20px",
              color: "#1E3A5F",
            }}
          >
            📋
          </div>
          <div>
            <div
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "bold",
                color: "#2C2C2C",
              }}
            >
              {dashboardData.totalOrders.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: isMobile ? "12px" : "14px",
                color: "#6b7280",
              }}
            >
              Total Orders
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: isMobile ? "16px" : "20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "15px",
            border: "1px solid #F5F5F5",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              width: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              backgroundColor: "#F5F5F5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "18px" : "20px",
              color: "#1E3A5F",
            }}
          >
            📈
          </div>
          <div>
            <div
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "bold",
                color: "#2C2C2C",
              }}
            >
              {formatCurrency(dashboardData.totalSales)}
            </div>
            <div
              style={{
                fontSize: isMobile ? "12px" : "14px",
                color: "#6b7280",
              }}
            >
              Total Sales
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: isMobile ? "16px" : "20px",
          marginBottom: isMobile ? "20px" : "30px",
        }}
      >
        {/* Sales Trend Chart */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: isMobile ? "16px" : "24px",
            borderRadius: "8px",
            border: "1px solid #F5F5F5",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              marginBottom: "20px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "10px" : "0",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "600",
                margin: 0,
                color: "#2C2C2C",
              }}
            >
              Sales Trend
            </h3>

            {/* Time Range Selector */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#1E3A5F",
                    borderRadius: "50%",
                  }}
                ></div>
                <span style={{ color: "#6b7280" }}>Sales</span>
              </div>

              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <select
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value, e)}
                  style={{
                    padding: isMobile
                      ? "6px 28px 6px 10px"
                      : "8px 32px 8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                    color: "#374151",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    appearance: "none",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease",
                    minWidth: isMobile ? "120px" : "140px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#9CA3AF";
                    e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow =
                      "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                  <option value="All Time">All Time</option>
                  <option value="Custom Range">Custom Range</option>
                </select>

                {/* Custom dropdown arrow */}
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    width: "0",
                    height: "0",
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid #6B7280",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Custom Date Range Inputs */}
          {showCustomRange && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: isMobile ? "wrap" : "nowrap",
              }}
            >
              <input
                type="date"
                value={customRange.startDate}
                onChange={(e) =>
                  setCustomRange({ ...customRange, startDate: e.target.value })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              />
              <span style={{ color: "#6b7280" }}>to</span>
              <input
                type="date"
                value={customRange.endDate}
                onChange={(e) =>
                  setCustomRange({ ...customRange, endDate: e.target.value })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent default button behavior
                  handleCustomRangeSubmit();
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#1E3A5F",
                  color: "white",
                  fontSize: isMobile ? "12px" : "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Apply
              </button>
            </div>
          )}

          <div style={{ height: isMobile ? "200px" : "250px" }}>
            {chartLoading ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                Loading chart data...
              </div>
            ) : dashboardData.salesTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatXAxisLabel}
                    style={{
                      fontSize: isMobile ? "10px" : "12px",
                      fill: "#6b7280",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    style={{
                      fontSize: isMobile ? "10px" : "12px",
                      fill: "#6b7280",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [`${formatCurrency(value)}`, "Sales"]}
                    labelFormatter={formatTooltipLabel}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #F5F5F5",
                      borderRadius: "6px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#1E3A5F"
                    strokeWidth={3}
                    dot={{
                      fill: "#1E3A5F",
                      strokeWidth: 2,
                      r: isMobile ? 3 : 4,
                    }}
                    activeDot={{
                      r: isMobile ? 5 : 6,
                      fill: "#1E3A5F",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                No sales data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Tables Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: getBottomGridColumns(),
          gap: isMobile ? "16px" : "20px",
        }}
      >
        {/* All Orders Table */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: isMobile ? "16px" : "24px",
            borderRadius: "8px",
            border: "1px solid #F5F5F5",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "#2C2C2C",
            }}
          >
            Recent Orders
          </h3>
          <div style={{ overflowX: "auto" }}>
            {dashboardData.recentOrders.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: isMobile ? "600px" : "auto",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #F5F5F5" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: isMobile ? "8px 6px" : "12px 8px",
                        fontSize: isMobile ? "12px" : "14px",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}
                    >
                      Product
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: isMobile ? "8px 6px" : "12px 8px",
                        fontSize: isMobile ? "12px" : "14px",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}
                    >
                      Order ID
                    </th>
                    {!isMobile && (
                      <th
                        style={{
                          textAlign: "left",
                          padding: isMobile ? "8px 6px" : "12px 8px",
                          fontSize: isMobile ? "12px" : "14px",
                          fontWeight: "500",
                          color: "#6b7280",
                        }}
                      >
                        Customer
                      </th>
                    )}
                    {!isMobile && (
                      <th
                        style={{
                          textAlign: "left",
                          padding: isMobile ? "8px 6px" : "12px 8px",
                          fontSize: isMobile ? "12px" : "14px",
                          fontWeight: "500",
                          color: "#6b7280",
                        }}
                      >
                        Date
                      </th>
                    )}
                    <th
                      style={{
                        textAlign: "left",
                        padding: isMobile ? "8px 6px" : "12px 8px",
                        fontSize: isMobile ? "12px" : "14px",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: isMobile ? "8px 6px" : "12px 8px",
                        fontSize: isMobile ? "12px" : "14px",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.map((order, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #F5F5F5" }}
                    >
                      <td
                        style={{
                          padding: isMobile ? "8px 6px" : "12px 8px",
                          fontSize: isMobile ? "18px" : "20px",
                        }}
                      >
                        {order.items &&
                        order.items[0] &&
                        order.items[0].image ? (
                          <img
                            src={order.items[0].image}
                            alt="Product"
                            style={{
                              width: isMobile ? "24px" : "30px",
                              height: isMobile ? "24px" : "30px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          "🛍️"
                        )}
                      </td>
                      <td
                        style={{
                          padding: isMobile ? "8px 6px" : "12px 8px",
                          fontSize: isMobile ? "12px" : "14px",
                          color: "#2C2C2C",
                        }}
                      >
                        #{order._id?.slice(-6).toUpperCase() || "N/A"}
                      </td>
                      {!isMobile && (
                        <td
                          style={{
                            padding: isMobile ? "8px 6px" : "12px 8px",
                            fontSize: isMobile ? "12px" : "14px",
                            color: "#2C2C2C",
                          }}
                        >
                          {order.userId?.name || "N/A"}
                        </td>
                      )}
                      {!isMobile && (
                        <td
                          style={{
                            padding: isMobile ? "8px 6px" : "12px 8px",
                            fontSize: isMobile ? "12px" : "14px",
                            color: "#6b7280",
                          }}
                        >
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                      )}
                      <td
                        style={{
                          padding: isMobile ? "8px 6px" : "12px 8px",
                          fontSize: isMobile ? "12px" : "14px",
                          color: "#2C2C2C",
                          fontWeight: "500",
                        }}
                      >
                        {formatCurrency(order.amount)}
                      </td>
                      <td
                        style={{
                          padding: isMobile ? "8px 6px" : "12px 8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            padding: isMobile ? "4px 8px" : "4px 8px",
                            borderRadius: "4px",
                            fontSize: isMobile ? "11px" : "12px",
                            fontWeight: "500",
                            backgroundColor: getStatusColor(order.status),
                            color: getStatusTextColor(order.status),
                            display: "inline-block",
                            minWidth: isMobile ? "70px" : "auto",
                            textAlign: "center",
                          }}
                        >
                          {getAbbreviatedStatus(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  padding: isMobile ? "1.5rem" : "2rem",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                No recent orders
              </div>
            )}
          </div>
        </div>

        {/* Top Sold Items */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: isMobile ? "16px" : "24px",
            borderRadius: "8px",
            border: "1px solid #F5F5F5",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "#2C2C2C",
            }}
          >
            Top Sold Items
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {dashboardData.topSoldItems.length > 0 ? (
              dashboardData.topSoldItems.map((item, index) => {
                // Generate a color based on index for consistent coloring
                const colors = [
                  "#1E3A5F",
                  "#4A5D23",
                  "#2C2C2C",
                  "#6b7280",
                  "#F5F5F5",
                ];
                const color = colors[index % colors.length];

                return (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: isMobile ? "12px" : "14px",
                          color: "#2C2C2C",
                        }}
                      >
                        {isMobile && item.name && item.name.length > 10
                          ? `${item.name.substring(0, 10)}...`
                          : item.name || "Unknown Product"}
                      </span>
                      <span
                        style={{
                          fontSize: isMobile ? "12px" : "14px",
                          fontWeight: "500",
                          color: "#2C2C2C",
                        }}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: isMobile ? "6px" : "8px",
                        backgroundColor: "#F5F5F5",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          height: "100%",
                          backgroundColor: color,
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: isMobile ? "0.5rem" : "1rem",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                No sales data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
