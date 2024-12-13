'use strict';

// ---------------------------
// Global Variables
// ---------------------------
let gamePaused = true;
let gold = 0;
let level = 1;
let experience = 0;
let expToNext = 10;
let attackPower = 1;
let defense = 1;
let health = 100;
let maxHealth = 100;
let passiveIncome = 0;
let lives = 3;
let healthRegenRate = 1; // Starts with 1 health per second

let totalClicks = 0;
let defenseUpgrades = 0;
let healthUpgrades = 0;
let autoClickPurchased = false;
let bossesDefeated = 0;
let monstersDefeated = 0;
let deaths = 0;
let synergyForged = false;
let prestigeCount = 0;

let comboCount = 0;
let comboTimeout = null;
const comboMaxStacks = 5;
const comboDuration = 2000; 
let lastClickTime = 0;

const baseUpgradeCosts = {
    attack: 50,
    defense: 75,
    health: 100,
    autoClick: 300,
    criticalHit: 500,
    goldMultiplier: 750,
    experienceBoost: 1000,
    monsterSlayer: 1250,
    shield: 1500,
    luck: 1750,
};

let upgradeCosts = { ...baseUpgradeCosts };

const upgrades = [
    { id: 1, type: 'attack', name: 'Attack Upgrade I', cost: baseUpgradeCosts.attack, effect: 'Increase Attack Power by 2.', owned: 0 },
    { id: 2, type: 'defense', name: 'Defense Upgrade I', cost: baseUpgradeCosts.defense, effect: 'Increase Defense by 2.', owned: 0 },
    { id: 3, type: 'health', name: 'Max Health Upgrade (+10 Max Health)', cost: baseUpgradeCosts.health, effect: 'Increase Hp and Max Health by 10.', owned: 0 },
    { id: 4, type: 'autoClick', name: 'Auto-Clicker', cost: baseUpgradeCosts.autoClick, effect: 'Gain 10 gold per second.', owned: false },
    { id: 5, type: 'criticalHit', name: 'Critical Hit', cost: baseUpgradeCosts.criticalHit, effect: '15% chance to deal double damage.', owned: 0 },
    { id: 6, type: 'goldMultiplier', name: 'Gold Multiplier', cost: baseUpgradeCosts.goldMultiplier, effect: 'Increase gold per click by 2.', owned: 0 },
    { id: 7, type: 'experienceBoost', name: 'Experience Boost', cost: baseUpgradeCosts.experienceBoost, effect: 'Gain 3 XP per click.', owned: 0 },
    { id: 8, type: 'monsterSlayer', name: 'Monster Slayer', cost: baseUpgradeCosts.monsterSlayer, effect: 'Deal 3 extra damage to monsters.', owned: 0 },
    { id: 9, type: 'shield', name: 'Shield', cost: baseUpgradeCosts.shield, effect: 'Reduce incoming damage by 2 per owned shield upgrade.', owned: 0 },
    { id: 10, type: 'luck', name: 'Luck Enhancement', cost: baseUpgradeCosts.luck, effect: 'Increase gold gain by 15%.', owned: 0 },
    { id: 11, type: 'healthRegen', name: 'Health Regeneration Boost', cost: 1000, effect: 'Increase health regeneration by 2% of max health per second.', owned: 0 }
];

const swords = [
    { id: 1, name: 'Stick of Fury 🪵', cost: 300, damage: 2, description: 'A sturdy stick with fury.', owned: false },
    { id: 2, name: 'Rusty Blade 🗡️', cost: 900, damage: 5, description: 'A rusty blade, surprisingly effective.', owned: false },
    { id: 3, name: 'Goblin\'s Gleam 👹🗡️', cost: 2250, damage: 10, description: 'A gleaming sword from goblins.', owned: false },
    { id: 4, name: 'Dragon\'s Tooth Sabre 🐉🗡️', cost: 4500, damage: 20, description: 'A sabre made from a dragon tooth.', owned: false },
    { id: 5, name: 'Legendary Lightbringer 🌟🗡️', cost: 9000, damage: 50, description: 'A legendary sword of light.', owned: false },
    { id: 6, name: 'Shadow Dagger 🌑🗡️', cost: 10800, damage: 60, description: 'Forged in dark shadows.', owned: false },
    { id: 7, name: 'Phoenix Blade 🔥🗡️', cost: 13500, damage: 75, description: 'Imbued with phoenix fire.', owned: false },
    { id: 8, name: 'Thunderstrike ⚡🗡️', cost: 16200, damage: 90, description: 'Channels the power of thunder.', owned: false },
    { id: 9, name: 'Frostmourne ❄️🗡️', cost: 18900, damage: 105, description: 'Freezes enemies on impact.', owned: false },
    { id: 10, name: 'Venomous Viper 🐍🗡️', cost:22500, damage:120, description:'Coated with deadly venom.', owned:false},
    { id: 11, name:'Celestial Longsword 🌌🗡️', cost:27000, damage:140, description:'Harnesses celestial energy.', owned:false},
    { id: 12, name:'Inferno Edge 🔥🗡️', cost:31500, damage:160, description:'Burns with eternal flames.', owned:false},
    { id: 13, name:'Earthshaker Hammer 🛠️', cost:36000, damage:180, description:'Can shatter earth.', owned:false},
    { id: 14, name:'Stormbreaker Blade 🌩️🗡️', cost:40500, damage:200, description:'Breaks storms and foes.', owned:false},
    { id: 15, name:'Serpent Sword 🐉🗡️', cost:45000, damage:220, description:'A serpent-like deadly sword.', owned:false},
    { id: 16, name:'Doombringer ⚔️☠️', cost:49500, damage:240, description:'Brings doom to foes.', owned:false},
    { id: 17, name:'Eclipse Blade 🌘🗡️', cost:54000, damage:260, description:'Harnesses eclipse power.', owned:false},
    { id: 18, name:'Radiant Saber ✨🗡️', cost:58500, damage:280, description:'Shines with radiant light.', owned:false},
    { id: 19, name:'Obsidian Edge 🖤🗡️', cost:63000, damage:300, description:'Carved from obsidian.', owned:false},
    { id: 20, name:'Mystic Katana 🈶🗡️', cost:67500, damage:320, description:'Imbued with mystic energy.', owned:false},
    { id: 21, name:'Arcane Sword 🔮🗡️', cost:72000, damage:340, description:'Filled with arcane magic.', owned:false},
    { id: 22, name:'Soulstealer Blade 👻🗡️', cost:76500, damage:360, description:'Steals souls of foes.', owned:false},
    { id: 23, name:'Tempest Blade 🌪️🗡️', cost:81000, damage:380, description:'Channels tempestuous winds.', owned:false},
    { id: 24, name:'Lunar Crescent 🌓🗡️', cost:85500, damage:400, description:'Glows under moonlight.', owned:false},
    { id: 25, name:'Solar Flare ☀️🗡️', cost:90000, damage:420, description:'Blazes with solar energy.', owned:false},
    { id: 26, name:'Void Reaver 🌌🗡️', cost:94500, damage:440, description:'Draws power from the void.', owned:false},
    { id: 27, name:'Astral Blade 🌠🗡️', cost:99000, damage:460, description:'Shines with astral light.', owned:false},
    { id: 28, name:'Nebula Sword 🌫️🗡️', cost:103500, damage:480, description:'Adorned with nebular patterns.', owned:false},
    { id: 29, name:'Galactic Saber 🌌🗡️', cost:108000, damage:500, description:'Embodies galaxy\'s might.', owned:false},
    { id: 30, name:'Infinity Blade ♾️🗡️', cost:112500, damage:520, description:'The ultimate infinite power.', owned:false}
];

