import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Settings = () => {
    const { setDisplayName, toggleTheme } = useContext(AppContext);
    
    // State lưu dữ liệu form
    const [profile, setProfile] = useState({
        displayName: '',
        theme: 'light',
        password: '' 
    });
    
    // State quản lý trạng thái đang tải
    const [isLoading, setIsLoading] = useState(false);

    // 1. Lấy dữ liệu từ Backend khi vừa load trang
    useEffect(() => {
        fetch('http://localhost:5000/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                // Cập nhật Context toàn cục ngay khi lấy dữ liệu về
                setDisplayName(data.displayName);
                toggleTheme(data.theme);
            })
            .catch(err => console.error("Lỗi lấy profile:", err));
    }, []);

    // 2. Xử lý khi người dùng thay đổi input
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // 3. Xử lý khi bấm nút Lưu
    const handleSave = () => {
        setIsLoading(true);
        fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Lưu thành công!");
                // Cập nhật giao diện ngay lập tức không cần F5
                setDisplayName(profile.displayName);
                toggleTheme(profile.theme);
            } else {
                alert("Lỗi khi lưu!");
            }
        })
        .catch(err => alert("Lỗi kết nối Backend!"))
        .finally(() => setIsLoading(false));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px' }}>
            <h2>⚙️ Cài đặt hệ thống</h2>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Tên hiển thị:</label>
                <input 
                    name="displayName" 
                    value={profile.displayName} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Giao diện:</label>
                <select 
                    name="theme" 
                    value={profile.theme} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px' }}
                >
                    <option value="light">Sáng (Light)</option>
                    <option value="dark">Tối (Dark)</option>
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu vùng kín:</label>
                <input 
                    type="password" 
                    name="password" 
                    value={profile.password} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px' }}
                    placeholder="Nhập mật khẩu bảo vệ..."
                />
            </div>

            <button 
                onClick={handleSave} 
                disabled={isLoading}
                style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </div>
    );
};

export default Settings;