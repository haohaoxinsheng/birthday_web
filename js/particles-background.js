/**
 * 粒子背景特效
 * 为密码登录页面创建动态粒子背景
 */

(function() {
    // 粒子系统配置
    const config = {
        particleCount: 80,         // 粒子数量
        particleColor: '#ffffff',  // 粒子颜色
        lineColor: '#ff9a9e',      // 连线颜色
        particleSize: {
            min: 1,                // 最小粒子尺寸
            max: 3                 // 最大粒子尺寸
        },
        lineWidth: 0.5,            // 连线宽度
        moveSpeed: {
            min: 0.2,              // 最小移动速度
            max: 0.8               // 最大移动速度
        },
        connectDistance: 120,      // 粒子连线距离
        interactiveDistance: 150,  // 鼠标交互距离
        responsive: true,          // 响应式
        density: 10000             // 粒子密度（屏幕面积/密度=粒子数量）
    };

    // 粒子类
    class Particle {
        constructor(canvas, options) {
            this.canvas = canvas;
            this.ctx = canvas.ctx;

            // 随机位置
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            // 随机大小
            this.size = Math.random() * (options.particleSize.max - options.particleSize.min) + options.particleSize.min;

            // 随机速度
            this.speedX = Math.random() * (options.moveSpeed.max - options.moveSpeed.min) * 2 - options.moveSpeed.max;
            this.speedY = Math.random() * (options.moveSpeed.max - options.moveSpeed.min) * 2 - options.moveSpeed.max;

            // 粒子颜色
            this.color = options.particleColor;

            // 透明度
            this.alpha = Math.random() * 0.5 + 0.5;

            // 连线颜色
            this.lineColor = options.lineColor;

            // 连线宽度
            this.lineWidth = options.lineWidth;
        }

        // 更新粒子位置
        update() {
            // 移动粒子
            this.x += this.speedX;
            this.y += this.speedY;

            // 边界检测
            if (this.x > this.canvas.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = this.canvas.width;
            }

            if (this.y > this.canvas.height) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = this.canvas.height;
            }
        }

        // 绘制粒子
        draw() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.globalAlpha = this.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }

        // 连接附近粒子
        connect(particles, options) {
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];

                // 避免自连接
                if (particle === this) continue;

                // 计算距离
                const dx = this.x - particle.x;
                const dy = this.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 如果距离小于连接距离，则绘制线条
                if (distance < options.connectDistance) {
                    // 根据距离计算线条透明度
                    const opacity = 1 - (distance / options.connectDistance);

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.x, this.y);
                    this.ctx.lineTo(particle.x, particle.y);
                    this.ctx.strokeStyle = options.lineColor;
                    this.ctx.globalAlpha = opacity * 0.5;
                    this.ctx.lineWidth = options.lineWidth;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }

    // 粒子系统类
    class ParticleSystem {
        constructor(canvasId, options) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Canvas element not found:', canvasId);
                return;
            }

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.options = Object.assign({}, config, options);
            this.mouse = {
                x: null,
                y: null,
                radius: this.options.interactiveDistance
            };

            // 初始化
            this.init();

            // 事件监听
            this.addEventListeners();

            // 开始动画
            this.animate();
        }

        // 初始化
        init() {
            // 设置画布大小
            this.resizeCanvas();

            // 创建粒子
            this.createParticles();
        }

        // 调整画布大小
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            // 如果是响应式，则根据屏幕大小调整粒子数量
            if (this.options.responsive) {
                const area = this.canvas.width * this.canvas.height;
                this.options.particleCount = Math.floor(area / this.options.density);
            }
        }

        // 创建粒子
        createParticles() {
            this.particles = [];

            for (let i = 0; i < this.options.particleCount; i++) {
                this.particles.push(new Particle(this, this.options));
            }
        }

        // 添加事件监听
        addEventListeners() {
            // 窗口大小改变事件
            window.addEventListener('resize', () => {
                this.resizeCanvas();
                this.createParticles();
            });

            // 鼠标移动事件
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            // 触摸事件
            window.addEventListener('touchmove', (e) => {
                if (e.touches[0]) {
                    this.mouse.x = e.touches[0].clientX;
                    this.mouse.y = e.touches[0].clientY;
                }
            });

            // 鼠标离开事件
            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }

        // 更新粒子
        update() {
            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];

                // 更新粒子位置
                particle.update();

                // 鼠标交互
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = particle.x - this.mouse.x;
                    const dy = particle.y - this.mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.mouse.radius) {
                        // 计算推力方向
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;

                        // 计算推力大小
                        const force = (this.mouse.radius - distance) / this.mouse.radius;

                        // 应用推力
                        const directionX = forceDirectionX * force * 2;
                        const directionY = forceDirectionY * force * 2;

                        particle.x += directionX;
                        particle.y += directionY;
                    }
                }
            }
        }

        // 绘制粒子
        draw() {
            // 清除画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 绘制粒子
            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];

                // 绘制粒子
                particle.draw();

                // 连接附近粒子
                particle.connect(this.particles, this.options);
            }
        }

        // 动画循环
        animate() {
            this.update();
            this.draw();

            // 请求下一帧
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    // 当DOM加载完成后初始化粒子系统
    document.addEventListener('DOMContentLoaded', () => {
        // 创建粒子系统
        new ParticleSystem('particles-canvas', {
            // 可以在这里覆盖默认配置
            particleColor: '#ffffff',
            lineColor: 'rgba(255, 154, 158, 0.5)'  // 使用网站主题色
        });
    });
})();