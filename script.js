'use strict'; 

// Visa žemiau esanti logika iškelta iš HTML failo, sutvarkyta ir optimizuota.
// Čia yra visas žaidimo JavaScript kodas.

// --------------------------------------------------
// Jūsų pateiktas kodas, perkeltas iš HTML po </html> į script.js
// Nieko iš esmės nekeičiam, tik sutvarkom 'use strict' poziciją
// bei patikriname, kad visos funkcijos egzistuoja ir veikia tinkamai.
// --------------------------------------------------

// Dialog Array
const tutorialDialog = [
    "Welcome, young adventurer! 👀 Prepare for an epic journey!",
    "You see, this world is plagued with annoying monsters. 👾",
    "Your task? Click, smash, and slay them all! 🗡️",
    "Gold will rain upon you as you defeat your enemies. 💰",
    "Upgrade your hero, collect powerful swords, and reach level 100! ⚔️",
    "Oh, and don't die. That’s generally bad for adventurers. 💀",
    "Ready? Hit the 'Start Game' button and show these monsters who's boss!"
];
let dialogIndex = 0; // Current dialog line index

// Game Variables and Data
let gamePaused = true; // Game starts in a paused state
let gold = 0;
let level = 1;
let experience = 0;
let expToNext = 10;
let attackPower = 1;
let defense = 1;
let health = 100;
let maxHealth = 100;
let passiveIncome = 0; // Gold per second
let lives = 3; // Player starts with 3 lives

// Click Counters for Achievements
let totalClicks = 0;
let defenseUpgrades = 0;
let healthUpgrades = 0;
let autoClickPurchased = false;
let bossesDefeated = 0;
let deaths = 0;

// Upgrade Costs
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

// Upgrades Data
const upgrades = [
    { id: 1, type: 'attack', name: 'Attack Upgrade I', cost: baseUpgradeCosts.attack, effect: 'Increase Attack Power by 2.', owned: 0 },
    { id: 2, type: 'defense', name: 'Defense Upgrade I', cost: baseUpgradeCosts.defense, effect: 'Increase Defense by 2.', owned: 0 },
    { id: 3, type: 'health', name: 'Health Upgrade I', cost: baseUpgradeCosts.health, effect: 'Increase Max Health by 10.', owned: 0 },
    { id: 4, type: 'autoClick', name: 'Auto-Clicker', cost: baseUpgradeCosts.autoClick, effect: 'Gain 10 gold per second.', owned: false },
    { id: 5, type: 'criticalHit', name: 'Critical Hit', cost: baseUpgradeCosts.criticalHit, effect: '15% chance to deal double damage.', owned: 0 },
    { id: 6, type: 'goldMultiplier', name: 'Gold Multiplier', cost: baseUpgradeCosts.goldMultiplier, effect: 'Increase gold per click by 2.', owned: 0 },
    { id: 7, type: 'experienceBoost', name: 'Experience Boost', cost: baseUpgradeCosts.experienceBoost, effect: 'Gain 3 XP per click.', owned: 0 },
    { id: 8, type: 'monsterSlayer', name: 'Monster Slayer', cost: baseUpgradeCosts.monsterSlayer, effect: 'Deal 3 extra damage to monsters.', owned: 0 },
    { id: 9, type: 'shield', name: 'Shield', cost: baseUpgradeCosts.shield, effect: 'Reduce incoming damage by 2.', owned: 0 },
    { id: 10, type: 'luck', name: 'Luck Enhancement', cost: baseUpgradeCosts.luck, effect: 'Increase gold gain by 15%.', owned: 0 }
];

