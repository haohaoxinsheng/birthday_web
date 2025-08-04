document.addEventListener('DOMContentLoaded', function() {
    // 添加当前日期
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('zh-CN', options);
    
    document.getElementById('current-date').textContent = formattedDate;
    document.getElementById('signature-date').textContent = formattedDate;
    
    // 创建飘落元素
    const fallingElements = ['🌹', '🍰', '🎀', '🌸', '💝', '🎂', '✨', '💖', '🎁', '🎈'];
    const container = document.getElementById('falling-elements');
    const maxElements = 30; // 限制最大元素数量
    let activeElements = 0;
    
    function createFallingElement() {
        // 限制最大元素数量，避免性能问题
        if (activeElements >= maxElements) return;
        
        const element = document.createElement('div');
        element.className = 'falling';
        
        // 随机选择元素
        element.textContent = fallingElements[Math.floor(Math.random() * fallingElements.length)];
        
        // 随机位置
        const left = Math.random() * 100;
        element.style.left = `${left}%`;
        
        // 随机大小
        const size = Math.random() * 20 + 10;
        element.style.fontSize = `${size}px`;
        
        // 随机动画时间
        const duration = Math.random() * 10 + 8;
        element.style.animationDuration = `${duration}s`;
        
        // 随机延迟
        const delay = Math.random() * 5;
        element.style.animationDelay = `${delay}s`;
        
        // 随机透明度
        const opacity = Math.random() * 0.5 + 0.5;
        element.style.opacity = opacity;
        
        // 随机旋转
        const rotation = Math.random() * 360;
        element.style.transform = `rotate(${rotation}deg)`;
        
        container.appendChild(element);
        activeElements++;
        
        // 元素动画结束后移除
        setTimeout(() => {
            element.remove();
            activeElements--;
        }, (duration + delay) * 1000);
    }
    
    // 定期创建飘落元素
    setInterval(createFallingElement, 800);
    
    // 初始创建一些元素
    for (let i = 0; i < 10; i++) {
        setTimeout(createFallingElement, i * 300);
    }
    
    // 音乐播放控制
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    const progressBar = document.getElementById('music-progress-bar');
    
    let isMusicPlaying = false;
    
    // 更新音乐进度条
    function updateMusicProgress() {
        if (bgMusic.duration) {
            const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        if (isMusicPlaying) {
            requestAnimationFrame(updateMusicProgress);
        }
    }
    
    // 音乐播放按钮点击事件
    musicBtn.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.play()
                .then(() => {
                    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    isMusicPlaying = true;
                    updateMusicProgress();
                })
                .catch(e => {
                    alert('请点击页面任意位置后，再尝试播放音乐');
                });
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // 尝试自动播放音乐
    document.addEventListener('click', function initAudio() {
        bgMusic.play()
            .then(() => {
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                isMusicPlaying = true;
                updateMusicProgress();
            })
            .catch(e => {
                // 自动播放失败，不做处理
            });
        document.removeEventListener('click', initAudio);
    });
    
    // 添加页面滚动动画效果
    const animateElements = document.querySelectorAll('.letter-content p');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }
        });
    }
    
    // 初始检查
    checkScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', checkScroll);
});