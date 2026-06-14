"use client";
import React, { useState, useEffect } from 'react';

// SẾP LƯU Ý: Thay đường link này bằng link Backend Render thực tế của sếp nhé!
const API_URL = "https://myrace-backend.onrender.com";

export default function UltimateAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventName, setEventName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  
  // 1. Quản lý chọn môn thi đấu
  const [includeRun, setIncludeRun] = useState(true);
  const [includeRide, setIncludeRide] = useState(false);
  const [includeSwim, setIncludeSwim] = useState(false);

  const selectedSportsCount = [includeRun, includeRide, includeSwim].filter(Boolean).length;

  // 2. Quản lý Quy đổi điểm (Chỉ khả dụng khi >= 2 môn)
  const [enablePointsConversion, setEnablePointsConversion] = useState(false);

  // Tự động tắt quy đổi nếu số môn giảm xuống dưới 2
  useEffect(() => {
    if (selectedSportsCount < 2) {
      setEnablePointsConversion(false);
    }
  }, [selectedSportsCount]);

  // 3. Cấu hình các môn (Theo sát chính xác file quy định kỹ thuật sếp gửi)
  const [runConfig, setRunConfig] = useState({ 
    multiplier: 10, minDistance: 1.0, movingRatio: 90, 
    paceMin: 4.0, paceMax: 15.0, requireGps: true, requirePublic: true 
  });

  const [rideConfig, setRideConfig] = useState({ 
    multiplier: 3, minDistance: 5.0, movingRatio: 85, 
    speedMin: 15, speedMax: 45, requireHr: true, requireCadence: true, cadenceMin: 60, cadenceMax: 100
  });

  const [swimConfig, setSwimConfig] = useState({ 
    multiplier: 40, minDistance: 0.1, movingRatio: 90, swimType: "pool",
    paceMin: 1.5, paceMax: 3.5 
  });

  const [enableAntiCheat, setEnableAntiCheat] = useState(true);

  // CỔNG CHUYỂN DỮ LIỆU THẬT VỚI RENDER BACKEND
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối API lấy danh sách giải:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !creatorName) return alert("Sếp vui lòng điền đầy đủ Tên giải và Người tổ chức!");
    if (selectedSportsCount === 0) return alert("Sếp phải chọn ít nhất 1 môn thi đấu cho giải!");

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
        alert("🚀 Gửi yêu cầu tạo giải đấu thành công! Đang chờ duyệt.");
        setEventName("");
        fetchEvents(); // Tải lại danh sách thật tự động
      } else {
        alert("Có lỗi xảy ra khi tạo giải từ phía máy chủ.");
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ Render!");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/events/${id}/approve`, { method: "PUT" });
      if (res.ok) {
        alert(`🎉 Phê duyệt thành công giải đấu #${id}! Luật chơi sinh học đã được kích hoạt.`);
        fetchEvents();
      }
    } catch (error) {
      alert("Lỗi kết nối khi duyệt giải!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      {/* Thanh điều hướng Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8 border-b border-gray-100">
        <h1 className="text-2xl font-black tracking-tighter">
          MY<span className="text-orange-500">RACE</span> <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-md ml-2">PRO CONSOLE</span>
        </h1>
        <div className="flex gap-4 font-bold text-sm text-gray-500">
          <a href="/profile?id=33415712" className="hover:text-orange-500 transition">Dashboard</a>
          <a href="/leaderboard" className="hover:text-orange-500 transition">Leaderboard</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* BÊN TRÁI: KHU VỰC XÉT DUYỆT (7 Cột) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
              <span>⏳</span> ĐƠN HÀNG CHỜ PHÊ DUYỆT ({events.filter(e => e.status === "pending").length})
            </h2>

            <div className="space-y-4">
              {events.filter(e => e.status === "pending").length === 0 ? (
                <p className="text-gray-400 font-medium text-center py-8">Không có giải đấu nào đang chờ phê duyệt. Sếp có thể thong thả! ☕</p>
              ) : (
                events.filter(e => e.status === "pending").map((ev) => (
                  <div key={ev.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between gap-4 transition hover:shadow-md">
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className="bg-gray-200 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase">Event ID: #{ev.id}</span>
                        <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">Chờ duyệt</span>
                      </div>
                      <h3 className="font-black text-lg text-gray-900 mt-2">{ev.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">Người tổ chức: <span className="text-gray-800 font-bold">{ev.creator_name}</span></p>
                      
                      {/* Bảng phân tích cấu hình luật trong DB */}
                      <div className="mt-4 overflow-hidden border border-gray-100 rounded-xl bg-white shadow-2xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-2">Môn thi đấu</th>
                              <th className="px-4 py-2 text-center">Hệ số</th>
                              <th className="px-4 py-2 text-center">Yêu cầu tỷ lệ</th>
                              <th className="px-4 py-2 text-center">Chống Cheat</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {ev.sports_included?.run && (
                              <tr>
                                <td className="px-4 py-2 font-bold">🏃‍♂️ Chạy bộ (Run)</td>
                                <td className="px-4 py-2 text-center text-orange-600 font-black">x{ev.rules?.run?.multiplier || 10}</td>
                                <td className="px-4 py-2 text-center">{ev.rules?.run?.movingRatio || 90}%</td>
                                <td className="px-4 py-2 text-center">{ev.rules?.antiCheat ? "🔥 Đang bật" : "❌ Tắt"}</td>
                              </tr>
                            )}
                            {ev.sports_included?.ride && (
                              <tr>
                                <td className="px-4 py-2 font-bold">🚴 Đạp xe (Ride)</td>
                                <td className="px-4 py-2 text-center text-blue-600 font-black">x{ev.rules?.ride?.multiplier || 3}</td>
                                <td className="px-4 py-2 text-center">{ev.rules?.ride?.movingRatio || 85}%</td>
                                <td className="px-4 py-2 text-center">{ev.rules?.antiCheat ? "🔥 Đang bật" : "❌ Tắt"}</td>
                              </tr>
                            )}
                            {ev.sports_included?.swim && (
                              <tr>
                                <td className="px-4 py-2 font-bold">🏊 Bơi lội (Swim)</td>
                                <td className="px-4 py-2 text-center text-cyan-600 font-black">x{ev.rules?.swim?.multiplier || 40}</td>
                                <td className="px-4 py-2 text-center">{ev.rules?.swim?.movingRatio || 90}%</td>
                                <td className="px-4 py-2 text-center">{ev.rules?.antiCheat ? "🔥 Đang bật" : "❌ Tắt"}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                      <button onClick={() => handleApprove(ev.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition">Phê duyệt giải</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DANH SÁCH CÁC GIẢI ĐÃ XÉT DUYỆT ĐANG CHẠY */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight uppercase">🟢 GIẢI ĐẤU ĐANG HOẠT ĐỘNG</h2>
            <div className="divide-y divide-gray-100">
              {events.filter(e => e.status === "approved").map((ev) => (
                <div key={ev.id} className="py-4 flex justify-between items-center">
                  <div>
                    <a href={`/event/${ev.id}`} className="font-extrabold text-blue-600 hover:underline">{ev.name}</a>
                    <p className="text-xs text-gray-400 mt-1">Tổ chức bởi: {ev.creator_name}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BÊN PHẢI: FORM THIẾT LẬP GIẢI ĐẤU ĐA MÔN ĐẦY ĐỦ (5 Cột) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
          <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight uppercase">➕ THIẾT LẬP GIẢI ĐẤU MỚI</h2>
          
          <form onSubmit={handleSubmitEvent} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tên giải đấu / Sự kiện</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Ví dụ: Thử Thách Ba Môn Phối Hợp..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 transition" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tên đơn vị / Người tổ chức</label>
              <input type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder="Ví dụ: Công ty Sếp Hiển..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 transition" />
            </div>

            {/* BẢNG CHỌN SỐ LƯỢNG MÔN THI ĐẤU */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Lựa chọn các môn thi đấu áp dụng</label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setIncludeRun(!includeRun)} className={`p-3 rounded-xl border-2 text-center text-xs font-bold flex flex-col items-center gap-1 transition ${includeRun ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-2xs' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                  <span className="text-xl">🏃‍♂️</span> Chạy Bộ
                </button>
                <button type="button" onClick={() => setIncludeRide(!includeRide)} className={`p-3 rounded-xl border-2 text-center text-xs font-bold flex flex-col items-center gap-1 transition ${includeRide ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-2xs' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                  <span className="text-xl">🚴</span> Đạp Xe
                </button>
                <button type="button" onClick={() => setIncludeSwim(!includeSwim)} className={`p-3 rounded-xl border-2 text-center text-xs font-bold flex flex-col items-center gap-1 transition ${includeSwim ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-2xs' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                  <span className="text-xl">🏊</span> Bơi Lội
                </button>
              </div>
            </div>

            {/* Tuỳ chọn Quy đổi điểm (Chỉ hiện khi có >= 2 môn) */}
            {selectedSportsCount > 1 && (
              <div className={`p-4 rounded-2xl border-2 flex items-center justify-between transition cursor-pointer ${enablePointsConversion ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`} onClick={() => setEnablePointsConversion(!enablePointsConversion)}>
                <div>
                  <h4 className={`text-sm font-black ${enablePointsConversion ? 'text-purple-700' : 'text-gray-600'}`}>🎯 Kích hoạt Quy đổi điểm</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">Cấu hình hệ số điểm quy đổi giữa các môn.</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${enablePointsConversion ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${enablePointsConversion ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            )}

            {/* CẤU HÌNH THÔNG SỐ ĐỘNG - CHẠY BỘ */}
            {includeRun && (
              <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-black text-orange-700 uppercase tracking-wider">⚙️ Thông số Chạy Bộ</h4>
                  {enablePointsConversion && (
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-orange-200">
                      <label className="text-gray-500 text-[10px] font-bold">Hệ số:</label>
                      <input type="number" value={runConfig.multiplier} onChange={(e) => setRunConfig({...runConfig, multiplier: Number(e.target.value)})} className="w-10 text-center font-black text-orange-600 bg-transparent" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  <div>
                    <label className="text-gray-500 block mb-1">Pace (min/km) [Min-Max]</label>
                    <div className="flex items-center gap-1">
                      <input type="number" step="0.1" value={runConfig.paceMin} onChange={(e) => setRunConfig({...runConfig, paceMin: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                      <span>-</span>
                      <input type="number" step="0.1" value={runConfig.paceMax} onChange={(e) => setRunConfig({...runConfig, paceMax: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Min Km/Cuốc chạy</label>
                    <input type="number" step="0.1" value={runConfig.minDistance} onChange={(e) => setRunConfig({...runConfig, minDistance: Number(e.target.value)})} className="w-full bg-white border px-3 py-1 rounded-lg text-center" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">Tỷ lệ hiệu suất thời gian (Moving Ratio %)</label>
                    <input type="number" value={runConfig.movingRatio} onChange={(e) => setRunConfig({...runConfig, movingRatio: Number(e.target.value)})} className="w-full bg-white border px-3 py-1 rounded-lg text-center font-bold" />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-bold text-gray-600">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={runConfig.requireGps} onChange={(e) => setRunConfig({...runConfig, requireGps: e.target.checked})} className="accent-orange-500" /> Bắt buộc GPS</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={runConfig.requirePublic} onChange={(e) => setRunConfig({...runConfig, requirePublic: e.target.checked})} className="accent-orange-500" /> Hoạt động Public</label>
                </div>
              </div>
            )}

            {/* CẤU HÌNH THÔNG SỐ ĐỘNG - ĐẠP XE */}
            {includeRide && (
              <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider">⚙️ Thông số Đạp Xe</h4>
                  {enablePointsConversion && (
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-blue-200">
                      <label className="text-gray-500 text-[10px] font-bold">Hệ số:</label>
                      <input type="number" value={rideConfig.multiplier} onChange={(e) => setRideConfig({...rideConfig, multiplier: Number(e.target.value)})} className="w-10 text-center font-black text-blue-600 bg-transparent" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  <div>
                    <label className="text-gray-500 block mb-1">Tốc độ (km/h) [Min-Max]</label>
                    <div className="flex items-center gap-1">
                      <input type="number" value={rideConfig.speedMin} onChange={(e) => setRideConfig({...rideConfig, speedMin: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                      <span>-</span>
                      <input type="number" value={rideConfig.speedMax} onChange={(e) => setRideConfig({...rideConfig, speedMax: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Guồng chân Cadence (rpm)</label>
                    <div className="flex items-center gap-1">
                      <input type="number" value={rideConfig.cadenceMin} onChange={(e) => setRideConfig({...rideConfig, cadenceMin: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                      <span>-</span>
                      <input type="number" value={rideConfig.cadenceMax} onChange={(e) => setRideConfig({...rideConfig, cadenceMax: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold mt-2">
                  <div>
                    <label className="text-gray-500 block mb-1">Min Km/Cuốc đạp</label>
                    <input type="number" step="0.1" value={rideConfig.minDistance} onChange={(e) => setRideConfig({...rideConfig, minDistance: Number(e.target.value)})} className="w-full bg-white border px-3 py-1 rounded-lg text-center" />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Moving Ratio (%)</label>
                    <input type="number" value={rideConfig.movingRatio} onChange={(e) => setRideConfig({...rideConfig, movingRatio: Number(e.target.value)})} className="w-full bg-white border px-3 py-1 rounded-lg text-center" />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-bold text-gray-600">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={rideConfig.requireHr} onChange={(e) => setRideConfig({...rideConfig, requireHr: e.target.checked})} className="accent-blue-500" /> Bắt buộc Nhịp tim (HR)</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={rideConfig.requireCadence} onChange={(e) => setRideConfig({...rideConfig, requireCadence: e.target.checked})} className="accent-blue-500" /> Bắt buộc Guồng chân</label>
                </div>
              </div>
            )}

            {/* CẤU HÌNH THÔNG SỐ ĐỘNG - BƠI LỘI */}
            {includeSwim && (
              <div className="p-4 bg-cyan-50/40 rounded-2xl border border-cyan-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-black text-cyan-700 uppercase tracking-wider">⚙️ Thông số Bơi Lội</h4>
                  {enablePointsConversion && (
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-cyan-200">
                      <label className="text-gray-500 text-[10px] font-bold">Hệ số:</label>
                      <input type="number" value={swimConfig.multiplier} onChange={(e) => setSwimConfig({...swimConfig, multiplier: Number(e.target.value)})} className="w-10 text-center font-black text-cyan-600 bg-transparent" />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="text-gray-500 text-xs font-bold block mb-1">Loại hình bơi</label>
                  <div className="flex gap-4 text-xs font-bold">
                    <label className="flex items-center gap-1"><input type="radio" name="swimType" checked={swimConfig.swimType === "open"} onChange={() => setSwimConfig({...swimConfig, swimType: "open"})} className="accent-cyan-500" /> Bơi biển (GPS)</label>
                    <label className="flex items-center gap-1"><input type="radio" name="swimType" checked={swimConfig.swimType === "pool"} onChange={() => setSwimConfig({...swimConfig, swimType: "pool"})} className="accent-cyan-500" /> Bơi bể (No GPS)</label>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <div className="col-span-2">
                    <label className="text-gray-500 block mb-1">Pace bơi (phút/100m)</label>
                    <div className="flex items-center gap-1">
                      <input type="number" step="0.1" value={swimConfig.paceMin} onChange={(e) => setSwimConfig({...swimConfig, paceMin: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                      <span>-</span>
                      <input type="number" step="0.1" value={swimConfig.paceMax} onChange={(e) => setSwimConfig({...swimConfig, paceMax: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Moving (%)</label>
                    <input type="number" value={swimConfig.movingRatio} onChange={(e) => setSwimConfig({...swimConfig, movingRatio: Number(e.target.value)})} className="w-full bg-white border px-2 py-1 rounded-lg text-center" />
                  </div>
                </div>
              </div>
            )}

            {/* MẮT THẦN ANTI-CHEAT */}
            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition ${enableAntiCheat ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <input type="checkbox" checked={enableAntiCheat} onChange={(e) => setEnableAntiCheat(e.target.checked)} className="w-5 h-5 mt-0.5 accent-red-600 cursor-pointer" />
              <div>
                <h4 className={`text-sm font-black ${enableAntiCheat ? 'text-red-700' : 'text-gray-500'}`}>🤖 AI Anti-Cheat & Báo cáo vi phạm</h4>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Tự động phát hiện gian lận sinh học chéo chẽ giữa Nhịp tim - Pace - Guồng chân để báo cáo phạm quy.</p>
              </div>
            </div>

            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-black text-lg py-5 rounded-2xl shadow-xl transition transform hover:-translate-y-1">
              CHỐT LUẬT & GỬI YÊU CẦU
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}