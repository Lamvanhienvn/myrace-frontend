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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [rawDebugData, setRawDebugData] = useState<string>("Đang kết nối ống nước...");

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

  useEffect(() => {
    if (!selectedEventId) return;

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setRawDebugData("Đang kéo dữ liệu từ Render...");
      try {
        const url = `${API_URL}/api/leaderboard/${selectedEventId}?t=${Date.now()}`;
        const res = await fetch(url, { cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          setRawDebugData(JSON.stringify(data, null, 2));
          
          let actualArray = [];
          if (Array.isArray(data)) {
            actualArray = data;
          } else if (data && Array.isArray(data.leaderboard)) {
            actualArray = data.leaderboard;
          }

          if (actualArray.length > 0) {
            const cleanedData = actualArray.map((user: any) => ({
              ...user,
              name: (user.name || `Strava VĐV ${user.strava_id}`).replace(/None/g, '').trim(),
              points: user.score !== undefined ? user.score : (user.points || 0),
              avatar: user.avatar || `https://ui-avatars.com/api/?name=V&background=FC4C02&color=fff&size=128`
            }));
            
            // 🎯 ĐÃ SỬA LỖI TYPESCRIPT Ở ĐÂY: Ép kiểu (a: any, b: any)
            cleanedData.sort((a: any, b: any) => b.points - a.points);
            cleanedData.forEach((u: any, idx: number) => u.rank = idx + 1);

            setLeaderboardData(cleanedData);
          } else {
            setLeaderboardData([]);
          }
        } else {
          setRawDebugData(`Render báo lỗi API: Mã ${res.status}`);
        }
      } catch (error: any) {
        setRawDebugData(`Mất kết nối: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedEventId]);

  const safeData = Array.isArray(leaderboardData) ? leaderboardData : [];
  const filteredData = safeData.filter(user => (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  const isSearching = searchTerm.trim().length > 0;

  const top1 = safeData.length > 0 ? safeData[0] : null;
  const top2 = safeData.length > 1 ? safeData[1] : null;
  const top3 = safeData.length > 2 ? safeData[2] : null;
  const others = safeData.length > 3 ? safeData.slice(3) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold tracking-tighter">
          MY<span className="text-orange-500">RACE</span>
        </h1>
        <a href="/profile?id=33415712" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition">Quay lại Dashboard</a>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">BẢNG XẾP HẠNG</h2>
        </div>

        <div className="flex justify-center mb-8 relative z-30">
          <select 
            value={selectedEventId || ""} 
            onChange={(e) => {
               setSelectedEventId(e.target.value);
               setSearchTerm("");
            }}
            className="w-full md:w-auto bg-white border-2 border-orange-200 text-gray-800 font-bold py-3 px-6 rounded-xl focus:outline-none focus:border-orange-500 shadow-sm appearance-none cursor-pointer text-center"
          >
            {events.length === 0 && <option value="">Đang tải danh sách giải...</option>}
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>🏆 {ev.name} (ID Giải: #{ev.id})</option>
            ))}
          </select>
        </div>

        <div className="mb-6 max-w-xl mx-auto relative z-20">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-xl">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm tên VĐV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-orange-300 rounded-2xl pl-12 pr-4 py-4 font-bold text-gray-700 focus:outline-none focus:border-orange-600 transition shadow-md"
          />
        </div>

        <details className="bg-gray-900 text-green-400 p-2 rounded-xl font-mono text-xs overflow-auto mb-8 shadow-inner border-2 border-green-900 opacity-60 hover:opacity-100 cursor-pointer">
           <summary className="text-white font-bold outline-none select-none">💻 Máy Nội Soi API (Bấm để xem)</summary>
           <pre className="mt-2">{rawDebugData}</pre>
        </details>

        {isLoading ? (
           <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div></div>
        ) : safeData.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-500">Giải đấu này chưa có ai ghi điểm! 🚀</h3>
          </div>
        ) : (
          <>
            {!isSearching && (
              <div className="flex justify-center items-end gap-2 md:gap-6 mb-12 h-64 z-10 relative">
                {top2 && (
                  <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <img src={top2.avatar} alt="Top 2" className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-300 shadow-lg z-10 -mb-6 bg-white object-cover" />
                    <div className="bg-gradient-to-t from-gray-300 to-gray-100 w-24 md:w-32 h-32 rounded-t-2xl flex flex-col justify-end pb-4 shadow-inner relative">
                      <span className="absolute top-8 w-full text-center font-black text-gray-400 text-3xl opacity-50">2</span>
                      <p className="text-center font-bold text-gray-800 text-xs md:text-sm truncate px-2">{top2.name}</p>
                      <p className="text-center font-black text-blue-600 text-lg">{top2.points}</p>
                    </div>
                  </div>
                )}
                {top1 && (
                  <div className="flex flex-col items-center animate-fade-in-up z-20" style={{ animationDelay: '0ms' }}>
                    <div className="relative">
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl">👑</span>
                      <img src={top1.avatar} alt="Top 1" className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 shadow-xl z-10 -mb-8 bg-white object-cover" />
                    </div>
                    <div className="bg-gradient-to-t from-yellow-300 to-yellow-100 w-28 md:w-36 h-40 rounded-t-2xl flex flex-col justify-end pb-6 shadow-inner relative">
                      <span className="absolute top-10 w-full text-center font-black text-yellow-600 text-4xl opacity-40">1</span>
                      <p className="text-center font-bold text-gray-900 text-xs md:text-sm truncate px-2">{top1.name}</p>
                      <p className="text-center font-black text-orange-600 text-xl">{top1.points}</p>
                    </div>
                  </div>
                )}
                {top3 && (
                  <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <img src={top3.avatar} alt="Top 3" className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-amber-600 shadow-md z-10 -mb-4 bg-white object-cover" />
                    <div className="bg-gradient-to-t from-amber-700/30 to-amber-600/10 w-24 md:w-32 h-24 rounded-t-2xl flex flex-col justify-end pb-2 shadow-inner relative">
                      <span className="absolute top-6 w-full text-center font-black text-amber-700/30 text-3xl">3</span>
                      <p className="text-center font-bold text-gray-800 text-xs truncate px-2">{top3.name}</p>
                      <p className="text-center font-black text-amber-700 text-base">{top3.points}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-3xl p-2 md:p-6 shadow-sm border border-gray-100">
              {filteredData.length === 0 && isSearching ? (
                <p className="text-center text-gray-500 font-bold py-8">Không tìm thấy VĐV nào tên "{searchTerm}"</p>
              ) : (
                (isSearching ? filteredData : others).map((user: any) => (
                  <div key={user.rank} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition rounded-xl">
                    <div className="flex items-center gap-4 w-2/3">
                      <span className="w-8 text-center font-black text-gray-400">#{user.rank}</span>
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border border-gray-200 object-cover" />
                      <span className="font-extrabold text-gray-800 truncate">{user.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-orange-600 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
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