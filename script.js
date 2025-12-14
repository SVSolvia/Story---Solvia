/* =========================================
   0. KẾT NỐI FIREBASE (FIRESTORE + STORAGE)
   ========================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// Dùng bộ thư viện Firestore
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Dùng bộ thư viện Storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// --- DÁN MÃ CONFIG CỦA DỰ ÁN PHOTOBOOTH VÀO ĐÂY ---
const firebaseConfig = {
    apiKey: "AIzaSyDhTpzZw4kWvlNjPag1CguFmQy-XoRQl_4",
    authDomain: "chat-3407.firebaseapp.com",
    databaseURL: "https://chat-3407-default-rtdb.firebaseio.com",
    projectId: "chat-3407",
    storageBucket: "chat-3407.appspot.com",
    messagingSenderId: "645134241923",
    appId: "1:645134241923:web:3479bed824394302aa4bb6",
    measurementId: "G-X3EL784VPT"
};

// --------------------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Khởi tạo Firestore
const storage = getStorage(app); // Khởi tạo Storage

/* =========================================
   1. HIỆU ỨNG (PARTICLES)
   ========================================= */
window.createParticles = function() {
    const container = document.getElementById('particles-container');
    if (!container) return; 
    const particleCount = 20; 
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 15 + 5 + 'px'; 
        particle.style.width = size; particle.style.height = size;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        container.appendChild(particle);
    }
}
window.createParticles();

/* =========================================
   2. HỆ THỐNG NHẠC (LOCAL)
   ========================================= */
const defaultSongs = [
    { name: "Born To Die - Lana Del Rey", url: "music/Born To Die - Lana Del Rey.mp3" },
    { name: "Radio - Lana Dey Rey", url: "music/Radio - Lana Dey Rey.mp3" },
    { name: "Sad Girl - Lana Dey Rey", url: "music/Sad Girl - Lana Dey Rey.mp3" },
    { name: "Summertime Sadness - Lana Del Rey", url: "music/Summertime Sadness - Lana Del Rey.mp3" },
    { name: "Young and Beautiful - Lana Dey Rey", url: "music/Young and Beautiful - Lana Dey Rey.mp3" },
      { name: "Cinnamon Girl - Lana Dey Rey", url: "music/Cinnamon Girl - Lana Dey Rey.mp3" },
         { name: "Brooklyn Baby - Lana Del Rey", url: "music/Brooklyn Baby - Lana Del Rey.mp3" },
];

let playlist = [...defaultSongs];
let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;

window.initMusicPlayer = function() {
    renderPlaylist();
    if (playlist.length > 0) {
        audio.src = playlist[0].url;
        document.getElementById('track-name').innerText = playlist[0].name;
        document.getElementById('track-artist').innerText = "Thư viện có sẵn";
    }
}

window.handleMusicFiles = function(input) {
    const files = input.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
        playlist.push({
            name: files[i].name.replace(/\.[^/.]+$/, ""),
            url: URL.createObjectURL(files[i]),
            type: 'user'
        });
    }
    renderPlaylist();
    showToast(`Đã thêm ${files.length} bài hát.`);
}

window.renderPlaylist = function(filterKeyword = "") {
    const list = document.getElementById('playlist');
    if (!list) return;
    list.innerHTML = "";
    const filtered = playlist.map((song, index) => ({...song, originalIndex: index}))
                             .filter(song => song.name.toLowerCase().includes(filterKeyword.toLowerCase()));
    if (filtered.length === 0) { list.innerHTML = '<li style="text-align:center; padding:20px; opacity:0.6;">Không tìm thấy...</li>'; return; }
    filtered.forEach(song => {
        const li = document.createElement('li');
        li.className = `song-item ${song.originalIndex === currentSongIndex ? 'active' : ''}`;
        li.onclick = () => loadSong(song.originalIndex);
        const icon = song.type === 'user' ? '<i class="fas fa-user-music"></i>' : '<i class="fas fa-compact-disc"></i>';
        li.innerHTML = `<span class="s-name">${song.name}</span><span class="s-dur" style="font-size:0.8rem; opacity:0.7">${icon}</span>`;
        list.appendChild(li);
    });
}

