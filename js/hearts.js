class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.startColor = color;
        this.endColor = this.generateEndColor(color);
        this.angle = angle;
        this.speed = speed;
        this.gravity = 0.1;
        this.alpha = 1;
        this.decay = 0.02;
        this.trail = [];
        this.maxTrailLength = 5;
    }

    generateEndColor(startColor) {
        // 随机生成一个相近但不同的颜色
        const rgb = this.hexToRgb(startColor);
        const variation = 50; // 颜色变化范围
        const newRgb = {
            r: Math.min(255, Math.max(0, rgb.r + (Math.random() * variation * 2 - variation))),
            g: Math.min(255, Math.max(0, rgb.g + (Math.random() * variation * 2 - variation))),
            b: Math.min(255, Math.max(0, rgb.b + (Math.random() * variation * 2 - variation)))
        };
        return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
    }

    interpolateColor(progress) {
        const start = this.hexToRgb(this.startColor);
        const end = this.hexToRgb(this.endColor);
        const r = Math.round(start.r + (end.r - start.r) * progress);
        const g = Math.round(start.g + (end.g - start.g) * progress);
        const b = Math.round(start.b + (end.b - start.b) * progress);
        return this.rgbToHex(r, g, b);
    }

    draw(ctx) {
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const pos = this.trail[i];
            const progress = i / this.trail.length;
            const currentColor = this.interpolateColor(progress);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `${currentColor}${Math.floor(this.alpha * 255 * (i / this.trail.length)).toString(16).padStart(2, '0')}`;
            ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${this.endColor}${Math.floor(this.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed + this.gravity;
        this.x += vx;
        this.y += vy;
        this.speed *= 0.98;
        this.alpha -= this.decay;
    }

    isDead() {
        return this.alpha <= 0;
    }
}

class Firework {
    constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        this.speed = -15;
        this.particles = [];
        this.exploded = false;
    }

    draw(ctx) {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        this.particles.forEach(particle => particle.draw(ctx));
    }

    update() {
        if (!this.exploded) {
            this.y += this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles = this.particles.filter(particle => !particle.isDead());
            this.particles.forEach(particle => particle.update());
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            const speed = Math.random() * 2 + 2;
            this.particles.push(new Particle(this.x, this.y, this.color, angle, speed));
        }
    }

    isDead() {
        return this.exploded && this.particles.length === 0;
    }
}

class FireworkAnimation {
    constructor() {
        this.canvas = document.getElementById('heartCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.colors = [
            '#ff6b6b',  // 红色
            '#4ecdc4',  // 青色
            '#45b7d1',  // 蓝色
            '#96ceb4',  // 绿色
            '#ffd93d',  // 黄色
            '#ff8080',  // 粉红
            '#9b59b6',  // 紫色
            '#3498db',  // 天蓝
            '#2ecc71',  // 翠绿
            '#f1c40f'   // 金黄
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < 5; i++) {
            this.createFirework();
        }
    }

    createFirework() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = Math.random() * (this.canvas.height * 0.6);
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.fireworks.push(new Firework(x, y, targetY, color));
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.fireworks = this.fireworks.filter(firework => !firework.isDead());
        this.fireworks.forEach(firework => {
            firework.update();
            firework.draw(this.ctx);
        });

        if (Math.random() < 0.05) {
            this.createFirework();
        }

        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', () => {
    new FireworkAnimation();
});