import React, { useState, useEffect } from 'react';

function Notes() {

       //VÙNG 1: KHỞI TẠO STATE
      
    const [topic, setTopic] = useState('hoc-tap');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);

    
    //VÙNG 2: XỬ LÝ LOGIC & GỌI API

    // Hàm lấy danh sách ghi chú
    const fetchNotes = () => {
        fetch(`http://localhost:5000/api/notes/${topic}`)
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(err => console.error("Lỗi lấy danh sách:", err));
    };
    

    // Gọi API khi đổi chủ đề
    useEffect(() => {
        fetchNotes();
        setSearchQuery('');
        setCurrentPage(1);
    }, [topic]);


    // Reset về trang 1 khi đổi từ khóa tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);


    // Hàm xử lý Lưu (Thêm mới hoặc Cập nhật)
    const handleSave = () => {
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
            fetchNotes();
            setFormData({ id: null, title: '', content: '' });
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

   
       //LỌC theo từ khóa tìm kiếm
    const filteredNotes = notes.filter(note => {
        const keyword = searchQuery.toLowerCase().trim();
        if (!keyword) return true;
        return (
            note.title.toLowerCase().includes(keyword) ||
            note.content.toLowerCase().includes(keyword)
        );
    });

   
    //SẮP XẾP theo updatedAt (mới nhất lên đầu)
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });


    //Phân trang
    const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedNotes = sortedNotes.slice(indexOfFirstItem, indexOfLastItem);


    //VÙNG 3: RENDER GIAO DIỆN (UI/CSS)
    return (
        <div style={{ padding: '20px' }}>
            <h2>📝 Ghi chú Công khai</h2>

            {/* 3.1. Vùng chọn chủ đề + Tìm kiếm */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
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
                <div>
                    <strong>Tìm kiếm: </strong>
                    <input
                        type="text"
                        placeholder="Nhập tiêu đề hoặc nội dung..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '5px', width: '250px' }}
                    />
                </div>
            </div>

            {/* 3.2. Form Nhập liệu */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>{formData.id ? '✏️ Sửa ghi chú' : '➕ Thêm ghi chú mới'}</h3>
                <input
                    placeholder="Tiêu đề"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                />
                <textarea
                    placeholder="Nội dung"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{ display: 'block', width: '100%', height: '80px', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
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
                {sortedNotes.length === 0 && <p>Chưa có ghi chú nào trong chủ đề này.</p>}
                {sortedNotes.length > 0 && paginatedNotes.length === 0 && (
                    <p style={{ color: '#999', fontStyle: 'italic', gridColumn: 'span 2', textAlign: 'center' }}>
                        Không tìm thấy ghi chú nào khớp với từ khóa "{searchQuery}".
                    </p>
                )}
                {paginatedNotes.map(note => (
                    <div 
                        key={note.id} 
                        style={{ border: '1px solid #007bff', padding: '15px', borderRadius: '5px' }}
                    >
                        <h4 style={{ margin: '0 0 10px 0' }}>{note.title}</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                            Tạo: {new Date(note.createdAt).toLocaleString('vi-VN')}
                            {note.updatedAt !== note.createdAt && (
                                <span> | Sửa: {new Date(note.updatedAt).toLocaleString('vi-VN')}</span>
                            )}
                        </div>
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

            {/* 3.4. Phân trang */}
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
                                backgroundColor: page === currentPage ? '#007bff' : '#fff',
                                color: page === currentPage ? '#fff' : '#000',
                                border: '1px solid #007bff',
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

            {/* 3.5. Thông tin phân trang */}
            {sortedNotes.length > 0 && (
                <div style={{ marginTop: '10px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedNotes.length)} / {sortedNotes.length} ghi chú
                    {searchQuery && ` (đã lọc theo từ khóa "${searchQuery}")`}
                </div>
            )}
        </div>
    );
}

export default Notes;