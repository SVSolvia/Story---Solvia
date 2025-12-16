/* =========================================
   0. KẾT NỐI FIREBASE (FIRESTORE + STORAGE)
   ========================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// Dùng bộ thư viện Firestore
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Dùng bộ thư viện Storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// --- CẤU HÌNH DỰ ÁN CỦA BẠN ---
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
/* =========================================
   1. QUẢN LÝ HIỆU ỨNG NỀN (NÂNG CẤP)
   ========================================= */
/* =========================================
   1. QUẢN LÝ HIỆU ỨNG NỀN (ĐÃ THÊM HIỆU ỨNG LỬA)
   ========================================= */
let currentEffect = 'snow'; // Mặc định

window.createParticles = function() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Nếu đang chạy lửa thì xóa hết các hạt khác (tuyết/mưa) đi cho sạch
    if (currentEffect === 'fire') {
        container.innerHTML = '';
        return; 
    }
    
    // ... (Giữ nguyên logic tạo tuyết/mưa cũ ở đây) ...
    container.innerHTML = ''; 
    let count = 20; 
    if (currentEffect === 'rain') count = 60;
    if (currentEffect === 'firefly') count = 15;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle', currentEffect);
        
        let size = Math.random() * 15 + 5; 
        p.style.left = Math.random() * 100 + 'vw';
        let duration = Math.random() * 15 + 15; 

        if (currentEffect === 'rain') {
            size = Math.random() * 2 + 1;
            p.style.height = (Math.random() * 20 + 10) + 'px';
            duration = Math.random() * 1 + 0.5;
        } 
        else if (currentEffect === 'firefly') {
            size = Math.random() * 6 + 2;
            p.style.animationDelay = Math.random() * 5 + 's';
        }

        p.style.width = size + 'px';
        if (currentEffect !== 'rain') p.style.height = size + 'px';
        p.style.animationDuration = duration + 's';
        
        container.appendChild(p);
    }
}

// Hàm chuyển đổi hiệu ứng
// Hàm chuyển đổi hiệu ứng (ĐÃ NÂNG CẤP LOGIC LỬA)
// Hàm chuyển đổi hiệu ứng (ĐÃ TÍCH HỢP LỬA CHÂN THỰC)
window.setEffect = function(type) {
    currentEffect = type;
    
    // --- XỬ LÝ LỬA ĐIỆN ẢNH ---
    if (type === 'fire') {
        startCinematicFire();
    } else {
        stopCinematicFire();
    }
    // ---------------------------

    // Logic tạo hạt bay khác
    window.createParticles(); 
    
    let msg = "";
    if(type === 'snow') msg = "Tuyết rơi lạnh giá";
    if(type === 'firefly') msg = "Đom đóm mùa hạ";
    if(type === 'rain') msg = "Mưa tuôn nỗi niềm";
    if(type === 'fire') msg = "Ngọn lửa đam mê";
    showToast(`Đã chuyển hiệu ứng: ${msg}`);
}

