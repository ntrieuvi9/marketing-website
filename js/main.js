/**
 * ====================================================================
 * NGUYỄN TRIỀU VĨ - GROWTH MARKETING & PERFORMANCE ADS
 * File: js/main.js (Phiên bản v4.0 độc lập)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCursorSpotlight();
  initCyberCanvas();
  initOrbitalCards();
  initHeroParallax();
  initAffiliateToggle();
});

/* ====================================================================
   1. MENU ĐIỀU HƯỚNG MOBILE (DRAWER TOGGLE)
   ==================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('open');
    mobileToggle.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
  });

  // Tự động đóng menu khi bấm vào bất kỳ link điều hướng nào
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileToggle.innerHTML = '☰';
    });
  });

  // Đóng menu khi chạm vào khoảng trống ngoài màn hình
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      mobileToggle.innerHTML = '☰';
    }
  });
}

/* ====================================================================
   2. HIỆU ỨNG ĐỐM SÁNG BÁM THEO CON TRỎ CHUỘT (SPOTLIGHT)
   ==================================================================== */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursor-spotlight');
  if (!spotlight) return;

  // Kiểm tra nếu thiết bị có chuột (không kích hoạt trên cảm ứng điện thoại)
  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateSpotlight = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      spotlight.style.left = `${currentX}px`;
      spotlight.style.top = `${currentY}px`;
      requestAnimationFrame(updateSpotlight);
    };
    updateSpotlight();
  } else {
    spotlight.style.display = 'none';
  }
}

/* ====================================================================
   3. CANVAS MẠNG LƯỚI HẠT CÔNG NGHỆ (CYBER PARTICLES)
   ==================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let particles = [];
  const particleCount = width < 768 ? 25 : 55;
  const maxDistance = width < 768 ? 95 : 140;

  let mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('pointerleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.radius = Math.random() * 1.6 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Tương tác nhẹ khi chuột lại gần
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.8;
          this.y -= (dy / dist) * force * 1.8;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Vẽ các đường nối dữ liệu giữa các hạt gần nhau
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ====================================================================
   4. HỆ THỐNG QUỸ ĐẠO 3D (3D ORBIT SYSTEM) QUANH CHÂN DUNG
   ==================================================================== */
function initOrbitalCards() {
  const container = document.getElementById('orbit-container');
  if (!container) return;

  const cards = [
    document.getElementById('card-0'),
    document.getElementById('card-1'),
    document.getElementById('card-2'),
    document.getElementById('card-3')
  ].filter(Boolean);

  if (cards.length === 0) return;

  let currentAngle = 0;
  const rotationSpeed = 0.0065;
  let isPaused = false;

  // Lấy bán kính elip chuẩn theo độ phân giải màn hình
  function getOrbitRadii() {
    const isMobile = window.innerWidth <= 768;
    return {
      rx: isMobile ? 140 : 285, // Bán kính ngang
      ry: isMobile ? 85 : 135,  // Bán kính dọc
      y0: isMobile ? 45 : 70    // Độ dời tâm xuống vùng đáy mờ, tránh che ngực và mặt
    };
  }

  // Dừng xoay khi rê chuột hoặc chạm tay vào ô dịch vụ
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => (isPaused = true));
    card.addEventListener('mouseleave', () => (isPaused = false));
    card.addEventListener('touchstart', () => (isPaused = true), { passive: true });
    card.addEventListener('touchend', () => {
      setTimeout(() => (isPaused = false), 1500);
    });
  });

  function animate() {
    if (!isPaused) {
      currentAngle += rotationSpeed;
    }

    const { rx, ry, y0 } = getOrbitRadii();
    const total = cards.length;

    cards.forEach((card, idx) => {
      const angle = currentAngle + (idx * (Math.PI * 2)) / total;
      
      // Tọa độ elip 3D
      const x = Math.cos(angle) * rx;
      const sinVal = Math.sin(angle); // sinVal > 0: Phía trước; sinVal <= 0: Sau lưng
      const y = sinVal * ry + y0;

      const isFront = sinVal > 0;
      
      // Tính toán tỷ lệ co giãn và độ mờ theo chiều sâu z
      const scale = 0.85 + (sinVal + 1) * 0.095;       // Từ 0.85 (sau) lên 1.04 (trước)
      const opacity = 0.58 + (sinVal + 1) * 0.21;      // Từ 0.58 lên 1.0
      const zIndex = isFront ? 15 : 4;                  // 15: Trước chân dung (z:10); 4: Sau chân dung

      card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      card.style.zIndex = zIndex;
      card.style.opacity = isPaused && card.matches(':hover') ? '1' : opacity.toFixed(3);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ====================================================================
   5. HIỆU ỨNG NGHIÊNG 3D PARALLAX CHO SÂN KHẤU HERO
   ==================================================================== */
function initHeroParallax() {
  const stage = document.getElementById('hero-stage');
  if (!stage || window.innerWidth <= 992) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 6;
    const rotY = (x / (rect.width / 2)) * 6;

    stage.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  });

  stage.addEventListener('mouseleave', () => {
    stage.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    stage.style.transition = 'transform 0.5s ease';
  });

  stage.addEventListener('mouseenter', () => {
    stage.style.transition = 'none';
  });
}

/* ====================================================================
   6. BẬT / TẮT DANH SÁCH SẢN PHẨM AFFILIATE (SHOW MORE)
   ==================================================================== */
function initAffiliateToggle() {
  const grid = document.getElementById('affiliate-grid');
  const btn = document.getElementById('btn-show-more');
  if (!grid || !btn) return;

  const cards = grid.querySelectorAll('.product-card');
  const MAX_ITEMS = 4; // Số lượng hiển thị tối đa mặc định trước khi mở rộng

  if (cards.length > MAX_ITEMS) {
    btn.style.display = 'inline-block';
    for (let i = MAX_ITEMS; i < cards.length; i++) {
      cards[i].classList.add('hidden-item');
    }
  }

  btn.addEventListener('click', () => {
    const hiddenCards = grid.querySelectorAll('.hidden-item');
    if (hiddenCards.length > 0) {
      hiddenCards.forEach((card) => card.classList.remove('hidden-item'));
      btn.innerHTML = 'Thu gọn danh sách ▲';
    } else {
      for (let i = MAX_ITEMS; i < cards.length; i++) {
        cards[i].classList.add('hidden-item');
      }
      btn.innerHTML = 'Xem thêm sản phẩm ▼';
      grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}