const monsterTypes = [
    { name: 'Slimey McSlimeface 🟢', health: 40, attack: 4, emoji: '🟢'},
    { name: 'Gobblin Giggles 👺', health: 60, attack: 6, emoji:'👺'},
    { name: 'Orcward the Awkward 🐗', health:100, attack:10, emoji:'🐗'},
    { name: 'Trolltastic the Troll 🧌', health:160, attack:16, emoji:'🧌'},
    { name: 'Dragzilla the Dazzling 🐉', health:300, attack:30, emoji:'🐉'},
    { name: 'Bashful Blob 🤖', health:50, attack:4, emoji:'🤖'},
    { name: 'Sneaky Sneaker 🕵️', health:70, attack:8, emoji:'🕵️'},
    { name: 'Vampire Vex 🧛‍♂️', health:120, attack:12, emoji:'🧛‍♂️', isMagic:true},
    { name: 'Werewolf Wally 🐺', health:140, attack:14, emoji:'🐺'},
    { name: 'Zombie Zed 🧟‍♂️', health:80, attack:8, emoji:'🧟‍♂️'},
    { name: 'Ghostly Gary 👻', health:90, attack:9, emoji:'👻', isMagic:true},
    { name: 'Skeleton Sam 💀', health:70, attack:6, emoji:'💀'},
    { name: 'Cyclops Carl 👁️', health:180, attack:18, emoji:'👁️'},
    { name: 'Giant Grog 🦍', health:240, attack:24, emoji:'🦍'},
    { name: 'Lizard Lord 🦎', health:110, attack:11, emoji:'🦎'},
    { name: 'Harpy Hannah 🦅', health:100, attack:10, emoji:'🦅'},
    { name: 'Mummy Mike 🧱', health:130, attack:13, emoji:'🧱'},
    { name: 'Demon Drake 🐉', health:200, attack:20, emoji:'🐉', isMagic:true},
    { name: 'Banshee Bella 👺', health:140, attack:16, emoji:'👺'},
    { name: 'Phoenix Phil 🔥', health:160, attack:18, emoji:'🔥'},
    { name: 'Hydra Henry 🐉', health:220, attack:22, emoji:'🐉'},
    { name: 'Minotaur Max 🐂', health:190, attack:20, emoji:'🐂'},
    { name: 'Kraken Kyle 🐙', health:260, attack:26, emoji:'🐙'},
    { name: 'Siren Sally 🧜‍♀️', health:170, attack:17, emoji:'🧜‍♀️'},
    { name: 'Gorgon Gina 🐍', health:150, attack:15, emoji:'🐍'},
    { name: 'Leviathan Leo 🐉', health:280, attack:28, emoji:'🐉'},
    { name: 'Chimera Charlie 🐯', health:230, attack:23, emoji:'🐯'},
    { name: 'Behemoth Ben 🐘', health:250, attack:25, emoji:'🐘'},
    { name: 'Specter Steve 👻', health:120, attack:12, emoji:'👻', isMagic:true},
    { name: 'Giant Goblin Grug 👹', health:180, attack:18, emoji:'👹'}
];

let monsters = [];
let monsterId = 1;
let currentBoss = null;
const bosses = [];

const finalBoss = {
    id: 999,
    name: 'Titan of the Abyss 🌌👹',
    health:20000,
    attack:99,
    emoji:'🌌👹',
    isFinal:true,
    isBoss:true,
    attackInterval: null
};

const quests = [
    { id:1, name:'Reach Level', baseGoal:5, baseGold:500, baseXP:100, level:1, claimed:false },
    { id:2, name:'Defeat Monsters', baseGoal:10, baseGold:1000, baseXP:200, level:1, claimed:false },
    { id:3, name:'Own Swords', baseGoal:5, baseGold:1500, baseXP:300, level:1, claimed:false }
];

const achievements = [
    { id:1, name:'First Click', description:'Click the hero once.', achieved:false },
    { id:2, name:'Gold Collector', description:'Earn 100 gold.', achieved:false },
    { id:3, name:'Level Up', description:'Reach Level 5.', achieved:false },
    { id:4, name:'Defensive Master', description:'Upgrade Defense 5 times.', achieved:false },
    { id:5, name:'Health Guru', description:'Upgrade Health 3 times.', achieved:false },
    { id:6, name:'Auto-Clicker', description:'Purchase Auto-Clicker.', achieved:false },
    { id:7, name:'Rich', description:'Earn 1000 gold.', achieved:false },
    { id:8, name:'Ultimate Level', description:'Reach Level 20.', achieved:false },
    { id:9, name:'Defensive Wall', description:'Upgrade Defense 10 times.', achieved:false },
    { id:10, name:'Health is Wealth', description:'Upgrade Health 10 times.', achieved:false },
    { id:11, name:'Sword Master', description:'Own all 30 swords.', achieved:false },
    { id:12, name:'Epic Journey', description:'Reach Level 50.', achieved:false },
    { id:13, name:'Legendary Hero', description:'Reach Level 100.', achieved:false },
    { id:14, name:'Mythical Champion', description:'Reach Level 150.', achieved:false },
    { id:15, name:'Immortal', description:'Reach Level 200.', achieved:false },
    { id:16, name:'Monster Slayer', description:'Defeat 5 monsters.', achieved:false },
    { id:17, name:'Boss Hunter', description:'Defeat a boss.', achieved:false },
    { id:18, name:'Ultimate Conqueror', description:'Defeat the final boss and own all swords.', achieved:false },
    { id:19, name:'Survivor', description:'Survive 3 deaths.', achieved:false }
];

// Define currentGoldGain function
function currentGoldGain(amount) {
    const goldMult = upgrades.find(u => u.type === 'goldMultiplier').owned;
    const luckMult = upgrades.find(u => u.type === 'luck').owned;
    const comboMultiplier = 1 + (0.05 * comboCount);
    const prestigeMultiplier = 1 + (prestigeCount * 0.05);
    return Math.floor(amount * (1 + (1.5 * goldMult)) * (1 + (0.1 * luckMult)) * comboMultiplier * prestigeMultiplier);
}

function currentCriticalHitChance(){
    const critUpg=upgrades.find(u=>u.type==='criticalHit').owned;
    const chance=0.15+(0.03*critUpg);
    return Math.random()<chance;
}

function currentExperienceGain(){
    const expUpg=upgrades.find(u=>u.type==='experienceBoost').owned;
    return 1+(2*expUpg);
}

function gainExperience(amount) {
    const levelSpeedMultiplier = 2; 
    const xpMultiplier = level >= 10 ? 2 : 1; 
    experience += amount * levelSpeedMultiplier * xpMultiplier;

    let bossShouldSpawn = false;
    while (experience >= expToNext && level < 100) {
        experience -= expToNext;
        levelUp();
        if (level % 10 === 0 && level < 100 && !currentBoss) {
            bossShouldSpawn = true;
        }
    }

    if (bossShouldSpawn) {
        spawnBoss(true);
    }

    if (level === 100 && swords.every(s => s.owned)) showVictoryModal();

    updateStats();
    checkQuests();
}

function initializeGame() {
    initializeAchievements();
    initializeUpgrades();
    initializeSwords();
    initializeShields();
    updateStats();
    updateAchievements();
    startPassiveIncome();
    initializeQuests();
    updateComboDisplay();
    startHealthRegeneration();
}

// Tutorial dialog
let dialogIndex = 0;
const tutorialDialog = [
    "Welcome, young adventurer! 👀 Prepare for an epic journey!",
    "This world is plagued with annoying monsters. 👾",
    "Click, smash, and slay them all! 🗡️",
    "Gold will rain upon you! 💰",
    "Upgrade your hero, collect swords, reach Level 100! ⚔️",
    "Don't die. That's bad. 💀",
    "Hit 'Start Game' and show these monsters who's boss!"
];

function startGame() {
    const modal = document.getElementById("tutorialModal");
    modal.classList.remove("active");
    gamePaused = false;
    initializeGame();
    delayedMonsterSpawn(); // Start the countdown to spawn monsters
}

function nextDialog() {
    dialogIndex++;
    const dialogElement = document.getElementById("npcDialog");
    const startButton = document.getElementById("startGameButton");
    if (dialogIndex < tutorialDialog.length) {
        dialogElement.textContent = tutorialDialog[dialogIndex];
    } else {
        startButton.style.display = "inline-block";
        dialogElement.textContent = "That's all I've got. Make me proud! 🧙";
    }
}

function switchTab(tabName, buttonElement) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section=>section.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab=>tab.classList.remove('active'));
    buttonElement.classList.add('active');
}

let activeNotifications = new Set();

function showNotification(message, type) {
    if (activeNotifications.has(message)) return;

    const notificationArea = document.getElementById('notificationArea');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationArea.appendChild(notification);
    activeNotifications.add(message);

    setTimeout(() => {
        notification.remove();
        activeNotifications.delete(message);
    }, 3000);
}

