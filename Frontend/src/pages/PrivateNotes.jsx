import React, { useState, useEffect } from 'react';

function PrivateNotes() {
    
    //VÙNG 1: STATE (Trạng thái)
       
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);

  
    // VÙNG 2: LOGIC (Xác thực & Fetch Data)
    
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


    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setFormData({ id: null, title: '', content: '' });
    };


    // Reset về trang 1 khi đổi từ khóa tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);


    //LỌC theo từ khóa tìm kiếm
    const filteredNotes = notes.filter(note => {
        const keyword = searchQuery.toLowerCase().trim();
        if (!keyword) return true;
        return (
            note.title.toLowerCase().includes(keyword) ||
            note.content.toLowerCase().includes(keyword)
        );
    });


   // SẮP XẾP theo updatedAt (mới nhất lên đầu)
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    

    //PHÂN TRANG   
    const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedNotes = sortedNotes.slice(indexOfFirstItem, indexOfLastItem);


    //VÙNG 3: RENDER (Hiển thị)
     
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

            {/* Ô TÌM KIẾM */}
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm ghi chú riêng tư..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #dc3545',
                        borderRadius: '5px',
                        fontSize: '14px',
                        backgroundColor: '#fff5f5',
                        boxSizing: 'border-box'
                    }}
                />
            </div>
            
            {/* Form nhập liệu */}
            <div style={{ border: '1px solid red', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>{formData.id ? '✏️ Sửa ghi chú' : '➕ Thêm ghi chú mới'}</h3>
                <input
                    placeholder="Tiêu đề bí mật"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                />
                <textarea
                    placeholder="Nội dung bí mật"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{ display: 'block', width: '100%', height: '80px', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                />
                <button 
                    onClick={handleSave} 
                    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: 'red', color: 'white', marginRight: '10px', border: 'none', borderRadius: '4px' }}
                >
                    {formData.id ? 'Cập nhật' : 'Lưu bí mật'}
                </button>
                {formData.id && (
                    <button 
                        onClick={handleCancelEdit}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Hủy
                    </button>
                )}
            </div>

            {/* Danh sách */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {sortedNotes.length === 0 && <p>Chưa có ghi chú riêng tư nào.</p>}
                {sortedNotes.length > 0 && paginatedNotes.length === 0 && (
                    <p style={{ color: '#999', fontStyle: 'italic', gridColumn: 'span 2', textAlign: 'center' }}>
                        Không tìm thấy ghi chú nào khớp với từ khóa "{searchQuery}".
                    </p>
                )}
                {paginatedNotes.map(note => (
                    <div key={note.id} style={{ border: '1px solid red', padding: '15px', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>{note.title}</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                            Tạo: {new Date(note.createdAt).toLocaleString('vi-VN')}
                            {note.updatedAt !== note.createdAt && (
                                <span> | Sửa: {new Date(note.updatedAt).toLocaleString('vi-VN')}</span>
                            )}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={() => handleEdit(note)} style={{ marginRight: '10px', cursor: 'pointer' }}>Sửa</button>
                            <button onClick={() => handleDelete(note.id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {sortedNotes.length > 0 && totalPages > 1 && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '6px 12px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        « Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                padding: '6px 12px',
                                cursor: 'pointer',
                                backgroundColor: page === currentPage ? 'red' : '#fff',
                                color: page === currentPage ? '#fff' : '#000',
                                border: '1px solid red',
                                fontWeight: page === currentPage ? 'bold' : 'normal'
                            }}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '6px 12px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                    >
                        Sau »
                    </button>
                </div>
            )}

            {/* Thông tin phân trang */}
            {sortedNotes.length > 0 && (
                <div style={{ marginTop: '10px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedNotes.length)} / {sortedNotes.length} ghi chú
                    {searchQuery && ` (đã lọc theo từ khóa "${searchQuery}")`}
                </div>
            )}
        </div>
    );
}

export default PrivateNotes;