// Swords Data (30 Swords)
const swords = [
    { id: 1, name: 'Stick of Fury 🪵', cost: 100, damage: 2, description: 'A sturdy stick that slaps enemies with fury.', owned: false },
    { id: 2, name: 'Rusty Blade 🗡️', cost: 300, damage: 5, description: 'An old, rusty blade. Surprisingly effective, increasing attack by 5.', owned: false },
    { id: 3, name: 'Goblin\'s Gleam 🗡️👹', cost: 750, damage: 10, description: 'A gleaming sword stolen from goblins, increasing attack by 10.', owned: false },
    { id: 4, name: 'Dragon\'s Tooth Sabre 🐉🗡️', cost: 1500, damage: 20, description: 'A mighty sabre made from a dragon\'s tooth, increasing attack by 20.', owned: false },
    { id: 5, name: 'Legendary Lightbringer 🌟🗡️', cost: 3000, damage: 50, description: 'The legendary sword that shines with light, increasing attack by 50.', owned: false },
    { id: 6, name: 'Shadow Dagger 🗡️🌑', cost: 3600, damage: 60, description: 'A dagger forged in shadows, granting stealthy attacks.', owned: false },
    { id: 7, name: 'Phoenix Blade 🔥🗡️', cost: 4500, damage: 75, description: 'A blade imbued with phoenix fire, dealing massive damage.', owned: false },
    { id: 8, name: 'Thunderstrike ⚡🗡️', cost: 5400, damage: 90, description: 'A sword that channels the power of thunder.', owned: false },
    { id: 9, name: 'Frostmourne ❄️🗡️', cost: 6300, damage: 105, description: 'A chilling blade that freezes enemies on impact.', owned: false },
    { id: 10, name: 'Venomous Viper 🐍🗡️', cost: 7500, damage: 120, description: 'A sword coated with deadly venom.', owned: false },
    { id: 11, name: 'Celestial Longsword 🌌🗡️', cost: 9000, damage: 140, description: 'A longsword that harnesses celestial energy.', owned: false },
    { id: 12, name: 'Inferno Edge 🔥🗡️', cost: 10500, damage: 160, description: 'An edge that burns with eternal flames.', owned: false },
    { id: 13, name: 'Earthshaker Hammer 🛠️', cost: 12000, damage: 180, description: 'A hammer that can shatter the earth itself.', owned: false },
    { id: 14, name: 'Stormbreaker Blade 🌩️🗡️', cost: 13500, damage: 200, description: 'A blade that breaks storms and enemies alike.', owned: false },
    { id: 15, name: 'Serpent Sword 🐉🗡️', cost: 15000, damage: 220, description: 'A sword resembling a serpent, deadly and swift.', owned: false },
    { id: 16, name: 'Doombringer ⚔️☠️', cost: 16500, damage: 240, description: 'A sword that brings doom to its foes.', owned: false },
    { id: 17, name: 'Eclipse Blade 🌘🗡️', cost: 18000, damage: 260, description: 'A blade that harnesses the power of eclipses.', owned: false },
    { id: 18, name: 'Radiant Saber ✨🗡️', cost: 19500, damage: 280, description: 'A saber that shines with radiant light.', owned: false },
    { id: 19, name: 'Obsidian Edge 🖤🗡️', cost: 21000, damage: 300, description: 'An edge carved from pure obsidian.', owned: false },
    { id: 20, name: 'Mystic Katana 🈶🗡️', cost: 22500, damage: 320, description: 'A katana imbued with mystic energies.', owned: false },
    { id: 21, name: 'Arcane Sword 🔮🗡️', cost: 24000, damage: 340, description: 'A sword filled with arcane magic.', owned: false },
    { id: 22, name: 'Soulstealer Blade 👻🗡️', cost: 25500, damage: 360, description: 'A blade that steals the souls of its victims.', owned: false },
    { id: 23, name: 'Tempest Blade 🌪️🗡️', cost: 27000, damage: 380, description: 'A blade that channels tempestuous winds.', owned: false },
    { id: 24, name: 'Lunar Crescent 🌓🗡️', cost: 28500, damage: 400, description: 'A crescent-shaped blade glowing under moonlight.', owned: false },
    { id: 25, name: 'Solar Flare ☀️🗡️', cost: 30000, damage: 420, description: 'A blade that blazes with solar energy.', owned: false },
    { id: 26, name: 'Void Reaver 🌌🗡️', cost: 31500, damage: 440, description: 'A reaver that draws power from the void.', owned: false },
    { id: 27, name: 'Astral Blade 🌠🗡️', cost: 33000, damage: 460, description: 'A blade that shines with astral light.', owned: false },
    { id: 28, name: 'Nebula Sword 🌫️🗡️', cost: 34500, damage: 480, description: 'A sword adorned with nebular patterns.', owned: false },
    { id: 29, name: 'Galactic Saber 🌌🗡️', cost: 36000, damage: 500, description: 'A saber that embodies the galaxy\'s might.', owned: false },
    { id: 30, name: 'Infinity Blade ♾️🗡️', cost: 37500, damage: 520, description: 'The ultimate blade with infinite power.', owned: false }
];

// Monsters Data (30 Monsters)
const monsterTypes = [
    { name: 'Slimey McSlimeface 🟢', health: 40, attack: 4, emoji: '🟢' },
    { name: 'Gobblin Giggles 👺', health: 60, attack: 6, emoji: '👺' },
    { name: 'Orcward the Awkward 🐗', health: 100, attack: 10, emoji: '🐗' },
    { name: 'Trolltastic the Troll 🧌', health: 160, attack: 16, emoji: '🧌' },
    { name: 'Dragzilla the Dazzling 🐉', health: 300, attack: 30, emoji: '🐉' },
    { name: 'Bashful Blob 🤖', health: 50, attack: 4, emoji: '🤖' },
    { name: 'Sneaky Sneaker 🕵️', health: 70, attack: 8, emoji: '🕵️' },
    { name: 'Vampire Vex 🧛‍♂️', health: 120, attack: 12, emoji: '🧛‍♂️' },
    { name: 'Werewolf Wally 🐺', health: 140, attack: 14, emoji: '🐺' },
    { name: 'Zombie Zed 🧟‍♂️', health: 80, attack: 8, emoji: '🧟‍♂️' },
    { name: 'Ghostly Gary 👻', health: 90, attack: 9, emoji: '👻' },
    { name: 'Skeleton Sam 💀', health: 70, attack: 6, emoji: '💀' },
    { name: 'Cyclops Carl 👁️', health: 180, attack: 18, emoji: '👁️' },
    { name: 'Giant Grog 🦍', health: 240, attack: 24, emoji: '🦍' },
    { name: 'Lizard Lord 🦎', health: 110, attack: 11, emoji: '🦎' },
    { name: 'Harpy Hannah 🦅', health: 100, attack: 10, emoji: '🦅' },
    { name: 'Mummy Mike 🧱', health: 130, attack: 13, emoji: '🧱' },
    { name: 'Demon Drake 🐉', health: 200, attack: 20, emoji: '🐉' },
    { name: 'Banshee Bella 👺', health: 140, attack: 16, emoji: '👺' },
    { name: 'Phoenix Phil 🔥', health: 160, attack: 18, emoji: '🔥' },
    { name: 'Hydra Henry 🐉', health: 220, attack: 22, emoji: '🐉' },
    { name: 'Minotaur Max 🐂', health: 190, attack: 20, emoji: '🐂' },
    { name: 'Kraken Kyle 🐙', health: 260, attack: 26, emoji: '🐙' },
    { name: 'Siren Sally 🧜‍♀️', health: 170, attack: 17, emoji: '🧜‍♀️' },
    { name: 'Gorgon Gina 🐍', health: 150, attack: 15, emoji: '🐍' },
    { name: 'Leviathan Leo 🐉', health: 280, attack: 28, emoji: '🐉' },
    { name: 'Chimera Charlie 🐯', health: 230, attack: 23, emoji: '🐯' },
    { name: 'Behemoth Ben 🐘', health: 250, attack: 25, emoji: '🐘' },
    { name: 'Specter Steve 👻', health: 120, attack: 12, emoji: '👻' },
    { name: 'Giant Goblin Grug 👹', health: 180, attack: 18, emoji: '👹' }
];