let criticalHitNotificationCooldown=false;

function createBloodParticles(event){
    const bloodContainer=document.getElementById('bloodParticles');
    const numberOfParticles=20;
    const containerRect=bloodContainer.getBoundingClientRect();
    const clickX=event.clientX - containerRect.left;
    const clickY=event.clientY - containerRect.top;
    for(let i=0;i<numberOfParticles;i++){
        const particle=document.createElement('div');
        particle.classList.add('blood-particle');
        const dx=(Math.random()-0.5)*100+'px';
        const dy=(Math.random()-0.5)*100+'px';
        particle.style.left=`${clickX}px`;
        particle.style.top=`${clickY}px`;
        particle.style.setProperty('--dx',dx);
        particle.style.setProperty('--dy',dy);
        bloodContainer.appendChild(particle);
        particle.addEventListener('animationend',()=>{particle.remove();});
    }
}

function heroClick(event) {
    if (gamePaused || idleMode) return;
    totalClicks++;
    const now=Date.now();
    if(now-lastClickTime<=comboDuration){
        if(comboCount<comboMaxStacks) comboCount++;
    } else {
        comboCount=1;
    }
    lastClickTime=now;
    updateComboDisplay();

    let damageDealt=attackPower;
    let goldEarned=currentGoldGain(damageDealt);
    gold+=goldEarned;
    updateStats();
    playSound(document.getElementById('clickSound'));
    gainExperience(currentExperienceGain());
    checkAchievements();
    createBloodParticles(event);

    if(monstersDefeated>0 && monstersDefeated%5===0 && !currentBoss){
        spawnBoss();
    }

    if(comboTimeout) clearTimeout(comboTimeout);
    comboTimeout=setTimeout(()=>{
        comboCount=0;
        updateComboDisplay();
    },comboDuration);
}

function levelUp() {
    level++;
    expToNext = Math.floor(expToNext * 1.25);
    playSound(document.getElementById('levelUpSound'));
    showLevelUpModal();
    checkAchievements();

    showLevelMilestoneNotification(); 

    if (level === 50) {
        showNotification('🌟 You are halfway to mastery! Keep going!', 'achievement');
    }
    if (level === 90) {
        showNotification('⚔️ Just a little more to the ultimate challenge!', 'achievement');
    }

    if (level === 100) spawnFinalBoss();

    updateStats();
    checkQuests();
}

function showLevelUpModal(){
    document.getElementById('newLevel').textContent=level;
    const modal=document.getElementById('levelUpModal');
    modal.classList.add('active');
}

function closeLevelUpModal(){
    const modal=document.getElementById('levelUpModal');
    modal.classList.remove('active');
}

function showVictoryModal(){
    const modal=document.getElementById('victoryModal');
    if(!modal.classList.contains('active')){
        playSound(document.getElementById('victorySound'));
        modal.classList.add('active');
        showNotification('🏆 You have achieved Victory! 🏆','victory');
        const prestigeButton = document.getElementById('prestigeButton');
        prestigeButton.style.display = 'inline-block';
    }
}

function closeVictoryModal(){
    const modal=document.getElementById('victoryModal');
    modal.classList.remove('active');
}

function showGameOverModal(){
    playSound(document.getElementById('gameOverSound'));
    const modal=document.getElementById('gameOverModal');
    modal.classList.add('active');
    showNotification('💀 Game Over! 💀','error');
}

function restartGame(){
    const modal=document.getElementById('gameOverModal');
    modal.classList.remove('active');
    resetGame();
}

function updateStats() {
    document.getElementById('gold').textContent = Math.floor(gold).toLocaleString();
    document.getElementById('level').textContent = level;
    document.getElementById('experience').textContent = Math.floor(experience).toLocaleString();
    document.getElementById('expToNext').textContent = Math.floor(expToNext).toLocaleString();
    document.getElementById('passiveIncome').textContent = passiveIncome.toLocaleString();
    document.getElementById('attackPower').textContent = Math.round(attackPower).toLocaleString();
    document.getElementById('defense').textContent = Math.round(defense).toLocaleString();
    document.getElementById('currentHealth').textContent = Math.floor(health).toLocaleString();
    document.getElementById('maxHealth').textContent = Math.floor(maxHealth).toLocaleString();
    document.getElementById('lives').textContent = lives;
    document.getElementById('prestigeCountDisplay').textContent = prestigeCount;

    const healthRegenUpgrade = upgrades.find(u => u.type === 'healthRegen');
    const regenRate = healthRegenRate + (healthRegenUpgrade ? Math.round(maxHealth * 0.02 * healthRegenUpgrade.owned) : 0);
    document.getElementById('healthRegenRate').textContent = `${regenRate} HP/s`;

    const xpPercentage = Math.min((experience / expToNext) * 100, 100);
    document.getElementById('xpBar').style.width = `${xpPercentage}%`;
}

function recalculateAttackPower(){
    attackPower=1;
    swords.forEach(s=>{if(s.owned)attackPower+=s.damage;});
    updateStats();
}

function buySword(swordId){
    const sword=swords.find(s=>s.id===swordId);
    if(!sword.owned && gold>=sword.cost){
        gold-=sword.cost;
        sword.owned=true;
        recalculateAttackPower();
        const swordButton=document.getElementById(`sword${sword.id}`).querySelector('button');
        swordButton.disabled=true;
        swordButton.textContent='Owned ✅';
        updateStats();
        playSound(document.getElementById('upgradeSound'));
        checkAchievements();
        showNotification(`Purchased Sword: ${sword.name}`,'success');
    } else if(sword.owned){
        showNotification('❗ You already own this sword! 🔒','error');
    } else {
        showNotification('❗ Not enough gold! 💸','error');
    }
}

function buyUpgrade(type) {
    const upg = upgrades.find(u => u.type === type);
    if (!upg) return;

    if (gold >= upg.cost) {
        gold -= upg.cost;
        upg.owned += 1;

        switch (type) {
            case 'attack':
                attackPower += 2;
                break;
            case 'defense':
                defense += 2;
                defenseUpgrades++;
                break;
            case 'health':
                maxHealth += 10;
                health = maxHealth;
                healthUpgrades++;
                break;
            case 'healthRegen':
                // Effect applied automatically in updateStats
                break;
            case 'autoClick':
                if(!autoClickPurchased){
                    autoClickPurchased=true;
                    passiveIncome+=10;
                }
                break;
        }

        updateStats();
        playSound(document.getElementById('upgradeSound'));
        showNotification(`${upg.name} purchased!`, 'success');

        upg.cost = Math.floor(upg.cost * 2);
        const upgradeCostSpan = document.getElementById(`upgradeCost${upg.id}`);
        if (upgradeCostSpan) upgradeCostSpan.textContent = upg.cost;

        const upgradeButton = document.getElementById(`upgrade${upg.id}`).querySelector('button');
        upgradeButton.innerHTML = `${upg.name} (Owned: ${upg.owned}) - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`;

        checkAchievements();
        checkQuests();
    } else {
        showNotification('Not enough gold!', 'error');
    }
}

function checkAchievements(){
    updateAchievements();
}

function isAchievementAchieved(achievement){
    switch(achievement.id){
        case 1:return totalClicks>=1;
        case 2:return gold>=100;
        case 3:return level>=5;
        case 4:return defenseUpgrades>=5;
        case 5:return healthUpgrades>=3;
        case 6:return autoClickPurchased;
        case 7:return gold>=1000;
        case 8:return level>=20;
        case 9:return defenseUpgrades>=10;
        case 10:return healthUpgrades>=10;
        case 11:return swords.every(s=>s.owned);
        case 12:return level>=50;
        case 13:return level>=100;
        case 14:return level>=150;
        case 15:return level>=200;
        case 16:return monstersDefeated>=5;
        case 17:return bossesDefeated>=1;
        case 18:return bossesDefeated>=1 && swords.every(s=>s.owned);
        case 19:return deaths>=3;
        default:return false;
    }
}

function initializeAchievements(){
    const achievementsList=document.getElementById('achievementsList');
    achievementsList.innerHTML='';
    achievements.forEach(ach=>{
        const achDiv=document.createElement('div');
        achDiv.className='achievement locked';
        achDiv.id=`achievement${ach.id}`;
        achDiv.innerHTML=`<span class="icon">🔒</span><div><strong>${ach.name}</strong><br>${ach.description}</div>`;
        achievementsList.appendChild(achDiv);
    });
}