// Khởi chạy
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
    { name: "Say Yes To Heaven - Lana Del Rey", url: "music/Say Yes To Heaven - Lana Del Rey.mp3" },
    { name: "Lovely - Billie Eilish, Khalid", url: "music/Lovely - Billie Eilish, Khalid.mp3" },
    { name: "Take Me To Church - Hozier", url: "music/Take Me To Church - Hozier.mp3" },
    { name: "Daylight - David Kushner", url: "music/Daylight - David Kushner.mp3" },
    { name: "Until I Found You - Stephen Sanchez", url: "music/Until I Found You - Stephen Sanchez.mp3" },
    { name: "Chemtrails Over The Country Club - Lana Del Rey", url: "music/Chemtrails Over The Country Club - Lana Del Rey.mp3" },
    { name: "I Wanna Be Yours", url: "music/I Wanna Be Yours.mp3" },
    { name: "Die With A Smile - Lady Gaga, Bruno Mars", url: "music/Die With A Smile - Lady Gaga, Bruno Mars.mp3" },


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
                showToast("Đang lưu lại khoảnh khắc vô giá này...");
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
                
                console.log("Một bức ảnh thay vạn lời nói. Đã lưu giữ xong.", downloadUrl);
            } catch (err) {
                console.error("Lỗi up ảnh:", err);
                showToast("Lỗi upload ảnh!");
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
        showToast("Khoan đã... hình như lòng bạn vẫn đang ngập ngừng? Hít thở sâu và để cảm xúc dẫn lối nhé.");
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
        showToast("Đã gửi vào thinh không. Hy vọng lòng bạn giờ đã bình yên hơn");
        
        // 3. Reset form
        document.querySelector('.input-nick').value = "";
        document.querySelector('.input-title').value = "";
        document.getElementById('editor').innerHTML = "";
        if(document.getElementById('preview-box')) document.getElementById('preview-box').innerHTML = "";
        
        // 4. Tải lại danh sách
        fetchStoriesFromFirebase();

        setTimeout(() => {
            goHome();
            showToast("Câu chuyện đã được cất giữ an toàn. Cảm ơn bạn đã dũng cảm đối diện với nó.");
        }, 1000);

    } catch (e) {
        console.error("Lỗi Firestore:", e);
        btn.innerHTML = originalText;
        showToast("Có chút trục trặc... Có lẽ vũ trụ muốn bạn chậm lại một nhịp. Hãy thử lại nhé.");
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
        list.innerHTML = '<p style="text-align:center; opacity:0.5">Lỗi tải dữ liệu</p>';
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
        list.innerHTML = '<p style="text-align:center; opacity:0.5; margin-top:20px;">Góc nhỏ này vẫn đang đợi người đầu tiên mở lời...</p>';
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
    } else { showToast("Đã hết những dòng tâm sự cũ. Hãy quay lại sau nhé."); }
}

/* =========================================
   4. ĐIỀU HƯỚNG GIAO DIỆN & TIỆN ÍCH (ĐÃ SỬA: THÊM LẠI CÁC THÔNG BÁO)
   ========================================= */

// Biến cờ: Nhớ xem đã hiện gợi ý đọc chưa
let hasShownReadHint = false; 

window.switchView = function(viewId) {
    // Ẩn tất cả view cũ
    document.querySelectorAll('.view').forEach(el => { 
        el.classList.remove('active'); 
        el.style.display = 'none'; 
    });

    // Hiện view mới
    const target = document.getElementById(viewId);
    if (target) { 
        target.style.display = 'block'; 
        setTimeout(() => target.classList.add('active'), 50); 
    }
    
    window.scrollTo(0,0);

    const btnList = document.getElementById('btn-read-list');
    if (btnList) btnList.style.display = (viewId === 'read-view') ? 'block' : 'none';

    /* --- XỬ LÝ THÔNG BÁO --- */
    
    // 1. Vào trang VIẾT: Luôn hiện
    if (viewId === 'write-view') {
        setTimeout(() => showToast("Đừng để không gian quá tĩnh lặng. Hãy để âm nhạc vỗ về bạn."), 1500);
    } 
    
    // 2. Vào trang ĐỌC (Thư viện): Hiện 1 lần duy nhất
    else if (viewId === 'read-view') {
        // Bỏ điều kiện "&& stories.length > 0" để luôn hiện dù đang tải dữ liệu
        if (!hasShownReadHint) { 
            setTimeout(() => showToast("Những câu chuyện cũ vẫn nằm lặng lẽ ở góc trái, chờ người tri kỷ..."), 2000);
            hasShownReadHint = true; // Đánh dấu đã hiện
        }
    }
}

// --- CÁC HÀM KHÁC GIỮ NGUYÊN ---
window.goHome = function() { switchView('home-view'); }
window.goToWrite = function() { switchView('write-view'); }

window.goToRead = function() { 
    if (stories.length === 0) {
        showToast("Đang kết nối với những miền ký ức...");
        switchView('read-view');
    } else { 
        openArticle(stories[0]); 
    }
}

window.toggleSidebar = function(id) {
    const all = document.querySelectorAll('.sidebar');
    all.forEach(s => { if(s.id !== `sidebar-${id}`) s.classList.remove('active'); });
    document.getElementById(`sidebar-${id}`).classList.toggle('active');
}

/* =========================================
   HÀM ĐỔI MÀU GIAO DIỆN (NEW PALETTE)
   ========================================= */