// Current Game State
let monsters = [];
let monsterId = 1;
let monstersDefeated = 0; // Counter for defeated monsters

// Boss Data
const bosses = [];
let currentBoss = null;

// Final Boss Data
const finalBoss = {
    id: 999,
    name: 'Titan of the Abyss 🌌👹',
    health: 20000,
    attack: 99,
    emoji: '🌌👹',
    isFinal: true,
    isBoss: true
};

// Achievements Data
const achievements = [
    { id: 1, name: 'First Click', description: 'Click the hero once.', achieved: false },
    { id: 2, name: 'Gold Collector', description: 'Earn 100 gold.', achieved: false },
    { id: 3, name: 'Level Up', description: 'Reach Level 5.', achieved: false },
    { id: 4, name: 'Defensive Master', description: 'Upgrade Defense 5 times.', achieved: false },
    { id: 5, name: 'Health Guru', description: 'Upgrade Health 3 times.', achieved: false },
    { id: 6, name: 'Auto-Clicker', description: 'Purchase Auto-Clicker.', achieved: false },
    { id: 7, name: 'Rich', description: 'Earn 1000 gold.', achieved: false },
    { id: 8, name: 'Ultimate Level', description: 'Reach Level 20.', achieved: false },
    { id: 9, name: 'Defensive Wall', description: 'Upgrade Defense 10 times.', achieved: false },
    { id: 10, name: 'Health is Wealth', description: 'Upgrade Health 10 times.', achieved: false },
    { id: 11, name: 'Sword Master', description: 'Own all 30 swords.', achieved: false },
    { id: 12, name: 'Epic Journey', description: 'Reach Level 50.', achieved: false },
    { id: 13, name: 'Legendary Hero', description: 'Reach Level 100.', achieved: false },
    { id: 14, name: 'Mythical Champion', description: 'Reach Level 150.', achieved: false },
    { id: 15, name: 'Immortal', description: 'Reach Level 200.', achieved: false },
    { id: 16, name: 'Monster Slayer', description: 'Defeat 5 monsters.', achieved: false },
    { id: 17, name: 'Boss Hunter', description: 'Defeat a boss.', achieved: false },
    { id: 18, name: 'Ultimate Conqueror', description: 'Defeat the final boss and own all swords.', achieved: false },
    { id: 19, name: 'Survivor', description: 'Survive 3 deaths.', achieved: false }
];

// --------------------------------------------------
// Initialization and Utility Functions
// --------------------------------------------------

function recalculateAttackPower() {
    attackPower = 1; 
    swords.forEach(sword => {
        if (sword.owned) {
            attackPower += sword.damage;
        }
    });
    updateStats();
}

function initializeAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    achievements.forEach(ach => {
        const achDiv = document.createElement('div');
        achDiv.className = 'achievement locked';
        achDiv.id = `achievement${ach.id}`;
        achDiv.innerHTML = `<span class="icon">🔒</span><div><strong>${ach.name}</strong><br>${ach.description}</div>`;
        achievementsList.appendChild(achDiv);
    });
}

function getUpgradeEmoji(type) {
    switch(type) {
        case 'attack': return '⚔️';
        case 'defense': return '🛡️';
        case 'health': return '❤️';
        case 'autoClick': return '🤖';
        case 'criticalHit': return '⚡';
        case 'goldMultiplier': return '💰';
        case 'experienceBoost': return '📈';
        case 'monsterSlayer': return '👹';
        case 'shield': return '🛡️';
        case 'luck': return '🍀';
        default: return '';
    }
}

function initializeUpgrades() {
    const upgradesList = document.getElementById('upgradesList');
    upgradesList.innerHTML = '';
    upgrades.forEach(upg => {
        const upgDiv = document.createElement('div');
        upgDiv.className = 'achievement';
        upgDiv.id = `upgrade${upg.id}`;
        upgDiv.innerHTML = `
            <span class="icon">🔧</span>
            <div>
                <strong>${upg.name} ${getUpgradeEmoji(upg.type)}</strong><br>
                ${upg.effect}
            </div>
            <button class="upgrade-button" onclick="buyUpgrade('${upg.type}')">
            ${upg.type !== 'autoClick' ? `${upg.name} (Owned: ${upg.owned}) - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰` : `${upg.name} - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`}
            </button>
        `;
        upgradesList.appendChild(upgDiv);
    });
}

function initializeSwords() {
    const swordsList = document.getElementById('swordsList');
    swordsList.innerHTML = '';
    swords.forEach(sword => {
        const swordDiv = document.createElement('div');
        swordDiv.className = 'sword';
        swordDiv.id = `sword${sword.id}`;
        swordDiv.innerHTML = `
            <span class="icon">🗡️</span>
            <div>
                <strong>${sword.name}</strong><br>
                ${sword.description}<br>
                Damage: ${sword.damage} 🗡️
            </div>
            <button class="upgrade-button" onclick="buySword(${sword.id})"> Buy (Cost: <span id="swordCost${sword.id}">${sword.cost}</span> 💰) </button>
        `;
        swordsList.appendChild(swordDiv);
    });
}

function initializeGame() {
    initializeAchievements();
    initializeUpgrades();
    initializeSwords();
    updateStats();
    updateAchievements();
    renderLoadedMonsters();
    spawnMonsterRandomly();
    startPassiveIncome();
}

