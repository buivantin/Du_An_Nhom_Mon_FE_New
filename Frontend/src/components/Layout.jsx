import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Layout = () => {
    // Lấy dữ liệu từ Context toàn cục
    const { displayName, theme } = useContext(AppContext);

    return (
        <div style={{ 
            display: 'flex', // Thêm display flex để Sidebar và Content nằm cạnh nhau
            minHeight: '100vh',
            backgroundColor: theme === 'dark' ? '#222' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000'
        }}>
            {/* Sidebar: menu điều hướng cố định bên trái */}
            <aside style={{ 
                width: '220px', 
                padding: '20px', 
                borderRight: '1px solid #ccc',
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f4f4f4'
            }}>
                <h3>Xin chào, {displayName}</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <Link to="/" style={{ color: 'inherit' }}>🏠 Trang chủ</Link>
                    <Link to="/notes" style={{ color: 'inherit' }}>📝 Ghi chú</Link> {/* <-- Thêm dòng này */}
                    <Link to="/settings" style={{ color: 'inherit' }}>⚙️ Cài đặt</Link>
                    <Link to="/private" style={{ color: 'inherit' }}>🔒 Vùng kín</Link>
                </nav>
            </aside>

            {/* Content: nơi từng trang con sẽ được render vào */}
            <main style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;