window.setTheme = function(mode) {
    const body = document.body;
    
    // 1. Xóa sạch các class màu cũ
    body.classList.remove(
        'warm-theme', 'forest-theme', 'dream-theme', 'cold-theme', 
        'sakura-theme', 'coffee-theme', 'cyber-theme', 'royal-theme'
    );
    
    // 2. Reset nút active
    document.querySelectorAll('.theme-item').forEach(btn => btn.classList.remove('active'));
    
    let msg = "";

    // 3. Kích hoạt màu (Giữ lại các màu cơ bản cũ + 4 màu mới)
    if (mode === 'night') { 
        document.querySelector('.theme-item.night').classList.add('active'); 
        msg = "Đêm thâu tĩnh lặng"; 
    } 
    else if (mode === 'warm') { body.classList.add('warm-theme'); document.querySelector('.theme-item.warm').classList.add('active'); msg = "Ấm áp"; }
    else if (mode === 'forest') { body.classList.add('forest-theme'); document.querySelector('.theme-item.forest').classList.add('active'); msg = "Rừng xanh"; }
    else if (mode === 'dream') { body.classList.add('dream-theme'); document.querySelector('.theme-item.dream').classList.add('active'); msg = "Mộng mơ"; }
    else if (mode === 'cold') { body.classList.add('cold-theme'); document.querySelector('.theme-item.cold').classList.add('active'); msg = "Lạnh giá"; }
    
    // --- 4 MÀU MỚI (ĐẸP HƠN) ---
    else if (mode === 'sakura') { 
        body.classList.add('sakura-theme'); 
        document.querySelector('.theme-item.sakura').classList.add('active'); 
        msg = "Sakura lãng mạn"; 
    }
    else if (mode === 'coffee') { 
        body.classList.add('coffee-theme'); 
        document.querySelector('.theme-item.coffee').classList.add('active'); 
        msg = "Coffee House Chill"; 
    }
    else if (mode === 'cyber') { 
        body.classList.add('cyber-theme'); 
        document.querySelector('.theme-item.cyber').classList.add('active'); 
        msg = "Cyberpunk Future"; 
    }
    else if (mode === 'royal') { 
        body.classList.add('royal-theme'); 
        document.querySelector('.theme-item.royal').classList.add('active'); 
        msg = "Hoàng Gia Sang Trọng"; 
    }

    showToast(msg);
}

/* =========================================
   HÀM THÔNG BÁO THÔNG MINH (TỰ CHỈNH THỜI GIAN)
   ========================================= */
window.showToast = function(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // --- CÔNG THỨC TÍNH THỜI GIAN ---
    // 1. Mặc định ít nhất 3000ms (3 giây) cho các câu ngắn.
    // 2. Cộng thêm 50ms cho mỗi ký tự trong câu.
    // Ví dụ: Câu 100 chữ cái sẽ hiện thêm 5 giây -> Tổng 8 giây.
    let duration = 3000 + (msg.length * 50);

    // 3. Giới hạn tối đa 10 giây (để không bị treo mãi)
    if (duration > 10000) duration = 10000;

    // Tạo thông báo
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Thêm nội dung
    toast.innerHTML = `<i class="fas fa-heart" style="color:var(--accent); margin-right: 8px;"></i> ${msg}`;
    
    // Hiện lên đầu danh sách (Xếp chồng)
    container.prepend(toast); 

    // Ẩn sau khoảng thời gian đã tính (duration)
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transform = 'translateY(-20px)'; 
        setTimeout(() => toast.remove(), 500); 
    }, duration);
}

// XỬ LÝ ẢNH (BLOB)
/* =========================================
   XỬ LÝ ẢNH & KÉO GÓC (NEW - RESIZE HANDLE)
   ========================================= */
// Lấy các phần tử cần thiết
// Lưu ý: Biến 'editor' đã được khai báo ở phần Toolbar bên dưới, 
// nhưng để chắc chắn code chạy đúng thứ tự, ta lấy lại tham chiếu ở đây.
const editorRef = document.getElementById('editor'); 
const resizeHandle = document.getElementById('resize-handle');
let currentImg = null; // Ảnh đang chọn
let isResizing = false;
let startX, startWidth;

// 1. CHỌN ẢNH (Ủy quyền sự kiện - Bắt dính mọi ảnh được paste/upload)
editorRef.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
        e.stopPropagation(); // Ngừng lan truyền click
        selectImage(e.target);
    } else {
        deselectImage(); // Bấm ra ngoài thì bỏ chọn
    }
});

// 2. HÀM CHỌN ẢNH
function selectImage(img) {
    if (currentImg && currentImg !== img) deselectImage();
    
    currentImg = img;
    currentImg.classList.add('active-img'); // Thêm viền xanh
    
    updateHandlePosition(); // Đưa nút kéo về đúng góc ảnh
    resizeHandle.style.display = 'block'; // Hiện nút
}