function updateAchievements(){
    achievements.forEach(ach=>{
        if(!ach.achieved&&isAchievementAchieved(ach)){
            ach.achieved=true;
            const achDiv=document.getElementById(`achievement${ach.id}`);
            achDiv.classList.remove('locked');
            achDiv.innerHTML=`<span class="icon">✅</span><div><strong>${ach.name}</strong><br>${ach.description}</div>`;
            playSound(document.getElementById('upgradeSound'));
            showNotification(`Achievement Unlocked: ${ach.name}! 🏆`,'achievement');
        }
    });
}

function saveGame(){
    const gameState={
        gold,level,experience,expToNext,attackPower,defense,health,maxHealth,
        passiveIncome,lives,upgradeCosts,upgrades,swords,monsters,monsterId,
        monstersDefeated,bossesDefeated,currentBoss,achievements,totalClicks,
        defenseUpgrades,healthUpgrades,autoClickPurchased,deaths,synergyForged,
        prestigeCount,
        quests
    };
    localStorage.setItem('goldyMcGoldfaceSave',JSON.stringify(gameState));
    showNotification('💾 Game Saved!','success');
}

function loadGame(){
    const savedState = localStorage.getItem('goldyMcGoldfaceSave');
    if(savedState){
        const gameState = JSON.parse(savedState);
        gold = gameState.gold || 0;
        level = gameState.level || 1;
        experience = gameState.experience || 0;
        expToNext = gameState.expToNext || 10;
        defense = gameState.defense || 1;
        health = gameState.health || 100;
        maxHealth = gameState.maxHealth || 100;
        passiveIncome = gameState.passiveIncome || 0;
        lives = gameState.lives || 3;
        quests.forEach((q, i) => {
            quests[i] = gameState.quests[i];
        });
        upgrades.forEach((upg, index) => {
            upgrades[index].owned = gameState.upgrades[index].owned;
            if(upg.type === 'autoClick' && upgrades[index].owned){
                autoClickPurchased = true;
                passiveIncome +=10;
            } else {
                if(upg.type==='defense') defenseUpgrades=upgrades[index].owned;
                if(upg.type==='health') healthUpgrades=upgrades[index].owned;
            }
        });
        swords.forEach((sw, index) => {
            swords[index].owned = Boolean(gameState.swords[index].owned);
        });
        recalculateAttackPower();
        monsters = gameState.monsters || [];
        monsterId = gameState.monsterId || 1;
        monstersDefeated = gameState.monstersDefeated || 0;
        bossesDefeated = gameState.bossesDefeated || 0;
        currentBoss = gameState.currentBoss || null;
        achievements.forEach((ach, index) => {
            achievements[index].achieved = gameState.achievements[index].achieved;
        });
        totalClicks = gameState.totalClicks || 0;
        defenseUpgrades = gameState.defenseUpgrades || 0;
        healthUpgrades = gameState.healthUpgrades || 0;
        autoClickPurchased = gameState.autoClickPurchased || false;
        deaths = gameState.deaths || 0;
        synergyForged = gameState.synergyForged || false;
        prestigeCount = gameState.prestigeCount || 0;
        updateStats();
        renderLoadedMonsters();
        gamePaused = false;
        initializeQuests();
        updateComboDisplay();
        showNotification('📂 Game Loaded!','success');
        if(level >= 100 && swords.every(s => s.owned)){
            showVictoryModal();
        }
    } else {
        showNotification('❗ No saved game found.','error');
    }
}

function renderLoadedMonsters(){
    const monstersContainer=document.getElementById('monstersContainer');
    monstersContainer.innerHTML='';
    monsters.forEach(monster=>{
        renderMonster(monster);
        scheduleMonsterAttack(monster);
        scheduleMonsterSpell(monster);
    });
}

function resetGame(){
    if(confirm('⚠️ Are you sure you want to reset the game?')){
        localStorage.removeItem('goldyMcGoldfaceSave');
        gold=0;level=1;experience=0;expToNext=10;
        attackPower=1;defense=1;health=100;maxHealth=100;passiveIncome=0;lives=3;
        upgradeCosts={...baseUpgradeCosts};
        totalClicks=0;defenseUpgrades=0;healthUpgrades=0;autoClickPurchased=false;bossesDefeated=0;deaths=0;synergyForged=false;

        upgrades.forEach(upg=>{
            upg.owned=(upg.type==='autoClick'?false:0);
        });

        swords.forEach(s=>{
            s.owned=false;
        });

        quests.forEach(q=>{
            q.level=1;
            q.claimed=false;
        });

        recalculateAttackPower();
        monsters=[];
        monsterId=1;
        monstersDefeated=0;
        bossesDefeated=0;
        currentBoss=null;
        achievements.forEach(ach=>ach.achieved=false);
        initializeAchievements();
        document.getElementById('monstersContainer').innerHTML='';
        updateStats();
        updateAchievements();
        initializeQuests();
        updateComboDisplay();
        showNotification('🔄 Game has been reset.','success');
    }
}

function buyHeart(){
    const heartCost=10000;
    if(gold>=heartCost){
        gold-=heartCost;
        lives+=1;
        updateStats();
        playSound(document.getElementById('buyHeartSound'));
        showNotification('❤️ Purchased a full heart! Lives +1.','success');
        checkAchievements();
    } else {
        showNotification('❗ Not enough gold to buy a full heart!','error');
    }
}

function playSound(sound){
    if(sound){
        try{
            sound.currentTime=0;
            sound.play().catch((error)=>{console.error("Audio playback failed:",error);});
        }catch(error){
            console.error("Error with audio:",error);
        }
    }
}

let isMuted = false;

function toggleMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const muteButton = document.getElementById('muteButton');
    
    if (!backgroundMusic) return;
    if (isMuted) {
        backgroundMusic.muted = false;
        muteButton.textContent = '🔊';
    } else {
        backgroundMusic.muted = true;
        muteButton.textContent = '🔈';
    }
    isMuted = !isMuted;
}

function setVolume(value){
    const audioElements=document.querySelectorAll('audio');
    audioElements.forEach(a=>{a.volume=value;});
}

function enhanceUIResponsiveness(){
    const gameContainer=document.getElementById('game-container');
    const hero=document.getElementById('hero');
    const stats=document.querySelector('.stats');
    const upgradesList=document.getElementById('upgradesList');

    function adjustUI(){
        const screenWidth=window.innerWidth;
        if(screenWidth<800){
            gameContainer.style.padding='20px';
            gameContainer.style.fontSize='10px';
            hero.style.fontSize='60px';
            stats.style.width='90%';
        } else {
            gameContainer.style.padding='40px';
            gameContainer.style.fontSize='14px';
            hero.style.fontSize='100px';
            stats.style.width='300px';
        }
        if(screenWidth<500){
            upgradesList.style.gap='10px';
        } else {
            upgradesList.style.gap='20px';
        }
    }
    window.addEventListener('resize',adjustUI);
    adjustUI();
}

function initializeUpgrades(){
    const upgradesList=document.getElementById('upgradesList');
    upgradesList.innerHTML='';
    upgrades.forEach(upg=>{
        const upgDiv=document.createElement('div');
        upgDiv.className='achievement';
        upgDiv.id=`upgrade${upg.id}`;
        upgDiv.innerHTML=`
        <span class="icon">🔧</span>
        <div>
            <strong>${upg.name} ${getUpgradeEmoji(upg.type)}</strong><br>
            ${upg.effect}
        </div>
        <button class="upgrade-button" onclick="buyUpgrade('${upg.type}')">
        ${upg.type!=='autoClick'?`${upg.name} (Owned: ${upg.owned}) - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`:
        `${upg.name} - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`}
        </button>
        `;
        upgradesList.appendChild(upgDiv);
    });
}

function getUpgradeEmoji(type){
    switch(type){
        case 'attack':return '⚔️';
        case 'defense':return '🛡️';
        case 'health':return '❤️';
        case 'autoClick':return '🤖';
        case 'criticalHit':return '⚡';
        case 'goldMultiplier':return '💰';
        case 'experienceBoost':return '📈';
        case 'monsterSlayer':return '👹';
        case 'shield':return '🛡️';
        case 'luck':return '🍀';
        default:return '';
    }
}

