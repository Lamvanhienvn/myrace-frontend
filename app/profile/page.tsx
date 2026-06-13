"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Đóng gói toàn bộ nội dung trang vào một Component con
function ProfileContent() {
  const searchParams = useSearchParams();
  const stravaId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(true);

  // MOCK DATA (Dữ liệu giả lập)
  const user = {
    name: "Sếp Hiển",
    avatar: "https://ui-avatars.com/api/?name=Hien&background=FC4C02&color=fff&size=150",
    stravaId: stravaId || "33415712",
    totalPoints: 250.5,
    rank: 1,
    activeEvents: 1,
  };

  const recentActivities = [
    { id: 1, name: "Chạy bộ buổi sáng", sport: "Run", distance: "5.00 km", points: "+50.0", date: "Hôm nay" },
    { id: 2, name: "Đạp xe cuối tuần", sport: "Ride", distance: "20.50 km", points: "+61.5", date: "Hôm qua" },
  ];

  useEffect(() => {
    // Giả lập thời gian load trang
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      {/* Header Bar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-tighter">
          MY<span className="text-orange-500">RACE</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden md:block">Xin chào, {user.name}</span>
          <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-orange-100" />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Khối Căn Cước VĐV */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-8 transform transition hover:-translate-y-1 duration-300">
          <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full shadow-md" />
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 font-medium mt-1">Strava ID: {user.stravaId}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
             <div className="flex-1 md:flex-none bg-orange-50 rounded-2xl p-4 text-center min-w-[120px]">
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Tổng điểm</p>
                <p className="text-3xl font-black text-orange-500">{user.totalPoints}</p>
             </div>
             <div className="flex-1 md:flex-none bg-blue-50 rounded-2xl p-4 text-center min-w-[120px]">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Xếp hạng</p>
                <p className="text-3xl font-black text-blue-500">#{user.rank}</p>
             </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Hoạt động gần đây</h3>
        
        {/* Khối Lịch sử hoạt động */}
        <div className="space-y-4">
          {recentActivities.map((act) => (
            <div key={act.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition duration-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${act.sport === 'Run' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  {act.sport === 'Run' ? '🏃‍♂️' : '🚴'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{act.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{act.date} • {act.distance}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-green-100 text-green-700 font-black px-3 py-1 rounded-full text-sm">
                  {act.points}
                </span>
              </div>
            </div>
          ))}

          <button className="w-full mt-4 py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-700 transition">
            XEM TẤT CẢ HOẠT ĐỘNG
          </button>
        </div>

      </div>
    </div>
  );
}

// Bọc Component con bằng Suspense ở Component chính
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}