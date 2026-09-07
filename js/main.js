/* ==========================================================================
   CẤU HÌNH VÀ NẠP BÀI VIẾT TỰ ĐỘNG
   ========================================================================== */
const GITHUB_USER = 'ntrieuvi9';
const GITHUB_REPO = 'marketing-website';

// Dữ liệu dự phòng hiển thị tức thì (phòng khi kho GitHub để Private hoặc mạng lag)
const defaultPosts = [
  {
    title: "Cách Setup GTM Đo Lường Sự Kiện Mua Hàng Không Bị Trùng Dữ Liệu",
    date: "01/09/2026",
    thumbnail: "images/post-1.jpg",
    file: "post-1.json"
  },
  {
    title: "Case Study: Tăng 200% Doanh Thu Bằng Cách Tái Cấu Trúc Google PMax",
    date: "25/08/2026",
    thumbnail: "images/post-2.jpg",
    file: "post-2.json"
  },
  {
    title: "Tối Ưu Entity & Cấu Trúc Silo: Đưa Website Lên Top Bền Vững",
    date: "18/08/2026",
    thumbnail: "images/post-3.jpg",
    file: "post-3.json"
  }
];

function renderPosts(posts, container) {
  container.innerHTML = '';
  posts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
      <div class="post-thumb">
        <img src="${post.thumbnail}" alt="${post.title}" loading="lazy" onerror="this.src='images/hinh vi nguyen trang chu.jpg'">
      </div>
      <div class="post-body">
        <div class="post-meta"><time>${post.date}</time></div>
        <h3 class="post-title">
          <a href="bai-viet.html?file=${post.file}">${post.title}</a>
        </h3>
        <a href="bai-viet.html?file=${post.file}" class="read-more">Đọc tiếp →</a>
      </div>
    `;
    container.appendChild(card);
  });
}

async function loadDynamicPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`);
    if (!res.ok) throw new Error('Không thể kết nối API');

    const files = await res.json();
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));
    if (jsonFiles.length === 0) throw new Error('Chưa có file');

    const loadedPosts = [];
    for (const file of jsonFiles) {
      const postRes = await fetch(file.download_url);
      const postData = await postRes.json();
      loadedPosts.push({
        title: postData.title,
        date: postData.date ? new Date(postData.date).toLocaleDateString('vi-VN') : '',
        thumbnail: postData.thumbnail || 'images/hinh vi nguyen trang chu.jpg',
        file: file.name
      });
    }

    renderPosts(loadedPosts, container);
  } catch (err) {
    // Nếu gặp lỗi kết nối API hoặc kho đang Private, hiển thị ngay bộ bài mẫu chuẩn UI
    renderPosts(defaultPosts, container);
  }
}

document.addEventListener('DOMContentLoaded', loadDynamicPosts);