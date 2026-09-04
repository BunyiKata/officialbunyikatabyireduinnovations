import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """      <div id="view-belajar-bacaan" className="screen">"""

replacement = """      <div id="view-ar-sukukata" className="screen" style={{ backgroundColor: "#fdf2f8", height: "100%", width: "100%" }}>
        <div className="flex flex-col md:flex-row h-full w-full relative">
            <button
              className="neo-btn bg-red"
              style={{ position: "absolute", top: "20px", left: "20px", zIndex: 100 }}
              onClick={(e) => {
                window.tutupARSukuKata && window.tutupARSukuKata();
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> Kembali
            </button>
            {/* Kiri: Kamera AR */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-black flex items-center justify-center overflow-hidden shadow-2xl z-10 md:rounded-r-3xl rounded-b-3xl">
                <video id="input_video_ar_sukukata" className="hidden" autoPlay playsInline></video>
                <canvas id="output_canvas_ar_sukukata" className="w-full h-full object-cover transform scale-x-[-1]"></canvas>
                
                <div id="camera_status_ar_sukukata" className="absolute inset-0 flex items-center justify-center bg-black/70 text-white flex-col z-20 backdrop-blur-sm transition-opacity duration-500">
                    <i className="fa-solid fa-spinner fa-spin fa-3x mb-4 text-pink-400"></i>
                    <p className="text-2xl font-bold tracking-wide">Memuatkan Kamera AR...</p>
                    <p className="text-sm mt-2 text-gray-300">Sila benarkan akses kamera</p>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-sm pointer-events-none">
                    <p className="text-white text-sm font-semibold">✨ Filter AR Beruang Aktif!</p>
                </div>
            </div>

            {/* Kanan: Panel Kawalan */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-6 md:p-10 items-center justify-center relative bg-gradient-to-br from-pink-200 via-rose-100 to-orange-200">
                <div className="absolute top-6 right-6 md:top-8 md:right-8 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border-2 border-pink-300 flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow-md">⭐</span>
                    <span id="score_display_ar_sukukata" className="text-3xl font-black text-pink-500">0</span>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black text-pink-500 mb-2 drop-shadow-sm">Mari Membaca!</h1>
                    <p id="ar_sukukata_kemahiran_label" className="text-xl md:text-2xl text-orange-500 font-bold bg-white/50 inline-block px-4 py-1 rounded-full border border-orange-200">Suku Kata</p>
                </div>
               
                <div id="word_card_ar_sukukata" className="bg-white px-10 py-14 rounded-[3rem] shadow-xl border-4 border-orange-200 card-transition transform hover:scale-105 mb-8 w-full max-w-md text-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-4xl opacity-50">✨</div>
                    <div className="absolute bottom-4 right-4 text-4xl opacity-50">✨</div>
                    <p id="word_display_ar_sukukata" className="text-7xl md:text-8xl font-black text-gray-700 tracking-wider">?</p>
                </div>

                <div className="flex items-center justify-center gap-3 mb-8 h-12 w-full max-w-md bg-white/60 rounded-full py-2 px-6 shadow-inner">
                    <div id="mic_icon_ar_sukukata" className="w-5 h-5 bg-red-500 rounded-full hidden shadow-lg shadow-red-300" style={{animation: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite"}}></div>
                    <p id="speech_status_ar_sukukata" className="text-xl md:text-2xl font-semibold text-gray-600 text-center">Tekan "MULA MAIN"</p>
                </div>

                <button id="start_btn_ar_sukukata" className="neo-btn bg-pink text-white font-black py-4 px-14 rounded-full text-2xl md:text-3xl">
                    MULA MAIN
                </button>
            </div>
        </div>
      </div>

      <div id="view-belajar-bacaan" className="screen">"""

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Added view-ar-sukukata")
