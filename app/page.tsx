'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State mới cho AI Coach
  const [aiMessage, setAiMessage] = useState("Đang thỉnh giáo AI Coach...");
  const myStravaId = 33415712; // Mã Strava của bạn

  const fetchData = () => {
    setLoading(true);
    setAiMessage("Đang thỉnh giáo AI Coach...");

    // 1. Lấy Bảng xếp hạng
    fetch('https://myrace-backend.onrender.com/api/leaderboard/1')
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard || []);
        setLoading(false);
      });
      
    // 2. Lấy lời khuyên từ AI Coach
    fetch(`https://myrace-backend.onrender.com/api/ai-coach/${myStravaId}`)
      .then((res) => res.json())
      .then((data) => {
        setAiMessage(data.message);
      })
      .catch(() => setAiMessage("Tiếp tục chạy đi nào!"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Giải Đấu */}
        <div className="bg-orange-500 rounded-t-2xl p-8 text-center text-white shadow-lg">
          <h1 className="text-4xl font-extrabold uppercase tracking-wider mb-2">Myrace Challenge</h1>
          <p className="text-lg opacity-90">Bảng Xếp Hạng Trực Tuyến</p>
        </div>

        {/* Hộp thoại AI Coach */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 my-4 rounded-r-lg shadow-md transform transition-all hover:scale-105">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🤖</span>
            <div>
              <h3 className="text-blue-800 font-black text-sm uppercase tracking-widest">AI Coach nhắn nhủ:</h3>
              <p className="text-blue-900 font-medium text-lg italic mt-1">"{aiMessage}"</p>
            </div>
          </div>
        </div>

        {/* Thân Bảng Xếp Hạng */}
        <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
          
          <div className="flex justify-end p-4 bg-gray-50 border-b">
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-orange-100 text-orange-600 font-semibold rounded-lg hover:bg-orange-200 transition-colors"
            >
              {loading ? 'Đang tải...' : '🔄 Cập nhật dữ liệu & AI'}
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {leaderboard.length === 0 && !loading ? (
              <p className="text-center text-gray-500 py-8">Chưa có ai tham gia giải đấu này.</p>
            ) : (
              leaderboard.map((athlete) => (
                <div key={athlete.strava_id} className="flex items-center p-6 hover:bg-gray-50 transition duration-150">
                  <div className="flex-shrink-0 w-12 text-center">
                    <span className={`text-2xl font-black ${athlete.rank === 1 ? 'text-yellow-500' : athlete.rank === 2 ? 'text-gray-400' : athlete.rank === 3 ? 'text-yellow-700' : 'text-gray-300'}`}>
                      #{athlete.rank}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-xl font-bold text-gray-900">VĐV {athlete.strava_id}</p>
                    <p className="text-sm text-gray-500">Mã Strava</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-3xl font-black text-orange-500">
                      {athlete.distance} <span className="text-lg font-medium text-gray-500">km</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}