"use client";
import React, { useState } from 'react';

export default function AdvancedAdminPage() {
  // Quản lý danh sách giải đấu (Dữ liệu mẫu)
  const [events, setEvents] = useState([
    {
      id: 201,
      name: "Thử Thách Ba Môn Phối Hợp Sài Gòn",
      creator: "Ban Tổ Chức Ironman",
      status: "Pending",
      sports: { run: true, ride: true, swim: true },
      settings: {
        run: { multiplier: 10, minDistance: 2, requireGps: true },
        ride: { multiplier: 3, minDistance: 5, requireGps: true },
        swim: { multiplier: 40, minDistance: 0.5, requireGps: false }
      }
    },
    {
      id: 1,
      name: "Thử thách tháng 6 - Vượt qua giới hạn",
      creator: "Sếp Hiển",
      status: "Approved",
      sports: { run: true, ride: false, swim: false },
      settings: {
        run: { multiplier: 10, minDistance: 0, requireGps: false }
      }
    }
  ]);

  // State quản lý Form tạo giải mới
  const [eventName, setEventName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  
  // State bật/tắt các môn thể thao trong giải
  const [includeRun, setIncludeRun] = useState(true);
  const [includeRide, setIncludeRide] = useState(false);
  const [includeSwim, setIncludeSwim] = useState(false);

  // State cấu hình chi tiết cho từng môn
  const [runConfig, setRunConfig] = useState({ multiplier: 10, minDistance: 1, requireGps: true });
  const [rideConfig, setRideConfig] = useState({ multiplier: 3, minDistance: 5, requireGps: true });
  const [swimConfig, setSwimConfig] = useState({ multiplier: 40, minDistance: 0.2, requireGps: false });

  // Xử lý duyệt giải
  const handleApprove = (id: number) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, status: "Approved" } : ev));
    alert(`🎉 Phê duyệt thành công giải đấu #${id}! Động cơ AI Trọng tài đã được nạp luật chơi.`);
  };

  // Xử lý từ chối
  const handleReject = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  // Xử lý nộp form tạo giải
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !creatorName) return alert("Sếp điền đầy đủ Tên giải và Người tổ chức nhé!");
    if (!includeRun && !includeRide && !includeSwim) return alert("Sếp phải chọn ít nhất 1 môn thi đấu cho giải chứ ạ!");

    const finalSettings: any = {};
    if (includeRun) finalSettings.run = runConfig;
    if (includeRide) finalSettings.ride = rideConfig;
    if (includeSwim) finalSettings.swim = swimConfig;

    const newEvent = {
      id: Date.now(),
      name: eventName,
      creator: creatorName,
      status: "Pending",
      sports: { run: includeRun, ride: includeRide, swim: includeSwim },
      settings: finalSettings
    };

    setEvents([newEvent, ...events]);
    setEventName("");
    alert("🚀 Gửi giải đấu lên hệ thống thành công! Đang chờ Admin phê duyệt.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      {/* Navbar điều hướng */}
      <nav className="bg-white shadow-xs px-6 py-4 flex justify-between items-center mb-8 border-b border-gray-100">
        <h1 className="text-2xl font-black tracking-tighter">
          MY<span className="text-orange-500">RACE</span> <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-md ml-2">Console</span>
        </h1>
        <div className="flex gap-4 font-bold text-sm text-gray-500">
          <a href="/profile?id=33415712" className="hover:text-orange-500 transition">Dashboard</a>
          <a href="/leaderboard" className="hover:text-orange-500 transition">Leaderboard</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* BÊN TRÁI: BẢNG KIỂM SOÁT DUYỆT GIẢI ĐẤU (Chiếm 7 cột) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
              <span>⏳</span> DANH SÁCH CHỜ PHÊ DUYỆT ({events.filter(e => e.status === "Pending").length})
            </h2>

            <div className="space-y-4">
              {events.filter(e => e.status === "Pending").length === 0 ? (
                <p className="text-gray-400 font-medium text-center py-8">Không có giải đấu nào đang chờ phê duyệt. Sếp có thể thong thả! ☕</p>
              ) : (
                events.filter(e => e.status === "Pending").map((ev) => (
                  <div key={ev.id} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-200 flex flex-col justify-between gap-4 transition hover:shadow-sm">
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className="bg-gray-200 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase">Event ID: #{ev.id}</span>
                        <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">Chờ duyệt</span>
                      </div>
                      <h3 className="font-black text-lg text-gray-900 mt-2">{ev.name}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">Người tổ chức: <span className="text-gray-800 font-bold">{ev.creator}</span></p>
                      
                      {/* Bảng phân tích thông số kỹ thuật được cấu hình sâu */}
                      <div className="mt-4 overflow-hidden border border-gray-100 rounded-xl bg-white shadow-2xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-2">Môn thi đấu</th>
                              <th className="px-4 py-2 text-center">Hệ số nhân</th>
                              <th className="px-4 py-2 text-center">Min Km/Cuốc</th>
                              <th className="px-4 py-2 text-center">Yêu cầu GPS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {ev.settings.run && (
                              <tr>
                                <td className="px-4 py-2 font-bold">🏃‍♂️ Chạy bộ (Run)</td>
                                <td className="px-4 py-2 text-center text-orange-600 font-black">x{ev.settings.run.multiplier}</td>
                                <td className="px-4 py-2 text-center">{ev.settings.run.minDistance} km</td>
                                <td className="px-4 py-2 text-center">{ev.settings.run.requireGps ? "✅ Bắt buộc" : "❌ Không"}</td>
                              </tr>
                            )}
                            {ev.settings.ride && (
                              <tr>
                                <td className="px-4 py-2 font-bold">🚴 Đạp xe (Ride)</td>
                                <td className="px-4 py-2 text-center text-blue-600 font-black">x{ev.settings.ride.multiplier}</td>
                                <td className="px-4 py-2 text-center">{ev.settings.ride.minDistance} km</td>
                                <td className="px-4 py-2 text-center">{ev.settings.ride.requireGps ? "✅ Bắt buộc" : "❌ Không"}</td>
                              </tr>
                            )}
                            {ev.settings.swim && (
                              <tr>
                                <td className="px-4 py-2 font-bold">🏊 Bơi lội (Swim)</td>
                                <td className="px-4 py-2 text-center text-cyan-600 font-black">x{ev.settings.swim.multiplier}</td>
                                <td className="px-4 py-2 text-center">{ev.settings.swim.minDistance} km</td>
                                <td className="px-4 py-2 text-center">{ev.settings.swim.requireGps ? "✅ Bắt buộc" : "❌ Không"}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full justify-end border-t border-gray-100 pt-3">
                      <button onClick={() => handleApprove(ev.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition">
                        Phê duyệt giải
                      </button>
                      <button onClick={() => handleReject(ev.id)} className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs transition">
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Các giải đấu ĐANG HOẠT ĐỘNG */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight uppercase">🟢 GIẢI ĐẤU ĐANG HOẠT ĐỘNG</h2>
            <div className="divide-y divide-gray-100">
              {events.filter(e => e.status === "Approved").map((ev) => (
                <div key={ev.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-extrabold text-gray-800">{ev.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Cấu hình: {Object.keys(ev.settings).map(k => k.toUpperCase()).join(' + ')}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BÊN PHẢI: FORM CẤU HÌNH TẠO GIẢI ĐA MÔN ĐỘNG (Chiếm 5 cột) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 h-fit">
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

            {/* CẤU HÌNH THÔNG SỐ ĐỘNG - CHỈ HIỆN KHI MÔN ĐÓ ĐƯỢC BẬT */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              
              {/* Cấu hình Chạy bộ */}
              {includeRun && (
                <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 animate-fade-in">
                  <h4 className="text-xs font-black text-orange-700 uppercase tracking-wider mb-3 flex items-center gap-1">⚙️ Bảng cài đặt thông số Chạy Bộ</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="text-gray-500 block mb-1">Hệ số quy đổi (1km = ? điểm)</label>
                      <input type="number" value={runConfig.multiplier} onChange={(e) => setRunConfig({...runConfig, multiplier: Number(e.target.value)})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-center focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Min Km / Cuốc chạy</label>
                      <input type="number" step="0.1" value={runConfig.minDistance} onChange={(e) => setRunConfig({...runConfig, minDistance: Number(e.target.value)})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-center focus:outline-none" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-xs font-bold text-gray-600 select-none cursor-pointer">
                    <input type="checkbox" checked={runConfig.requireGps} onChange={(e) => setRunConfig({...runConfig, requireGps: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500" />
                    <span>Yêu cầu bắt buộc dữ liệu bản đồ GPS (Chống cheat)</span>
                  </label>
                </div>
              )}

              {/* Cấu hình Đạp xe */}
              {includeRide && (
                <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 animate-fade-in">
                  <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1">⚙️ Bảng cài đặt thông số Đạp Xe</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="text-gray-500 block mb-1">Hệ số quy đổi (1km = ? điểm)</label>
                      <input type="number" value={rideConfig.multiplier} onChange={(e) => setRideConfig({...rideConfig, multiplier: Number(e.target.value)})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-center focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Min Km / Cuốc đạp</label>
                      <input type="number" step="0.1" value={rideConfig.minDistance} onChange={(e) => setRideConfig({...rideConfig, minDistance: Number(e.target.value)})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-center focus:outline-none" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-xs font-bold text-gray-600 select-none cursor-pointer">
                    <input type="checkbox" checked={rideConfig.requireGps} onChange={(e) => setRideConfig({...rideConfig, requireGps: e.target.checked})} className="rounded text-blue-500 focus:ring-blue-500" />
                    <span>Yêu cầu bắt buộc dữ liệu bản đồ GPS (Chống cheat)</span>
                  </label>
                </div>
              )}

              {/* Cấu hình Bơi lội */}
              {includeSwim && (
                <div className="p-4 bg-cyan-50/40 rounded-2xl border border-cyan-100 animate-fade-in">
                  <h4 className="text-xs font-black text-cyan-700 uppercase tracking-wider mb-3 flex items-center gap-1">⚙️ Bảng cài đặt thông số Bơi Lội</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="text-gray-500 block mb-1">Hệ số quy đổi (1km = ? điểm)</label>
                      <input type="number" value={swimConfig.multiplier} onChange={(e) => setSwimConfig({...swimConfig, multiplier: Number(e.target.value)})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-center focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Min Km / Cuốc bơi</label>
                      <input type="number" step="0.1" value={swimConfig.minDistance} onChange={(e) => setSwimConfig({...swimConfig, minDistance: Number(e.target.value)})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-center focus:outline-none" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-xs font-bold text-gray-600 select-none cursor-pointer">
                    <input type="checkbox" checked={swimConfig.requireGps} onChange={(e) => setSwimConfig({...swimConfig, requireGps: e.target.checked})} className="rounded text-cyan-500 focus:ring-cyan-500" />
                    <span>Yêu cầu bắt buộc dữ liệu bản đồ GPS (Chống cheat)</span>
                  </label>
                </div>
              )}

            </div>

            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl text-sm shadow-md transition transform hover:-translate-y-0.5">
              GỬI YÊU CẦU DUYỆT GIẢI ĐẤU
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}