// Hero Click Event
document.getElementById('hero').addEventListener('click', function (event) {
    if (gamePaused) return;
    totalClicks++;
    let damageDealt = attackPower;
    if (currentCriticalHitChance()) {
        damageDealt *= 2;
        showCriticalHitNotification();
    }
    let goldEarned = currentGoldGain(damageDealt);
    gold += goldEarned;
    updateStats();
    playSound(document.getElementById('clickSound'));
    gainExperience(currentExperienceGain());
    checkAchievements();
    createBloodParticles(event);
    if (monstersDefeated > 0 && monstersDefeated % 5 === 0 && !currentBoss) {
        spawnBoss();
    }
});

// Critical Hit Chance Calculation
function currentCriticalHitChance() {
    const criticalUpgrades = upgrades.find(upg => upg.type === 'criticalHit').owned;
    const chance = 0.15 + (0.03 * criticalUpgrades);
    return Math.random() < chance;
}

// Experience Gain
function currentExperienceGain() {
    const expUpgrades = upgrades.find(upg => upg.type === 'experienceBoost').owned;
    return 1 + (2 * expUpgrades);
}

// Gold Gain
function currentGoldGain(amount) {
    const goldMultiplier = upgrades.find(upg => upg.type === 'goldMultiplier').owned;
    const luckMultiplier = upgrades.find(upg => upg.type === 'luck').owned;
    return amount * (1 + (2 * goldMultiplier)) * (1 + 0.15 * luckMultiplier);
}

// Notification Queue
let notificationQueue = [];
const maxNotifications = 5;

function showNotification(message, type) {
    const notificationArea = document.getElementById('notificationArea');
    if (notificationQueue.length >= maxNotifications) return;
    const notification = document.createElement('div');
    notification.className = 'notification';
    if (type === 'critical') {
        notification.classList.add('critical');
    } else if (type === 'achievement') {
        notification.classList.add('achievement');
    } else if (type === 'success') {
        notification.classList.add('success');
    } else if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'victory') {
        notification.classList.add('victory');
    }
    notification.textContent = message;
    notificationArea.appendChild(notification);
    notificationQueue.push(notification);
    setTimeout(() => {
        notification.remove();
        notificationQueue.shift();
    }, 3000);
}

// Critical Hit Notification Cooldown
let criticalHitNotificationCooldown = false;
function showCriticalHitNotification() {
    if (criticalHitNotificationCooldown) return;
    showNotification('⚡ Critical Hit! Double Damage!', 'critical');
    criticalHitNotificationCooldown = true;
    setTimeout(() => {
        criticalHitNotificationCooldown = false;
    }, 1000);
}

