class Carousel {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: true,
            interval: 5000,
            duration: 500,
            ...options
        };

        this.currentIndex = 0;
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
        if (this.options.autoplay) {
            this.startAutoplay();
        }
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
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - this.currentIndex) * 100}%)`;
        });

        // 更新指示器
        const dots = this.container.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
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