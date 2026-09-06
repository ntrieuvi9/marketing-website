/* ==========================================================================
   CẤU HÌNH TÀI KHOẢN GITHUB
   ========================================================================== */
const GITHUB_USER = 'ntrieuvi9';
const GITHUB_REPO = 'marketing-website';

/* ==========================================================================
   1. ĐÓNG MỞ MENU TRÊN MOBILE
   ========================================================================== */
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

if (menuBtn && navMenu) {
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('is-active');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-active');
    });
  });
}

/* ==========================================================================
   2. TỰ ĐỘNG NẠP BÀI VIẾT TỪ THƯ MỤC POSTS
   ========================================================================== */
async function loadDynamicPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`);
    if (!res.ok) {
      container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Chưa có bài viết nào hoặc kho đang để chế độ Private.</p>';
      return;
    }

    const files = await res.json();
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    if (jsonFiles.length === 0) {
      container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Chưa có bài viết nào trong hệ thống.</p>';
      return;
    }

    container.innerHTML = '';

    for (const file of jsonFiles) {
      const postRes = await fetch(file.download_url);
      const post = await postRes.json();
      
      const thumb = post.thumbnail || 'images/post-1.jpg';
      const postDate = post.date ? new Date(post.date).toLocaleDateString('vi-VN') : '';

      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-thumb">
          <img src="${thumb}" alt="${post.title}" loading="lazy">
        </div>
        <div class="post-body">
          <div class="post-meta">
            <time>${postDate}</time>
          </div>
          <h3 class="post-title">
            <a href="bai-viet.html?file=${file.name}">${post.title}</a>
          </h3>
          <a href="bai-viet.html?file=${file.name}" class="read-more">Đọc tiếp →</a>
        </div>
      `;
      container.appendChild(card);
    }
  } catch (err) {
    container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Không thể nạp bài viết lúc này.</p>';
  }
}

loadDynamicPosts();