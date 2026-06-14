"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = "https://myrace-backend.onrender.com";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('event_id'); 
  
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Thanh tìm kiếm VĐV
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Tải danh sách giải đấu đổ vào Bộ chọn
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const approvedEvents = data.filter((e: any) => e.status === "approved");
          setEvents(approvedEvents);
          if (!selectedEventId && approvedEvents.length > 0) {
            setSelectedEventId(String(approvedEvents[0].id));
          }
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách giải:", error);
      }
    };
    fetchEvents();
  }, [selectedEventId]);

  // 2. Hút điểm thật từ Render về xử lý
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const url = `${API_URL}/api/leaderboard/${selectedEventId}?t=${Date.now()}`;
        const res = await fetch(url, { cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          
          let actualArray = [];
          if (Array.isArray(data)) {
            actualArray = data;
          } else if (data && Array.isArray(data.leaderboard)) {
            actualArray = data.leaderboard;
          }

          if (actualArray.length > 0) {
            const cleanedData = actualArray.map((user: any) => {
              // 🎯 GIẢI PHÁP ĐỘT PHÁ: Áp tên thật cho tài khoản test của sếp để gõ tìm kiếm dễ dàng
              let athleteName = user.name || "";
              athleteName = athleteName.replace(/None/g, '').trim();

              if (!athleteName || athleteName === "") {
                athleteName = `Vận Động Viên #${user.strava_id}`;
             }

              return {
                ...user,
                name: athleteName,
                points: user.score !== undefined ? user.score : (user.points || 0),
                avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(athleteName)}&background=FC4C02&color=fff&size=128`
              };
            });
            
            // Sắp xếp thứ hạng chuyên nghiệp
            cleanedData.sort((a: any, b: any) => b.points - a.points);
            cleanedData.forEach((u: any, idx: number) => u.rank = idx + 1);

            setLeaderboardData(cleanedData);
          } else {
            setLeaderboardData([]);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Bảng xếp hạng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedEventId]);

  const safeData = Array.isArray(leaderboardData) ? leaderboardData : [];
  
  // Xử lý bộ lọc tìm kiếm chữ
  const filteredData = safeData.filter(user => (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  const isSearching = searchTerm.trim().length > 0;

  const top1 = safeData.length > 0 ? safeData[0] : null;
  const top2 = safeData.length > 1 ? safeData[1] : null;
  const top3 = safeData.length > 2 ? safeData[2] : null;
  const others = safeData.length > 3 ? safeData.slice(3) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      {/* Navbar cao cấp */}
      <nav className="bg-white shadow-xs px-6 py-4 flex justify-between items-center mb-8 border-b border-gray-100">
        <h1 className="text-2xl font-black tracking-tighter">
          MY<span className="text-orange-500">RACE</span> <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-md uppercase ml-1 font-bold">Arena</span>
        </h1>
        <a href="/profile?id=33415712" className="text-sm font-bold text-gray-600 hover:text-orange-500 transition flex items-center gap-1">
          <span>📊</span> Quay lại Dashboard
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        {/* Tiêu đề chính */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">BẢNG XẾP HẠNG THÀNH TÍCH</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Dữ liệu đồng bộ thời gian thực từ Strava AI</p>
        </div>

        {/* 🛠️ TRUNG TÂM ĐIỀU KHIỂN KHOA HỌC: CHIA 2 HÀNG ĐỀU NHAU MẮT MẮT */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-10 space-y-4 max-w-2xl mx-auto">
          {/* Hàng 1: Chọn giải đấu */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider w-full sm:w-24 text-left sm:text-right">Giải đấu:</span>
            <div className="relative w-full flex-1">
              <select 
                value={selectedEventId || ""} 
                onChange={(e) => {
                   setSelectedEventId(e.target.value);
                   setSearchTerm(""); // Reset ô search khi đổi giải
                }}
                className="w-full bg-gray-50 border-2 border-gray-200 text-gray-800 font-extrabold py-3 px-4 rounded-xl focus:outline-none focus:border-orange-500 transition cursor-pointer text-sm appearance-none"
              >
                {events.length === 0 && <option value="">Đang tải danh sách giải đấu...</option>}
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>🏆 {ev.name} (ID: #{ev.id})</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">🔻</div>
            </div>
          </div>

          {/* Hàng 2: Tìm kiếm vận động viên */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider w-full sm:w-24 text-left sm:text-right">Tìm kiếm:</span>
            <div className="relative w-full flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-sm">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Nhập tên vận động viên để tìm kiếm nhanh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>
        </div>

        {/* LOADING VÀ DANH SÁCH THÀNH TÍCH */}
        {isLoading ? (
           <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div></div>
        ) : safeData.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-400">Giải đấu này chưa có chiến binh nào ghi điểm! 🚀</h3>
          </div>
        ) : (
          <>
            {/* BỤC VINH QUANG PODIUM (Tự động ẩn đi khi gõ tìm kiếm để tối ưu không gian) */}
            {!isSearching && (
              <div className="flex justify-center items-end gap-2 md:gap-6 mb-12 h-64 z-10 relative border-b border-gray-100 pb-2">
                
                {/* Hạng 2 */}
                {top2 && (
                  <div className="flex flex-col items-center animate-fade-in-up">
                    <img src={top2.avatar} alt="Top 2" className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-300 shadow-md z-10 -mb-6 bg-white object-cover" />
                    <div className="bg-gradient-to-t from-gray-200 to-gray-50 w-24 md:w-32 h-28 rounded-t-2xl flex flex-col justify-end pb-3 shadow-inner relative">
                      <span className="absolute top-4 w-full text-center font-black text-gray-300 text-4xl opacity-60">2</span>
                      <p className="text-center font-black text-gray-700 text-xs truncate px-2 z-10">{top2.name}</p>
                      <p className="text-center font-black text-blue-600 text-base z-10">{top2.points} <span className="text-[10px] font-bold text-blue-400">pts</span></p>
                    </div>
                  </div>
                )}

                {/* Hạng 1 (Nhà vô địch) */}
                {top1 && (
                  <div className="flex flex-col items-center animate-fade-in-up z-20">
                    <div className="relative">
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">👑</span>
                      <img src={top1.avatar} alt="Top 1" className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 shadow-xl z-10 -mb-8 bg-white object-cover" />
                    </div>
                    <div className="bg-gradient-to-t from-orange-100 to-yellow-50 w-28 md:w-36 h-36 rounded-t-2xl flex flex-col justify-end pb-5 shadow-inner relative border-t-2 border-yellow-300">
                      <span className="absolute top-4 w-full text-center font-black text-yellow-300 text-5xl opacity-50">1</span>
                      <p className="text-center font-black text-gray-900 text-sm truncate px-2 z-10">{top1.name}</p>
                      <p className="text-center font-black text-orange-600 text-lg z-10">{top1.points} <span className="text-xs font-bold text-orange-400">pts</span></p>
                    </div>
                  </div>
                )}

                {/* Hạng 3 */}
                {top3 && (
                  <div className="flex flex-col items-center animate-fade-in-up">
                    <img src={top3.avatar} alt="Top 3" className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-amber-600 shadow-md z-10 -mb-4 bg-white object-cover" />
                    <div className="bg-gradient-to-t from-amber-100/40 to-amber-50/10 w-24 md:w-32 h-22 rounded-t-2xl flex flex-col justify-end pb-2 shadow-inner relative">
                      <span className="absolute top-2 w-full text-center font-black text-amber-800/20 text-3xl">3</span>
                      <p className="text-center font-black text-gray-700 text-xs truncate px-2 z-10">{top3.name}</p>
                      <p className="text-center font-black text-amber-800 text-sm z-10">{top3.points} <span className="text-[10px] font-bold text-amber-500">pts</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BẢNG DANH SÁCH CHI TIẾT */}
            <div className="bg-white rounded-2xl p-2 md:p-4 shadow-xs border border-gray-100">
              {filteredData.length === 0 && isSearching ? (
                <p className="text-center text-gray-400 font-bold py-10">❌ Không tìm thấy vận động viên nào có tên "{searchTerm}"</p>
              ) : (
                (isSearching ? filteredData : others).map((user: any) => (
                  <div key={user.rank} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition rounded-xl">
                    <div className="flex items-center gap-4 w-2/3">
                      <span className="w-8 text-center font-black text-gray-400 text-sm">#{user.rank}</span>
                      <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full border border-gray-100 object-cover shadow-2xs" />
                      <span className="font-bold text-gray-800 truncate text-sm md:text-base">{user.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-orange-600 bg-orange-50/60 px-4 py-2 rounded-xl border border-orange-100 text-sm md:text-base inline-block min-w-[80px] text-center">
                        {user.points} <span className="text-xs font-bold text-orange-400">pts</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div></div>}>
      <LeaderboardContent />
    </Suspense>
  );
}