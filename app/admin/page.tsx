"use client";
import React, { useState } from 'react';

export default function UltimateAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventName, setEventName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  
  // 1. Quản lý môn thi đấu
  const [includeRun, setIncludeRun] = useState(true);
  const [includeRide, setIncludeRide] = useState(false);
  const [includeSwim, setIncludeSwim] = useState(false);

  // Biến đếm số môn để quyết định ẩn/hiện Hệ số quy đổi điểm
  const selectedSportsCount = [includeRun, includeRide, includeSwim].filter(Boolean).length;

  // 2. Cấu hình CHẠY BỘ (RUN)
  const [runConfig, setRunConfig] = useState({ 
    multiplier: 10, minDistance: 1, maxElapsedTimeMin: 300, 
    paceMin: 3.5, paceMax: 15, requireGps: true, requirePublic: true, requireElevation: false 
  });

  // 3. Cấu hình ĐẠP XE (RIDE)
  const [rideConfig, setRideConfig] = useState({ 
    multiplier: 3, minDistance: 5, maxElapsedTimeMin: 600, 
    speedMin: 10, speedMax: 45, requireHr: true, requireCadence: true 
  });

  // 4. Cấu hình BƠI LỘI (SWIM)
  const [swimConfig, setSwimConfig] = useState({ 
    multiplier: 40, minDistance: 0.5, swimType: "pool", // "pool" hoặc "open"
    paceMin: 1.5, paceMax: 5, requireHr: false 
  });

  // 5. Cấu hình ANTI-CHEAT AI
  const [enableAntiCheat, setEnableAntiCheat] = useState(true);

  // Nộp Form
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !creatorName) return alert("Vui lòng điền Tên giải và Người tổ chức!");
    if (selectedSportsCount === 0) return alert("Phải chọn ít nhất 1 môn thi đấu!");

    const newEvent = {
      id: Date.now(), name: eventName, creator: creatorName, status: "Pending",
      sports: { run: includeRun, ride: includeRide, swim: includeSwim },
      settings: {
        run: includeRun ? runConfig : null,
        ride: includeRide ? rideConfig : null,
        swim: includeSwim ? swimConfig : null,
        antiCheat: enableAntiCheat
      }
    };
    setEvents([newEvent, ...events]);
    setEventName("");
    alert("🚀 Đã tạo giải đấu với bộ luật Chuyên Nghiệp! Đang chờ duyệt.");
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

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase">Thiết lập Giải Đấu Chuyên Nghiệp</h2>
          <p className="text-gray-500 mb-8 font-medium">Hệ thống hỗ trợ cấu hình sinh học và Anti-Cheat AI.</p>
          
          <form onSubmit={handleSubmitEvent} className="space-y-8">
            {/* Thông tin cơ bản */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tên giải đấu</label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Người tổ chức</label>
                <input type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-orange-500 outline-none" />
              </div>
            </div>

            {/* Chọn môn */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Chọn môn thi đấu ({selectedSportsCount} môn)</label>
              <div className="grid grid-cols-3 gap-4">
                <button type="button" onClick={() => setIncludeRun(!includeRun)} className={`py-4 rounded-2xl border-2 font-black transition ${includeRun ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>🏃 RUN</button>
                <button type="button" onClick={() => setIncludeRide(!includeRide)} className={`py-4 rounded-2xl border-2 font-black transition ${includeRide ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>🚴 RIDE</button>
                <button type="button" onClick={() => setIncludeSwim(!includeSwim)} className={`py-4 rounded-2xl border-2 font-black transition ${includeSwim ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>🏊 SWIM</button>
              </div>
            </div>

            {/* Cảnh báo tính điểm */}
            {selectedSportsCount > 1 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                <span>⚠️</span> Vì giải đấu có {selectedSportsCount} môn, sếp cần thiết lập "Hệ số quy đổi điểm" cho từng môn để xếp hạng chung.
              </div>
            )}

            {/* BOX CẤU HÌNH CHẠY BỘ */}
            {includeRun && (
              <div className="p-6 bg-white rounded-2xl border-2 border-orange-100 shadow-sm">
                <h4 className="text-lg font-black text-orange-600 mb-4 border-b pb-2">🏃‍♂️ LUẬT CHẠY BỘ (RUN)</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm font-medium">
                  {selectedSportsCount > 1 && (
                    <div><label className="text-gray-500 text-xs">Hệ số (1km = ? điểm)</label><input type="number" value={runConfig.multiplier} onChange={(e) => setRunConfig({...runConfig, multiplier: Number(e.target.value)})} className="w-full mt-1 bg-gray-50 border px-3 py-2 rounded-lg" /></div>
                  )}
                  <div><label className="text-gray-500 text-xs">Min/Max Pace (phút/km)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" step="0.1" value={runConfig.paceMin} onChange={(e) => setRunConfig({...runConfig, paceMin: Number(e.target.value)})} className="w-full bg-gray-50 border px-2 py-2 rounded-lg text-center" />
                      <span>-</span>
                      <input type="number" step="0.1" value={runConfig.paceMax} onChange={(e) => setRunConfig({...runConfig, paceMax: Number(e.target.value)})} className="w-full bg-gray-50 border px-2 py-2 rounded-lg text-center" />
                    </div>
                  </div>
                  <div><label className="text-gray-500 text-xs">Cự ly tối thiểu (km)</label><input type="number" step="0.1" value={runConfig.minDistance} onChange={(e) => setRunConfig({...runConfig, minDistance: Number(e.target.value)})} className="w-full mt-1 bg-gray-50 border px-3 py-2 rounded-lg" /></div>
                  <div><label className="text-gray-500 text-xs">Max Elapsed Time (Phút)</label><input type="number" value={runConfig.maxElapsedTimeMin} onChange={(e) => setRunConfig({...runConfig, maxElapsedTimeMin: Number(e.target.value)})} className="w-full mt-1 bg-gray-50 border px-3 py-2 rounded-lg" /></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-gray-700">
                  <label className="flex items-center gap-1"><input type="checkbox" checked={runConfig.requireGps} onChange={(e) => setRunConfig({...runConfig, requireGps: e.target.checked})} className="accent-orange-500 w-4 h-4" /> Bắt buộc có GPS</label>
                  <label className="flex items-center gap-1"><input type="checkbox" checked={runConfig.requirePublic} onChange={(e) => setRunConfig({...runConfig, requirePublic: e.target.checked})} className="accent-orange-500 w-4 h-4" /> Hoạt động Public</label>
                  <label className="flex items-center gap-1"><input type="checkbox" checked={runConfig.requireElevation} onChange={(e) => setRunConfig({...runConfig, requireElevation: e.target.checked})} className="accent-orange-500 w-4 h-4" /> Ghi nhận Elevation</label>
                </div>
              </div>
            )}

            {/* BOX CẤU HÌNH ĐẠP XE */}
            {includeRide && (
              <div className="p-6 bg-white rounded-2xl border-2 border-blue-100 shadow-sm">
                <h4 className="text-lg font-black text-blue-600 mb-4 border-b pb-2">🚴 LUẬT ĐẠP XE (RIDE)</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm font-medium">
                  {selectedSportsCount > 1 && (
                    <div><label className="text-gray-500 text-xs">Hệ số (1km = ? điểm)</label><input type="number" value={rideConfig.multiplier} onChange={(e) => setRideConfig({...rideConfig, multiplier: Number(e.target.value)})} className="w-full mt-1 bg-gray-50 border px-3 py-2 rounded-lg" /></div>
                  )}
                  <div><label className="text-gray-500 text-xs">Tốc độ (km/h) [Min-Max]</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" value={rideConfig.speedMin} onChange={(e) => setRideConfig({...rideConfig, speedMin: Number(e.target.value)})} className="w-full bg-gray-50 border px-2 py-2 rounded-lg text-center" />
                      <span>-</span>
                      <input type="number" value={rideConfig.speedMax} onChange={(e) => setRideConfig({...rideConfig, speedMax: Number(e.target.value)})} className="w-full bg-gray-50 border px-2 py-2 rounded-lg text-center" />
                    </div>
                  </div>
                  <div><label className="text-gray-500 text-xs">Cự ly tối thiểu (km)</label><input type="number" step="0.1" value={rideConfig.minDistance} onChange={(e) => setRideConfig({...rideConfig, minDistance: Number(e.target.value)})} className="w-full mt-1 bg-gray-50 border px-3 py-2 rounded-lg" /></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-gray-700">
                  <label className="flex items-center gap-1"><input type="checkbox" checked={rideConfig.requireHr} onChange={(e) => setRideConfig({...rideConfig, requireHr: e.target.checked})} className="accent-blue-500 w-4 h-4" /> Bắt buộc có Nhịp tim (HR)</label>
                  <label className="flex items-center gap-1"><input type="checkbox" checked={rideConfig.requireCadence} onChange={(e) => setRideConfig({...rideConfig, requireCadence: e.target.checked})} className="accent-blue-500 w-4 h-4" /> Bắt buộc có Guồng chân (Cadence)</label>
                </div>
              </div>
            )}

            {/* BOX CẤU HÌNH BƠI LỘI */}
            {includeSwim && (
              <div className="p-6 bg-white rounded-2xl border-2 border-cyan-100 shadow-sm">
                <h4 className="text-lg font-black text-cyan-600 mb-4 border-b pb-2">🏊 LUẬT BƠI LỘI (SWIM)</h4>
                
                <div className="mb-4">
                  <label className="text-gray-500 text-xs font-bold block mb-2">Loại hình bơi (Quyết định GPS)</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold"><input type="radio" name="swimType" checked={swimConfig.swimType === "open"} onChange={() => setSwimConfig({...swimConfig, swimType: "open"})} className="accent-cyan-500" /> Bơi biển/Hồ (Bắt buộc GPS)</label>
                    <label className="flex items-center gap-2 text-sm font-bold"><input type="radio" name="swimType" checked={swimConfig.swimType === "pool"} onChange={() => setSwimConfig({...swimConfig, swimType: "pool"})} className="accent-cyan-500" /> Bơi bể (Không cần GPS)</label>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm font-medium">
                  {selectedSportsCount > 1 && (
                    <div><label className="text-gray-500 text-xs">Hệ số (1km = ? điểm)</label><input type="number" value={swimConfig.multiplier} onChange={(e) => setSwimConfig({...swimConfig, multiplier: Number(e.target.value)})} className="w-full mt-1 bg-gray-50 border px-3 py-2 rounded-lg" /></div>
                  )}
                  <div><label className="text-gray-500 text-xs">Pace Bơi (phút/100m)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" step="0.1" value={swimConfig.paceMin} onChange={(e) => setSwimConfig({...swimConfig, paceMin: Number(e.target.value)})} className="w-full bg-gray-50 border px-2 py-2 rounded-lg text-center" />
                      <span>-</span>
                      <input type="number" step="0.1" value={swimConfig.paceMax} onChange={(e) => setSwimConfig({...swimConfig, paceMax: Number(e.target.value)})} className="w-full bg-gray-50 border px-2 py-2 rounded-lg text-center" />
                    </div>
                  </div>
                  <div><label className="text-gray-500 text-xs">Cự ly tối thiểu (km)</label><input type="number" step="0.1" value={swimConfig.minDistance} onChange={(e) => setSwimConfig({...swimConfig, minDistance: Number(e.target.value)})} className="w-full mt-1 bg-gray-50 border px-3 py-2 rounded-lg" /></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-gray-700">
                  <label className="flex items-center gap-1"><input type="checkbox" checked={swimConfig.requireHr} onChange={(e) => setSwimConfig({...swimConfig, requireHr: e.target.checked})} className="accent-cyan-500 w-4 h-4" /> Bắt buộc có Nhịp tim (HR)</label>
                </div>
              </div>
            )}

            {/* MẮT THẦN ANTI-CHEAT */}
            <div className={`p-5 rounded-2xl border-2 flex items-start gap-4 transition ${enableAntiCheat ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <input type="checkbox" checked={enableAntiCheat} onChange={(e) => setEnableAntiCheat(e.target.checked)} className="w-6 h-6 mt-1 accent-red-600 cursor-pointer" />
              <div>
                <h4 className={`text-lg font-black ${enableAntiCheat ? 'text-red-700' : 'text-gray-500'}`}>🤖 Kích hoạt AI Anti-Cheat (Chống gian lận)</h4>
                <p className="text-sm text-gray-600 mt-1 font-medium">Hệ thống sẽ tự động đối chiếu chéo <span className="font-bold text-gray-800">Nhịp tim - Tốc độ - Guồng chân</span>. (Ví dụ: Chạy pace 3:00 nhưng Nhịp tim 90bpm ➔ Đánh dấu vi phạm "Nghi ngờ đi xe máy"). Khi phát hiện vi phạm, log sẽ không được tính điểm và sinh ra <b>Báo cáo vi phạm chi tiết</b>.</p>
              </div>
            </div>

            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-black text-lg py-5 rounded-2xl shadow-xl transition transform hover:-translate-y-1">
              CHỐT LUẬT & TẠO GIẢI ĐẤU
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}