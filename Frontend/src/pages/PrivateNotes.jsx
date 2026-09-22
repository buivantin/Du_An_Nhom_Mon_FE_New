import React, { useState } from 'react';

function PrivateNotes() {
    /* =========================================================
       VÙNG 1: STATE (Trạng thái)
       ========================================================= */
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });

    /* =========================================================
       VÙNG 2: LOGIC (Xác thực & Fetch Data)
       ========================================================= */
    
    // Kiểm tra mật khẩu
    const handleLogin = () => {
        if (!passwordInput.trim()) {
            alert("Vui lòng nhập mật khẩu!");
            return;
        }
        
        fetch('http://localhost:5000/api/private/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setIsUnlocked(true);
                fetchPrivateNotes();
                setPasswordInput('');
            } else {
                alert("Sai mật khẩu, vui lòng thử lại!");
                setPasswordInput('');
            }
        })
        .catch(err => alert("Lỗi kết nối Backend!"));
    };

    // Lấy danh sách ghi chú riêng tư
    const fetchPrivateNotes = () => {
        fetch('http://localhost:5000/api/private/notes')
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(err => console.error("Lỗi lấy danh sách:", err));
    };

    // Lưu ghi chú (Thêm mới hoặc Cập nhật)
    const handleSave = () => {
        if (!formData.title.trim()) {
            alert("Vui lòng nhập tiêu đề!");
            return;
        }

        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/private/notes/${formData.id}`
            : `http://localhost:5000/api/private/notes`;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: formData.title, content: formData.content })
        })
        .then(res => res.json())
        .then(() => {
            fetchPrivateNotes();
            setFormData({ id: null, title: '', content: '' });
        })
        .catch(err => alert("Lỗi khi lưu ghi chú!"));
    };

    // Xóa ghi chú
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            fetch(`http://localhost:5000/api/private/notes/${id}`, { method: 'DELETE' })
                .then(() => fetchPrivateNotes())
                .catch(err => alert("Lỗi khi xóa!"));
        }
    };

    // Đưa dữ liệu lên form để sửa
    const handleEdit = (note) => {
        setFormData({ id: note.id, title: note.title, content: note.content });
    };

    /* =========================================================
       VÙNG 3: RENDER (Hiển thị)
       ========================================================= */
    
    // 3.1. Chưa mở khóa -> Form nhập Pass
    if (!isUnlocked) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2>🔒 Khu vực Bảo mật</h2>
                <p>Vui lòng nhập mật khẩu để truy cập</p>
                <input 
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Nhập mật khẩu..."
                    style={{ padding: '10px', width: '250px', marginRight: '10px' }}
                />
                <button 
                    onClick={handleLogin} 
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                    Mở khóa
                </button>
            </div>
        );
    }

    // 3.2. Đã mở khóa -> Giao diện Note
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: 'red' }}>🔐 Khu vực Ghi chú Riêng tư</h2>
            
            {/* Form nhập liệu */}
            <div style={{ border: '1px solid red', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>{formData.id ? '✏️ Sửa ghi chú' : '➕ Thêm ghi chú mới'}</h3>
                <input
                    placeholder="Tiêu đề bí mật"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <textarea
                    placeholder="Nội dung bí mật"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{ display: 'block', width: '100%', height: '80px', marginBottom: '10px', padding: '8px' }}
                />
                <button 
                    onClick={handleSave} 
                    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                >
                    {formData.id ? 'Cập nhật' : 'Lưu bí mật'}
                </button>
                {formData.id && (
                    <button 
                        onClick={() => setFormData({ id: null, title: '', content: '' })}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Hủy
                    </button>
                )}
            </div>

            {/* Danh sách */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {notes.length === 0 && <p>Chưa có ghi chú riêng tư nào.</p>}
                {notes.map(note => (
                    <div key={note.id} style={{ border: '1px solid red', padding: '15px', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>{note.title}</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={() => handleEdit(note)} style={{ marginRight: '10px', cursor: 'pointer' }}>Sửa</button>
                            <button onClick={() => handleDelete(note.id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PrivateNotes;