// Blood Particle Effect
function createBloodParticles(event) {
    const bloodContainer = document.getElementById('bloodParticles');
    const numberOfParticles = 20;
    const containerRect = bloodContainer.getBoundingClientRect();
    const clickX = event.clientX - containerRect.left;
    const clickY = event.clientY - containerRect.top;
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('blood-particle');
        particle.style.left = `${clickX}px`;
        particle.style.top = `${clickY}px`;
        const dx = `${(Math.random() - 0.5) * 100}px`;
        const dy = `${(Math.random() - 0.5) * 100}px`;
        particle.style.setProperty('--dx', dx);
        particle.style.setProperty('--dy', dy);
        bloodContainer.appendChild(particle);
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

// Buy Upgrade
function buyUpgrade(upgradeType) {
    const upgrade = upgrades.find(upg => upg.type === upgradeType);
    if (!upgrade) {
        showNotification('❗ Invalid upgrade type!', 'error');
        return;
    }
    if (upgrade.type !== 'autoClick') {
        const cost = upgradeCosts[upgradeType];
        if (gold >= cost) {
            gold -= cost;
            upgrade.owned += 1;
            if (upgrade.type === 'defense') {
                defenseUpgrades += 1;
            } else if (upgrade.type === 'health') {
                healthUpgrades += 1;
            }
            applyUpgradeEffect(upgrade.type);
            upgradeCosts[upgradeType] = Math.floor(upgradeCosts[upgradeType] * 2.0);
            updateStats();
            playSound(document.getElementById('upgradeSound'));
            checkAchievements();
            const upgradeButton = document.getElementById(`upgrade${upgrade.id}`).querySelector('button');
            upgradeButton.innerHTML = `${upgrade.name} (Owned: ${upgrade.owned}) - Cost: <span id="upgradeCost${upgrade.id}">${upgradeCosts[upgradeType]}</span> 💰`;
            showNotification(`Purchased Upgrade: ${upgrade.name}`, 'success');
        } else {
            showNotification('❗ Not enough gold! 💸', 'error');
        }
    } else {
        if (gold >= upgradeCosts.autoClick && !autoClickPurchased) {
            gold -= upgradeCosts.autoClick;
            passiveIncome += 10;
            autoClickPurchased = true;
            upgrade.owned = 1;
            applyUpgradeEffect(upgrade.type);
            updateStats();
            playSound(document.getElementById('upgradeSound'));
            checkAchievements();
            const upgradeButton = document.getElementById(`upgrade${upgrade.id}`).querySelector('button');
            upgradeButton.disabled = true;
            upgradeButton.textContent = 'Owned ✅';
            showNotification(`Purchased Upgrade: ${upgrade.name}`, 'success');
        } else if (autoClickPurchased) {
            showNotification('❗ Auto-Clicker already purchased! 🔒', 'error');
        } else {
            showNotification('❗ Not enough gold! 💸', 'error');
        }
    }
}

function applyUpgradeEffect(upgradeType) {
    switch(upgradeType) {
        case 'attack':
            attackPower += 2;
            break;
        case 'defense':
            defense += 2;
            break;
        case 'health':
            maxHealth += 10;
            health = maxHealth;
            break;
        case 'criticalHit':
            // Handled in click logic
            break;
        case 'goldMultiplier':
            // Handled in currentGoldGain
            break;
        case 'experienceBoost':
            // Handled in currentExperienceGain
            break;
        case 'monsterSlayer':
            // Added in attackMonster
            break;
        case 'shield':
            // Reduces damage taken
            break;
        case 'luck':
            // Handled in currentGoldGain
            break;
        default:
            break;
    }
}

// Experience and Leveling
function gainExperience(amount) {
    experience += amount;
    while (experience >= expToNext && level < 100) {
        experience -= expToNext;
        levelUp();
    }
    if (level === 100 && swords.every(sword => sword.owned)) {
        showVictoryModal();
    }
    updateStats();
}

function levelUp() {
    level++;
    expToNext = Math.floor(expToNext * 2.0);
    playSound(document.getElementById('levelUpSound'));
    showLevelUpModal();
    checkAchievements();
    if (level % 5 === 0) {
        scaleMonsters();
    }
    if (level % 10 === 0 && level < 100) {
        spawnBoss(true);
    }
    if (level === 100) {
        spawnFinalBoss();
    }
    if (level === 100 && swords.every(sword => sword.owned)) {
        showVictoryModal();
    }
}

function showLevelUpModal() {
    document.getElementById('newLevel').textContent = level;
    const modal = document.getElementById('levelUpModal');
    modal.classList.add('active');
}

function closeLevelUpModal() {
    const modal = document.getElementById('levelUpModal');
    modal.classList.remove('active');
}

function showVictoryModal() {
    if (!document.getElementById('victoryModal').classList.contains('active')) {
        playSound(document.getElementById('victorySound'));
        const modal = document.getElementById('victoryModal');
        modal.classList.add('active');
        showNotification('🏆 You have achieved Victory! 🏆', 'victory');
    }
}

function closeVictoryModal() {
    const modal = document.getElementById('victoryModal');
    modal.classList.remove('active');
}

function showGameOverModal() {
    playSound(document.getElementById('gameOverSound'));
    const modal = document.getElementById('gameOverModal');
    modal.classList.add('active');
    showNotification('💀 Game Over! 💀', 'error');
}

function restartGame() {
    const modal = document.getElementById('gameOverModal');
    modal.classList.remove('active');
    resetGame();
}

function updateStats() {
    document.getElementById('gold').textContent = Math.floor(gold).toLocaleString();
    document.getElementById('level').textContent = level;
    document.getElementById('experience').textContent = Math.floor(experience).toLocaleString();
    document.getElementById('expToNext').textContent = Math.floor(expToNext).toLocaleString();
    document.getElementById('passiveIncome').textContent = passiveIncome.toLocaleString();
    document.getElementById('attackPower').textContent = attackPower.toLocaleString();
    document.getElementById('defense').textContent = defense.toLocaleString();
    document.getElementById('currentHealth').textContent = Math.floor(health).toLocaleString();
    document.getElementById('maxHealth').textContent = Math.floor(maxHealth).toLocaleString();
    document.getElementById('lives').textContent = lives;

    const xpPercentage = Math.min((experience / expToNext) * 100, 100);
    document.getElementById('xpBar').style.width = `${xpPercentage}%`;
}

// Buy Sword
function buySword(swordId) {
    const sword = swords.find(s => s.id === swordId);
    if (!sword.owned && gold >= sword.cost) {
        gold -= sword.cost;
        sword.owned = true;
        recalculateAttackPower();
        const swordButton = document.getElementById(`sword${sword.id}`).querySelector('button');
        swordButton.disabled = true;
        swordButton.textContent = 'Owned ✅';
        updateStats();
        playSound(document.getElementById('upgradeSound'));
        checkAchievements();
        showNotification(`Purchased Sword: ${sword.name}`, 'success');
    } else if (sword.owned) {
        showNotification('❗ You already own this sword! 🔒', 'error');
    } else {
        showNotification('❗ Not enough gold! 💸', 'error');
    }
}

// Final Boss
function spawnFinalBoss() {
    if (currentBoss) return;
    currentBoss = { ...finalBoss };
    renderBoss(currentBoss);
    bossAttackLoop(currentBoss);
    showNotification(`⚠️ Final Boss Appears: ${currentBoss.name}!`, 'achievement');
    playSound(document.getElementById('bossAppearSound'));
}

// Spawn Monster
function spawnMonster() {
    const randomType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    const healthVariation = Math.floor(Math.random() * 50) - 25;
    const attackVariation = Math.floor(Math.random() * 5) - 2;
    const newMonster = {
        id: monsterId,
        name: `${randomType.name} (Lv. ${level})`,
        health: Math.max(1, randomType.health + healthVariation),
        attack: Math.max(1, randomType.attack + attackVariation),
        emoji: randomType.emoji,
        isBoss: false,
    };
    monsters.push(newMonster);
    renderMonster(newMonster);
    showNotification(`👾 New Monster Appeared: ${newMonster.name}!`, 'achievement');
    const monsterAppearSound = document.getElementById('monsterAppearSound');
    if (monsterAppearSound) {
        monsterAppearSound.currentTime = 0;
        monsterAppearSound.play();
    }
    monsterId++;
}

function renderMonster(monster) {
    const monstersContainer = document.getElementById('monstersContainer');
    const monsterDiv = document.createElement('div');
    monsterDiv.className = 'monster undefeated';
    monsterDiv.id = `monster${monster.id}`;
    monsterDiv.innerHTML = `
        <span class="icon">${monster.emoji}</span>
        <div>
            <strong>${monster.name}</strong><br>
            Health: <span id="monsterHealth${monster.id}">${monster.health}</span> ❤️<br>
            Attack: <span id="monsterAttack${monster.id}">${monster.attack}</span> ⚔️
        </div>
        <button class="upgrade-button" onclick="attackMonster(${monster.id})">Attack 👊</button>
    `;
    monstersContainer.appendChild(monsterDiv);
    scheduleMonsterAttack(monster);
    scheduleMonsterSpell(monster);
}

// Scale Monsters
function scaleMonsters() {
    monsters.forEach(monster => {
        monster.health = Math.floor(monster.health * 1.2);
        monster.attack = Math.floor(monster.attack * 1.2);
        const healthSpan = document.getElementById(`monsterHealth${monster.id}`);
        if (healthSpan) healthSpan.textContent = monster.health;
        const attackSpan = document.getElementById(`monsterAttack${monster.id}`);
        if (attackSpan) attackSpan.textContent = monster.attack;
    });
}

// Spawn Boss
function spawnBoss(isLevelBased = false) {
    if (currentBoss) return;
    const bossHealthBase = isLevelBased ? 1000 + (level * 50) : 300;
    const bossAttackBase = isLevelBased ? 50 + (level * 5) : 20;
    const boss = {
        id: 500 + bosses.length,
        name: `Boss ${bosses.length + 1}`,
        health: bossHealthBase,
        attack: bossAttackBase,
        emoji: '👹',
        isBoss: true,
        isFinal: false
    };
    currentBoss = boss;
    bosses.push(boss);
    renderBoss(boss);
    bossAttackLoop(boss);
    showNotification(`⚠️ Boss appeared: ${boss.name}!`, 'achievement');
    playSound(document.getElementById('bossAppearSound'));
}

function renderBoss(boss) {
    const monstersContainer = document.getElementById('monstersContainer');
    const bossDiv = document.createElement('div');
    bossDiv.className = 'monster undefeated boss';
    bossDiv.id = `monster${boss.id}`;
    bossDiv.innerHTML = `
        <span class="icon">${boss.emoji}</span>
        <div>
            <strong>${boss.name}</strong><br>
            Health: <span id="monsterHealth${boss.id}">${boss.health}</span> ❤️<br>
            Attack: <span id="monsterAttack${boss.id}">${boss.attack}</span> ⚔️
        </div>
        <button class="upgrade-button" onclick="attackMonster(${boss.id})">Attack 👊</button>
    `;
    monstersContainer.appendChild(bossDiv);
}

// Attack Monster
function attackMonster(monsterId) {
    const monster = monsters.find(m => m.id === monsterId) || (currentBoss && currentBoss.id === monsterId ? currentBoss : null);
    if (monster) {
        let playerDamage = attackPower;
        const isCriticalHit = currentCriticalHitChance();
        if (isCriticalHit) {
            playerDamage *= 2;
            showCriticalHitNotification();
        } else {
            playSound(document.getElementById('clickSound'));
        }
        const monsterSlayerUpgrades = upgrades.find(upg => upg.type === 'monsterSlayer').owned;
        playerDamage += 3 * monsterSlayerUpgrades;
        monster.health -= playerDamage;
        showDamageAnimation(playerDamage, `monster${monster.id}`);
        if (monster.health <= 0) {
            if (monster.isBoss) {
                gold += 1000;
                experience += 500;
                bossesDefeated++;
                playSound(document.getElementById('bossDefeatedSound'));
                showNotification(`🎉 Boss ${monster.name} defeated! Earned 1000 gold and 500 XP!`, 'success');
                currentBoss = null;
            } else {
                gold += 100;
                monstersDefeated++;
                playSound(document.getElementById('monsterDefeatedSound'));
                showNotification(`🎉 Monster ${monster.name} defeated! Earned 100 gold!`, 'success');
            }
            const monsterIndex = monsters.indexOf(monster);
            if (monsterIndex >= 0) {
                monsters.splice(monsterIndex, 1);
            }
            const monsterDiv = document.getElementById(`monster${monster.id}`);
            if (monsterDiv) {
                monsterDiv.remove();
            }
            updateStats();
            gainExperience(monster.isBoss ? 500 : 50);
            if (monster.isBoss && monster.isFinal && swords.every(sword => sword.owned)) {
                showVictoryModal();
            }
        } else {
            document.getElementById(`monsterHealth${monster.id}`).textContent = monster.health;
        }
    }
}

function attackPlayer(monster) {
    const damage = Math.max(monster.attack - defense, 0);
    health -= damage;
    showDamageAnimation(damage, 'home');
    playSound(document.getElementById('monsterAttackSound'));
    showNotification(`⚔️ ${monster.name} attacked you for ${damage} damage! ❤️`, 'error');
    updateStats();
    if (health <= 0) {
        lives -= 1;
        deaths += 1;
        if (lives > 0) {
            health = maxHealth;
            updateStats();
            showNotification(`💀 You have been defeated by ${monster.name}! You lost a life. ❤️ Lives left: ${lives}`, 'error');
        } else {
            handleGameOver();
        }
        monsters = monsters.filter(m => m.id !== monster.id);
        const monsterDiv = document.getElementById(`monster${monster.id}`);
        if (monsterDiv) {
            monsterDiv.remove();
        }
    }
}

function showDamageAnimation(amount, targetId) {
    if (targetId === 'home') {
        const homeSection = document.getElementById('home');
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = `-${amount}`;
        homeSection.appendChild(damageText);
        setTimeout(() => {
            damageText.remove();
        }, 1000);
    } else {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const damageText = document.createElement('div');
            damageText.className = 'damage-text';
            damageText.textContent = `-${amount}`;
            targetElement.appendChild(damageText);
            setTimeout(() => {
                damageText.remove();
            }, 1000);
        }
    }
}

