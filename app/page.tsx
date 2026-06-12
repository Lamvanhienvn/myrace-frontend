import React from 'react';

export default function LandingPage() {
  // Lấy biến môi trường từ Vercel
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // Mẹo nhỏ cực hay: Cắt bỏ dấu "/" ở cuối link (nếu sếp lỡ tay copy dư) để tránh lỗi URL
  const API_URL = rawApiUrl.replace(/\/$/, ""); 
  
  const stravaLoginUrl = `${API_URL}/auth/login`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex flex-col items-center justify-center p-4 text-white">
      <div className="max-w-3xl w-full text-center">
        {/* Logo / Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 drop-shadow-lg">
            MY<span className="text-yellow-300">RACE</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium opacity-90 drop-shadow-md">
            Nền Tảng Tổ Chức Giải Thể Thao Chuyên Nghiệp
          </p>
        </div>

        {/* Khối Đăng nhập */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-gray-800 max-w-md mx-auto transform transition hover:scale-105 duration-300">
          <h2 className="text-2xl font-bold mb-2 text-center">Bắt đầu ngay</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Kết nối với đồng hồ của bạn qua hệ thống Strava
          </p>

          <a 
            href={stravaLoginUrl}
            className="flex items-center justify-center w-full bg-[#FC4C02] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#E34402] transition-colors shadow-lg hover:shadow-orange-500/50"
          >
            {/* Icon Strava Trắng */}
            <svg className="w-6 h-6 mr-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Kết nối với Strava
          </a>

          <div className="mt-6 text-xs text-gray-400 text-center space-y-2">
            <p>Hỗ trợ tự động đồng bộ Bơi - Đạp - Chạy.</p>
            <p>Trọng tài AI chấm điểm 24/7.</p>
          </div>
        </div>
      </div>
    </div>
  );
}