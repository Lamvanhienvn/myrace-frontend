"use client";
import React, { useState } from 'react';

export default function AdminPage() {
  // MOCK DATA: Danh sách các giải đấu đang chờ duyệt và đã duyệt
  const [events, setEvents] = useState([
    { id: 101, name: "Thử Thách Chạy Bộ Techcombank", creator: "VĐV Nguyễn Văn A", type: "Run", multiplier: 10, minKm: 2, status: "Pending" },
    { id: 102, name: "Ironman Bán Kỳ 2026", creator: "Trần Minh Tuấn", type: "Swim", multiplier: 40, minKm: 0.5, status: "Pending" },
    { id: 1, name: "Thử thách tháng 6 - Vượt qua giới hạn", creator: "Sếp Hiển", type: "Run", multiplier: 10, minKm: 0, status: "Approved" },
  ]);

  // State quản lý Form Tạo Giải
  const [newEventName, setNewEventName] = useState("");
  const [sportType, setSportType] = useState("Run");
  const [multiplier, setMultiplier] = useState(10);
  const [minKm, setMinKm] = useState(0);
  const [creatorName, setCreatorName] = useState("Người dùng ẩn danh");

  // Hàm xử lý Duyệt giải đấu
  const handleApprove = (id: number) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, status: "Approved" } : ev));
    alert(`🎉 Đã duyệt thành công giải đấu ID #${id}! Người chơi hiện tại đã có thể mời bạn bè gia nhập.`);
  };

  // Hàm xử lý Từ chối giải đấu
  const handleReject = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
    alert(`🗑️ Đã gỡ bỏ yêu cầu tạo giải đấu ID #${id}.`);
  };

  // Hàm xử lý gửi Form tạo giải mới (Chuyển sang trạng thái Pending)
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName) return alert("Sếp vui lòng điền tên giải đấu!");

    const newEvent = {
      id: Date.now(),
      name: newEventName,
      creator: creatorName,
      type: sportType,
      multiplier: Number(multiplier),
      minKm: Number(minKm),
      status: "Pending"
    };

    setEvents([newEvent, ...events]);
    setNewEventName("");
    alert("🚀 Gửi yêu cầu tạo giải đấu thành công! Vui lòng đợi Ban quản trị (Admin) phê duyệt để kích hoạt giải.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      {/* Header Bar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tighter">
          MY<span className="text-orange-500">RACE</span> <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full uppercase ml-1">Admin Space</span>
        </h1>
        <div className="flex gap-4">
          <a href="/profile?id=33415712" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition">Dashboard</a>
          <a href="/leaderboard" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition">Leaderboard</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KHU VỰC 1: BẢNG DUYỆT GIẢI CỦA TỐI CAO ADMIN (Chiếm 2 phần màn hình) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
              <span>⏳</span> Đơn hàng chờ duyệt ({events.filter(e => e.status === "Pending").length})
            </h2>

            <div className="space-y-4">
              {events.filter(e => e.status === "Pending").length === 0 ? (
                <p className="text-gray-400 font-medium text-center py-6">Không có giải đấu nào đang chờ duyệt. Sếp có thể nghỉ ngơi! 😎</p>
              ) : (
                events.filter(e => e.status === "Pending").map((ev) => (
                  <div key={ev.id} className="p-5 bg-orange-50/40 rounded-2xl border border-orange-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md">
                    <div>
                      <span className="inline-block bg-orange-100 text-orange-700 text-xs font-black px-2 py-0.5 rounded-md mb-2 uppercase">ID: #{ev.id}</span>
                      <h3 className="font-extrabold text-lg text-gray-900">{ev.name}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">Người tạo: <span className="text-gray-700 font-bold">{ev.creator}</span></p>
                      
                      {/* Thống số cấu hình môn chạy */}
                      <div className="flex gap-4 mt-3 text-xs font-bold text-gray-600">
                        <span className="bg-white px-2 py-1 rounded-md border shadow-2xs">🎯 Môn: {ev.type === 'Run' ? '🏃 Chạy' : ev.type === 'Swim' ? '🏊 Bơi' : '🚴 Đạp'}</span>
                        <span className="bg-white px-2 py-1 rounded-md border shadow-2xs">🔢 Hệ số: x{ev.multiplier} điểm/km</span>
                        <span className="bg-white px-2 py-1 rounded-md border shadow-2xs">📏 Tối thiểu: {ev.minKm} km/cuốc</span>
                      </div>
                    </div>
                    
                    {/* Cặp nút hành động của Admin */}
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => handleApprove(ev.id)} className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-sm transition">
                        Duyệt giải
                      </button>
                      <button onClick={() => handleReject(ev.id)} className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold px-4 py-2.5 rounded-xl text-sm transition">
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Danh sách các giải ĐÃ DUYỆT */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">🏁 Giải đấu đang chạy hoạt động</h2>
            <div className="divide-y divide-gray-100">
              {events.filter(e => e.status === "Approved").map((ev) => (
                <div key={ev.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-gray-800">{ev.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Do {ev.creator} tạo • Luật: 1km = {ev.multiplier} điểm</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    🟢 Đang chạy
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KHU VỰC 2: FORM TẠO EVENT MỚI CỦA NGƯỜI DÙNG (Chiếm 1 phần màn hình) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">➕ Tạo Giải Đấu Mới</h2>
          
          <form onSubmit={handleCreateEvent} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tên giải đấu / Sự kiện</label>
              <input type="text" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="Ví dụ: Đua Top Săn Quà..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-medium transition" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tên người tổ chức</label>
              <input type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder="Tên sếp hoặc tên thương hiệu..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-medium transition" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Môn thể thao áp dụng</label>
              <select value={sportType} onChange={(e) => setSportType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-bold tracking-wide transition">
                <option value="Run">🏃 Chạy Bộ (Run)</option>
                <option value="Ride">🚴 Đạp Xe (Ride)</option>
                <option value="Swim">🏽 Bơi Lội (Swim)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Hệ số điểm (1Km = ?)</label>
                <input type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-bold text-center transition" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Min Km / Cuốc</label>
                <input type="number" step="0.1" value={minKm} onChange={(e) => setMinKm(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-bold text-center transition" />
              </div>
            </div>

            <div className="bg-blue-50/70 rounded-2xl p-4 text-xs text-blue-700 font-medium leading-relaxed">
              💡 <span className="font-bold">Quy tắc hệ thống:</span> Sau khi bấm gửi, giải đấu sẽ rơi vào trạng thái <span className="font-bold">Chờ duyệt</span>. Khi Admin phê duyệt giải đấu thành công, link tham gia giải mới kích hoạt cho cộng đồng join.
            </div>

            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl text-sm shadow-md transition transform hover:-translate-y-0.5">
              GỬI YÊU CẦU DUYỆT GIẢI
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}