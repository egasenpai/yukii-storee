// ========================================
// VERCEL SERVERLESS FUNCTION - UPLOAD TO GITHUB
// ========================================

const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
    
    try {
        const { file, productName, price } = req.body;
        
        if (!file) {
            return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
        }
        
        // Parse base64 file
        const base64Data = file.includes(',') ? file.split(',')[1] : file;
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Generate filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const fileName = `payments/${timestamp}_${random}.jpg`;
        
        // GitHub API Config
        const owner = "egasenpai";
        const repo = "yuki-regal";
        const token = process.env.GITHUB_TOKEN_YUKI;
        const myDomain = "https://yuki-regal.vercel.app/";
        
        if (!token) {
            return res.status(500).json({ 
                success: false, 
                message: 'Server configuration error: GITHUB_TOKEN not set' 
            });
        }
        
        // Upload to GitHub
        const { data } = await axios.put(
            `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`,
            {
                message: `Payment proof: ${productName} - Rp ${price}`,
                content: base64Data
            },
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github.v3+json",
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        
        const fileUrl = `${myDomain}${fileName}`;
        
        return res.status(200).json({
            success: true,
            message: 'Upload berhasil',
            url: fileUrl,
            githubUrl: data.content.html_url
        });
        
    } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message || 'Upload gagal'
        });
    }
};
