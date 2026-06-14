"use client";
import React from 'react';

// Link Backend xử lý Đăng nhập Strava
const STRAVA_LOGIN_URL = "https://myrace-backend.onrender.com/auth/login";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-100 transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-gray-900">
            MY<span className="text-orange-500">RACE</span>
          </h1>
          <div className="flex gap-6 items-center font-bold text-sm">
            <a href="/leaderboard" className="text-gray-500 hover:text-orange-500 transition hidden md:block">Bảng Xếp Hạng</a>
            <a 
              href={STRAVA_LOGIN_URL} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full shadow-md transition transform hover:-translate-y-0.5"
            >
              Kết nối Strava
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 flex justify-center items-center opacity-10 pointer-events-none">
           <div className="w-[800px] h-[800px] bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-orange-100 text-orange-700 font-black text-xs px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase border border-orange-200">
            Nền tảng thi đấu thể thao ảo
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight mb-8">
            Đua thực tế, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Vinh quang trên mây.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Hệ thống tổ chức giải đấu thể thao tự động 100%. Đồng bộ dữ liệu trực tiếp từ Strava. Tích hợp AI Trọng tài chống gian lận sinh học chuyên nghiệp.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href={STRAVA_LOGIN_URL} 
              className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-black text-lg px-10 py-5 rounded-2xl shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo.svg" alt="Strava" className="w-6 h-6 invert" />
              KẾT NỐI VÀ THAM GIA NGAY
            </a>
            <a 
              href="/admin" 
              className="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-lg px-10 py-4.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
            >
              👑 Dành cho Ban tổ chức
            </a>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Tại sao chọn MyRace?</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">⚡</div>
              <h4 className="text-xl font-black text-gray-900 mb-3">Đồng bộ tự động</h4>
              <p className="text-gray-500 font-medium leading-relaxed">Không cần nhập kết quả bằng tay. Hoàn thành bài chạy trên Strava, điểm số tự động cập nhật lên bảng xếp hạng ngay lập tức.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🤖</div>
              <h4 className="text-xl font-black text-gray-900 mb-3">AI Trọng Tài Anti-Cheat</h4>
              <p className="text-gray-500 font-medium leading-relaxed">Phân tích chéo Nhịp tim (HR), Tốc độ (Pace) và Guồng chân (Cadence) để loại bỏ hoàn toàn các hoạt động đi xe máy, gian lận.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🏆</div>
              <h4 className="text-xl font-black text-gray-900 mb-3">Đa dạng môn thi</h4>
              <p className="text-gray-500 font-medium leading-relaxed">Hỗ trợ thiết lập luật chơi tùy biến cho Chạy bộ, Đạp xe và Bơi lội. Quy đổi điểm thông minh để xếp hạng chung cuộc.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-400 font-medium">© 2026 MyRace Platform. Tích hợp Strava API.</p>
      </footer>

    </div>
  );
}