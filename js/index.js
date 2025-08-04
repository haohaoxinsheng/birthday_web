// 页面加载时显示自定义弹窗
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('nameModal');
    const nameInput = document.getElementById('nameInput');
    const confirmBtn = document.getElementById('confirmBtn');
    const errorMsg = document.getElementById('errorMsg');
    const birthdayPerson = document.getElementById('birthdayPerson');
    const startBtn = document.getElementById('startBtn');
    const mainContainer = document.getElementById('mainContainer');

    // 确保主容器可见
    mainContainer.style.display = 'block';
    mainContainer.style.opacity = '1';

    // 显示弹窗
    modal.style.display = 'flex';
    setTimeout(() => { nameInput.focus(); }, 300);

    // 确认按钮点击事件
    confirmBtn.addEventListener('click', validateName);

    // 输入框回车事件
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') validateName();
    });

    function validateName() {
        const userName = nameInput.value.trim();

        if (userName === 'lsy5201314') {
            // 验证通过
            birthdayPerson.textContent = '亲爱的';
            modal.style.display = 'none';
            startBtn.disabled = false;
            errorMsg.style.display = 'none';

            // 显示欢迎动画
            startBtn.style.animation = 'pulse 1.5s infinite';
        } else {
            // 验证失败
            errorMsg.style.display = 'block';
            nameInput.value = '';

            // 添加错误动画
            nameInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                nameInput.style.animation = '';
                nameInput.focus();
            }, 500);

            // 显示提示弹窗
            showHintModal();
        }
    }

    // 开始按钮点击事件
    startBtn.addEventListener('click', function() {
        // 显示倒计时
        const countdown = document.getElementById('countdown');
        countdown.classList.add('active');

        // 3秒倒计时
        let count = 3;
        const countdownNumber = document.getElementById('countdownNumber');
        const timer = setInterval(() => {
            count--;
            countdownNumber.textContent = count;

            if (count <= 0) {
                clearInterval(timer);
                // 跳转到下一页
                window.location.href = "first.html"; // 替换为实际下一页
                countdown.classList.remove('active');
            }
        }, 1000);

        // 创建彩色纸屑效果
        createConfetti();
    });

    // 防止手机浏览器缩放
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
});

// 创建彩色纸屑
function createConfetti() {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.style.opacity = '1';
            confetti.style.transition = 'all ' + (Math.random() * 3 + 2) + 's ease-out';
            confetti.style.top = '100vh';
            confetti.style.left = Math.random() * 100 + 'vw';
        }, i * 100);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// 生成随机颜色
function getRandomColor() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 显示密码提示弹窗
function showHintModal() {
    const hintModal = document.getElementById('hintModal');
    const hintText = document.getElementById('hintText');
    const hintBtn = document.getElementById('hintBtn');

    // 清空之前的内容
    hintText.innerHTML = '';
    hintBtn.style.display = 'none';

    // 显示弹窗
    hintModal.style.display = 'flex';

    // 逐行显示文本
    const lines = ["哎嘿，密码错误了呢", "密码是什么呢？？？"];
    let lineIndex = 0;

    function showNextLine() {
        if (lineIndex < lines.length) {
            const line = document.createElement('div');
            line.textContent = lines[lineIndex];
            line.style.overflow = 'hidden';
            line.style.whiteSpace = 'nowrap';
            line.style.borderRight = '3px solid white';
            line.style.width = '0';
            line.style.animation = 'typewriter 1.5s steps(40) forwards';
            line.style.marginBottom = '10px';
            hintText.appendChild(line);

            lineIndex++;
            setTimeout(showNextLine, 2000); // 2秒后显示下一行
        } else {
            // 显示按钮
            setTimeout(() => {
                hintBtn.style.display = 'inline-block';
            }, 500);
        }
    }

    showNextLine();

    // 点击按钮跳转到src/game.html
    hintBtn.onclick = function() {
        window.location.href = 'game.html';
    };

    // 添加点击空白处关闭弹窗的功能
    hintModal.addEventListener('click', function(event) {
        // 如果点击的是弹窗本身（而不是弹窗内容）
        if (event.target === hintModal) {
            hintModal.style.display = 'none';
        }
    });
}