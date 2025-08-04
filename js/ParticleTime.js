"use strict";

/**
 * 生日倒计时计算器
 * 计算并显示从出生日期到当前时间的精确时间差
 */

// 常量定义
const BIRTH_DATE = new Date("08/17/2003 00:00:00"); // 修改出生日期
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ageDisplay = document.getElementById('span_dt_dt');
let updateInterval = null;

/**
 * 计算时间差并返回格式化对象
 * @param {number} timeDiff - 时间差(毫秒)
 * @returns {Object} 包含天、小时、分钟、秒的对象
 */
function calculateTimeDifference(timeDiff) {
    const eDays = timeDiff / MS_PER_DAY;
    const days = Math.floor(eDays);
    const eHours = (eDays - days) * 24;
    const hours = Math.floor(eHours);
    const eMinutes = (eHours - hours) * 60;
    const minutes = Math.floor(eMinutes);
    const seconds = Math.floor((eMinutes - minutes) * 60);

    return { days, hours, minutes, seconds };
}

/**
 * 更新页面显示的年龄信息
 */
function updateAge() {
    try {
        const now = new Date();
        const timeDiff = now.getTime() - BIRTH_DATE.getTime();
        const { days, hours, minutes, seconds } = calculateTimeDifference(timeDiff);

        if (ageDisplay) {
            ageDisplay.textContent = `${days}天${hours}小时${minutes}分${seconds}秒`;
        }

        // 显示段落（如果存在）
        const textElement = document.querySelector('.text');
        textElement?.classList.add('show');

        // 显示跳转按钮（如果存在）
        const continueButton = document.getElementById('continueButton');
        if (continueButton) {
            continueButton.style.opacity = '1';
        }
    } catch (error) {
        console.error('更新年龄时出错:', error);
        clearInterval(updateInterval); // 出错时停止定时器
    }
}

/**
 * 初始化计时器
 */
function initAgeCounter() {
    if (updateInterval) {
        clearInterval(updateInterval); // 避免重复初始化
    }

    updateAge(); // 立即执行一次
    updateInterval = setInterval(updateAge, 1000); // 每秒更新
}

// 确保DOM加载完成后再执行
document.addEventListener('DOMContentLoaded', initAgeCounter);

// 导出函数供测试使用（如果有测试环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateTimeDifference };
}
