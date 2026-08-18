require('dotenv').config();

async function cekModel() {
    console.log("Mengecek daftar model AI dari Google untuk API Key Anda...\n");
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.error("❌ Error dari Google:", data.error.message);
            return;
        }
        
        console.log("✅ DAFTAR MODEL YANG BISA ANDA GUNAKAN:");
        data.models.forEach(m => {
            // Kita hanya ambil model yang mendukung pembuatan teks (generateContent)
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`👉 ${m.name.replace('models/', '')}`);
            }
        });
        
        console.log("\n=======================================================");
        console.log("Pilih salah satu nama model di atas (misalnya: gemini-1.5-flash)");
        console.log("Lalu ganti tulisan di server.js pada bagian model: '...'");
        console.log("=======================================================");
        
    } catch (err) {
        console.error("Gagal mengecek:", err.message);
    }
}

cekModel();