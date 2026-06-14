"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = "https://myrace-backend.onrender.com";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  // Ưu tiên lấy event_id từ link, nếu không có thì mặc định lấy giải số 1
  const eventId = searchParams.get('event_id') || "1"; 
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          // Ép kiểu: Chỉ nhận nếu dữ liệu trả về đúng là 1 mảng danh sách
          if (Array.isArray(data)) {
            setLeaderboardData(data);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Bảng xếp hạng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  // BỌC THÉP CHỐNG SẬP TRANG: Đảm bảo dữ liệu chia Top cực kỳ an toàn
  const safeData = Array.isArray(leaderboardData) ? leaderboardData : [];
  const top1 = safeData.length > 0 ? safeData[0] : null;
  const top2 = safeData.length > 1 ? safeData[1] : null;
  const top3 = safeData.length > 2 ? safeData[2] : null;
  const others = safeData.length > 3 ? safeData.slice(3) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tighter">
          MY<span className="text-orange-500">RACE</span>
        </h1>
        <a href="/profile?id=33415712" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition">
          Quay lại Dashboard
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">BẢNG XẾP HẠNG</h2>
          <p className="text-orange-600 mt-2 font-black uppercase bg-orange-100 inline-block px-4 py-1 rounded-full text-sm">
            Giải đấu ID #{eventId}
          </p>
        </div>

        {safeData.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-500">Chưa có VĐV nào ghi điểm. Sếp hãy là người dẫn đầu! 🚀</h3>
          </div>
        ) : (
          <>
            {/* BỤC VINH QUANG TOP 3 (PODIUM) */}
            <div className="flex justify-center items-end gap-2 md:gap-6 mb-12 h-64">
              
              {/* Vị trí số 2 */}
              {top2 && (
                <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <img src={top2?.avatar || "https://ui-avatars.com/api/?name=VĐV&background=0070F3&color=fff"} alt="Top 2" className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-300 shadow-lg z-10 -mb-6 bg-white object-cover" />
                  <div className="bg-gradient-to-t from-gray-300 to-gray-100 w-24 md:w-32 h-32 rounded-t-2xl flex flex-col justify-end pb-4 shadow-inner relative">
                    <span className="absolute top-8 w-full text-center font-black text-gray-400 text-3xl opacity-50">2</span>
                    <p className="text-center font-bold text-gray-800 text-sm truncate px-2">{top2?.name || "VĐV"}</p>
                    <p className="text-center font-black text-blue-600 text-lg">{top2?.points || 0}</p>
                  </div>
                </div>
              )}

              {/* Vị trí số 1 (Ngôi vương) */}
              {top1 && (
                <div className="flex flex-col items-center animate-fade-in-up z-20" style={{ animationDelay: '0ms' }}>
                  <div className="relative">
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-3xl">👑</span>
                    <img src={top1?.avatar || "https://ui-avatars.com/api/?name=VĐV&background=FC4C02&color=fff"} alt="Top 1" className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 shadow-xl z-10 -mb-8 bg-white object-cover" />
                  </div>
                  <div className="bg-gradient-to-t from-yellow-300 to-yellow-100 w-28 md:w-36 h-40 rounded-t-2xl flex flex-col justify-end pb-6 shadow-inner relative">
                    <span className="absolute top-10 w-full text-center font-black text-yellow-500 text-4xl opacity-40">1</span>
                    <p className="text-center font-bold text-gray-900 text-sm truncate px-2">{top1?.name || "VĐV"}</p>
                    <p className="text-center font-black text-orange-600 text-xl">{top1?.points || 0}</p>
                  </div>
                </div>
              )}

              {/* Vị trí số 3 */}
              {top3 && (
                <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <img src={top3?.avatar || "https://ui-avatars.com/api/?name=VĐV&background=00B4D8&color=fff"} alt="Top 3" className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-amber-600 shadow-md z-10 -mb-4 bg-white object-cover" />
                  <div className="bg-gradient-to-t from-amber-700/30 to-amber-600/10 w-24 md:w-32 h-24 rounded-t-2xl flex flex-col justify-end pb-2 shadow-inner relative">
                    <span className="absolute top-6 w-full text-center font-black text-amber-700/30 text-3xl">3</span>
                    <p className="text-center font-bold text-gray-800 text-xs truncate px-2">{top3?.name || "VĐV"}</p>
                    <p className="text-center font-black text-amber-700 text-base">{top3?.points || 0}</p>
                  </div>
                </div>
              )}
            </div>

            {/* DANH SÁCH TỪ TOP 4 TRỞ XUỐNG */}
            {others.length > 0 && (
              <div className="bg-white rounded-3xl p-2 md:p-6 shadow-sm border border-gray-100">
                {others.map((user: any) => (
                  <div key={user?.rank} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="w-8 text-center font-bold text-gray-400">#{user?.rank}</span>
                      <img src={user?.avatar || "https://ui-avatars.com/api/?name=VĐV"} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="font-bold text-gray-700">{user?.name || "Vận động viên"}</span>
                    </div>
                    <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                      {user?.points || 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

// Lớp bọc an toàn Suspense của Next.js
export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  );
}