/**
 * @file
 * @author jutal
 * @date 17-11-28.
 */

var WINDOW_WITDH = 1366;
var WINDOW_HEIGHT = 600;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
var balls = [];
var colors = ['#66FFFF', '#66FFCC', '#9966CC', '#9999CC', '#99FFCC', '#CC99FF', '#FFCC99', '#666699'];

var curHours, curMinutes, curSeconds;

window.onload = function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WITDH;
    canvas.height = WINDOW_HEIGHT;

    setInterval(function () {
        render(context);
        // update()
    }, 50);
};

// 绘制
function render(cxt) {

    // 对矩形平面的内容进行刷新
    cxt.clearRect(0, 0, WINDOW_WITDH, WINDOW_HEIGHT);

    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var seconds = new Date().getSeconds();

    // 以12:34:56为例
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);    // 1
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);    // 2
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);    // :
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);    // 3
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);    // 4
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);    // :
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);    // 5
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);    // 6

    // 按每一位判断数字是否发生变化, 若变化则调用addBalls()
    // 秒的第二位随时发生变化, 直接调用
    if (curSeconds !== seconds) {
        addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10));
    }

    // 秒的第一位在seconds整10的时候才变化
    if (seconds % 10 === 0 && curSeconds !== seconds) {
        addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10));
    }

    // 分的第二位在seconds为0的时候变化
    if (seconds === 0) {
        addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10));
    }

    // 分的第一位在minutes整10的时候才变化
    if (minutes % 10 === 0 && curMinutes !== minutes) {
        addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10));
    }

    // 时的第二位在minutes为0的时候变化
    if (minutes === 0 && curMinutes !== minutes) {
        addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10));
    }

    // 时的第一位在hours整10的时候才变化
    if (hours % 10 === 0 && curHours !== hours) {
        addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10));
    }

    updateBalls();

    for (var i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        cxt.closePath();

        cxt.fill();
    }

    curHours = hours;
    curMinutes = minutes;
    curSeconds = seconds;
}

// 更新掉落小球的运动轨迹
function updateBalls() {
    // 飞行损耗的摩擦系数
    var u = .99;

    for (var i = 0; i < balls.length; i++) {
        // x方向不加入损耗
        balls[i].x += balls[i].vx;

        balls[i].vy = balls[i].vy * u;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (Math.abs(balls[i].y) < .05) {
            balls[i].y = 0;
        }

        // 下边缘碰撞检测
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = lossY(balls[i].vy);
        }
    }
}

// Y方向的碰撞损耗
function lossY(vy) {
    var loss = 4;

    if (vy > 0 && Math.abs(vy) >= loss) {
        vy = -(vy - loss);
    } else if (vy < 0 && Math.abs(vy) >= loss) {
        vy = -(vy + loss);
    } else {
        vy = 0;
    }
    return vy;
}

// 增加显示出的小球
function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 1; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: .5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -.5,
                    color: colors[Math.floor((Math.random() * colors.length))]
                };

                balls.push(aBall);
            }
        }
    }
}

// 画出变换的时间
function renderDigit(x, y, num, cxt) {

    cxt.fillStyle = "rgb(0, 102, 153)";

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}