// 3. HÀM BỎ CHỌN
function deselectImage() {
    if (currentImg) {
        currentImg.classList.remove('active-img');
        currentImg = null;
    }
    resizeHandle.style.display = 'none';
}

// 4. CẬP NHẬT VỊ TRÍ NÚT KÉO (Chạy liên tục khi cuộn trang)
function updateHandlePosition() {
    if (!currentImg) return;
    
    const rect = currentImg.getBoundingClientRect();
    // Tính toán vị trí nút (Góc dưới phải) + Cuộn trang
    const handleTop = rect.bottom + window.scrollY - 12; // -12 là nửa chiều cao nút
    const handleLeft = rect.right + window.scrollX - 12;

    resizeHandle.style.top = `${handleTop}px`;
    resizeHandle.style.left = `${handleLeft}px`;
}

// Cập nhật vị trí khi cuộn hoặc thay đổi kích thước màn hình
window.addEventListener('scroll', updateHandlePosition, true);
window.addEventListener('resize', updateHandlePosition);
editorRef.addEventListener('input', updateHandlePosition); // Khi gõ chữ làm ảnh chạy

// 5. XỬ LÝ KÉO (LOGIC CHÍNH)
const startResize = (clientX) => {
    if (!currentImg) return;
    isResizing = true;
    startX = clientX;
    startWidth = currentImg.offsetWidth; // Lấy chiều rộng hiện tại (pixel)
    
    // Tắt chọn văn bản để kéo cho mượt
    document.body.style.userSelect = 'none';
};

const doResize = (clientX) => {
    if (!isResizing || !currentImg) return;

    // Tính khoảng cách đã kéo
    const dx = clientX - startX;
    const newPixelWidth = startWidth + dx;

    // Quy đổi ra % để tương thích mobile
    const editorWidth = editorRef.offsetWidth;
    let newPercent = (newPixelWidth / editorWidth) * 100;

    // Giới hạn Min 20% - Max 100%
    if (newPercent < 20) newPercent = 20;
    if (newPercent > 100) newPercent = 100;

    currentImg.style.width = `${newPercent}%`;
    updateHandlePosition(); // Nút chạy theo ảnh ngay lập tức
};

const stopResize = () => {
    isResizing = false;
    document.body.style.userSelect = ''; // Trả lại chọn văn bản
};

// --- Sự kiện cho MÁY TÍNH (Mouse) ---
resizeHandle.addEventListener('mousedown', (e) => {
    e.preventDefault(); 
    startResize(e.clientX);
});
window.addEventListener('mousemove', (e) => doResize(e.clientX));
window.addEventListener('mouseup', stopResize);

// --- Sự kiện cho ĐIỆN THOẠI (Touch) ---
resizeHandle.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Chặn cuộn màn hình khi đang kéo
    startResize(e.touches[0].clientX);
});
window.addEventListener('touchmove', (e) => {
    if (isResizing) doResize(e.touches[0].clientX);
});
window.addEventListener('touchend', stopResize);

// --- HÀM CHÈN ẢNH & UPLOAD (ĐÃ NÂNG CẤP) ---
window.insertImageToEditor = function(src) {
    editorRef.focus();
    const img = document.createElement('img');
    img.src = src;
    img.style.width = "80%"; // Mặc định to 80%
    
    // Chèn vào vị trí con trỏ
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && editorRef.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.collapse(false);
    } else {
        editorRef.appendChild(img);
    }
    
    // Thêm dòng mới để viết tiếp
    const div = document.createElement('div'); div.innerHTML = '<br>';
    if (img.nextSibling) editorRef.insertBefore(div, img.nextSibling);
    else editorRef.appendChild(div);

    // Tự động chọn ảnh vừa chèn
    setTimeout(() => selectImage(img), 100);
}

// Hàm xử lý file input (Upload ảnh)
window.handleImage = function(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const blobUrl = URL.createObjectURL(file);
        
        // Hiện preview nhỏ
        const previewBox = document.getElementById('preview-box');
        previewBox.innerHTML = '';
        const imgPre = document.createElement('img');
        imgPre.src = blobUrl;
        imgPre.onclick = () => insertImageToEditor(blobUrl);
        previewBox.appendChild(imgPre);
        
        // Hoặc chèn luôn nếu muốn (tùy chọn)
        showToast("Ảnh đã sẵn sàng. Bấm vào ảnh nhỏ để chèn.");
    }
}
/* =========================================
   XỬ LÝ THANH CÔNG CỤ NỔI (FLOATING TOOLBAR)
   ========================================= */
