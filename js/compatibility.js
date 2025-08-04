/**
 * 兼容性脚本
 * 用于处理不同浏览器和设备的兼容性问题
 */

(function() {
    // 检测浏览器是否支持requestAnimationFrame
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // 检测浏览器是否支持触摸事件
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    // 为不支持backdrop-filter的浏览器提供替代方案
    if (typeof document !== 'undefined' && document.documentElement) {
        const isBackdropFilterSupported = 'backdropFilter' in document.documentElement.style ||
                                         'webkitBackdropFilter' in document.documentElement.style;

        if (!isBackdropFilterSupported) {
            // 如果不支持backdrop-filter，增加容器的不透明度
            const containers = document.querySelectorAll('.container, .modal-content');
            containers.forEach(container => {
                if (container) {
                    container.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                }
            });
        }
    }

    // 禁用iOS设备上的双击缩放
    if (isTouchDevice) {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // 修复某些移动浏览器中的100vh问题
    function setVhProperty() {
        // 获取视口高度
        const vh = window.innerHeight * 0.01;
        // 设置CSS变量
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // 初始设置
    setVhProperty();

    // 窗口大小改变时重新计算
    window.addEventListener('resize', setVhProperty);

    // 检测WebGL支持
    function isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                    (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    }

    // 如果不支持WebGL，可能需要降级处理某些动画效果
    if (!isWebGLSupported()) {
        console.log('WebGL不受支持，某些视觉效果可能会降级');
        // 这里可以添加降级处理代码
    }

    // 检测浏览器是否支持CSS动画
    const supportsAnimation = typeof document.documentElement.style.animation !== 'undefined' ||
                             typeof document.documentElement.style.webkitAnimation !== 'undefined';

    // 如果不支持CSS动画，添加一个类名到body
    if (!supportsAnimation && document.body) {
        document.body.classList.add('no-animations');
    }
})();