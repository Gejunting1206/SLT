// 载入历史数据

let rewards = {};
let currentPool = "奖励";

// 从localStorage读取奖励池数据
const savedRewards = localStorage.getItem("RewardsPools");
if (savedRewards != null) {
    rewards = JSON.parse(savedRewards);
} else {
    // 初始奖励列表，分为好和坏两个奖品池
    rewards = {
        "奖励": [
            "积分+20",
            "免作业一次",
            "棒棒糖一根",
            "小盆栽一个",
            "小礼物任选一个",
            "免一次小考",
            "免一次值日",
            "拉布布药匙扣"
        ],
        "惩罚": [
            "抄背诵课文",
            "值日一周",
            "抄词语表",
            "抄日积月累",
            "抄英语单词句子",
            "为班级做一次贡献",
            "表演一个节目",
            "写500字说明书",
            "大卷一张"
        ]
    };
}


// 当前卡片数据
let scratchCards = [];

// DOM 元素
const rewardsList = document.getElementById('rewardsList');
const scratchGrid = document.getElementById('scratchGrid');
const newRewardInput = document.getElementById('newRewardInput');
const addRewardBtn = document.getElementById('addRewardBtn');
const resetBtn = document.getElementById('resetBtn');
const newCardsBtn = document.getElementById('newCardsBtn');

// 初始化函数
function init() {
    renderRewardsList();
    generateScratchCards();
    renderScratchCards();
}

// 渲染奖励列表
function renderRewardsList() {
    // 添加奖品池选择和管理界面
    rewardsList.innerHTML = `
        <div class="pool-controls" style="margin-bottom: 20px;">
            <div style="margin-bottom: 10px;">
                <label for="poolSelect" style="margin-right: 10px;">选择奖品池：</label>
                <select id="poolSelect" style="padding: 8px; border: 2px solid #4ecdc4; border-radius: 5px; margin-right: 15px;">
                    ${Object.keys(rewards).map(pool => `
                        <option value="${pool}" ${pool === currentPool ? 'selected' : ''}>${pool}</option>
                    `).join('')}
                </select>
                <button id="deletePoolBtn" style="padding: 8px 15px; background-color: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">删除当前奖品池</button>
            </div>
            <div>
                <label for="newPoolInput" style="margin-right: 10px;">添加新奖品池：</label>
                <input type="text" id="newPoolInput" placeholder="奖品池名称" style="padding: 8px; border: 2px solid #4ecdc4; border-radius: 5px; width: 150px; margin-right: 10px;">
                <button id="addPoolBtn" style="padding: 8px 15px; background-color: #4ecdc4; color: white; border: none; border-radius: 5px; cursor: pointer;">添加</button>
            </div>
        </div>
    `;
    
    // 渲染当前奖品池的奖励列表
    if (rewards[currentPool] && rewards[currentPool].length > 0) {
        rewards[currentPool].forEach((reward, index) => {
            const rewardItem = document.createElement('div');
            rewardItem.className = 'reward-item';
            rewardItem.innerHTML = `
                <span class="reward-text">${reward}</span>
                <div class="reward-actions">
                    <button class="edit-btn" data-index="${index}">编辑</button>
                    <button class="delete-btn" data-index="${index}">删除</button>
                </div>
            `;
            rewardsList.appendChild(rewardItem);
        });
    } else {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#666';
        emptyMessage.style.padding = '20px';
        emptyMessage.textContent = '当前奖品池为空，请添加奖励';
        rewardsList.appendChild(emptyMessage);
    }
    
    // 添加事件监听器
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            editReward(index);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteReward(index);
        });
    });
    
    // 奖品池管理事件监听器
    document.getElementById('poolSelect').addEventListener('change', function() {
        currentPool = this.value;
        renderRewardsList();
        generateScratchCards();
        renderScratchCards();
    });
    
    // 添加新奖品池
    document.getElementById('addPoolBtn').addEventListener('click', function() {
        const newPoolName = document.getElementById('newPoolInput').value.trim();
        if (newPoolName && !rewards[newPoolName]) {
            rewards[newPoolName] = [];
            currentPool = newPoolName;
            document.getElementById('newPoolInput').value = '';
            SaveReward();
            renderRewardsList();
            generateScratchCards();
            renderScratchCards();
        }
    });
    
    // 删除当前奖品池
    document.getElementById('deletePoolBtn').addEventListener('click', function() {
        if (Object.keys(rewards).length > 1) {
            if (confirm(`确定要删除奖品池 "${currentPool}" 吗？`)) {
                delete rewards[currentPool];
                currentPool = Object.keys(rewards)[0];
                SaveReward();
                renderRewardsList();
                generateScratchCards();
                renderScratchCards();
            }
        } else {
            alert('至少需要保留一个奖品池');
        }
    });
}

// 添加新奖励
function addReward() {
    const newReward = newRewardInput.value.trim();
    if (newReward) {
        rewards[currentPool].push(newReward);
        newRewardInput.value = '';
        SaveReward();
        renderRewardsList();
        generateScratchCards();
        renderScratchCards();
    }
}

// 保存奖励

