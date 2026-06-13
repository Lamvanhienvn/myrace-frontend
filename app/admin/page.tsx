"use client";
import React, { useState } from 'react';

export default function AdminSettingsPage() {
  const [sports, setSports] = useState({ run: false, ride: false, swim: false });
  const [swimMode, setSwimMode] = useState('pool');
  const [isConversionEnabled, setIsConversionEnabled] = useState(false);
  const [convMode, setConvMode] = useState('points');

  const toggleSport = (s: 'run' | 'ride' | 'swim') => setSports({...sports, [s]: !sports[s]});
  const selectedCount = Object.values(sports).filter(Boolean).length;

  // --- HÀM BẮN DỮ LIỆU ĐÃ ĐƯỢC TÍCH HỢP BIẾN MÔI TRƯỜNG ---
  const handleCreateEvent = async () => {
    if (selectedCount === 0) {
      alert("⚠️ Vui lòng chọn ít nhất 1 môn thể thao!");
      return;
    }

    const payload = {
      sports: sports,
      swimMode: swimMode,
      isConversionEnabled: isConversionEnabled,
      convMode: convMode,
      conversionRates: { run: 10, ride: 3, swim: 40 } 
    };

    try {
      // Dùng biến môi trường ở đây để linh hoạt giữa localhost và link Internet
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/admin/event/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("🎉 Chúc mừng sếp! Cấu hình đã được lưu thành công!");
      } else {
        alert("❌ Lỗi cấu hình, Backend từ chối nhận dữ liệu.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("❌ Mất kết nối tới Backend.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans antialiased text-[#2D3748]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-5xl mx-auto pt-12 px-6">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden border border-gray-100">
          
          <div className="px-10 py-8 border-b border-gray-50 bg-white">
            <h1 className="text-3xl font-[900] text-gray-900 tracking-tight">
              Lựa chọn môn thi đấu và cài đặt thông số
            </h1>
            <p className="text-gray-500 mt-2 font-[500]">Thiết lập quy tắc, chống gian lận và cơ chế tính toán cho giải đấu.</p>
          </div>

          <div className="p-10 space-y-12">
            
            <section>
              <h2 className="text-[11px] font-[900] uppercase tracking-[0.2em] text-gray-400 mb-6">Bước 1: Chọn môn thi đấu</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SportBtn active={sports.run} onClick={() => toggleSport('run')} icon="🏃‍♂️" label="Chạy bộ" color="#FC4C02" />
                <SportBtn active={sports.ride} onClick={() => toggleSport('ride')} icon="🚴" label="Đạp xe" color="#0070F3" />
                <SportBtn active={sports.swim} onClick={() => toggleSport('swim')} icon="🏊‍♂️" label="Bơi lội" color="#00B4D8" />
              </div>
            </section>

            {selectedCount > 0 && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-[11px] font-[900] uppercase tracking-[0.2em] text-gray-400">Bước 2: Cài đặt thông số</h2>
                
                {sports.run && (
                  <ConfigBox title="Cấu hình Chạy bộ" color="#FC4C02" icon="🏃‍♂️">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <Field label="Quãng đường Min (km)" />
                      <Field label="Pace nhanh nhất (p/km)" />
                      <Field label="Pace chậm nhất (p/km)" />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <Toggle label="Bắt buộc GPS" />
                      <Toggle label="Chặn nhập tay" />
                      <Toggle label="Yêu cầu Nhịp tim" />
                    </div>
                  </ConfigBox>
                )}

                {sports.ride && (
                  <ConfigBox title="Cấu hình Đạp xe" color="#0070F3" icon="🚴">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <Field label="Quãng đường Min (km)" />
                      <Field label="Tốc độ tối đa (km/h)" />
                      <Field label="Độ cao Gain Min (m)" />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <Toggle label="Bắt buộc GPS" />
                      <Toggle label="Chặn Zwift/Virtual" />
                      <Toggle label="Yêu cầu Nhịp tim" />
                    </div>
                  </ConfigBox>
                )}

                {sports.swim && (
                  <ConfigBox title="Cấu hình Bơi lội" color="#00B4D8" icon="🏊‍♂️">
                    <div className="mb-6 flex gap-3">
                      <button onClick={() => setSwimMode('pool')} className={`px-6 py-3 rounded-xl font-[700] text-sm transition ${swimMode === 'pool' ? 'bg-[#00B4D8] text-white shadow-md' : 'bg-white border-2 border-gray-100 text-gray-400'}`}>Bơi bể (Pool)</button>
                      <button onClick={() => setSwimMode('open_water')} className={`px-6 py-3 rounded-xl font-[700] text-sm transition ${swimMode === 'open_water' ? 'bg-[#00B4D8] text-white shadow-md' : 'bg-white border-2 border-gray-100 text-gray-400'}`}>Ngoài trời (Open Water)</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Tốc độ Max - Pace nhanh nhất (p/100m)" />
                      <Field label="Tốc độ Min - Pace chậm nhất (p/100m)" />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <Toggle label="Yêu cầu Nhịp tim" checked={true} />
                      {swimMode === 'open_water' && <Toggle label="Bắt buộc GPS" checked={true} />}
                    </div>
                  </ConfigBox>
                )}
              </section>
            )}

            {selectedCount >= 2 && (
              <section className="pt-8 border-t border-gray-100">
                <div onClick={() => setIsConversionEnabled(!isConversionEnabled)} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                  <div>
                    <h3 className="font-[700] text-gray-900">Thiết lập Quy đổi Hệ số (Tùy chọn)</h3>
                    <p className="text-sm text-gray-500 font-[500] mt-1">Sử dụng nếu bạn muốn quy đổi điểm PTS hoặc quy chiếu chéo giữa các môn.</p>
                  </div>
                  <Switch checked={isConversionEnabled} />
                </div>

                {isConversionEnabled && (
                  <div className="mt-6 bg-gray-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                      <h3 className="text-xl font-[900] text-yellow-400">Chọn phương thức:</h3>
                      <div className="flex bg-gray-800 p-1.5 rounded-xl">
                        <button onClick={() => setConvMode('points')} className={`px-5 py-2.5 rounded-lg text-xs font-[900] transition ${convMode === 'points' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'}`}>KM ➔ ĐIỂM PTS</button>
                        <button onClick={() => setConvMode('cross')} className={`px-5 py-2.5 rounded-lg text-xs font-[900] transition ${convMode === 'cross' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'}`}>KM ➔ TƯƠNG ĐƯƠNG</button>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {sports.run && <ConvInput sport="Chạy bộ" mode={convMode} />}
                      {sports.ride && <ConvInput sport="Đạp xe" mode={convMode} />}
                      {sports.swim && <ConvInput sport="Bơi lội" mode={convMode} />}
                    </div>
                  </div>
                )}
              </section>
            )}

            <div className="pt-4">
              <button 
                onClick={handleCreateEvent}
                className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-[900] text-lg hover:bg-black transition-all shadow-xl shadow-gray-200"
              >
                HOÀN TẤT CÀI ĐẶT
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function SportBtn({ active, onClick, icon, label, color }: any) {
  return (
    <button onClick={onClick} className={`p-6 rounded-[1.5rem] border-2 flex flex-col items-center gap-3 transition-all duration-300 ${active ? 'border-transparent shadow-xl scale-[1.02] text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`} style={{ backgroundColor: active ? color : '' }}>
      <span className="text-4xl">{icon}</span><span className="font-[900] text-sm uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ConfigBox({ title, color, icon, children }: any) {
  return (
    <div className="p-8 md:p-10 rounded-[2rem] border-2 border-gray-100 bg-[#FBFBFB] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: color }}></div>
      <div className="flex items-center gap-4 mb-8"><span className="text-3xl">{icon}</span><h3 className="text-xl font-[900] text-gray-800">{title}</h3></div>
      {children}
    </div>
  );
}

function Field({ label }: { label: string }) {
  return (
    <div>
      <label className="text-[10px] font-[900] text-gray-400 uppercase mb-2 block ml-1">{label}</label>
      <input type="text" placeholder="0.0" className="w-full bg-white border border-gray-200 rounded-2xl p-4 font-[700] text-gray-800 focus:border-gray-900 outline-none transition shadow-sm" />
    </div>
  );
}

function Toggle({ label, checked = false }: { label: string, checked?: boolean }) {
  return (
    <label className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm cursor-pointer">