function initializeSwords(){
    const swordsList=document.getElementById('swordsList');
    swordsList.innerHTML='';
    swords.forEach(s=>{
        const swordDiv=document.createElement('div');
        swordDiv.className='sword';
        swordDiv.id=`sword${s.id}`;
        swordDiv.innerHTML=`
        <span class="icon">🗡️</span>
        <div>
            <strong>${s.name}</strong><br>
            ${s.description}<br>
            Damage: ${s.damage} 🗡️
        </div>
        <button class="upgrade-button" onclick="buySword(${s.id})">
        Buy (Cost: <span id="swordCost${s.id}">${s.cost}</span> 💰)
        </button>
        `;
        swordsList.appendChild(swordDiv);
    });
}

function startPassiveIncome(){
    setInterval(()=>{
        if(!gamePaused){
            const prestigeMultiplier = 1 + (prestigeCount * 0.1);
            gold+=passiveIncome*prestigeMultiplier;
            updateStats();
        }
    },1000);
}

function updateComboDisplay() {
    document.getElementById('comboCount').textContent = comboCount;
    document.getElementById('comboBonus').textContent = (comboCount * 10) + '%';

    if (comboCount >= 3) {
        const comboHealthRegen = Math.round(maxHealth * 0.02);
        health = Math.min(health + comboHealthRegen, maxHealth);
        updateStats();
        showNotification(`🔥 Combo Health Regen: +${comboHealthRegen} health!`, 'success');
    }
}

function spawnMonster() {
    const randomType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    const healthMultiplier = 1 + (level * 0.05) + (attackPower * 0.02);
    const attackMultiplier = 1 + (defense * 0.01) + (level * 0.05);

    const newMonster = {
        id: monsterId,
        name: `${randomType.name} (Lv. ${level})`,
        health: Math.max(1, Math.round(randomType.health * healthMultiplier)),
        attack: Math.max(1, Math.round(randomType.attack * attackMultiplier)),
        emoji: randomType.emoji,
        isBoss: false,
        isFinal: false,
        isMagic: randomType.isMagic || false,
        attackTimeout: null
    };

    monsters.push(newMonster);
    renderMonster(newMonster);
    scheduleMonsterAttack(newMonster);
    scheduleMonsterSpell(newMonster);
    monsterId++;

    showNotification(`👾 New Monster Appeared: ${newMonster.name}!`, 'achievement');
    playSound(document.getElementById('monsterAppearSound'));
}

function renderMonster(monster) {
    const monstersContainer = document.getElementById('monstersContainer');
    const monsterDiv = document.createElement('div');
    monsterDiv.className = 'monster';
    monsterDiv.id = `monster${monster.id}`;

    const spellButton = monster.isMagic
        ? `<button class="spell-button" onclick="castSpellOnMonster(${monster.id})">Cast Spell ✨</button>`
        : '';

    monsterDiv.innerHTML = `
        <span class="icon">${monster.emoji}</span>
        <div>
            <strong>${monster.name}</strong><br>
            Health: <span id="monsterHealth${monster.id}">${Math.round(monster.health)}</span> ❤️<br>
            Attack: <span id="monsterAttack${monster.id}">${Math.round(monster.attack)}</span> ⚔️
        </div>
        <button class="attack-button" onclick="attackMonster(${monster.id})">Attack 👊</button>
        ${spellButton}
    `;
    monstersContainer.appendChild(monsterDiv);
    updateIdleModeUI();
}

function getMonsterSpawnInterval() {
    if (level <= 10) {
        return Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000;
    } else if (level <= 20) {
        return Math.floor(Math.random() * (40000 - 30000 + 1)) + 30000;
    } else {
        return Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
    }
}

function attackMonster(monsterId) {
    if (idleMode) {
        showNotification("❌ You can't attack while in Idle Mode!", 'error');
        return; 
    }

    const monster = monsters.find(m => m.id === monsterId) || (currentBoss && currentBoss.id === monsterId ? currentBoss : null);
    if (!monster) return;

    let playerDamage = attackPower;
    const isCritical = currentCriticalHitChance();
    if (isCritical) {
        playerDamage *= 2;
        if (!criticalHitNotificationCooldown) {
            showNotification('⚡ Critical Hit! Double Damage!', 'critical');
            playSound(document.getElementById('criticalHitSound'));
            criticalHitNotificationCooldown = true;
            setTimeout(() => { criticalHitNotificationCooldown = false; }, 1000);
        }
    } else {
        playSound(document.getElementById('clickSound'));
    }

    const monsterSlayerUpgrades = upgrades.find(u => u.type === 'monsterSlayer').owned;
    playerDamage += 3 * monsterSlayerUpgrades;
    monster.health -= playerDamage;
    showDamageAnimation(playerDamage, `monster${monster.id}`);
    if (monster.health <= 0) {
        killMonster(monster);
    } else {
        const mh = document.getElementById(`monsterHealth${monster.id}`);
        if (mh) mh.textContent = monster.health;
    }
}

function killMonster(monster) {
    clearMonsterIntervals(monster);
    if(monster.isBoss){
        gold += 1000;
        experience += 1000; 
        bossesDefeated++;
        playSound(document.getElementById('bossDefeatedSound'));
        showNotification(`🎉 Boss ${monster.name} defeated! Earned 1000 gold and 1000 XP!`, 'success');
        currentBoss = null;
    } else {
        gold += 100;
        monstersDefeated++;
        playSound(document.getElementById('monsterDefeatedSound'));
        showNotification(`🎉 Monster ${monster.name} defeated! Earned 100 gold!`, 'success');
        experience += 100; 
    }

    monsters = monsters.filter(m => m.id !== monster.id);
    const monsterDiv = document.getElementById(`monster${monster.id}`);
    if(monsterDiv) monsterDiv.remove();

    updateStats();
    checkAchievements();
    checkQuests();
    if(monster.isBoss && monster.isFinal && swords.every(s => s.owned)) showVictoryModal();
}

function clearMonsterIntervals(monster) {
    if (monster.attackTimeout) {
        clearInterval(monster.attackTimeout);
        monster.attackTimeout = null;
    }
    if (monster.spellTimeout) {
        clearTimeout(monster.spellTimeout);
        monster.spellTimeout = null;
    }
}

function attackPlayer(monster) {
    if (!monster) return;
    const shieldUpgrades = upgrades.find(u => u.type === 'shield').owned || 0;
    let damage = Math.max(Math.round(monster.attack - (2 * shieldUpgrades)), 0);

    health -= damage;
    showDamageAnimation(damage, 'home');
    playSound(document.getElementById('monsterAttackSound'));
    showNotification(`⚔️ ${monster.name} attacked you for ${damage} damage! ❤️`, 'error');

    if (health <= 0) {
        lives -= 1;
        deaths += 1;
        if (lives > 0) {
            health = maxHealth;
            showNotification(`💀 You died! Lost a life. Lives left: ${lives}`, 'error');
        } else {
            handleGameOver();
        }
    }

    updateStats();
}

function handleGameOver(){
    showGameOverModal();
}

function scheduleMonsterAttack(monster) {
    if (monster.attackTimeout) {
        clearInterval(monster.attackTimeout);
    }
    monster.attackTimeout = setInterval(() => {
        if (!gamePaused && !idleMode && monsters.includes(monster)) {
            attackPlayer(monster);
        } else if (idleMode) {
            clearInterval(monster.attackTimeout);
            monster.attackTimeout = null;
        }
    }, Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000);
}

function scheduleMonsterSpell(monster) {
    if (!monster.isBoss) {
        const spellDelay = Math.floor(Math.random() * (12000 - 8000 + 1)) + 8000;
        monster.spellTimeout = setTimeout(() => {
            if (!gamePaused && monsters.includes(monster)) {
                castSpell(monster);
                scheduleMonsterSpell(monster);
            }
        }, spellDelay);
    }
}