function scheduleMonsterAttack(monster) {
    const attackDelay = Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
    setTimeout(() => {
        if (!gamePaused && monsters.find(m => m.id === monster.id)) {
            attackPlayer(monster);
        }
    }, attackDelay);
}

function scheduleMonsterSpell(monster) {
    const spellDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
    setTimeout(() => {
        const activeMonster = monsters.find(m => m.id === monster.id);
        if (!gamePaused && activeMonster) {
            castSpell(activeMonster);
            scheduleMonsterSpell(activeMonster);
        }
    }, spellDelay);
}

function castSpell(monster) {
    const spellDamage = Math.floor(monster.attack / 2);
    health -= spellDamage;
    showDamageAnimation(spellDamage, 'home');
    playSound(document.getElementById('spellCastSound'));
    showNotification(`✨ ${monster.name} cast a spell on you for ${spellDamage} damage! ✨`, 'error');
    updateStats();
    if (health <= 0) {
        lives -= 1;
        deaths += 1;
        if (lives > 0) {
            health = maxHealth;
            updateStats();
            showNotification(`💀 You have been struck by a spell from ${monster.name}! You lost a life. ❤️ Lives left: ${lives}`, 'error');
        } else {
            handleGameOver();
        }
        monsters = monsters.filter(m => m.id !== monster.id);
        const monsterDiv = document.getElementById(`monster${monster.id}`);
        if (monsterDiv) {
            monsterDiv.remove();
        }
    }
}

