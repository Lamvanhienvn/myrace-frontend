"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';

const API_URL = "https://myrace-backend.onrender.com";

function EventDetailContent() {
  const searchParams = useSearchParams();
  const params = useParams(); // Lấy ID chuẩn xác bằng công cụ chuyên dụng
  const eventId = params?.id;

  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const stravaId = searchParams.get('strava_id') || searchParams.get('id') || "33415712";

  useEffect(() => {
    if (!eventId) return; // Đợi hệ thống gắp ID xong mới chạy

    const loadEventDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        if (res.ok) {
          const allEvents = await res.json();
          const currentEvent = allEvents.find((e: any) => String(e.id) === String(eventId));
          
          if (currentEvent) {
            setEventData(currentEvent);
          } else {
            console.error("Không tìm thấy giải đấu!");
          }
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu giải đấu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventDetail();
  }, [eventId]);

  const handleJoinEvent = async () => {
    if (!eventId) return alert("Lỗi: Không tìm thấy mã giải đấu!");

    const confirmId = prompt("Xác nhận số báo danh Strava ID của sếp để ghi danh:", stravaId);
    if (!confirmId) return;

    setIsRegistering(true);
    try {
      const res = await fetch(`${API_URL}/join-event/${eventId}?strava_id=${confirmId}`);
      const result = await res.json();

      if (res.ok || result.message?.includes("thành công")) {
        alert(`🎉 XIN CHÚC MỪNG! Sếp đã ghi danh vào giải đấu "${eventData.name}" thành công! Trọng tài AI đã sẵn sàng.`);
      } else {
        alert(`⚠️ THÔNG BÁO: ${result.detail || "Vui lòng kết nối ứng dụng Strava ở trang chủ trước khi tham gia giải!"}`);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối API tới máy chủ Render!");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading || !eventData) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
      <div className="bg-gray-900 pt-16 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1552674605-db6aea4bc09c?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="bg-green-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Đang mở đấu trường</span>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">{eventData.name}</h1>
          <p className="text-gray-400 font-medium text-lg">Đơn vị tổ chức: <span className="text-white font-bold">{eventData.creator_name}</span></p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-100 pb-8 mb-8">
            <div className="flex flex-wrap gap-2">
              {eventData.sports_included?.run && <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-xl font-black text-xs">🏃 CHẠY BỘ</span>}
              {eventData.sports_included?.ride && <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl font-black text-xs">🚴 ĐẠP XE</span>}
              {eventData.sports_included?.swim && <span className="bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-xl font-black text-xs">🏊 BƠI LỘI</span>}
            </div>
            
            <button 
              onClick={handleJoinEvent}
              disabled={isRegistering}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-1"
            >
              {isRegistering ? "ĐANG GHI DANH..." : "GHI DANH THAM GIA"}
            </button>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">📜 ĐIỀU LỆ VÀ QUY ĐỊNH KỸ THUẬT GIẢI</h3>
          
          {eventData.rules?.antiCheat && (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
               <span className="text-2xl">🤖</span>
               <div>
                 <h4 className="text-red-700 font-black uppercase text-sm">Mắt thần AI Anti-Cheat đang bật</h4>
                 <p className="text-red-600/80 text-xs font-bold mt-1">Mọi thông số bất thường chênh lệch giữa Tốc độ, Nhịp tim và Guồng chân sẽ bị hệ thống tự động hủy kết quả.</p>
               </div>
             </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {eventData.sports_included?.run && eventData.rules?.run && (
              <div className="border-2 border-orange-100 rounded-2xl p-5 bg-orange-50/10">
                <h4 className="font-black text-orange-600 text-lg mb-3">🏃‍♂️ Tiêu chuẩn Chạy bộ / Đi bộ</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-600">
                  <li className="flex justify-between border-b pb-2"><span>Khung Pace hợp lệ:</span> <strong className="text-gray-900">{eventData.rules.run.paceMin} - {eventData.rules.run.paceMax} min/km</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Hiệu suất vận động:</span> <strong className="text-gray-900">{">="} {eventData.rules.run.movingRatio}%</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Cự ly tối thiểu/cuốc:</span> <strong className="text-gray-900">{eventData.rules.run.minDistance} km</strong></li>
                  {eventData.rules.pointsConversion && (
                     <li className="flex justify-between bg-orange-100/50 px-2 py-1 rounded text-xs font-bold"><span>Hệ số quy đổi điểm:</span> <strong className="text-orange-700">1km = {eventData.rules.run.multiplier} điểm</strong></li>
                  )}
                </ul>
              </div>
            )}

            {eventData.sports_included?.ride && eventData.rules?.ride && (
              <div className="border-2 border-blue-100 rounded-2xl p-5 bg-blue-50/10">
                <h4 className="font-black text-blue-600 text-lg mb-3">🚴 Tiêu chuẩn Đạp xe</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-600">
                  <li className="flex justify-between border-b pb-2"><span>Tốc độ hợp lệ:</span> <strong className="text-gray-900">{eventData.rules.ride.speedMin} - {eventData.rules.ride.speedMax} km/h</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Hiệu suất vận động:</span> <strong className="text-gray-900">{">="} {eventData.rules.ride.movingRatio}%</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Cự ly tối thiểu/cuốc:</span> <strong className="text-gray-900">{eventData.rules.ride.minDistance} km</strong></li>
                  {eventData.rules.pointsConversion && (
                     <li className="flex justify-between bg-blue-100/50 px-2 py-1 rounded text-xs font-bold"><span>Hệ số quy đổi điểm:</span> <strong className="text-blue-700">1km = {eventData.rules.ride.multiplier} điểm</strong></li>
                  )}
                </ul>
              </div>
            )}
            
            {eventData.sports_included?.swim && eventData.rules?.swim && (
              <div className="border-2 border-cyan-100 rounded-2xl p-5 bg-cyan-50/10">
                <h4 className="font-black text-cyan-600 text-lg mb-3">🏊 Tiêu chuẩn Bơi lội</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-600">
                  <li className="flex justify-between border-b pb-2"><span>Loại hình:</span> <strong className="text-gray-900">{eventData.rules.swim.swimType === 'open' ? 'Bơi biển/Hồ (Có GPS)' : 'Bơi bể (Không GPS)'}</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Pace hợp lệ (min/100m):</span> <strong className="text-gray-900">{eventData.rules.swim.paceMin} - {eventData.rules.swim.paceMax}</strong></li>
                  <li className="flex justify-between border-b pb-2"><span>Cự ly tối thiểu/cuốc:</span> <strong className="text-gray-900">{eventData.rules.swim.minDistance} km</strong></li>
                  {eventData.rules.pointsConversion && (
                     <li className="flex justify-between bg-cyan-100/50 px-2 py-1 rounded text-xs font-bold"><span>Hệ số quy đổi điểm:</span> <strong className="text-cyan-700">1km = {eventData.rules.swim.multiplier} điểm</strong></li>
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

export default function EventDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div></div>}>
      <EventDetailContent />
    </Suspense>
  );
}