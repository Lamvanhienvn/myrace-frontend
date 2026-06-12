"use client";
import React, { useState, useRef } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 1. Thêm State để lưu trữ bộ lọc thời gian hiện tại
  const [timeRange, setTimeRange] = useState('week'); 
  
  const [athlete, setAthlete] = useState({
    firstname: "Lâm Văn",
    lastname: "Hiển",
    email: "hien@example.com",
    phone: "090xxxxxxx",
    stravaId: "33415712",
    profile_pic: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/33415712/10000000/1/large.jpg",
    // 2. Nâng cấp Dữ liệu Thống kê theo từng giai đoạn
    stats: {
      week: { run: 15.2, ride: 45.0, swim: 1.5 },
      month: { run: 65.5, ride: 210.5, swim: 5.2 },
      year: { run: 450.0, ride: 1500.0, swim: 25.0 },
      all: { run: 1250.5, ride: 4500.0, swim: 85.0 }
    }
  });

  const [previewImage, setPreviewImage] = useState(athlete.profile_pic);
  const [imageZoom, setImageZoom] = useState(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setAthlete({ ...athlete, profile_pic: imageUrl });
      setImageZoom(1);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    alert("Hệ thống đã lưu thông tin và ảnh đại diện mới!");
    setIsEditing(false);
  };

  // Cấu hình các nút bấm thời gian
  const timeFilters = [
    { id: 'week', label: 'Tuần này' },
    { id: 'month', label: 'Tháng này' },
    { id: 'year', label: 'Năm nay' },
    { id: 'all', label: 'Tất cả' }
  ];

  // Lấy dữ liệu hiện tại dựa trên bộ lọc
  const currentStats = (athlete.stats as any)[timeRange];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        
        {/* CARD HIỂN THỊ HỒ SƠ */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-40 bg-gradient-to-r from-[#FC4C02] to-orange-400"></div>
          <div className="px-8 pb-8">
            <div className="relative -top-16 flex flex-col md:flex-row items-end gap-6">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200">
                   <img 
                    src={athlete.profile_pic} 
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center' }}
                    alt="Avatar"
                  />
                </div>
              </div>
              <div className="pb-4 flex-1">
                <h1 className="text-4xl font-black text-gray-800">{athlete.firstname} {athlete.lastname}</h1>
                <p className="text-gray-500 font-medium">Strava Athlete ID: {athlete.stravaId}</p>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="mb-4 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-gray-900/30"
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex justify-between items-center">
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Email liên hệ</p>
                <p className="text-md font-bold text-gray-700">{athlete.email}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Số điện thoại</p>
                <p className="text-md font-bold text-gray-700">{athlete.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KHU VỰC THỐNG KÊ TÍCH LŨY MỚI */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-black text-gray-800">Thống kê tích lũy</h2>
            
            {/* Thanh điều hướng Tuần/Tháng/Năm */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeRange(filter.id)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    timeRange === filter.id 
                      ? 'bg-white text-[#FC4C02] shadow-md scale-105' 
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Các thẻ chỉ số */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Chạy bộ" value={currentStats.run} unit="km" color="green" icon="🏃‍♂️" bg="bg-green-50" />
            <StatCard label="Đạp xe" value={currentStats.ride} unit="km" color="blue" icon="🚴" bg="bg-blue-50" />
            <StatCard label="Bơi lội" value={currentStats.swim} unit="km" color="cyan" icon="🏊‍♂️" bg="bg-cyan-50" />
          </div>
        </div>
      </div>

      {/* MODAL CHỈNH SỬA & CROP ẢNH (GIỮ NGUYÊN NHƯ CŨ) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black mb-6 text-center">Cập nhật hồ sơ</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer mb-3" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 shadow-inner bg-gray-100">
                  <img 
                    src={previewImage} 
                    className="w-full h-full object-cover transition-transform" 
                    style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center' }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Tải ảnh lên</span>
                </div>
              </div>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
              <div className="w-full px-8 flex items-center gap-3">
                <span className="text-gray-400 text-sm font-bold">Thu</span>
                <input 
                  type="range" min="1" max="3" step="0.1" 
                  value={imageZoom} 
                  onChange={(e) => setImageZoom(parseFloat(e.target.value))} 
                  className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-400 text-sm font-bold">Phóng</span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <InputGroup label="Họ và tên đệm" value={athlete.firstname} onChange={(v: string) => setAthlete({...athlete, firstname: v})} />
              <InputGroup label="Tên" value={athlete.lastname} onChange={(v: string) => setAthlete({...athlete, lastname: v})} />
              <InputGroup label="Số điện thoại" value={athlete.phone} onChange={(v: string) => setAthlete({...athlete, phone: v})} />
              <InputGroup label="Email" value={athlete.email} onChange={(v: string) => setAthlete({...athlete, email: v})} />
              
              <div className="flex gap-4 pt-6 pb-2">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition">Hủy bỏ</button>
                <button type="submit" className="flex-1 bg-[#FC4C02] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Cập nhật lại StatCard cho màu sắc đẹp hơn
function StatCard({ label, value, unit, color, icon, bg }: any) {
  const colors: any = { 
    green: 'border-green-500 text-green-600', 
    blue: 'border-blue-500 text-blue-600', 
    cyan: 'border-cyan-500 text-cyan-600' 
  };
  return (
    <div className={`${bg} p-6 rounded-3xl border-t-4 ${colors[color]} flex flex-col justify-between items-start transition-all hover:shadow-md hover:-translate-y-1`}>
      <div className="flex justify-between w-full items-center mb-4">
         <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</p>
         <span className="text-2xl bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">{icon}</span>
      </div>
      <p className="text-4xl font-black text-gray-800">{value.toFixed(1)} <span className="text-lg font-bold text-gray-400">{unit}</span></p>
    </div>
  );
}

function InputGroup({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs font-black text-gray-400 uppercase ml-2 mb-1 block">{label}</label>
      <input 
        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3.5 focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold text-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}