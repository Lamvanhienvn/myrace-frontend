"use client";
import React, { useState, useEffect } from 'react';

// SẾP LƯU Ý: Thay đường link này bằng link Backend Render thực tế của sếp nhé!
const API_URL = "https://myrace-backend.onrender.com";

export default function UltimateAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventName, setEventName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  
  const [includeRun, setIncludeRun] = useState(true);
  const [includeRide, setIncludeRide] = useState(false);
  const [includeSwim, setIncludeSwim] = useState(false);
  const selectedSportsCount = [includeRun, includeRide, includeSwim].filter(Boolean).length;
  const [enablePointsConversion, setEnablePointsConversion] = useState(false);

  // Cấu hình sinh học
  const [runConfig, setRunConfig] = useState({ multiplier: 10, minDistance: 1.0, movingRatio: 90, paceMin: 4.0, paceMax: 15.0, requireGps: true, requirePublic: true });
  const [rideConfig, setRideConfig] = useState({ multiplier: 3, minDistance: 5.0, movingRatio: 85, speedMin: 15, speedMax: 45, requireHr: true, requireCadence: true, cadenceMin: 60, cadenceMax: 100});
  const [swimConfig, setSwimConfig] = useState({ multiplier: 40, minDistance: 0.1, movingRatio: 90, swimType: "pool", paceMin: 1.5, paceMax: 3.5 });
  const [enableAntiCheat, setEnableAntiCheat] = useState(true);

  // 1. TỰ ĐỘNG TẢI DANH SÁCH GIẢI TỪ BACKEND KHI MỞ TRANG
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách giải:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedSportsCount < 2) setEnablePointsConversion(false);
  }, [selectedSportsCount]);

  // 2. GỬI YÊU CẦU TẠO GIẢI XUỐNG BACKEND
  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !creatorName) return alert("Vui lòng điền Tên giải và Người tổ chức!");
    if (selectedSportsCount === 0) return alert("Phải chọn ít nhất 1 môn thi đấu!");

    const payload = {
      name: eventName,
      creator: creatorName,
      sports: { run: includeRun, ride: includeRide, swim: includeSwim },
      settings: {
        pointsConversion: enablePointsConversion,
        run: includeRun ? runConfig : null,
        ride: includeRide ? rideConfig : null,
        swim: includeSwim ? swimConfig : null,
        antiCheat: enableAntiCheat
      }
    };

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("🚀 Đã tạo giải đấu thành công! Đang chờ Admin duyệt.");
        setEventName("");
        fetchEvents(); // Tải lại danh sách để thấy giải mới
      }
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  // 3. ADMIN BẤM NÚT DUYỆT GIẢI XUỐNG BACKEND
  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/events/${id}/approve`, { method: "PUT" });
      if (res.ok) {
        alert(`🎉 Phê duyệt thành công giải đấu #${id}!`);
        fetchEvents(); // Tải lại danh sách cập nhật trạng thái
      }
    } catch (error) {
      alert("Lỗi khi duyệt giải!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tighter">
          MY<span className="text-orange-500">RACE</span> <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-md ml-2">PRO ADMIN</span>
        </h1>
        <div className="flex gap-4 font-bold text-sm text-gray-500">
          <a href="/profile?id=33415712" className="hover:text-orange-500">Dashboard</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KHU VỰC 1: BẢNG ADMIN XÉT DUYỆT */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
              <span>⏳</span> DANH SÁCH CHỜ PHÊ DUYỆT ({events.filter(e => e.status === "pending").length})
            </h2>
            <div className="space-y-4">
              {events.filter(e => e.status === "pending").map((ev) => (
                <div key={ev.id} className="p-5 bg-gray-50 rounded-2xl border flex flex-col justify-between gap-4">
                  <div>
                    <span className="bg-gray-200 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase">ID: #{ev.id}</span>
                    <h3 className="font-black text-lg text-gray-900 mt-2">{ev.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">Người tổ chức: {ev.creator_name}</p>
                    
                    {ev.rules?.antiCheat && (
                      <span className="mt-2 inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">
                        🤖 Đã bật Anti-Cheat AI
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 justify-end pt-3 border-t">
                    <button onClick={() => handleApprove(ev.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Phê duyệt giải</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight uppercase">🟢 GIẢI ĐẤU ĐANG HOẠT ĐỘNG</h2>
            <div className="divide-y divide-gray-100">
              {events.filter(e => e.status === "approved").map((ev) => (
                <div key={ev.id} className="py-4 flex justify-between items-center">
                  <div>
                    <a href={`/event/${ev.id}`} className="font-extrabold text-blue-600 hover:underline">{ev.name}</a>
                    <p className="text-xs text-gray-400 mt-1">Sắp xếp luật sinh học hoàn tất.</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KHU VỰC 2: FORM TẠO GIẢI MỚI (Rút gọn HTML ở đây cho sếp dễ nhìn, sếp dán lại cái form cấu hình môn thi đấu y hệt như bản trước vào chỗ này nhé) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">➕ TẠO GIẢI MỚI</h2>
          <form onSubmit={handleSubmitEvent} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Tên giải đấu</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Người tổ chức</label>
              <input type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500" />
            </div>
            {/* LƯU Ý: Chỗ này sếp chèn lại các Box chọn môn (Run, Ride, Swim) và Mắt thần Anti-Cheat từ bản trước vào đây để tránh file bị quá dài nhé! */}
            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-black text-lg py-5 rounded-2xl shadow-xl transition transform hover:-translate-y-1">
              CHỐT LUẬT & GỬI YÊU CẦU
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}