const editor = document.getElementById('editor');
const toolbar = document.getElementById('floating-toolbar');

// 1. LẮNG NGHE SỰ THAY ĐỔI VÙNG CHỌN (BẤT KỂ CHUỘT HAY CẢM ỨNG)
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();

    // Nếu không có gì được chọn hoặc vùng chọn rỗng -> Ẩn
    if (selection.isCollapsed || !editor.contains(selection.anchorNode)) {
        toolbar.style.display = 'none';
        return;
    }

    // Lấy vị trí của vùng bôi đen
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Nếu vùng chọn nằm ngoài màn hình hoặc bị ẩn -> Ẩn toolbar
    if (rect.width === 0 && rect.height === 0) {
        toolbar.style.display = 'none';
        return;
    }

    // 2. TÍNH TOÁN VỊ TRÍ ĐỂ HIỆN THANH CÔNG CỤ
    // Hiện ngay trên đầu vùng bôi đen
    // Cộng thêm window.scrollY để tính đúng khi cuộn trang
    const top = rect.top + window.scrollY - 45; 
    const left = rect.left + window.scrollX + (rect.width / 2);

    toolbar.style.top = `${top}px`;
    toolbar.style.left = `${left}px`;
    toolbar.style.display = 'flex'; // Dùng flex để dàn ngang nút
});

// 3. HÀM THỰC HIỆN LỆNH (QUAN TRỌNG: DÙNG MOUSEDOWN ĐỂ GIỮ BÔI ĐEN)
window.formatText = function(cmd) {
    // event.preventDefault() đã được gọi ngầm nhờ onmousedown trong HTML
    // Nó giúp nút bấm không "cướp" mất focus của văn bản
    
    document.execCommand(cmd, false, null);
    
    // Cập nhật lại vị trí toolbar (phòng khi căn lề làm chữ chạy đi chỗ khác)
    // Gọi lại sự kiện selectionchange nhân tạo
    document.dispatchEvent(new Event('selectionchange'));
}

// 4. CẤU HÌNH EDITOR: ENTER XUỐNG DÒNG LÀ THẺ DIV (ĐỂ CĂN LỀ CHUẨN)
// Chạy dòng này 1 lần khi load trang
document.execCommand('defaultParagraphSeparator', false, 'div');
/* =========================================
   BỘ MÁY TẠO LỬA CHÂN THỰC (CANVAS PARTICLE ENGINE)
   ========================================= */
/* =========================================
   BỘ MÁY LỬA CHILL (COZY FIRE ENGINE)
   ========================================= */
let cineFireCanvas, cineCtx;
let cineAnimationId = null;
let particles = [];

