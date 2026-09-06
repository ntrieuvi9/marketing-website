/**
 * Main Scripts for Marketing Portfolio
 * Tối ưu Core Web Vitals: Không dùng thư viện nặng, chỉ dùng Native API.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. HIỆU ỨNG CUỘN TRANG (INTERSECTION OBSERVER)
     Kích hoạt hiệu ứng trượt nhẹ và mờ dần (Fade Up) khi lướt tới vị trí
  -------------------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px', // Kích hoạt sớm hơn một chút trước khi chạm đáy viewport
      threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Ngừng theo dõi sau khi đã hiển thị để tiết kiệm RAM & CPU
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));
  } else {
    // Fallback cho trình duyệt rất cũ: hiển thị luôn nội dung
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  /* --------------------------------------------------------------------------
     2. HIỆU ỨNG THANH MENU KHI CUỘN (STICKY HEADER SHADOW)
  -------------------------------------------------------------------------- */
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true }); // passive: true giúp tăng tốc độ cuộn trang, tránh giật khung hình

  /* --------------------------------------------------------------------------
     3. XỬ LÝ FORM LIÊN HỆ & THÔNG BÁO TƯƠNG TÁC
  -------------------------------------------------------------------------- */
  const leadForm = document.getElementById('leadForm');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      const clientName = document.getElementById('name').value.trim();

      // Giả lập trạng thái đang gửi dữ liệu
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang xử lý...';

      setTimeout(() => {
        // Thông báo hoàn thành
        alert(`Cảm ơn ${clientName}! Yêu cầu tư vấn của bạn đã được tiếp nhận. Tôi sẽ phản hồi qua email trong vòng 24 giờ.`);
        
        // Reset form và trả lại nút ban đầu
        leadForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 800);
    });
  }

});