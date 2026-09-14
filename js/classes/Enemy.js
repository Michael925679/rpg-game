class Enemy {
    constructor(type, level = 1) {
        const baseStats = GAME_CONSTANTS.ENEMY_TYPES[type] || GAME_CONSTANTS.ENEMY_TYPES.goblin;
        
        this.type = type;
        this.level = level;
        this.color = baseStats.color;
        this.name = `${type.charAt(0).toUpperCase() + type.slice(1)} (Lv. ${level})`;
        
        // Scale stats by level
        this.maxHealth = baseStats.health * (1 + level * 0.1);
        this.health = this.maxHealth;
        this.attack = baseStats.attack * (1 + level * 0.08);
        this.defense = baseStats.defense * (1 + level * 0.05);
        this.experienceReward = baseStats.exp * level;
        
        this.isAlive = true;
    }
    
    takeDamage(amount) {
        const damageReduction = this.defense * 0.1;
        const actualDamage = Math.max(1, amount - damageReduction);
        this.health -= actualDamage;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
        return actualDamage;
    }
    
    getAttackDamage() {
        return this.attack + Phaser.Math.Between(-3, 3);
    }
    
    chooseAction() {
        // Simple AI: attack with 70% chance, defend with 30% chance
        return Phaser.Math.Between(0, 100) < 70 ? 'attack' : 'defend';
    }
}

class EnemyGroup {
    constructor(count = 3, playerLevel = 1) {
        this.enemies = [];
        const types = Object.keys(GAME_CONSTANTS.ENEMY_TYPES);
        
        for (let i = 0; i < count; i++) {
            const randomType = types[Phaser.Math.Between(0, types.length - 1)];
            this.enemies.push(new Enemy(randomType, playerLevel));
        }
    }
    
    getAliveEnemies() {
        return this.enemies.filter(e => e.isAlive);
    }
    
    allDefeated() {
        return this.getAliveEnemies().length === 0;
    }
}