function castSpell(monster) {
    if (!monster) return;
    const spellDamage = Math.max(1, Math.floor(monster.attack * 0.8));
    health -= spellDamage;

    showDamageAnimation(spellDamage, 'home');
    playSound(document.getElementById('spellCastSound'));
    showNotification(`✨ ${monster.name} cast a spell for ${spellDamage} damage!`, 'error');

    if (health <= 0) {
        lives -= 1;
        deaths += 1;

        if (lives > 0) {
            health = maxHealth;
            showNotification(`💀 You were struck by ${monster.name}'s spell! Lives left: ${lives}`, 'error');
        } else {
            handleGameOver();
        }
    }

    updateStats();
}

let spellCooldown = false;

function castSpellOnMonster(monsterId) {
    if (spellCooldown) {
        showNotification('❌ Spell is on cooldown!', 'error');
        return;
    }

    spellCooldown = true;
    setTimeout(() => (spellCooldown = false), 3000);

    const monster = monsters.find(m => m.id === monsterId);
    if (!monster) {
        showNotification('❌ Monster not found!', 'error');
        return;
    }

    if (!monster.isMagic) {
        showNotification(`❌ ${monster.name} is immune to spells!`, 'error');
        return;
    }

    const spellDamage = Math.floor(attackPower * 1.5);
    monster.health -= spellDamage;
    showDamageAnimation(spellDamage, `monster${monster.id}`);
    showNotification(`✨ Spell dealt ${spellDamage} damage to ${monster.name}!`, 'success');

    if (monster.health <= 0) {
        killMonster(monster);
    } else {
        const monsterHealthElement = document.getElementById(`monsterHealth${monster.id}`);
        if (monsterHealthElement) monsterHealthElement.textContent = monster.health;
    }
}

function showDamageAnimation(amount, targetId) {
    if(targetId==='home'){
        const homeSection=document.getElementById('home');
        const damageText=document.createElement('div');
        damageText.className='damage-text';
        damageText.textContent=`-${amount}`;
        homeSection.appendChild(damageText);
        setTimeout(()=>{damageText.remove();},1000);
    } else {
        const targetElement=document.getElementById(targetId);
        if(targetElement){
            const damageText=document.createElement('div');
            damageText.className='damage-text';
            damageText.textContent=`-${amount}`;
            targetElement.appendChild(damageText);
            setTimeout(()=>{damageText.remove();},1000);
        }
    }
}

function spawnBoss(isLevelBased = false) {
    if (currentBoss) return;
    if (level < 30) return;

    const bossHealthBase = isLevelBased ? (300 + (level * 150)) : 300; 
    const bossAttackBase = isLevelBased ? (5 + (level * 2)) : 5; 

    const boss = {
        id: 500 + bosses.length,
        name: `Boss ${bosses.length + 1}`,
        health: Math.round(bossHealthBase + (attackPower * 2)),
        attack: Math.round(bossAttackBase + (defense * 1)),
        emoji: '👹',
        isBoss: true,
        isFinal: false,
        attackTimeout: null
    };

    currentBoss = boss;
    bosses.push(boss);
    monsters.push(boss);

    renderMonster(boss);
    scheduleMonsterAttack(boss);
    showNotification(`⚠️ Boss appeared: ${boss.name}!`, 'achievement');
}

function spawnFinalBoss() {
    if (currentBoss) return;
    const fb = {
        ...finalBoss, 
        health: 200000,
        attack: 99,
        attackTimeout: null,
        isBoss: true,
        isFinal: true
    };

    currentBoss = fb;
    monsters.push(currentBoss);

    renderMonster(currentBoss);
    scheduleMonsterAttack(currentBoss);
    showNotification(`⚠️ Final Boss Appears: ${currentBoss.name}!`, 'achievement');
}

function prestige(){
    if(confirm("Are you sure you want to Prestige?\nYou will reset your progress but gain a permanent gold multiplier.")){
        prestigeCount++;
        gold=0;level=1;experience=0;expToNext=10;
        attackPower=1;defense=1;health=100;maxHealth=100;passiveIncome=0;lives=3;
        totalClicks=0;defenseUpgrades=0;healthUpgrades=0;autoClickPurchased=false;bossesDefeated=0;deaths=0;synergyForged=false;

        upgrades.forEach(upg=>{
            upg.owned=(upg.type==='autoClick'?false:0);
        });

        swords.forEach(s=>{s.owned=false;});

        monsters.forEach(m=>clearMonsterIntervals(m));
        monsters=[];
        monsterId=1;
        monstersDefeated=0;
        bossesDefeated=0;
        currentBoss=null;
        achievements.forEach(ach=>ach.achieved=false);

        quests.forEach(q=>{
            q.level=1;
            q.claimed=false;
        });

        switchTab('home', document.querySelector('.tab-button'));

        initializeAchievements();
        initializeUpgrades();
        initializeSwords();
        updateStats();
        updateAchievements();
        initializeQuests();
        updateComboDisplay();
        showNotification(`✨ Prestige done! Your gold income is now permanently increased! ✨`,'success');
    }
}

function showLevelMilestoneNotification() {
    if (level % 10 === 0) {
        showNotification(`🎉 You've reached Level ${level}! Keep it up!`, 'achievement');
    }
}

const shields = [
    {
        id: 1,
        name: 'Basic Shield 🛡️',
        cost: 500,
        defense: 2,
        description: 'A simple shield providing minimal protection.',
        effect: 'Reduces incoming damage slightly.',
        owned: false
    },
    {
        id: 2,
        name: 'Iron Shield 🛡️🪓',
        cost: 1500,
        defense: 5,
        description: 'A strong shield made of iron.',
        effect: 'Provides more defense.',
        owned: false
    },
    {
        id: 3,
        name: 'Golden Shield 🛡️✨',
        cost: 5000,
        defense: 10,
        description: 'A luxurious shield offering excellent protection.',
        effect: 'Even more defense!',
        owned: false
    },
    {
        id: 4,
        name: 'Crystal Barrier 🛡️🔷',
        cost: 10000,
        defense: 15,
        description: 'A mystical shield infused with crystal energy.',
        effect: 'High defense boost.',
        owned: false
    },
    {
        id: 5,
        name: 'Phoenix Guard 🛡️🔥',
        cost: 20000,
        defense: 20,
        description: 'A shield imbued with the spirit of the phoenix.',
        effect: 'Excellent defense.',
        owned: false
    },
    {
        id: 6,
        name: 'Shadow Aegis 🛡️🌑',
        cost: 35000,
        defense: 25,
        description: 'A shield forged from the shadows.',
        effect: 'Great defense boost.',
        owned: false
    },
    {
        id: 7,
        name: 'Stormwall Shield 🛡️⚡',
        cost: 50000,
        defense: 30,
        description: 'A shield that channels the power of storms.',
        effect: 'Huge defense boost.',
        owned: false
    },
    {
        id: 8,
        name: 'Dragon Scale 🛡️🐉',
        cost: 75000,
        defense: 40,
        description: 'An ancient shield made from dragon scales.',
        effect: 'Massive defense boost.',
        owned: false
    }
];

function initializeShields() {
    const shieldsList = document.getElementById('shieldsList');
    shieldsList.innerHTML = '';
    shields.forEach(shield => {
        const shieldDiv = document.createElement('div');
        shieldDiv.className = 'shield';
        shieldDiv.id = `shield${shield.id}`;
        shieldDiv.innerHTML = `
            <span class="icon">🛡️</span>
            <div>
                <strong>${shield.name}</strong><br>
                ${shield.description}<br>
                Defense: +${shield.defense} 🛡️<br>
                <em>Effect: ${shield.effect}</em>
            </div>
            <button class="upgrade-button" onclick="buyShield(${shield.id})">
                ${shield.owned ? 'Owned ✅' : `Buy (Cost: ${shield.cost} 💰)`}
            </button>
        `;
        shieldsList.appendChild(shieldDiv);
    });
}

function buyShield(shieldId) {
    const shield = shields.find(s => s.id === shieldId);
    if (!shield) return;

    if (shield.owned) {
        showNotification('❗ You already own this shield!', 'error');
        return;
    }

    if (gold >= shield.cost) {
        gold -= shield.cost;
        shield.owned = true;
        defense += shield.defense;
        updateStats();
        playSound(document.getElementById('upgradeSound'));
        showNotification(`Purchased Shield: ${shield.name}`, 'success');
        initializeShields();
    } else {
        showNotification('❗ Not enough gold!', 'error');
    }
}

