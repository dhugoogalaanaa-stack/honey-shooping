import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div style={{
            width: isMobile ? 'auto' : isCollapsed ? '80px' : '240px',
            minHeight: '100vh',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #F5F5F5',
            boxShadow: ' 0 2px 4px -1px rgba(0, 0, 0, 0.07)',
            transition: 'all 0.3s ease',
            position: 'relative',
            padding: isMobile ? '0.5rem' : '0',
        }}>
            {!isMobile && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '1rem',
                }}>
                    <button 
                        onClick={toggleSidebar}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F5F5F5',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#e5e5e5';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#F5F5F5';
                        }}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="20px" 
                            viewBox="0 -960 960 960" 
                            width="20px" 
                            fill="#2C2C2C"
                            style={{
                                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
                        </svg>
                    </button>
                </div>
            )}
            
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: isMobile ? '0.5rem' : '0 1rem 1rem 1rem',
            }}>
                <NavLink
                    to="/dashboard"
                    className="sidebar-link"
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile || isCollapsed ? 'center' : 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        color: isActive ? '#FFFFFF' : '#2C2C2C',
                        backgroundColor: isActive ? '#1E3A5F' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                    })}
                    title="Dashboard"
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.5s ease'
                    }} className="link-shine"></div>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={location.pathname === '/dashboard' ? "#FFFFFF" : "#1E3A5F"}><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
                    {(!isMobile && !isCollapsed) && <span style={{ fontWeight: '500' }}>Dashboard</span>}
                </NavLink>
                
                <NavLink
                    to="/add"
                    className="sidebar-link"
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile || isCollapsed ? 'center' : 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        color: isActive ? '#FFFFFF' : '#2C2C2C',
                        backgroundColor: isActive ? '#1E3A5F' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                    })}
                    title="Add Items"
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.5s ease'
                    }} className="link-shine"></div>
                    
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill={location.pathname === '/add' ? "#FFFFFF" : "#1E3A5F"}
                    >
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg>
                    {(!isMobile && !isCollapsed) && <span style={{ fontWeight: '500' }}>Add Items</span>}
                </NavLink>
                
                <NavLink
                    to="/list"
                    className="sidebar-link"
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile || isCollapsed ? 'center' : 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        color: isActive ? '#FFFFFF' : '#2C2C2C',
                        backgroundColor: isActive ? '#1E3A5F' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                    })}
                    title="List Items"
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.5s ease'
                    }} className="link-shine"></div>
                    
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24px" 
                        viewBox="0 -960 960 960" 
                        width="24px" 
                        fill={location.pathname === '/list' ? "#FFFFFF" : "#1E3A5F"}
                    >
                        <path d="M640-120q-33 0-56.5-23.5T560-200v-160q0-33 23.5-56.5T640-440h160q33 0 56.5 23.5T880-360v160q0 33-23.5 56.5T800-120H640Zm0-80h160v-160H640v160ZM80-240v-80h360v80H80Zm560-280q-33 0-56.5-23.5T560-600v-160q0-33 23.5-56.5T640-840h160q33 0 56.5 23.5T880-760v160q0 33-23.5 56.5T800-520H640Zm0-80h160v-160H640v160ZM80-640v-80h360v80H80Zm640 360Zm0-400Z" />
                    </svg>
                    {(!isMobile && !isCollapsed) && <span style={{ fontWeight: '500' }}>List Items</span>}
                </NavLink>
                
                <NavLink
                    to="/orders"
                    className="sidebar-link"
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile || isCollapsed ? 'center' : 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        color: isActive ? '#FFFFFF' : '#2C2C2C',
                        backgroundColor: isActive ? '#1E3A5F' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                    })}
                    title="Orders"
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.5s ease'
                    }} className="link-shine"></div>
                    
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24px" 
                        viewBox="0 -960 960 960" 
                        width="24px" 
                        fill={location.pathname === '/orders' ? "#FFFFFF" : "#1E3A5F"}
                    >
                        <path d="M200-640v440h560v-440H640v320l-160-80-160 80v-320H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm184 80v190l80-40 80 40v-190H400Zm-200 0h560-560Z" />
                    </svg>
                    {(!isMobile && !isCollapsed) && <span style={{ fontWeight: '500' }}>Orders</span>}
                </NavLink>
            </div>

            <style>{`
                .sidebar-link:hover {
                    background-color: #F5F5F5 !important;
                    color: #1E3A5F !important;
                    transform: translateX(4px);
                }
                
                .sidebar-link:hover svg {
                    fill: #1E3A5F !important;
                }
                
                .sidebar-link:hover .link-shine {
                    transform: translateX(100%);
                }
                
                .sidebar-link.active:hover {
                    background-color: #1a3152 !important;
                    color: white !important;
                }
                
                .sidebar-link.active:hover svg {
                    fill: white !important;
                }
            `}</style>
        </div>
    );
};

export default Sidebar;