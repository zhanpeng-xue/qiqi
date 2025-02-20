class Carousel {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: true,
            interval: 2000,
            duration: 500,
            ...options
        };

        this.currentIndex = 0;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.images = [
            { src: 'images/slide1.jpg', alt: '金海湖' },
            { src: 'images/slide2.jpg', alt: '秦皇岛' },
            { src: 'images/slide3.jpg', alt: '秦皇岛的我' },
            { src: 'images/slide4.jpg', alt: '天津妈祖文化园' },
            { src: 'images/slide5.jpg', alt: '广州珠江' },
            { src: 'images/slide6.jpg', alt: '秦皇岛' },
            { src: 'images/slide7.jpg', alt: '天津东堤公园' },
            { src: 'images/slide8.jpg', alt: '天津国家海洋博物馆' }
        ];

        this.init();
    }

    init() {
        this.createCarousel();
        this.createControls();
        this.addTouchEvents();
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    addTouchEvents() {
        this.slideContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.touchStart(e);
        });
        this.slideContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchStart(e);
        });
        this.slideContainer.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.touchEnd(e);
        });
        this.slideContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchEnd(e);
        });
        this.slideContainer.addEventListener('mousemove', (e) => {
            e.preventDefault();
            this.touchMove(e);
        });
        this.slideContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.touchMove(e);
        });
        this.slideContainer.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            this.touchEnd(e);
        });

        // 阻止图片的默认点击行为
        this.slideContainer.addEventListener('click', (e) => {
            e.preventDefault();
        });
    }

    touchStart(event) {
        this.isDragging = true;
        this.startPos = this.getPositionX(event);
        this.stopAutoplay();
        cancelAnimationFrame(this.animationID);
    }

    touchMove(event) {
        if (!this.isDragging) return;
        event.preventDefault();
        const currentPosition = this.getPositionX(event);
        const diff = currentPosition - this.startPos;
        this.currentTranslate = this.prevTranslate + diff;
        this.setSlidePosition(this.currentTranslate);
    }

    touchEnd() {
        this.isDragging = false;
        const movedBy = this.currentTranslate - this.prevTranslate;

        if (Math.abs(movedBy) > 100) {
            if (movedBy > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.goTo(this.currentIndex);
        }

        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    setSlidePosition(position) {
        this.slideContainer.style.transform = `translateX(${position}px)`;
    }

    createCarousel() {
        this.container.classList.add('carousel-container');
        
        // 创建轮播图片容器
        this.slideContainer = document.createElement('div');
        this.slideContainer.classList.add('carousel-slides');

        // 创建图片元素
        this.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.style.transform = `translateX(${index * 100}%)`;

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;

            const caption = document.createElement('div');
            caption.classList.add('carousel-caption');
            caption.textContent = image.alt;

            slide.appendChild(img);
            slide.appendChild(caption);
            this.slideContainer.appendChild(slide);
        });

        this.container.appendChild(this.slideContainer);
    }

    createControls() {
        // 创建导航按钮
        const prevButton = document.createElement('button');
        prevButton.addEventListener('click', () => this.prev());

        const nextButton = document.createElement('button');
        nextButton.addEventListener('click', () => this.next());

        // 创建指示器
        const indicators = document.createElement('div');
        indicators.classList.add('carousel-indicators');

        this.images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goTo(index));
            indicators.appendChild(dot);
        });

        this.container.appendChild(prevButton);
        this.container.appendChild(nextButton);
        this.container.appendChild(indicators);

        // 添加鼠标悬停暂停功能
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => {
            if (this.options.autoplay) this.startAutoplay();
        });
    }

    updateSlides() {
        const slides = this.slideContainer.querySelectorAll('.carousel-slide');
        const position = -this.currentIndex * this.container.offsetWidth;
        this.currentTranslate = position;
        this.prevTranslate = position;
        
        // 先移除所有活动状态
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });

        // 设置当前幻灯片为活动状态
        slides[this.currentIndex].classList.add('active');
        slides[this.currentIndex].style.opacity = '1';
        
        this.slideContainer.style.transition = 'transform 0.3s ease-out';
        this.setSlidePosition(position);

        // 更新指示器
        const dots = this.container.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // 重置过渡效果
        setTimeout(() => {
            this.slideContainer.style.transition = '';
        }, 300);
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlides();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlides();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateSlides();
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), this.options.interval);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}