window.filterPlaylist = function() {
    const keyword = document.getElementById('music-search').value;
    renderPlaylist(keyword);
}

window.loadSong = function(index) {
    if (index < 0 || index >= playlist.length) return;
    currentSongIndex = index;
    const song = playlist[index];
    audio.src = song.url;
    audio.load();
    document.getElementById('track-name').innerText = song.name;
    document.getElementById('track-artist').innerText = song.type === 'user' ? "Nhạc của bạn" : "Lana Del Rey Collection";
    renderPlaylist(document.getElementById('music-search').value);
    playAudio();
}

window.playAudio = function() {
    var playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            document.getElementById('play-icon').className = 'fas fa-pause';
            document.getElementById('disk-cover').classList.add('playing');
        }).catch(error => console.log("Chờ tương tác..."));
    }
}

window.pauseAudio = function() {
    audio.pause();
    isPlaying = false;
    document.getElementById('play-icon').className = 'fas fa-play';
    document.getElementById('disk-cover').classList.remove('playing');
}

window.togglePlay = function() {
    if (playlist.length === 0) return;
    if (isPlaying) pauseAudio(); else playAudio();
}

window.nextSong = function() {
    if (playlist.length === 0) return;
    let newIndex = currentSongIndex + 1;
    if (newIndex >= playlist.length) newIndex = 0;
    loadSong(newIndex);
}

window.prevSong = function() {
    if (playlist.length === 0) return;
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
    loadSong(newIndex);
}

audio.onended = window.nextSong;
audio.ontimeupdate = function() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        document.getElementById('seek-slider').value = percent;
        document.getElementById('current-time').innerText = formatTime(audio.currentTime);
        document.getElementById('total-duration').innerText = formatTime(audio.duration);
    }
};

