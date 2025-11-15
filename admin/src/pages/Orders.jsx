import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [updatingStatus, setUpdatingStatus] = useState({});

  /* ---------- fetch orders ---------- */
  const fetchAllOrders = async () => {
    if (!token) {
      setLoading(false);
      toast.error("Admin token required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { token },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- update order status ---------- */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

      const response = await axios.put(
        `${backendUrl}/api/order/status`,
        {
          orderId,
          status: newStatus,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  /* ---------- responsive check ---------- */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Prevent horizontal scrolling on mobile
      if (mobile) {
        document.body.style.overflowX = "hidden";
      } else {
        document.body.style.overflowX = "auto";
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflowX = "auto"; // Cleanup
    };
  }, []);

  /* ---------- fetch orders on mount ---------- */
  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  /* ---------- helpers ---------- */
  const getImageSrc = (item) => {
    if (!item) return "";
    if (Array.isArray(item.images) && item.images.length) {
      const first = item.images[0];
      return typeof first === "string" ? first : first.url;
    }
    if (item.image) {
      if (Array.isArray(item.image) && item.image.length) return item.image[0];
      return item.image;
    }
    return "https://via.placeholder.com/60x60?text=No+Image";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "#3B82F6";
      case "Processing":
        return "#F59E0B";
      case "Shipped":
        return "#8B5CF6";
      case "Delivered":
        return "#10B981";
      case "Cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  // Helper function to truncate text to 3 words
  const truncateToThreeWords = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(" ") + "...";
  };

  const statusOptions = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Check if payment should be marked as paid
  const shouldMarkAsPaid = (order) => {
    // For COD orders, mark as paid when delivered
    if (order.paymentMethod === "COD" && order.status === "Delivered") {
      return true;
    }
    // For other payment methods, use the actual payment status
    return order.payment;
  };

  /* ---------- render loading ---------- */
  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading orders...</p>
      </div>
    );
  }

  /* ---------- render no orders ---------- */
  if (orders.length === 0) {
    return (
      <div
        style={{
          padding: isMobile ? "1rem" : "2rem",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "1.5rem" : "1.8rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            wordWrap: "break-word",
          }}
        >
          ALL ORDERS
        </h1>
        <div
          style={{
            textAlign: "center",
            padding: isMobile ? "2rem" : "3rem",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
            maxWidth: "100%",
          }}
        >
          <p
            style={{
              fontSize: isMobile ? "1rem" : "1.2rem",
              color: "#6B7280",
              marginBottom: "1rem",
              wordWrap: "break-word",
            }}
          >
            No orders found.
          </p>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: isMobile ? "0.9rem" : "1rem",
              wordWrap: "break-word",
            }}
          >
            Orders will appear here once customers place them.
          </p>
        </div>
      </div>
    );
  }

  /* ---------- render orders ---------- */
  return (
    <div
      style={{
        padding: isMobile ? "1rem" : "2rem",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* heading */}
      <div
        style={{
          marginBottom: "1.5rem",
          maxWidth: "100%",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "1.5rem" : "1.8rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            wordWrap: "break-word",
          }}
        >
          ALL ORDERS
        </h1>
        <p
          style={{
            fontSize: isMobile ? "0.9rem" : "1rem",
            color: "#6B7280",
            wordWrap: "break-word",
          }}
        >
          Total: {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* orders list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          maxWidth: "100%",
        }}
      >
        {orders.map((order) => {
          const isPaid = shouldMarkAsPaid(order);

          return (
            <div
              key={order._id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: isMobile ? "1rem" : "1.5rem",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                maxWidth: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "0.5rem" : "0",
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      margin: "0 0 0.25rem 0",
                      fontSize: isMobile ? "1rem" : "1.1rem",
                      wordWrap: "break-word",
                    }}
                  >
                    Order #{order._id?.slice(-8).toUpperCase() || "N/A"}
                  </p>
                  <p
                    style={{
                      color: "#6B7280",
                      margin: "0",
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                      wordWrap: "break-word",
                    }}
                  >
                    Placed on {formatDate(order.date)}
                  </p>
                  <p
                    style={{
                      color: "#6B7280",
                      margin: "0.25rem 0 0 0",
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                      wordWrap: "break-word",
                    }}
                  >
                    Customer: {order.userId?.name || "N/A"} (
                    {order.userId?.email || "N/A"})
                  </p>
                  <p
                    style={{
                      color: "#6B7280",
                      margin: "0.25rem 0 0 0",
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                      wordWrap: "break-word",
                    }}
                  >
                    Payment: {order.paymentMethod} •{" "}
                    {isPaid ? "Paid" : "Pending"}
                  </p>
                </div>

                {/* Status Selector */}
                <div
                  style={{
                    display: "flex",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    flexDirection: isMobile ? "column" : "row",
                    maxWidth: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(order.status),
                        flexShrink: 0,
                      }}
                    ></div>
                    <span
                      style={{
                        color: getStatusColor(order.status),
                        fontWeight: "600",
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                        wordWrap: "break-word",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    disabled={updatingStatus[order._id]}
                    style={{
                      padding: isMobile ? "0.4rem" : "0.5rem",
                      border: "1px solid #D1D5DB",
                      borderRadius: "4px",
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                      backgroundColor: updatingStatus[order._id]
                        ? "#F3F4F6"
                        : "white",
                      cursor: updatingStatus[order._id]
                        ? "not-allowed"
                        : "pointer",
                      minWidth: isMobile ? "120px" : "auto",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {updatingStatus[order._id] && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#6B7280",
                        marginTop: isMobile ? "0.25rem" : "0",
                        wordWrap: "break-word",
                      }}
                    >
                      Updating...
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div
                style={{
                  marginBottom: "1rem",
                  maxWidth: "100%",
                }}
              >
                <p
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    wordWrap: "break-word",
                  }}
                >
                  Items:
                </p>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? "0.75rem" : "1rem",
                      padding: "0.75rem",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "4px",
                      marginBottom: "0.5rem",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <img
                      src={getImageSrc(item)}
                      alt={item.name}
                      style={{
                        width: isMobile ? "40px" : "50px",
                        height: isMobile ? "40px" : "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/50x50?text=No+Image";
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "500",
                          margin: "0 0 0.25rem 0",
                          fontSize: isMobile ? "0.85rem" : "0.9rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: isMobile ? "nowrap" : "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        {isMobile ? truncateToThreeWords(item.name) : item.name}
                      </p>
                      <div
                        style={{
                          color: "#6B7280",
                          margin: "0",
                          fontSize: isMobile ? "0.75rem" : "0.8rem",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.25rem",
                          alignItems: "center",
                          maxWidth: "100%",
                        }}
                      >
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>
                          Price: {item.price}
                          {currency}
                        </span>
                      </div>
                    </div>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: isMobile ? "0.85rem" : "0.9rem",
                        flexShrink: 0,
                        wordWrap: "break-word",
                      }}
                    >
                      {item.price * item.quantity}
                      {currency}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "1rem",
                  borderTop: "1px solid #E5E7EB",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  maxWidth: "100%",
                }}
              >
                <p
                  style={{
                    color: "#6B7280",
                    margin: "0",
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    wordWrap: "break-word",
                  }}
                >
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "0",
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    whiteSpace: "nowrap",
                    padding: "0.1rem 0.2rem",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "4px",
                  }}
                >
                  Total: {order.amount} {currency}
                </p>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: isMobile ? "0.75rem" : "1rem",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "4px",
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "600",
                      margin: "0 0 0.5rem 0",
                      fontSize: isMobile ? "0.85rem" : "0.9rem",
                      wordWrap: "break-word",
                    }}
                  >
                    Delivery Address:
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                      color: "#6B7280",
                      lineHeight: "1.4",
                      wordWrap: "break-word",
                    }}
                  >
                    {order.address.firstName} {order.address.lastName}
                    <br />
                    {order.address.street}, {order.address.city}
                    <br />
                    {order.address.region}, {order.address.country}{" "}
                    {order.address.zipcode}
                    <br />
                    Phone: {order.address.phone}
                    <br />
                    Email: {order.address.email}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