function bossAttackLoop(boss) {
    const attackInterval = 5000;
    function attack() {
        if (currentBoss && currentBoss.id === boss.id) {
            attackPlayer(boss);
            setTimeout(attack, attackInterval);
        }
    }
    attack();
}

function spawnMonsterRandomly() {
    if (gamePaused) return;
    spawnMonster();
    setInterval(() => {
        if (!gamePaused) {
            spawnMonster();
        }
    }, Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000);
}

// Achievements
function updateAchievements() {
    achievements.forEach(ach => {
        if (!ach.achieved && isAchievementAchieved(ach)) {
            ach.achieved = true;
            const achDiv = document.getElementById(`achievement${ach.id}`);
            achDiv.classList.remove('locked');
            achDiv.innerHTML = `<span class="icon">✅</span><div><strong>${ach.name}</strong><br>${ach.description}</div>`;
            playSound(document.getElementById('upgradeSound'));
            showNotification(`Achievement Unlocked: ${ach.name}! 🏆`, 'achievement');
        }
    });
}

function isAchievementAchieved(achievement) {
    switch(achievement.id) {
        case 1: return totalClicks >= 1;
        case 2: return gold >= 100;
        case 3: return level >= 5;
        case 4: return defenseUpgrades >= 5;
        case 5: return healthUpgrades >= 3;
        case 6: return autoClickPurchased;
        case 7: return gold >= 1000;
        case 8: return level >= 20;
        case 9: return defenseUpgrades >= 10;
        case 10: return healthUpgrades >= 10;
        case 11: return swords.every(sword => sword.owned);
        case 12: return level >= 50;
        case 13: return level >= 100;
        case 14: return level >= 150;
        case 15: return level >= 200;
        case 16: return monstersDefeated >= 5;
        case 17: return bossesDefeated >= 1;
        case 18: return bossesDefeated >= 1 && swords.every(sword => sword.owned);
        case 19: return deaths >= 3;
        default: return false;
    }
}

function checkAchievements() {
    updateAchievements();
}

// Save and Load
function saveGame() {
    const gameState = {
        gold, level, experience, expToNext, attackPower, defense, health, maxHealth,
        passiveIncome, lives, upgradeCosts, upgrades, swords, monsters, monsterId,
        monstersDefeated, bossesDefeated, currentBoss, achievements, totalClicks,
        defenseUpgrades, healthUpgrades, autoClickPurchased, deaths
    };
    localStorage.setItem('goldyMcGoldfaceSave', JSON.stringify(gameState));
    showNotification('💾 Game Saved!', 'success');
}