window.seekTo = function() {
    const slider = document.getElementById('seek-slider');
    const seekTime = (slider.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

function formatTime(s) {
    if(isNaN(s)) return "00:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
window.initMusicPlayer();

/* =========================================
   3. QUẢN LÝ BÀI VIẾT (FIRESTORE + STORAGE)
   ========================================= */
let stories = []; 
let currentStoryId = null; 

// --- UPLOAD ẢNH ---
async function uploadImagesInContent(htmlContent) {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const images = div.getElementsByTagName('img');

    for (let img of images) {
        // Chỉ xử lý ảnh là Blob (Link tạm)
        if (img.src.startsWith('blob:')) {
            try {
                showToast("Đang đẩy ảnh lên mây...");
                const response = await fetch(img.src);
                const blob = await response.blob();
                
                // Lưu vào thư mục riêng: story_solvia_images
                const fileName = `story_solvia_images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
                const imgRef = ref(storage, fileName);
                
                // Upload
                await uploadBytes(imgRef, blob);
                
                // Lấy link thật
                const downloadUrl = await getDownloadURL(imgRef);
                img.src = downloadUrl; // Thay thế link blob bằng link thật
                
                console.log("Upload ảnh thành công:", downloadUrl);
            } catch (err) {
                console.error("Lỗi up ảnh:", err);
                showToast("Lỗi upload ảnh! Kiểm tra Console.");
            }
        }
    }
    return div.innerHTML;
}

// --- GỬI BÀI VIẾT VÀO FIRESTORE ---
window.submitStory = async function() {
    const btn = document.querySelector('.submit-btn');
    const nick = document.querySelector('.input-nick').value || "Người Ẩn Danh";
    const title = document.querySelector('.input-title').value || "Không Tiêu Đề";
    let content = document.getElementById('editor').innerHTML;
    const originalText = "Gửi bài";

    if (!content.trim() || content === '<br>') {
        showToast("Viết gì đó đi bạn ơi...");
        return;
    }

    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang lưu...';
    
    try {
        // 1. Upload ảnh trước
        content = await uploadImagesInContent(content);

        // 2. Lưu vào Firestore (Collection riêng: story_solvia_posts)
        await addDoc(collection(db, "story_solvia_posts"), {
            nick: nick,
            title: title,
            content: content, 
            createdAt: new Date() // Firestore dùng Date object
        });

        btn.innerHTML = originalText;
        showToast("Đã lưu thành công!");
        
        // 3. Reset form
        document.querySelector('.input-nick').value = "";
        document.querySelector('.input-title').value = "";
        document.getElementById('editor').innerHTML = "";
        if(document.getElementById('preview-box')) document.getElementById('preview-box').innerHTML = "";
        
        // 4. Tải lại danh sách
        fetchStoriesFromFirebase();

        setTimeout(() => {
            goHome();
            showToast("Bài viết đã được lưu trữ.");
        }, 1000);

    } catch (e) {
        console.error("Lỗi Firestore:", e);
        btn.innerHTML = originalText;
        showToast("Lỗi kết nối! Kiểm tra Console (F12).");
    }
}

// --- TẢI DANH SÁCH TỪ FIRESTORE ---
async function fetchStoriesFromFirebase() {
    const list = document.getElementById('saved-articles');
    if(!list) return;
    list.innerHTML = '<p style="text-align:center; padding:20px; opacity:0.5"><i class="fas fa-spinner fa-spin"></i> Đang tải...</p>';

    try {
        // Lấy dữ liệu từ collection 'story_solvia_posts'
        const q = query(collection(db, "story_solvia_posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        stories = []; 
        
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let dateStr = "Vừa xong";
            // Xử lý ngày tháng Firestore
            if (data.createdAt && data.createdAt.toDate) {
                dateStr = data.createdAt.toDate().toLocaleDateString('vi-VN');
            }
            stories.push({ id: doc.id, ...data, date: dateStr });
        });

        renderArticleList();

    } catch (error) {
        console.error("Lỗi tải bài viết:", error);
        list.innerHTML = '<p style="text-align:center; opacity:0.5">Lỗi tải dữ liệu. Xem Console.</p>';
    }
}
// Chạy ngay khi mở web
fetchStoriesFromFirebase();

// --- CÁC HÀM HIỂN THỊ ---
window.renderArticleList = function() {
    const list = document.getElementById('saved-articles');
    if (!list) return;
    list.innerHTML = ''; 

    if (stories.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity:0.5; margin-top:20px;">Chưa có bài nào...</p>';
        return;
    }

    stories.forEach(story => {
        const li = document.createElement('li');
        li.className = 'article-item';
        li.onclick = function() { openArticle(story); };
        li.innerHTML = `
            <span class="article-date">${story.date}</span>
            <span class="article-title">${story.title}</span>
        `;
        list.appendChild(li);
    });
}

window.openArticle = function(story) {
    currentStoryId = story.id; 
    document.querySelector('.read-title').innerText = story.title;
    document.querySelector('.read-author').innerText = story.nick;
    document.querySelector('.read-content').innerHTML = story.content;
    const sidebar = document.getElementById('sidebar-left');
    if (sidebar) sidebar.classList.remove('active');
    switchView('read-view');
}

window.nextStory = function() {
    if (stories.length === 0) return;
    const currentIndex = stories.findIndex(s => s.id === currentStoryId);
    if (currentIndex !== -1 && currentIndex < stories.length - 1) {
        const nextArticle = stories[currentIndex + 1];
        const contentArea = document.querySelector('.story-wrapper');
        contentArea.style.opacity = 0; 
        setTimeout(() => { openArticle(nextArticle); contentArea.style.opacity = 1; }, 300);
    } else { showToast("Đã hết bài cũ rồi..."); }
}

/* =========================================
   4. ĐIỀU HƯỚNG GIAO DIỆN & TIỆN ÍCH
   ========================================= */
window.switchView = function(viewId) {
    document.querySelectorAll('.view').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
    const target = document.getElementById(viewId);
    if (target) { target.style.display = 'block'; setTimeout(() => target.classList.add('active'), 50); }
    window.scrollTo(0,0);
    const btnList = document.getElementById('btn-read-list');
    if (btnList) btnList.style.display = (viewId === 'read-view') ? 'block' : 'none';
}

window.goHome = function() { switchView('home-view'); }
window.goToWrite = function() { switchView('write-view'); }
window.goToRead = function() { 
    if (stories.length === 0) {
        showToast("Đang tải dữ liệu...");
        switchView('read-view');
    } else { openArticle(stories[0]); }
}
window.toggleSidebar = function(id) {
    const all = document.querySelectorAll('.sidebar');
    all.forEach(s => { if(s.id !== `sidebar-${id}`) s.classList.remove('active'); });
    document.getElementById(`sidebar-${id}`).classList.toggle('active');
}

window.setTheme = function(mode) {
    const body = document.body;
    body.classList.remove('warm-theme', 'forest-theme', 'dream-theme', 'cold-theme');
    document.querySelectorAll('.theme-item').forEach(btn => btn.classList.remove('active'));
    let msg = "";
    if (mode === 'night') { document.querySelector('.theme-item.night').classList.add('active'); msg = "Đêm thâu"; } 
    else if (mode === 'warm') { body.classList.add('warm-theme'); document.querySelector('.theme-item.warm').classList.add('active'); msg = "Ấm áp"; }
    else if (mode === 'forest') { body.classList.add('forest-theme'); document.querySelector('.theme-item.forest').classList.add('active'); msg = "Chữa lành"; }
    else if (mode === 'dream') { body.classList.add('dream-theme'); document.querySelector('.theme-item.dream').classList.add('active'); msg = "Mộng mơ"; }
    else if (mode === 'cold') { body.classList.add('cold-theme'); document.querySelector('.theme-item.cold').classList.add('active'); msg = "Lạnh giá"; }
    showToast(msg);
}

window.showToast = function(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-heart" style="color:var(--accent)"></i> ${msg}`;
    container.prepend(toast); 
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 4000);
}

// XỬ LÝ ẢNH (BLOB)
window.handleImage = function(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const blobUrl = URL.createObjectURL(file); // Dùng Blob URL
        
        const previewBox = document.getElementById('preview-box');
        previewBox.innerHTML = ''; 
        const img = document.createElement('img');
        img.src = blobUrl;
        img.onclick = () => { insertImageToEditor(blobUrl); img.remove(); };
        previewBox.appendChild(img);
        showToast("Đã tải ảnh. Bấm vào ảnh nhỏ để chèn.");
    }
}
let activeImg = null; 
window.insertImageToEditor = function(src) {
    const editor = document.getElementById('editor'); editor.focus();
    const img = document.createElement('img'); img.src = src; img.style.width = "60%"; 
    img.onclick = function(e) {
        e.stopPropagation(); 
        if(activeImg) activeImg.classList.remove('active-img');
        this.classList.add('active-img'); activeImg = this;
        showResizeSlider(this);
    };
    editor.appendChild(img); editor.appendChild(document.createElement('br'));
}
window.showResizeSlider = function(targetImg) {
    const oldSlider = document.getElementById('temp-slider'); if(oldSlider) oldSlider.remove();
    const slider = document.createElement('input'); slider.type = 'range'; slider.min = '10'; slider.max = '100'; 
    slider.value = parseInt(targetImg.style.width) || 60; slider.id = 'temp-slider'; slider.className = 'img-slider-control';
    targetImg.parentNode.insertBefore(slider, targetImg.nextSibling);
    slider.oninput = function() { targetImg.style.width = this.value + '%'; };
}
document.addEventListener('click', function(e) {
    if(e.target.tagName !== 'IMG' && e.target.id !== 'temp-slider') {
        if(activeImg) { activeImg.classList.remove('active-img'); activeImg = null; }
        const slider = document.getElementById('temp-slider'); if(slider) slider.remove();
    }
});