function startCinematicFire() {
    // 1. Tạo Canvas
    if (!document.getElementById('cinematic-fire-canvas')) {
        cineFireCanvas = document.createElement('canvas');
        cineFireCanvas.id = 'cinematic-fire-canvas';
        document.body.appendChild(cineFireCanvas);
        cineCtx = cineFireCanvas.getContext('2d');
        
        cineFireCanvas.width = window.innerWidth;
        cineFireCanvas.height = 300;

        window.addEventListener('resize', () => {
            cineFireCanvas.width = window.innerWidth;
        });
    }

    // 2. Hạt Lửa Mềm (Soft Flame)
    class FlameParticle {
        constructor() {
            this.reset(true); // true = khởi tạo ngẫu nhiên trên màn hình để không bị trống lúc đầu
        }

        reset(initial = false) {
            this.x = Math.random() * cineFireCanvas.width;
            // Nếu là lần đầu, rải đều độ cao để lửa có sẵn. Nếu tái sinh thì xuất phát từ đáy.
            this.y = initial ? Math.random() * cineFireCanvas.height : cineFireCanvas.height + 20;
            
            // TỐC ĐỘ RẤT CHẬM (Chill)
            this.vy = Math.random() * -1 - 0.5; // Bay lên từ từ
            this.vx = (Math.random() - 0.5) * 1; // Lắc lư nhẹ
            
            this.radius = Math.random() * 40 + 20; // Hạt to để tạo mảng màu lớn
            this.life = Math.random() * 100 + 50;
            this.maxLife = this.life;
            
            // MÀU SẮC ẤM CÚNG (Đỏ cam thẫm)
            // R: 200-255 (Đỏ nhiều)
            // G: 50-100 (Xanh lá ít -> Ra màu cam đất/đỏ)
            const r = Math.floor(Math.random() * 55 + 200); 
            const g = Math.floor(Math.random() * 50 + 30); 
            this.color = `${r},${g},0`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            this.radius -= 0.1; // Nhỏ dần rất chậm
            
            // Lắc lư mềm mại hình sin
            this.x += Math.sin(this.life / 20) * 0.3;

            if (this.life <= 0 || this.radius <= 0) {
                this.reset();
            }
        }

        draw(ctx) {
            // Opacity thấp để các lớp chồng lên nhau mượt mà
            const opacity = (this.life / this.maxLife) * 0.15;
            
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, `rgba(${this.color}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${this.color}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 3. Tàn tro bay lững lờ (Floating Embers)
    class Spark {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.x = Math.random() * cineFireCanvas.width;
            this.y = initial ? Math.random() * cineFireCanvas.height : cineFireCanvas.height;
            
            this.vy = Math.random() * -1.5 - 0.5; // Bay chậm hơn lửa cũ nhiều
            this.vx = (Math.random() - 0.5) * 2; // Bay xiên xẹo tự nhiên
            this.size = Math.random() * 2 + 0.5; // Nhỏ li ti
            this.life = Math.random() * 150 + 100;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            if (this.life <= 0) this.reset();
        }
        draw(ctx) {
            // Màu vàng cam sáng
            ctx.fillStyle = `rgba(255, 180, 50, ${this.life/200})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 4. Khởi tạo
    particles = [];
    // Tăng số lượng hạt lửa lên để tạo nền dày đặc, ấm áp
    for(let i=0; i<400; i++) particles.push(new FlameParticle());
    // Giảm tàn tro đi cho đỡ rối mắt
    for(let i=0; i<60; i++) particles.push(new Spark());

    // 5. Vòng lặp
    function animate() {
        cineCtx.clearRect(0, 0, cineFireCanvas.width, cineFireCanvas.height);
        
        // Dùng 'screen' thay vì 'lighter' để màu đằm hơn, không bị cháy sáng trắng
        cineCtx.globalCompositeOperation = 'screen'; 

        particles.forEach(p => {
            p.update();
            p.draw(cineCtx);
        });

        cineAnimationId = requestAnimationFrame(animate);
    }

    if (cineAnimationId) cancelAnimationFrame(cineAnimationId);
    animate();
}

function stopCinematicFire() {
    if (cineAnimationId) cancelAnimationFrame(cineAnimationId);
    const canvas = document.getElementById('cinematic-fire-canvas');
    if (canvas) canvas.remove();
}
/* =========================================
   LOGIC ZEN MODE (TỰ ĐỘNG)
   ========================================= */
// Lấy lại tham chiếu editor (đề phòng)
const zenEditor = document.getElementById('editor');

// 1. KHI BẮT ĐẦU VIẾT -> VÀO ZEN MODE
zenEditor.addEventListener('focus', () => {
    // Chỉ kích hoạt khi nội dung đã đủ dài (tránh vừa vào đã mất hết nút)
    // Hoặc kích hoạt luôn cho ngầu (ở đây mình để kích hoạt luôn)
    document.body.classList.add('zen-mode');
    
    // Tắt luôn thanh công cụ nổi nếu đang hiện
    const toolbar = document.getElementById('floating-toolbar');
    if(toolbar) toolbar.style.display = 'none';
});

// 2. KHI CLICK RA NGOÀI -> THOÁT ZEN MODE
zenEditor.addEventListener('blur', () => {
    document.body.classList.remove('zen-mode');
});

// 3. MẸO NHỎ: Nếu người dùng di chuột lên vùng trên cùng (Header),
// cũng tạm thời hiện lại các nút (để họ đỡ hoang mang nếu muốn thoát)
document.addEventListener('mousemove', (e) => {
    if (document.body.classList.contains('zen-mode')) {
        // Nếu chuột di chuyển lên 100px trên cùng màn hình
        if (e.clientY < 100) {
            document.body.classList.remove('zen-mode');
        }
    }
});
