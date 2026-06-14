"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = "https://myrace-backend.onrender.com";

function ProfileContent() {
  const searchParams = useSearchParams();
  const stravaId = searchParams.get('id') || "33415712";
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/${stravaId}`);
        if (res.ok) {
          const dashboardData = await res.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [stravaId]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div></div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-bold">Không tìm thấy dữ liệu VĐV. Hãy kết nối Strava!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-tighter">
          MY<span className="text-orange-500">RACE</span>
        </h1>
        <div className="flex gap-4 text-sm font-bold text-gray-500">
          <a href="/admin" className="hover:text-orange-500">Admin Console</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Khối Căn Cước VĐV */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-8 transform transition hover:-translate-y-1">
          <img src={data.user.avatar} alt="Avatar" className="w-24 h-24 rounded-full shadow-md border-4 border-orange-100" />
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-gray-900">{data.user.name}</h2>
            <p className="text-gray-500 font-bold mt-1">Strava ID: {data.user.strava_id}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
             <div className="flex-1 md:flex-none bg-orange-50 rounded-2xl p-4 text-center min-w-[130px]">
                <p className="text-xs text-orange-600 font-bold uppercase mb-1">Tổng điểm tích luỹ</p>
                <p className="text-4xl font-black text-orange-500">{data.stats.total_points}</p>
             </div>
          </div>
        </div>

        <h3 className="text-xl font-black text-gray-900 mb-4 px-2 uppercase tracking-tight">🏆 Các giải đấu đang tham gia ({data.stats.active_events})</h3>
        
        {/* Danh sách Giải đấu VĐV đang đua */}
        <div className="space-y-4">
          {data.events.length === 0 ? (
            <p className="text-gray-500 text-center py-8 font-bold bg-white rounded-2xl border">Sếp chưa tham gia giải đấu nào!</p>
          ) : (
            data.events.map((ev: any) => (
              <div key={ev.event_id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <a href={`/event/${ev.event_id}`} className="font-black text-lg text-gray-800 hover:text-orange-500">{ev.event_name}</a>
                  <p className="text-sm text-gray-500 font-bold mt-1">Xếp hạng hiện tại: <span className="text-blue-600">#{ev.rank}</span></p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl">
                    {ev.points} Điểm
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div></div>}>
      <ProfileContent />
    </Suspense>
  );
}