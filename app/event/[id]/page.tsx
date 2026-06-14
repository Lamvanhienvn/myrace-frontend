"use client";
import React, { useEffect, useState } from 'react';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu giải đấu (giả lập hoặc API thật)
  useEffect(() => {
    setTimeout(() => {
      setEventData({
        id: params.id,
        name: "Thử Thách Ironman Sinh Học 2026",
        creator_name: "Ban Tổ Chức Sếp Hiển",
        sports_included: { run: true, ride: true, swim: false },
        rules: {
          pointsConversion: true,
          antiCheat: true,
          run: { multiplier: 10, minDistance: 1, movingRatio: 90, paceMin: 4.0, paceMax: 15.0 },
          ride: { multiplier: 3, minDistance: 5, movingRatio: 85, speedMin: 15, speedMax: 45, requireHr: true }
        }
      });
      setIsLoading(false);
    }, 800);
  }, [params.id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
      {/* Banner Giải đấu */}
      <div className="bg-gray-900 pt-16 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1552674605-db6aea4bc09c?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="bg-orange-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Đang mở đăng ký</span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">{eventData.name}</h1>
          <p className="text-gray-400 font-medium text-lg">Đơn vị tổ chức: <span className="text-white font-bold">{eventData.creator_name}</span></p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-100 pb-8 mb-8">
            <div className="flex gap-3">
              {eventData.sports_included.run && <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-black text-lg">🏃 CHẠY BỘ</span>}
              {eventData.sports_included.ride && <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-black text-lg">🚴 ĐẠP XE</span>}
            </div>
            {/* NÚT GHI DANH */}
            <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-1">
              GHI DANH NGAY
            </button>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase">📜 Bảng Quy Định Sinh Học & Kỹ Thuật</h3>
          
          {eventData.rules.antiCheat && (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
               <span className="text-2xl">🤖</span>
               <div>
                 <h4 className="text-red-700 font-black uppercase text-sm">Hệ thống Anti-Cheat AI đang kích hoạt</h4>
                 <p className="text-red-600/80 text-xs font-bold mt-1">Mọi gian lận chéo giữa Pace, HR và Cadence sẽ bị phát hiện, hủy kết quả và gửi báo cáo vi phạm.</p>
               </div>
             </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Luật Chạy */}
            {eventData.sports_included.run && (
              <div className="border-2 border-orange-100 rounded-2xl p-5">
                <h4 className="font-black text-orange-600 text-lg mb-3">Thông số Chạy bộ</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-600">
                  <li className="flex justify-between border-b pb-2"><span>Pace hợp lệ:</span> <strong className="text-gray-900">{eventData.rules.run.paceMin} - {eventData.rules.run.paceMax} /km</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Tỷ lệ Moving/Elapsed:</span> <strong className="text-gray-900">{">="} {eventData.rules.run.movingRatio}%</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Cự ly tối thiểu/cuốc:</span> <strong className="text-gray-900">{eventData.rules.run.minDistance} km</strong></li>
                  {eventData.rules.pointsConversion && (
                     <li className="flex justify-between bg-orange-50 px-2 py-1 rounded"><span>Điểm quy đổi:</span> <strong className="text-orange-700">1km = {eventData.rules.run.multiplier} điểm</strong></li>
                  )}
                </ul>
              </div>
            )}

            {/* Luật Đạp xe */}
            {eventData.sports_included.ride && (
              <div className="border-2 border-blue-100 rounded-2xl p-5">
                <h4 className="font-black text-blue-600 text-lg mb-3">Thông số Đạp xe</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-600">
                  <li className="flex justify-between border-b pb-2"><span>Tốc độ hợp lệ:</span> <strong className="text-gray-900">{eventData.rules.ride.speedMin} - {eventData.rules.ride.speedMax} km/h</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Tỷ lệ Moving/Elapsed:</span> <strong className="text-gray-900">{">="} {eventData.rules.ride.movingRatio}%</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Bắt buộc đo nhịp tim (HR):</span> <strong className="text-gray-900">{eventData.rules.ride.requireHr ? "Có" : "Không"}</strong></li>
                  {eventData.rules.pointsConversion && (
                     <li className="flex justify-between bg-blue-50 px-2 py-1 rounded"><span>Điểm quy đổi:</span> <strong className="text-blue-700">1km = {eventData.rules.ride.multiplier} điểm</strong></li>
                  )}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}