import React, { useState, useEffect } from 'react';

function Notes() {
    /* =========================================================
       VÙNG 1: KHỞI TẠO STATE
       ========================================================= */
    const [topic, setTopic] = useState('hoc-tap');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });

    /* =========================================================
       VÙNG 2: XỬ LÝ LOGIC & GỌI API
       ========================================================= */
    
    // Hàm lấy danh sách ghi chú
    const fetchNotes = () => {
        fetch(`http://localhost:5000/api/notes/${topic}`)
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(err => console.error("Lỗi lấy danh sách:", err));
    };

    // Tự động gọi API mỗi khi đổi topic
    useEffect(() => {
        fetchNotes();
    }, [topic]);

    // Hàm xử lý Lưu (Thêm mới hoặc Cập nhật)
    const handleSave = () => {
        // Kiểm tra dữ liệu đầu vào (Edge Case - Trang 41)
        if (!formData.title.trim()) {
            alert("Vui lòng nhập tiêu đề!");
            return;
        }

        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/notes/${topic}/${formData.id}`
            : `http://localhost:5000/api/notes/${topic}`;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: formData.title, content: formData.content })
        })
        .then(res => res.json())
        .then(() => {
            fetchNotes(); // Tải lại danh sách
            setFormData({ id: null, title: '', content: '' }); // Reset form
        })
        .catch(err => alert("Lỗi khi lưu ghi chú!"));
    };

    // Hàm xử lý Xóa
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            fetch(`http://localhost:5000/api/notes/${topic}/${id}`, { method: 'DELETE' })
                .then(() => fetchNotes())
                .catch(err => alert("Lỗi khi xóa!"));
        }
    };

    // Hàm đưa dữ liệu cũ lên form để sửa
    const handleEdit = (note) => {
        setFormData({ id: note.id, title: note.title, content: note.content });
    };

    /* =========================================================
       VÙNG 3: RENDER GIAO DIỆN (UI/CSS)
       ========================================================= */
    return (
        <div style={{ padding: '20px' }}>
            <h2>📝 Ghi chú Công khai</h2>

            {/* 3.1. Vùng chọn chủ đề */}
            <div style={{ marginBottom: '20px' }}>
                <strong>Chủ đề: </strong>
                <select 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    style={{ padding: '5px', marginLeft: '10px' }}
                >
                    <option value="hoc-tap">Học tập</option>
                    <option value="cong-viec">Công việc</option>
                    <option value="ca-nhan">Cá nhân</option>
                </select>
            </div>

            {/* 3.2. Form Nhập liệu */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>{formData.id ? '✏️ Sửa ghi chú' : '➕ Thêm ghi chú mới'}</h3>
                <input
                    placeholder="Tiêu đề"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <textarea
                    placeholder="Nội dung"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{ display: 'block', width: '100%', height: '80px', marginBottom: '10px', padding: '8px' }}
                />
                <button 
                    onClick={handleSave} 
                    style={{ padding: '8px 16px', cursor: 'pointer', marginRight: '10px' }}
                >
                    {formData.id ? 'Cập nhật' : 'Thêm mới'}
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

            {/* 3.3. Danh sách thẻ ghi chú */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {notes.length === 0 && <p>Chưa có ghi chú nào trong chủ đề này.</p>}
                {notes.map(note => (
                    <div 
                        key={note.id} 
                        style={{ border: '1px solid #007bff', padding: '15px', borderRadius: '5px' }}
                    >
                        <h4 style={{ margin: '0 0 10px 0' }}>{note.title}</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                        <div style={{ marginTop: '10px' }}>
                            <button 
                                onClick={() => handleEdit(note)} 
                                style={{ marginRight: '10px', cursor: 'pointer' }}
                            >
                                Sửa
                            </button>
                            <button 
                                onClick={() => handleDelete(note.id)} 
                                style={{ color: 'red', cursor: 'pointer' }}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notes;