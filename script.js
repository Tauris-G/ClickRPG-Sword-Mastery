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
let spells = []; // Array to store active spells, initially empty


let totalClicks = 0;
let defenseUpgrades = 0;
let healthUpgrades = 0;
let autoClickPurchased = false;
let bossesDefeated = 0;
let monstersDefeated = 0;
let deaths = 0;

let synergyForged = false;
let prestigeCount = 0; 

// Combo system variables
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
    luck: 1750
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
    { id: 9, type: 'shield', name: 'Shield', cost: baseUpgradeCosts.shield, effect: 'Reduce incoming damage by 2.', owned: 0 },
    { id: 10, type: 'luck', name: 'Luck Enhancement', cost: baseUpgradeCosts.luck, effect: 'Increase gold gain by 15%.', owned: 0 },
    { id: 11, type: 'healthRegen', name: 'Health Regeneration Boost', cost: 1000, effect: 'Increase health regeneration by 2% of max health per second.', owned: 0 }
];


const swords = [
    { id: 1, name: 'Stick of Fury 🪵', cost: 300, damage: 2, description: 'A sturdy stick with fury.', owned: false },
    { id: 2, name: 'Rusty Blade 🗡️', cost: 900, damage: 5, description: 'A rusty blade, surprisingly effective.', owned: false },
    { id: 3, name: 'Goblin\'s Gleam 🗡️👹', cost: 2250, damage: 10, description: 'A gleaming sword from goblins.', owned: false },
    { id: 4, name: 'Dragon\'s Tooth Sabre 🐉🗡️', cost: 4500, damage: 20, description: 'A sabre made from a dragon tooth.', owned: false },
    { id: 5, name: 'Legendary Lightbringer 🌟🗡️', cost: 9000, damage: 50, description: 'A legendary sword of light.', owned: false },
    { id: 6, name: 'Shadow Dagger 🗡️🌑', cost: 10800, damage: 60, description: 'Forged in dark shadows.', owned: false },
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
    { name: 'Slimey McSlimeface 🟢', health: 40, attack: 4, emoji: '🟢', isMagic: false },
    { name: 'Gobblin Giggles 👺', health: 60, attack: 6, emoji:'👺'},
    { name: 'Orcward the Awkward 🐗', health:100, attack:10, emoji:'🐗'},
    { name: 'Trolltastic the Troll 🧌', health:160, attack:16, emoji:'🧌'},
    { name: 'Dragzilla the Dazzling 🐉', health:300, attack:30, emoji:'🐉'},
    { name: 'Bashful Blob 🤖', health:50, attack:4, emoji:'🤖'},
    { name: 'Sneaky Sneaker 🕵️', health:70, attack:8, emoji:'🕵️'},
    { name: 'Vampire Vex 🧛‍♂️', health: 120, attack: 12, emoji: '🧛‍♂️', isMagic: true },
    { name: 'Werewolf Wally 🐺', health: 140, attack: 14, emoji: '🐺', isMagic: false },
    { name: 'Zombie Zed 🧟‍♂️', health:80, attack:8, emoji:'🧟‍♂️'},
    { name: 'Ghostly Gary 👻', health: 90, attack: 9, emoji: '👻', isMagic: true },
    { name: 'Skeleton Sam 💀', health:70, attack:6, emoji:'💀'},
    { name: 'Cyclops Carl 👁️', health: 180, attack: 18, emoji: '👁️', isMagic: false },
    { name: 'Giant Grog 🦍', health:240, attack:24, emoji:'🦍'},
    { name: 'Lizard Lord 🦎', health:110, attack:11, emoji:'🦎'},
    { name: 'Harpy Hannah 🦅', health:100, attack:10, emoji:'🦅'},
    { name: 'Mummy Mike 🧱', health:130, attack:13, emoji:'🧱'},
    { name: 'Demon Drake 🐉', health: 200, attack: 20, emoji: '🐉', isMagic: true },
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
    { name: 'Specter Steve 👻', health: 120, attack: 12, emoji: '👻', isMagic: true },
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
    attackInterval: null // Nauja savybė atkūrimo atakoms
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

function initializeGame() {
    initializeAchievements();
    initializeUpgrades();
    initializeSwords();
    initializeShields();
    updateStats();
    updateAchievements();
    renderLoadedMonsters();
    delayedMonsterSpawn(); // Start delayed spawn when the game initializes
    startPassiveIncome();
    initializeQuests();
    updateComboDisplay();
    startHealthRegeneration(); // Start health regeneration at the beginning
}


function startGame() {
    const modal = document.getElementById("tutorialModal");
    modal.classList.remove("active");
    gamePaused = false;
    initializeGame();
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

let notificationQueue=[];
const maxNotifications=3;
let activeNotifications = new Set();

function showNotification(message, type) {
    // Jei notifikacija jau aktyvi, nieko nedarome
    if (activeNotifications.has(message)) return;

    const notificationArea = document.getElementById('notificationArea');
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Pridėkime papildomus stilius pagal tipą
    if (type === 'critical') notification.classList.add('critical');
    if (type === 'achievement') notification.classList.add('achievement');
    if (type === 'success') notification.classList.add('success');
    if (type === 'error') notification.classList.add('error');
    if (type === 'victory') notification.classList.add('victory');
    
    notification.textContent = message;
    notificationArea.appendChild(notification);
    activeNotifications.add(message);

    // Pašaliname notifikaciją po 3 sekundžių
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

function currentCriticalHitChance(){
    const critUpg=upgrades.find(u=>u.type==='criticalHit').owned;
    const chance=0.15+(0.03*critUpg);
    return Math.random()<chance;
}

function currentExperienceGain(){
    const expUpg=upgrades.find(u=>u.type==='experienceBoost').owned;
    return 1+(2*expUpg);
}

function currentGoldGain(amount) {
    const goldMult = upgrades.find(u => u.type === 'goldMultiplier').owned;
    const luckMult = upgrades.find(u => u.type === 'luck').owned;
    const comboMultiplier = 1 + (0.05 * comboCount); // Sumažintas bonusas iš kombinacijų
    const prestigeMultiplier = 1 + (prestigeCount * 0.05); // Mažesnis prestižo bonusas
    return Math.floor(amount * (1 + (1.5 * goldMult)) * (1 + (0.1 * luckMult)) * comboMultiplier * prestigeMultiplier);
}

function gainExperience(amount) {
    const levelSpeedMultiplier = 2; // Didesnis greitis lygiams
    const xpMultiplier = level >= 10 ? 2 : 1; // Dviguba XP nuo 10 lygio
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


function levelUp() {
    level++;
    expToNext = Math.floor(expToNext * 1.25); // Arba kitoks lygių skalavimas
    playSound(document.getElementById('levelUpSound'));
    showLevelUpModal();
    checkAchievements();

    if (level % 5 === 0) scaleMonsters();

    // Specialios notifikacijos tam tikruose lygmenyse
    showLevelMilestoneNotification(); // Kvietimas naujai funkcijai

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

    // Add health regeneration rate to stats display
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

        // Apply effects based on upgrade type
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
                // Health regeneration increase is handled in `startHealthRegeneration`
                break;
        }

        updateStats();
        playSound(document.getElementById('upgradeSound'));
        showNotification(`${upg.name} purchased!`, 'success');

        // Increase the cost for the next purchase
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

function scaleMonsters() {
    monsters.forEach(m => {
        m.health = Math.floor(m.health * (1.3 + level * 0.01)); // Sunkesniems lygiams didesnis sveikatos augimas
        m.attack = Math.floor(m.attack * (1.2 + level * 0.01)); // Mažesnis žalos augimas
        const healthSpan = document.getElementById(`monsterHealth${m.id}`);
        if (healthSpan) healthSpan.textContent = m.health;
        const attackSpan = document.getElementById(`monsterAttack${m.id}`);
        if (attackSpan) attackSpan.textContent = m.attack;
    });
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
        case 18:return bossesDefeated>=1&&swords.every(s=>s.owned);
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



function renderLoadedMonsters(){
    const monstersContainer=document.getElementById('monstersContainer');
    monstersContainer.innerHTML='';
    monsters.forEach(monster=>{
        renderMonster(monster);
        scheduleMonsterAttack(monster);
        scheduleMonsterSpell(monster);
    });
}

function loadGame(){
    const savedState = localStorage.getItem('goldyMcGoldfaceSave');
    if(savedState){
        const gameState = JSON.parse(savedState);
        gold = gameState.gold || 0;
        level = gameState.level || 1;
        experience = gameState.experience || 0;
        expToNext = gameState.expToNext || 10;
        attackPower = 1;
        defense = gameState.defense || 1;
        health = gameState.health || 100;
        maxHealth = gameState.maxHealth || 100;
        passiveIncome = gameState.passiveIncome || 0;
        lives = gameState.lives || 3;
        upgradeCosts = gameState.upgradeCosts || { ...baseUpgradeCosts };
        quests.forEach((q, i) => {
            quests[i] = gameState.quests[i];
        });
        upgrades.forEach((upg, index) => {
            upgrades[index].owned = gameState.upgrades[index].owned;
            if(upg.type !== 'autoClick'){
                if(upgrades[index].owned > 0){
                    const upgradeButton = document.getElementById(`upgrade${upg.id}`).querySelector('button');
                    upgradeButton.innerHTML = `${upg.name} (Owned: ${upg.owned}) - Cost: <span id="upgradeCost${upg.id}">${upgradeCosts[upg.type]}</span> 💰`;
                    if(upg.type === 'defense') defenseUpgrades = upgrades[index].owned;
                    if(upg.type === 'health') healthUpgrades = upgrades[index].owned;
                }
            } else {
                if(gameState.autoClickPurchased){
                    upgrades[index].owned = 1;
                    autoClickPurchased = true;
                    const upgradeButton = document.getElementById(`upgrade${upg.id}`).querySelector('button');
                    upgradeButton.disabled = true;
                    upgradeButton.textContent = 'Owned ✅';
                    passiveIncome += 10;
                }
            }
        });
        swords.forEach((sw, index) => {
            swords[index].owned = Boolean(gameState.swords[index].owned);
            if(sw.owned){
                const swordButton = document.getElementById(`sword${sw.id}`).querySelector('button');
                swordButton.disabled = true;
                swordButton.textContent = 'Owned ✅';
            }
        });
        recalculateAttackPower();
        monsters = gameState.monsters || [];
        monsterId = gameState.monsterId || 1;
        monstersDefeated = gameState.monstersDefeated || 0;
        bossesDefeated = gameState.bossesDefeated || 0;
        currentBoss = gameState.currentBoss || null;
        achievements.forEach((ach, index) => {
            achievements[index].achieved = gameState.achievements[index].achieved;
            if(achievements[index].achieved){
                const achDiv = document.getElementById(`achievement${ach.id}`);
                achDiv.classList.remove('locked');
                achDiv.innerHTML = `<span class="icon">✅</span><div><strong>${ach.name}</strong><br>${ach.description}</div>`;
            }
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
        
        // Pradedame atkūrimo atakų ciklą tik jei bossas yra gyvas
        if(currentBoss){
            const boss = monsters.find(m => m.id === currentBoss.id);
            if(boss){
                currentBoss = boss; // Atnaujiname currentBoss su atitinkamu monstru
                startBossAttackLoop(boss);
            } else {
                currentBoss = null;
            }
        }
        
        // ĮVESKITE ŠIĄ EILUTĘ, kad žaidimas būtų nepaused po įkėlimo
        gamePaused = false;

        initializeQuests();
        // ... Po visų žaidimo būsenos atstatymo operacijų
updateComboDisplay();
gamePaused = false; // Pridėkite šią eilutę

        showNotification('📂 Game Loaded!','success');

        if(level >= 100 && swords.every(s => s.owned)){
            showVictoryModal();
        }

    } else {
        showNotification('❗ No saved game found.','error');
    }
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
            const upgradeButton=document.getElementById(`upgrade${upg.id}`).querySelector('button');
            if(upg.type!=='autoClick'){
                upgradeButton.innerHTML=`${upg.name} (Owned: ${upg.owned}) - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`;
            } else {
                upgradeButton.disabled=false;
                upgradeButton.innerHTML=`${upg.name} - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`;
            }
        });

        swords.forEach(s=>{
            s.owned=false;
            const swordButton=document.getElementById(`sword${s.id}`).querySelector('button');
            swordButton.disabled=false;
            swordButton.innerHTML=`Buy (Cost: <span id="swordCost${s.id}">${s.cost}</span> 💰)`;
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
        const achievementsList=document.getElementById('achievementsList');
        achievementsList.innerHTML='';
        initializeAchievements();

        const monstersContainer=document.getElementById('monstersContainer');
        monstersContainer.innerHTML='';
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
    
    if (!backgroundMusic) {
        console.error("Audio element not found!");
        return;
    }
    
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
    const heroClickEffect=document.createElement('div');
    heroClickEffect.className='hero-pixel-click-effect';
    gameContainer.appendChild(heroClickEffect);
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
        const comboHealthRegen = Math.round(maxHealth * 0.02); // 2% regeneracija už kiekvieną combo > 3
        health = Math.min(health + comboHealthRegen, maxHealth);
        updateStats();
        showNotification(`🔥 Combo Health Regen: +${comboHealthRegen} health!`, 'success');
    }
}

function spawnMonster() {
    const randomType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    const healthMultiplier = 1 + (level * 0.05) + (attackPower * 0.02); // Mažesnis sveikatos skalavimas
    const attackMultiplier = 1 + (defense * 0.01) + (level * 0.05); // Mažesnis žalos skalavimas

    const newMonster = {
        id: monsterId,
        name: `${randomType.name} (Lv. ${level})`,
        health: Math.max(1, Math.round(randomType.health * healthMultiplier)),
        attack: Math.max(1, Math.round(randomType.attack * attackMultiplier)),
        emoji: randomType.emoji,
        isBoss: false,
        attackTimeout: null
    };

    monsters.push(newMonster);
    renderMonster(newMonster);
    scheduleMonsterAttack(newMonster);
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

    // Update attack button state for Idle Mode
    updateIdleModeUI();
}


function getMonsterSpawnInterval() {
    if (level <= 10) {
        return Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000; // Greičiau, bet ne per greitai
    } else if (level <= 20) {
        return Math.floor(Math.random() * (40000 - 30000 + 1)) + 30000;
    } else {
        return Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
    }
}


function attackMonster(monsterId) {
    if (idleMode) {
        showNotification("❌ You can't attack while in Idle Mode!", 'error');
        return; // Stop the function if Idle Mode is active
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
        
        // Išvalome atkūrimo atakų ciklą
        if(monster.attackInterval){
            clearInterval(monster.attackInterval);
            monster.attackInterval = null;
        }
        
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
    const damage = Math.max(Math.round(monster.attack - (2 * shieldUpgrades)), 0);

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



function removeMonster(monster){
    clearMonsterIntervals(monster);
    
    // Jei pašalinamas monstras yra bosas, atstatome currentBoss į null ir išvalome atkūrimo atakų ciklą
    if(monster.isBoss && currentBoss && currentBoss.id === monster.id) {
        if(monster.attackInterval){
            clearInterval(monster.attackInterval);
            monster.attackInterval = null;
        }
        currentBoss = null;
    }
    
    monsters = monsters.filter(m => m.id !== monster.id);
    const monsterDiv = document.getElementById(`monster${monster.id}`);
    if(monsterDiv) monsterDiv.remove();
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
function scheduleMonsterAttack(monster) {
    if (monster.attackTimeout) {
        clearInterval(monster.attackTimeout); // Clear any existing interval to avoid duplication
    }

    monster.attackTimeout = setInterval(() => {
        // Check if the monster is still alive and in the game
        if (!gamePaused && !idleMode && monsters.includes(monster)) {
            attackPlayer(monster); // Trigger the player's health reduction
        } else if (idleMode) {
            clearInterval(monster.attackTimeout); // Stop attacks in Idle Mode
            monster.attackTimeout = null;
        }
    }, Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000); // Random delay for attack
}

function scheduleMonsterSpell(monster) {
    if (!monster.isBoss) {
        const spellDelay = Math.floor(Math.random() * (12000 - 8000 + 1)) + 8000;
        monster.spellTimeout = setTimeout(() => {
            if (!gamePaused && monsters.includes(monster)) {
                castSpell(monster);
                scheduleMonsterSpell(monster); // Iš naujo suplanuojame burtą
            }
        }, spellDelay);
    }
}

function castSpell(monster) {
    if (!monster) return;

    // Spell damage: 80% of monster's attack
    const spellDamage = Math.max(1, Math.floor(monster.attack * 0.8));
    health -= spellDamage;

    // Show spell damage animation and notifications
    showDamageAnimation(spellDamage, 'home');
    playSound(document.getElementById('spellCastSound'));
    showNotification(`✨ ${monster.name} cast a spell for ${spellDamage} damage!`, 'error');

    // Check player health and lives
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
    setTimeout(() => (spellCooldown = false), 3000); // 3-second cooldown

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



function handleGameOver(){
    showGameOverModal();
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
    console.log("[DEBUG] initializeQuests called.");
    const questsList=document.getElementById('questsList');
    questsList.innerHTML='';
    quests.forEach(q=>{
        const conditionMet=checkQuestCondition(q);
        console.log(`[DEBUG] Rendering quest: ${q.name}, level: ${q.level}, conditionMet: ${conditionMet}`);
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
    const goalScaling = 1.5; // Didiname tikslų reikalavimus
    return Math.ceil(q.baseGoal * Math.pow(goalScaling, q.level));
}

function getQuestGoldReward(q) {
    const rewardScaling = 1.3; // Lėčiau augantys apdovanojimai
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

function spawnMonsterRandomly() {
    if (gamePaused || idleMode) return; // Prevent spawning in Idle Mode
    const monstersToSpawn = Math.min(1 + Math.floor(level / 10), 10); // Spawn limit

    for (let i = 0; i < monstersToSpawn; i++) {
        spawnMonster();
    }

    function scheduleNextSpawn() {
        const interval = getMonsterSpawnInterval();
        setTimeout(() => {
            if (!gamePaused && !idleMode) { // Skip if Idle Mode is active
                spawnMonsterRandomly();
                scheduleNextSpawn();
            }
        }, interval);
    }

    scheduleNextSpawn();
}

function spawnBoss(isLevelBased = false) {
    if (currentBoss) return; // Prevent multiple bosses from appearing at the same time

    if (level < 30) {
        console.log("[DEBUG] Bosses cannot spawn before level 30.");
        return; // Exit if the level is below 30
    }

    // Adjust boss health and attack scaling
    const bossHealthBase = isLevelBased ? (300 + (level * 150)) : 300; // Adjust health scaling
    const bossAttackBase = isLevelBased ? (5 + (level * 2)) : 5; // Lower attack scaling

    const boss = {
        id: 500 + bosses.length,
        name: `Boss ${bosses.length + 1}`,
        health: Math.round(bossHealthBase + (attackPower * 2)), // Adjust health multiplier
        attack: Math.round(bossAttackBase + (defense * 1)), // Adjust attack multiplier
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

    const finalBoss = {
        ...finalBoss, 
        id: 999,
        health: 200000,
        attack: 99,
        attackTimeout: null,
        isBoss: true,
        isFinal: true
    };

    currentBoss = finalBoss;
    monsters.push(currentBoss);

    renderMonster(currentBoss);
    scheduleMonsterAttack(currentBoss);
    showNotification(`⚠️ Final Boss Appears: ${currentBoss.name}!`, 'achievement');
}


function startBossAttackLoop(boss) {
    const attackInterval = 5000; // Atakuoja kas 5 sekundes
    // Naudojame setInterval ir saugome interval ID boss objekte
    boss.attackInterval = setInterval(() => {
        if(currentBoss && currentBoss.id === boss.id){
            attackPlayer(boss);
        }
    }, attackInterval);
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

        swords.forEach(s=>{
            s.owned=false;
        });

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

window.addEventListener('load', function() {
    const tutorialModal = document.getElementById("tutorialModal");
    tutorialModal.classList.add("active");

    const backgroundMusic = document.getElementById("backgroundMusic");
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(() => {}); // Pradinis bandymas
        document.addEventListener('click', function startMusic() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(error => console.error("Audio playback blocked:", error));
            }
            document.removeEventListener('click', startMusic); // Pašalinamas įvykis po pirmo paspaudimo
        }, { once: true });
    }

    enhanceUIResponsiveness();
    document.getElementById('hero').addEventListener('click', heroClick);
});

window.addEventListener('load', function() {
    const tutorialModal = document.getElementById("tutorialModal");
    tutorialModal.classList.add("active");

    startHealthRegeneration(); // Pradėti sveikatos regeneraciją

    const backgroundMusic = document.getElementById("backgroundMusic");
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(() => {}); // Pradinis bandymas
        document.addEventListener('click', function startMusic() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(error => console.error("Audio playback blocked:", error));
            }
            document.removeEventListener('click', startMusic); // Pašalinamas įvykis po pirmo paspaudimo
        }, { once: true });
    }

    enhanceUIResponsiveness();
    document.getElementById('hero').addEventListener('click', heroClick);
});
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
        effect: 'Reduces incoming damage by 2%.',
        owned: false,
        emoji: '🛡️'
    },
    {
        id: 2,
        name: 'Iron Shield 🛡️🪓',
        cost: 1500,
        defense: 5,
        description: 'A strong shield made of iron, perfect for defense.',
        effect: 'Adds a 10% chance to block damage completely.',
        owned: false,
        emoji: '🛡️🪓'
    },
    {
        id: 3,
        name: 'Golden Shield 🛡️✨',
        cost: 5000,
        defense: 10,
        description: 'A luxurious shield offering excellent protection.',
        effect: 'Reflects 5% of incoming damage back to the attacker.',
        owned: false,
        emoji: '🛡️✨'
    },
    {
        id: 4,
        name: 'Crystal Barrier 🛡️🔷',
        cost: 10000,
        defense: 15,
        description: 'A mystical shield infused with crystal energy.',
        effect: 'Reduces magic damage by 20%.',
        owned: false,
        emoji: '🛡️🔷'
    },
    {
        id: 5,
        name: 'Phoenix Guard 🛡️🔥',
        cost: 20000,
        defense: 20,
        description: 'A shield imbued with the spirit of the phoenix.',
        effect: 'Regenerates 5 health per second.',
        owned: false,
        emoji: '🛡️🔥'
    },
    {
        id: 6,
        name: 'Shadow Aegis 🛡️🌑',
        cost: 35000,
        defense: 25,
        description: 'A shield forged from the shadows.',
        effect: '15% chance to dodge all incoming attacks.',
        owned: false,
        emoji: '🛡️🌑'
    },
    {
        id: 7,
        name: 'Stormwall Shield 🛡️⚡',
        cost: 50000,
        defense: 30,
        description: 'A shield that channels the power of storms.',
        effect: 'Stuns attackers for 1 second upon hit.',
        owned: false,
        emoji: '🛡️⚡'
    },
    {
        id: 8,
        name: 'Dragon Scale 🛡️🐉',
        cost: 75000,
        defense: 40,
        description: 'An ancient shield made from dragon scales.',
        effect: 'Increases attack power by 10% while equipped.',
        owned: false,
        emoji: '🛡️🐉'
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
            <span class="icon">${shield.emoji}</span>
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

        // Aktyvuojame skydo efektą pagal ID
        switch (shieldId) {
            case 4:
                addCrystalBarrierEffect();
                break;
            case 5:
                addPhoenixGuardEffect();
                break;
            case 6:
                addShadowAegisEffect();
                break;
            case 7:
                addStormwallShieldEffect();
                break;
            case 8:
                addDragonScaleEffect();
                break;
        }

        updateStats();
        playSound(document.getElementById('upgradeSound'));
        showNotification(`Purchased Shield: ${shield.name}`, 'success');
        initializeShields();
    } else {
        showNotification('❗ Not enough gold!', 'error');
    }
}

function addIronShieldEffect() {
    // Pridėkite 10% šansą blokuoti žalą
    const originalAttackPlayer = attackPlayer;
    attackPlayer = function (monster) {
        if (Math.random() < 0.1) {
            showNotification('🛡️ Iron Shield Blocked the Damage!', 'success');
        } else {
            originalAttackPlayer(monster);
        }
    };
}

function addGoldenShieldEffect() {
    // Pridėkite 5% žalą atgal puolėjui
    const originalAttackMonster = attackMonster;
    attackMonster = function (monsterId) {
        const monster = monsters.find(m => m.id === monsterId);
        if (!monster) return;
        
        const reflectedDamage = Math.round(monster.attack * 0.05);
        if (reflectedDamage > 0) {
            monster.health -= reflectedDamage;
            showNotification(`✨ Golden Shield Reflected ${reflectedDamage} Damage!`, 'success');
        }

        originalAttackMonster(monsterId);
    };
}

function addCrystalBarrierEffect() {
    // Sumažiname magijos žalą
    const originalAttackPlayer = attackPlayer;
    attackPlayer = function (monster) {
        const isMagicDamage = Math.random() < 0.2; // Pvz., 20% monstro atakų yra magiškos
        const damageReduction = isMagicDamage ? monster.attack * 0.2 : 0;

        health -= Math.round(monster.attack - damageReduction);
        if (isMagicDamage) {
            showNotification('🔷 Crystal Barrier reduced magic damage!', 'success');
        }

        updateStats();
    };
}

function addPhoenixGuardEffect() {
    // Atkuriame 5 sveikatos taškus kas sekundę
    setInterval(() => {
        if (!gamePaused) {
            const regenAmount = 5;
            health = Math.min(maxHealth, health + regenAmount);
            updateStats();
            showNotification('🔥 Phoenix Guard restored 5 health!', 'success');
        }
    }, 1000);
}

function addShadowAegisEffect() {
    // Suteikiame šansą išvengti atakos
    const originalAttackPlayer = attackPlayer;
    attackPlayer = function (monster) {
        if (Math.random() < 0.15) {
            showNotification('🌑 Shadow Aegis dodged the attack!', 'success');
        } else {
            originalAttackPlayer(monster);
        }
    };
}

function addStormwallShieldEffect() {
    // Sustabdome monstro ataką trumpam
    const originalAttackMonster = attackMonster;
    attackMonster = function (monsterId) {
        const monster = monsters.find(m => m.id === monsterId);
        if (!monster) return;

        const stunChance = Math.random() < 0.1; // Pvz., 10% šansas
        if (stunChance) {
            monster.attackTimeout = null; // Laikinai sustabdome monstrą
            showNotification('⚡ Stormwall Shield stunned the attacker!', 'success');
        }

        originalAttackMonster(monsterId);
    };
}

function addDragonScaleEffect() {
    // Padidiname puolimo galią 10%
    attackPower *= 1.1;
    updateStats();
    showNotification('🐉 Dragon Scale boosted attack power by 10%!', 'success');
}

function castFreezeSpell(monsterId) {
    const monster = monsters.find(m => m.id === monsterId);
    if (!monster) {
        showNotification('❌ Monster not found!', 'error');
        return;
    }

    // Reduce monster attack for 5 seconds
    const originalAttack = monster.attack;
    monster.attack = Math.max(1, monster.attack - 5);
    showNotification(`❄️ ${monster.name} is frozen and attacks are weakened!`, 'success');

    // Revert attack after 5 seconds
    setTimeout(() => {
        monster.attack = originalAttack;
        showNotification(`❄️ Freeze effect on ${monster.name} has ended.`, 'info');
    }, 5000);
}

function startHealthRegeneration() {
    if (!healthRegenInterval) {
        healthRegenInterval = setInterval(() => {
            if (!idleMode) { // Regenerate health only if not in Idle Mode
                let totalRegen = healthRegenRate; // Base regeneration

                // Check if the healthRegen upgrade is owned and apply its effect
                const healthRegenUpgrade = upgrades.find(u => u.type === 'healthRegen');
                if (healthRegenUpgrade && healthRegenUpgrade.owned > 0) {
                    totalRegen += Math.round(maxHealth * 0.02 * healthRegenUpgrade.owned);
                }

                // Apply regeneration, ensuring it doesn't exceed maxHealth
                health = Math.min(health + totalRegen, maxHealth);
                updateStats();
            }
        }, 1000); // Regenerates every second
    }
}
function debugSpellSystem() {
    console.log('--- Spell System Debug ---');
    console.log('Monsters:', monsters);
    console.log('Current Boss:', currentBoss);
    console.log('Health:', health, '/', maxHealth);
    console.log('Lives:', lives);
    console.log('Attack Power:', attackPower);
    console.log('--- End Debug ---');
}

function delayedMonsterSpawnWithCountdown() {
    let countdown = 60; // Set the countdown duration in seconds

    // Create and update the countdown notification every 10 seconds
    const countdownInterval = setInterval(() => {
        if (countdown > 0) {
            if (countdown % 10 === 0) {
                showNotification(`Monsters coming in ${countdown} seconds...`, 'info');
            }
            countdown--;
        } else {
            clearInterval(countdownInterval); // Stop the countdown
            spawnMonsterRandomly(); // Spawn monsters after countdown ends
            showNotification(`👾 Monsters have arrived!`, 'achievement');
        }
    }, 1000); // 1-second interval
}

// Call this function to start the countdown
delayedMonsterSpawnWithCountdown();

let idleMode = false; // Default is active gameplay

function toggleIdleMode() {
    idleMode = !idleMode; // Toggle Idle Mode state

    if (idleMode) {
        // Activate Idle Mode
        gamePaused = true; // Pause active gameplay
        pauseMonsterAttacks(); // Pause monster attacks
        stopHealthRegeneration(); // Stop health regeneration
        showNotification("🌙 Idle Mode activated! Monsters will stop attacking.", 'info');
    } else {
        // Deactivate Idle Mode
        gamePaused = false; // Resume active gameplay
        resumeMonsterAttacks(); // Resume monster attacks
        startHealthRegeneration(); // Restart health regeneration
        showNotification("⚔️ Back to action mode! Monsters will resume attacks.", 'info');
    }

    updateIdleModeUI(); // Update the UI to reflect Idle Mode state
}

function pauseMonsterAttacks() {
    monsters.forEach(monster => {
        if (monster.attackTimeout) {
            clearInterval(monster.attackTimeout); // Clear the attack interval
            monster.attackTimeout = null; // Mark it as paused
        }
    });
}


function clearMonstersAndBosses() {
    // Clear existing monsters
    monsters.forEach(monster => clearMonsterIntervals(monster));
    monsters = [];
    currentBoss = null;

    const monstersContainer = document.getElementById('monstersContainer');
    if (monstersContainer) monstersContainer.innerHTML = ''; // Clear monster visuals
}

let healthRegenInterval;

function stopHealthRegeneration() {
    if (healthRegenInterval) {
        clearInterval(healthRegenInterval);
        healthRegenInterval = null;
    }
}

function updateIdleModeUI() {
    const heroButton = document.getElementById('hero');
    const idleModeToggle = document.getElementById('idleModeToggle');
    const attackButtons = document.querySelectorAll('.attack-button');

    if (idleMode) {
        heroButton.disabled = true; // Disable clicking on the hero
        idleModeToggle.textContent = "Switch to Active Mode";
        attackButtons.forEach(button => button.disabled = true); // Disable all attack buttons
        showNotification("🌙 Idle Mode: You can't attack monsters.", 'info');
    } else {
        heroButton.disabled = false; // Enable clicking on the hero
        idleModeToggle.textContent = "Switch to Idle Mode";
        attackButtons.forEach(button => button.disabled = false); // Enable all attack buttons
        showNotification("⚔️ Active Mode: Attack the monsters!", 'info');
    }
}



function resumeMonsterAttacks() {
    monsters.forEach(monster => {
        if (!monster.attackTimeout) {
            scheduleMonsterAttack(monster); // Reschedule their attack
        }
    });
}
