const gameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenu, Battle],
    parent: 'game-container',
    backgroundColor: '#1a1a2e'
};

// Game constants
const GAME_CONSTANTS = {
    BASE_HEALTH: 100,
    BASE_MANA: 50,
    BASE_ATTACK: 10,
    BASE_DEFENSE: 5,
    LEVEL_UP_EXP: 100,
    PLAYER_COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
    ENEMY_TYPES: {
        goblin: { health: 30, attack: 5, defense: 2, exp: 25, color: '#7FDB4F' },
        orc: { health: 50, attack: 10, defense: 5, exp: 50, color: '#8B4513' },
        troll: { health: 80, attack: 15, defense: 8, exp: 100, color: '#696969' },
        dragon: { health: 150, attack: 25, defense: 12, exp: 250, color: '#DC143C' }
    }
};