function loadGame() {
    const savedState = localStorage.getItem('goldyMcGoldfaceSave');
    if (savedState) {
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

        upgrades.forEach((upg, index) => {
            upgrades[index].owned = gameState.upgrades[index].owned;
            if (upg.type !== 'autoClick') {
                if (upgrades[index].owned > 0) {
                    const upgradeButton = document.getElementById(`upgrade${upg.id}`).querySelector('button');
                    upgradeButton.innerHTML = `${upg.name} (Owned: ${upg.owned}) - Cost: <span id="upgradeCost${upg.id}">${upgradeCosts[upg.type]}</span> 💰`;
                    if (upg.type === 'defense') {
                        defenseUpgrades = upgrades[index].owned;
                    } else if (upg.type === 'health') {
                        healthUpgrades = upgrades[index].owned;
                    }
                }
            } else {
                if (gameState.autoClickPurchased) {
                    upgrades[index].owned = 1;
                    autoClickPurchased = true;
                    const upgradeButton = document.getElementById(`upgrade${upg.id}`).querySelector('button');
                    upgradeButton.disabled = true;
                    upgradeButton.textContent = 'Owned ✅';
                    passiveIncome += 10;
                }
            }
        });

        swords.forEach((sword, index) => {
            swords[index].owned = Boolean(gameState.swords[index].owned);
            if (sword.owned) {
                const swordButton = document.getElementById(`sword${sword.id}`).querySelector('button');
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
            if (achievements[index].achieved) {
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
        updateStats();
        renderLoadedMonsters();
        if (currentBoss) {
            renderBoss(currentBoss);
            bossAttackLoop(currentBoss);
        }
        showNotification('📂 Game Loaded!', 'success');
    } else {
        showNotification('❗ No saved game found.', 'error');
    }
}

function renderLoadedMonsters() {
    const monstersContainer = document.getElementById('monstersContainer');
    monstersContainer.innerHTML = '';
    monsters.forEach(monster => {
        renderMonster(monster);
        scheduleMonsterAttack(monster);
        scheduleMonsterSpell(monster);
    });
}

function resetGame() {
    if (confirm('⚠️ Are you sure you want to reset the game? This cannot be undone.')) {
        localStorage.removeItem('goldyMcGoldfaceSave');
        gold = 0;
        level = 1;
        experience = 0;
        expToNext = 10;
        attackPower = 1;
        defense = 1;
        health = 100;
        maxHealth = 100;
        passiveIncome = 0;
        lives = 3;
        upgradeCosts = { ...baseUpgradeCosts };
        totalClicks = 0;
        defenseUpgrades = 0;
        healthUpgrades = 0;
        autoClickPurchased = false;
        bossesDefeated = 0;
        deaths = 0;

        upgrades.forEach(upg => {
            upg.owned = upg.type === 'autoClick' ? false : 0;
            const upgradeButton = document.getElementById(`upgrade${upg.id}`).querySelector('button');
            if (upg.type !== 'autoClick') {
                upgradeButton.innerHTML = `${upg.name} (Owned: ${upg.owned}) - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`;
            } else {
                upgradeButton.disabled = false;
                upgradeButton.innerHTML = `${upg.name} - Cost: <span id="upgradeCost${upg.id}">${upg.cost}</span> 💰`;
            }
        });

        swords.forEach(sword => {
            sword.owned = false;
            const swordButton = document.getElementById(`sword${sword.id}`).querySelector('button');
            swordButton.disabled = false;
            swordButton.innerHTML = `Buy (Cost: <span id="swordCost${sword.id}">${sword.cost}</span> 💰)`;
        });

        recalculateAttackPower();
        monsters = [];
        monsterId = 1;
        monstersDefeated = 0;
        bossesDefeated = 0;
        currentBoss = null;
        achievements.forEach(ach => ach.achieved = false);
        const achievementsList = document.getElementById('achievementsList');
        achievementsList.innerHTML = '';
        initializeAchievements();

        const monstersContainer = document.getElementById('monstersContainer');
        monstersContainer.innerHTML = '';
        updateStats();
        updateAchievements();
        showNotification('🔄 Game has been reset.', 'success');
    }
}

function switchTab(tabName, buttonElement) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    buttonElement.classList.add('active');
}

function startPassiveIncome() {
    setInterval(() => {
        if (!gamePaused) {
            gold += passiveIncome;
            updateStats();
        }
    }, 1000);
}

function playSound(sound) {
    if (sound) {
        try {
            sound.currentTime = 0;
            sound.play().catch((error) => {
                console.error("Audio playback failed:", error);
            });
        } catch (error) {
            console.error("Error interacting with audio element:", error);
        }
    }
}

function handleGameOver() {
    showGameOverModal();
}

// Buy Full Heart
function buyHeart() {
    const heartCost = 10000;
    if (gold >= heartCost) {
        gold -= heartCost;
        lives += 1;
        updateStats();
        playSound(document.getElementById('buyHeartSound'));
        showNotification('❤️ Purchased a full heart! Lives increased by 1.', 'success');
        checkAchievements();
    } else {
        showNotification('❗ Not enough gold to buy a full heart!', 'error');
    }
}

// Dialog Functions
function nextDialog() {
    dialogIndex++;
    const dialogElement = document.getElementById("npcDialog");
    const startButton = document.getElementById("startGameButton");
    if (dialogIndex < tutorialDialog.length) {
        dialogElement.textContent = tutorialDialog[dialogIndex];
    } else {
        startButton.style.display = "inline-block";
        dialogElement.textContent = "That's all I've got for you. Make me proud! 🧙";
    }
}

function startGame() {
    const modal = document.getElementById("tutorialModal");
    modal.classList.remove("active");
    gamePaused = false;
    initializeGame();
}

// Toggle Music
let isMuted = false;
function toggleMusic() {
    const backgroundMusicElement = document.getElementById('backgroundMusic');
    const muteButton = document.getElementById('muteButton');
    if (isMuted) {
        backgroundMusicElement.muted = false;
        isMuted = false;
        muteButton.textContent = '🔊';
    } else {
        backgroundMusicElement.muted = true;
        isMuted = true;
        muteButton.textContent = '🔈';
    }
}

// Set Volume
function setVolume(value) {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = value;
    });
}

function enhanceUIResponsiveness() {
    const gameContainer = document.getElementById('game-container');
    const hero = document.getElementById('hero');
    const stats = document.querySelector('.stats');
    const upgradesList = document.getElementById('upgradesList');
    function adjustUI() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 800) {
            gameContainer.style.padding = '20px';
            gameContainer.style.fontSize = '10px';
            hero.style.fontSize = '60px';
            stats.style.width = '90%';
        } else {
            gameContainer.style.padding = '40px';
            gameContainer.style.fontSize = '14px';
            hero.style.fontSize = '100px';
            stats.style.width = '300px';
        }
        if (screenWidth < 500) {
            upgradesList.style.gap = '10px';
        } else {
            upgradesList.style.gap = '20px';
        }
    }
    window.addEventListener('resize', adjustUI);
    adjustUI();

    const homeSection = document.getElementById('home');
    const heroClickEffect = document.createElement('div');
    heroClickEffect.className = 'hero-pixel-click-effect';
    gameContainer.appendChild(heroClickEffect);

    hero.addEventListener('click', (event) => {
        heroClickEffect.style.left = `${event.clientX}px`;
        heroClickEffect.style.top = `${event.clientY}px`;
        heroClickEffect.classList.add('animate');
        setTimeout(() => {
            heroClickEffect.classList.remove('animate');
        }, 300);
    });
}

window.addEventListener('load', function () {
    const tutorialModal = document.getElementById("tutorialModal");
    tutorialModal.classList.add("active");

    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.volume = 0.5;
    backgroundMusic.play().catch(() => {
        console.log("Autoplay blocked. Music will start on user interaction.");
    });

    document.addEventListener("click", function startMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch((error) => {
                console.error("Error playing background music:", error);
            });
        }
        document.removeEventListener("click", startMusic);
    });

    initializeGame();
    enhanceUIResponsiveness();
});