function attemptForgeSynergy() {
    if(synergyForged){
        document.getElementById('forgeStatus').textContent="You have already forged this synergy.";
        return;
    }
    const s5=swords.find(s=>s.id===5&&s.owned);
    const s10=swords.find(s=>s.id===10&&s.owned);
    const s15=swords.find(s=>s.id===15&&s.owned);
    if(s5&&s10&&s15){
        synergyForged=true;
        attackPower+=50;
        updateStats();
        document.getElementById('forgeStatus').textContent="✨ Synergy Forged! +50 Attack! ✨";
        showNotification("🎉 Synergy Forged Successfully! +50 Attack!",'success');
    } else {
        document.getElementById('forgeStatus').textContent="You don't have the required swords!";
    }
}

function initializeQuests(){
    const questsList=document.getElementById('questsList');
    questsList.innerHTML='';
    quests.forEach(q=>{
        const conditionMet=checkQuestCondition(q);
        let statusText=conditionMet?(q.claimed?'Completed (Claimed)':'Completed!'):'In Progress';
        let claimButton=conditionMet&&!q.claimed?`<button onclick="claimQuestReward(${q.id})">Claim Reward</button>`:'';
        const currentGoal=getQuestGoal(q);
        const currentGoldReward=getQuestGoldReward(q);
        const currentXPReward=getQuestXPReward(q);
        questsList.innerHTML+=`
        <div class="quest" id="quest${q.id}">
        <span class="icon">📜</span>
        <div>
            <strong>${q.name} ${currentGoal}</strong><br>
            Status: ${statusText}<br>
            Reward: ${currentGoldReward} Gold, ${currentXPReward} XP
        </div>
        ${claimButton}
        </div>
        `;
    });
}

function getQuestGoal(q) {
    const goalScaling = 1.5; 
    return Math.ceil(q.baseGoal * Math.pow(goalScaling, q.level));
}

function getQuestGoldReward(q) {
    const rewardScaling = 1.3;
    return Math.ceil(q.baseGold * Math.pow(rewardScaling, q.level));
}

function getQuestXPReward(q) {
    const rewardScaling = 1.3;
    return Math.ceil(q.baseXP * Math.pow(rewardScaling, q.level));
}

function checkQuestCondition(q){
    const goal=getQuestGoal(q);
    if(q.id===1){
        return level>=goal;
    } else if(q.id===2){
        return monstersDefeated>=goal;
    } else if(q.id===3){
        return swords.filter(s=>s.owned).length>=goal;
    }
    return false;
}

function claimQuestReward(id){
    const quest=quests.find(qq=>qq.id===id);
    if(!quest)return;
    if(checkQuestCondition(quest)&&!quest.claimed){
        quest.claimed=true;
        const goldReward=getQuestGoldReward(quest);
        const xpReward=getQuestXPReward(quest);
        gold+=goldReward;
        gainExperience(xpReward);
        showNotification(`Quest Completed! Gained ${goldReward} Gold and ${xpReward} XP`,'success');
        updateStats();
        quest.level++;
        quest.claimed=false; 
        initializeQuests();
    }
}

function checkQuests(){
    initializeQuests();
}

let healthRegenInterval;

function startHealthRegeneration() {
    if (!healthRegenInterval) {
        healthRegenInterval = setInterval(() => {
            if (!idleMode) {
                let totalRegen = healthRegenRate; 
                const healthRegenUpgrade = upgrades.find(u => u.type === 'healthRegen');
                if (healthRegenUpgrade && healthRegenUpgrade.owned > 0) {
                    totalRegen += Math.round(maxHealth * 0.02 * healthRegenUpgrade.owned);
                }
                health = Math.min(health + totalRegen, maxHealth);
                updateStats();
            }
        }, 1000);
    }
}

let idleMode = false; 
const idleModeCost = 5000; 
let idleAttackInterval = null;

function toggleIdleMode() {
    const button = document.getElementById('toggleIdleModeButton');

    if (!idleMode && gold >= idleModeCost) {
        gold -= idleModeCost;
        idleMode = true;
        button.textContent = "Deactivate Idle Mode";
        showNotification("🌙 Idle Mode activated! Automatically attacking monsters.", "success");
        startIdleMode();
    } else if (idleMode) {
        idleMode = false;
        button.textContent = "Activate Idle Mode (5k Gold)";
        showNotification("⚔️ Idle Mode deactivated. Back to manual gameplay.", "info");
        stopIdleMode();
    } else {
        showNotification("❌ Not enough gold to activate Idle Mode!", "error");
    }

    updateStats();
}

function startIdleMode() {
    if (idleAttackInterval) return;
    idleAttackInterval = setInterval(() => {
        if (monsters.length > 0) {
            const monster = monsters[0];
            attackMonster(monster.id);
        }
    }, 1000);
}

function stopIdleMode() {
    if (idleAttackInterval) {
        clearInterval(idleAttackInterval);
        idleAttackInterval = null;
    }
}

function updateIdleModeUI() {
    const heroButton = document.getElementById('hero');
    const attackButtons = document.querySelectorAll('.attack-button');

    if (idleMode) {
        heroButton.disabled = true;
        attackButtons.forEach(button => button.disabled = true);
    } else {
        heroButton.disabled = false;
        attackButtons.forEach(button => button.disabled = false);
    }
}

function delayedMonsterSpawn(){
    let countdown = 60; 
    const countdownInterval = setInterval(() => {
        if (countdown > 0) {
            if (countdown % 10 === 0) {
                showNotification(`Monsters coming in ${countdown} seconds...`, 'info');
            }
            countdown--;
        } else {
            clearInterval(countdownInterval);
            spawnMonsterRandomly();
            showNotification(`👾 Monsters have arrived!`, 'achievement');
        }
    }, 1000);
}

function spawnMonsterRandomly() {
    if (gamePaused || idleMode) return;
    const monstersToSpawn = Math.min(1 + Math.floor(level / 10), 10);
    for (let i = 0; i < monstersToSpawn; i++) {
        spawnMonster();
    }
    function scheduleNextSpawn() {
        const interval = getMonsterSpawnInterval();
        setTimeout(() => {
            if (!gamePaused && !idleMode) {
                spawnMonsterRandomly();
                scheduleNextSpawn();
            }
        }, interval);
    }
    scheduleNextSpawn();
}

window.addEventListener('load', function() {
    const tutorialModal = document.getElementById("tutorialModal");
    tutorialModal.classList.add("active");

    startHealthRegeneration();

    const backgroundMusic = document.getElementById("backgroundMusic");
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(() => {});
        document.addEventListener('click', function startMusic() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(error => console.error("Audio playback blocked:", error));
            }
            document.removeEventListener('click', startMusic);
        }, { once: true });
    }

    enhanceUIResponsiveness();
    document.getElementById('hero').addEventListener('click', heroClick);
});

// ---------------------------
// Timed Global Buff Events
// ---------------------------
let globalBuffActive = false;
let globalBuffMultiplier = 2; // Double gains
let globalBuffDuration = 30 * 1000; // 30 seconds
let globalBuffInterval = 10 * 60 * 1000; // Every 10 minutes

const originalCurrentGoldGain = currentGoldGain;

function buffedCurrentGoldGain(amount) {
  let base = originalCurrentGoldGain(amount);
  return globalBuffActive ? Math.floor(base * globalBuffMultiplier) : base;
}

// Reassign currentGoldGain to a wrapper
currentGoldGain = function(amount) {
  return buffedCurrentGoldGain(amount);
};

function startGlobalBuff() {
  if (globalBuffActive) return; 
  globalBuffActive = true;
  showNotification('💫 A mystic aura surrounds you! Gains are doubled for 30s!', 'achievement');
  setTimeout(() => {
    globalBuffActive = false;
    showNotification('💫 The mystic aura fades away.', 'info');
  }, globalBuffDuration);
}

setInterval(startGlobalBuff, globalBuffInterval);

// ---------------------------
// Pet Companion Mechanic
// ---------------------------
let petOwned = false;
let petHealthRegenBonus = 1; // +1 HP/s regen
let petXpBoost = 0.1;       // 10% XP boost per click

const buyPetButton = document.getElementById('buyPetButton');
const petStatus = document.getElementById('petStatus');