function SaveReward() {
    localStorage.setItem("RewardsPools", JSON.stringify(rewards));
    console.log(rewards);
}

// 编辑奖励
function editReward(index) {
    const newReward = prompt('编辑奖励内容:', rewards[currentPool][index]);
    if (newReward !== null) {
        rewards[currentPool][index] = newReward.trim();
        SaveReward();
        renderRewardsList();
        generateScratchCards();
        renderScratchCards();
    }
}

// 删除奖励
function deleteReward(index) {
    if (confirm(`确定要删除 "${rewards[currentPool][index]}" 吗？`)) {
        rewards[currentPool].splice(index, 1);
        SaveReward();
        renderRewardsList();
        generateScratchCards();
        renderScratchCards();
    }
}

// 生成刮刮乐卡片数据
function generateScratchCards() {
    scratchCards = [];
    
    // 确保有足够的奖励填充20个卡片
    const cardRewards = [];
    const currentPoolRewards = rewards[currentPool] || ["积分+20", "棒棒糖一根", "小盆栽一个"];
    
    const hasFreeHomework = currentPoolRewards.includes("免作业一次");
    
    let addedFreeHomework = false;
    if (hasFreeHomework) {
        cardRewards.push("免作业一次");
        addedFreeHomework = true;
    }
    
    // 填充剩余的卡片
    while (cardRewards.length < 20) {
        // 随机选择当前奖品池中的奖励
        let randomReward = currentPoolRewards[Math.floor(Math.random() * currentPoolRewards.length)];
        
        if (addedFreeHomework && randomReward === "免作业一次") {
            continue;
        }
        
        cardRewards.push(randomReward);
    }
    
    // 打乱奖励顺序
    for (let i = cardRewards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardRewards[i], cardRewards[j]] = [cardRewards[j], cardRewards[i]];
    }
    
    // 生成20个卡片
    for (let i = 0; i < 20; i++) {
        scratchCards.push({
            id: i,
            reward: cardRewards[i],
            scratched: false,
            scratchPercent: 0,
            isGreen: cardRewards[i] === "免作业一次"
        });
    }
}

// 渲染刮刮乐卡片
function renderScratchCards() {
    scratchGrid.innerHTML = '';
    
    scratchCards.forEach(card => {
        const scratchCard = document.createElement('div');
        scratchCard.className = 'scratch-card';
        scratchCard.innerHTML = `
            <div class="reward-content">${card.reward}</div>
            <canvas class="scratch-canvas" data-id="${card.id}"></canvas>
        `;
        scratchGrid.appendChild(scratchCard);
    });
    
    // 初始化所有Canvas
    scratchCards.forEach(card => {
        initScratchCard(card.id);
    });
}

// 初始化单个刮刮乐卡片
function initScratchCard(id) {
    const canvas = document.querySelector(`.scratch-canvas[data-id="${id}"]`);
    const ctx = canvas.getContext('2d');
    const card = scratchCards[id];
    
    // 设置Canvas尺寸
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // 绘制涂层，传递isGreen参数
    drawScratchLayer(ctx, canvas.width, canvas.height, card.isGreen);
    
    // 添加事件监听器
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 触摸事件
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        const pos = getPosition(e);
        lastX = pos.x;
        lastY = pos.y;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const pos = getPosition(e);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
        lastX = pos.x;
        lastY = pos.y;
        
        // 计算刮开比例
        calculateScratchedPercent(id, ctx, canvas.width, canvas.height);
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        startDrawing(e.touches[0]);
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        draw(e.touches[0]);
    }
    
    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}

// 绘制刮刮乐涂层
function drawScratchLayer(ctx, width, height, isGreen = false) {
    // 颜色选择：如果是绿色卡片固定使用绿色，否则随机选择其他颜色
    const colors = ['#ff6b6b', '#45b7d1', '#ffd166', '#ff9e6d'];
    const color = isGreen ? '#4ecdc4' : colors[Math.floor(Math.random() * colors.length)];
    
    // 绘制背景
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // 绘制文字
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('刮这里', width / 2, height / 2);
    
    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    
    // 水平线
    for (let y = 10; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // 垂直线
    for (let x = 10; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

// 计算刮开比例
function calculateScratchedPercent(id, ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparentPixels++;
        }
    }
    
    const totalPixels = width * height;
    const percent = (transparentPixels / totalPixels) * 100;
    
    scratchCards[id].scratchPercent = percent;
    
    if (percent > 50 && !scratchCards[id].scratched) {
        scratchCards[id].scratched = true;
        // 可以在这里添加刮开后的逻辑，比如播放声音等
    }
}

// 重置所有卡片
function resetAllCards() {
    scratchCards.forEach(card => {
        card.scratched = false;
        card.scratchPercent = 0;
    });
    renderScratchCards();
}

// 生成新卡片
function generateNewCards() {
    generateScratchCards();
    renderScratchCards();
}

// 事件监听器
addRewardBtn.addEventListener('click', addReward);
newRewardInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addReward();
    }
});

resetBtn.addEventListener('click', resetAllCards);
newCardsBtn.addEventListener('click', generateNewCards);

// 初始化应用
init();