buyPetButton.addEventListener('click', () => {
  if (petOwned) {
    showNotification('❗ You already have a pet!', 'error');
    return;
  }
  if (gold < 5000) {
    showNotification('❗ Not enough gold to adopt a pet!', 'error');
    return;
  }
  gold -= 5000;
  petOwned = true;
  petStatus.textContent = 'You have adopted a cute critter! It boosts your health regen and XP.';
  updateStats();
  showNotification('🐾 A pet joins your journey, boosting your abilities!', 'success');
});

const originalGainExperience = gainExperience;
gainExperience = function(amount) {
  let finalAmount = amount;
  if (petOwned) {
    finalAmount = Math.floor(finalAmount * (1 + petXpBoost));
  }
  originalGainExperience(finalAmount);
};

const originalHealthRegenFunction = startHealthRegeneration;
startHealthRegeneration = function() {
  if (!healthRegenInterval) {
    healthRegenInterval = setInterval(() => {
      if (!idleMode) {
        let totalRegen = healthRegenRate;
        const healthRegenUpgrade = upgrades.find(u => u.type === 'healthRegen');
        if (healthRegenUpgrade && healthRegenUpgrade.owned > 0) {
          totalRegen += Math.round(maxHealth * 0.02 * healthRegenUpgrade.owned);
        }
        if (petOwned) totalRegen += petHealthRegenBonus;
        health = Math.min(health + totalRegen, maxHealth);
        updateStats();
      }
    }, 1000);
  }
};

// ---------------------------
// Random Weather Events
// ---------------------------
const weathers = [
    { name: 'Sunny', goldMultiplier: 1.2, healthMultiplier: 1, xpMultiplier: 1 },
    { name: 'Rainy', goldMultiplier: 1, healthMultiplier: 0.9, xpMultiplier: 1 },
    { name: 'Foggy', goldMultiplier: 1, healthMultiplier: 1, xpMultiplier: 0.9 },
    { name: 'Stormy', goldMultiplier: 1, healthMultiplier: 0.95, xpMultiplier: 1.1 },
];

let currentWeather = weathers[0];

function applyWeatherEffects() {
  const originalCurrentGoldGainFunc = currentGoldGain;
  currentGoldGain = function(amount) {
    let base = originalCurrentGoldGainFunc(amount);
    return Math.floor(base * currentWeather.goldMultiplier);
  };

  const originalGainExperienceFunc = gainExperience;
  gainExperience = function(amount) {
    let final = Math.floor(amount * currentWeather.xpMultiplier);
    originalGainExperienceFunc(final);
  };

  const originalSpawnMonster = spawnMonster;
  spawnMonster = function() {
    originalSpawnMonster();
    if (monsters.length > 0) {
      let m = monsters[monsters.length - 1];
      m.health = Math.floor(m.health * currentWeather.healthMultiplier);
      const mh = document.getElementById(`monsterHealth${m.id}`);
      if(mh) mh.textContent = m.health;
    }
  };
}

function changeWeather() {
  const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
  currentWeather = newWeather;
  showNotification(`🌦 The weather changed to ${newWeather.name}!`, 'achievement');
}

// Change weather every 5 minutes
setInterval(changeWeather, 5 * 60 * 1000);
// Apply effects once at startup
applyWeatherEffects();

// ---------------------------
// Artifact Discovery System
// ---------------------------
const artifacts = [];
const artifactTypes = [
  { name: 'Ancient Coin', effect: 'Gold gain +1%' },
  { name: 'Crystal Feather', effect: 'XP gain +1%' },
  { name: 'Obsidian Shard', effect: 'Attack Power +1' },
  { name: 'Emerald Leaf', effect: 'Defense +1' },
  { name: 'Ruby Heart', effect: 'Max Health +5' }
];

function applyArtifacts() {
  let goldBoost = 0;
  let xpBoost = 0;
  let attackBoost = 0;
  let defenseBoost = 0;
  let healthBoost = 0;

  artifacts.forEach(a => {
    switch(a.name) {
      case 'Ancient Coin': goldBoost += 0.01; break;
      case 'Crystal Feather': xpBoost += 0.01; break;
      case 'Obsidian Shard': attackBoost += 1; break;
      case 'Emerald Leaf': defenseBoost += 1; break;
      case 'Ruby Heart': healthBoost += 5; break;
    }
  });

  attackPower += attackBoost;
  defense += defenseBoost;
  maxHealth += healthBoost;
  health = Math.min(health, maxHealth);

  const originalCurrentGoldGainRef = currentGoldGain;
  currentGoldGain = function(amount) {
    let base = originalCurrentGoldGainRef(amount);
    return Math.floor(base * (1 + goldBoost));
  };

  const originalGainExperienceRef = gainExperience;
  gainExperience = function(amount) {
    let final = Math.floor(amount * (1 + xpBoost));
    originalGainExperienceRef(final);
  };

  updateStats();
}

function discoverArtifact() {
  const found = Math.random() < 0.05; // 5% chance on monster kill
  if (!found) return;
  const artifact = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
  artifacts.push(artifact);
  showNotification(`💎 You found an artifact: ${artifact.name}! ${artifact.effect}`, 'success');
  const artifactList = document.getElementById('artifactList');
  const li = document.createElement('li');
  li.textContent = `${artifact.name} - ${artifact.effect}`;
  artifactList.appendChild(li);

  applyArtifacts();
}

const originalKillMonster = killMonster;
killMonster = function(monster) {
  originalKillMonster(monster);
  if (!monster.isBoss) {
    discoverArtifact();
  }
};

// ---------------------------
// Seasonal Festival Events 🌸🎉
// ---------------------------
const festivals = [
  { name: 'Spring Bloom 🌸', goldReward: 300, xpReward: 30, description: 'Celebrate new life and flowers!' },
  { name: 'Summer Sun ☀️', goldReward: 400, xpReward: 40, description: 'Feel the warmth of the sun!' },
  { name: 'Autumn Harvest 🍂', goldReward: 500, xpReward: 50, description: 'Reap the season\'s bounty!' },
  { name: 'Winter Wonder ❄️', goldReward: 600, xpReward: 60, description: 'Enjoy the snowy festivities!' }
];

let currentFestival = null;
const currentFestivalName = document.getElementById('currentFestivalName');
const festivalInfo = document.getElementById('festivalInfo');
const joinFestivalButton = document.getElementById('joinFestivalButton');

function startRandomFestival() {
  currentFestival = festivals[Math.floor(Math.random() * festivals.length)];
  currentFestivalName.textContent = currentFestival.name;
  festivalInfo.textContent = currentFestival.description;
  joinFestivalButton.disabled = false;
  showNotification(`🎉 A ${currentFestival.name} has begun! Join now for rewards!`, 'achievement');
}

function endFestival() {
  currentFestival = null;
  currentFestivalName.textContent = 'None';
  festivalInfo.textContent = 'No festival at the moment.';
  joinFestivalButton.disabled = true;
}

joinFestivalButton.addEventListener('click', () => {
  if (!currentFestival) return;
  gold += currentFestival.goldReward;
  gainExperience(currentFestival.xpReward);
  updateStats();
  showNotification(`🌟 You joined the ${currentFestival.name}! +${currentFestival.goldReward} Gold, +${currentFestival.xpReward} XP`, 'success');
  endFestival();
});

// Festivals occur every hour
setInterval(startRandomFestival, 60 * 60 * 1000);
// Start one shortly after page load for demo (e.g. after 30 seconds)
setTimeout(startRandomFestival, 30 * 1000);

// ---------------------------
// Player Titles 🎗️
// ---------------------------
const playerTitleElement = document.getElementById('playerTitle');

function updatePlayerTitle() {
  let title = 'Novice 👶';
  if (level >= 100) {
    title = 'Legendary Hero 🏆';
  } else if (level >= 50) {
    title = 'Epic Adventurer ⚔️';
  } else if (level >= 20) {
    title = 'Seasoned Warrior 🛡️';
  } else if (level >= 10) {
    title = 'Rising Star ⭐';
  }
  playerTitleElement.textContent = title;
}

const originalLevelUpFunc = levelUp;
levelUp = function() {
  originalLevelUpFunc();
  updatePlayerTitle();
};

window.addEventListener('load', updatePlayerTitle);
