class Player {
    constructor(id, name, colorIndex = 0) {
        this.id = id;
        this.name = name;
        this.colorIndex = colorIndex;
        this.color = GAME_CONSTANTS.PLAYER_COLORS[colorIndex];
        
        // Base stats
        this.level = 1;
        this.experience = 0;
        this.maxHealth = GAME_CONSTANTS.BASE_HEALTH;
        this.health = this.maxHealth;
        this.maxMana = GAME_CONSTANTS.BASE_MANA;
        this.mana = this.maxMana;
        this.attack = GAME_CONSTANTS.BASE_ATTACK;
        this.defense = GAME_CONSTANTS.BASE_DEFENSE;
        
        // Abilities
        this.abilities = [
            new Ability('Attack', 'Deal damage', 0, (target) => this.attack + Phaser.Math.Between(-2, 2)),
            new Ability('Power Strike', 'Deal 1.5x damage', 10, (target) => (this.attack * 1.5) + Phaser.Math.Between(-3, 3)),
            new Ability('Defend', 'Increase defense for next turn', 5, (target) => 0),
            new Ability('Heal', 'Restore health', 15, (target) => 30)
        ];
        
        this.isAlive = true;
    }
    
    gainExperience(amount) {
        this.experience += amount;
        if (this.experience >= GAME_CONSTANTS.LEVEL_UP_EXP) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience = 0;
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.maxMana += 10;
        this.mana = this.maxMana;
        this.attack += 5;
        this.defense += 2;
        
        // Unlock new ability at certain levels
        if (this.level === 5 && this.abilities.length === 4) {
            this.abilities.push(new Ability('Ultimate', 'Massive attack', 25, (target) => this.attack * 2.5));
        }
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
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    useMana(amount) {
        if (this.mana >= amount) {
            this.mana -= amount;
            return true;
        }
        return false;
    }
    
    restoreMana(amount) {
        this.mana = Math.min(this.maxMana, this.mana + amount);
    }
    
    getStats() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            experience: this.experience,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana: this.maxMana,
            attack: this.attack,
            defense: this.defense,
            isAlive: this.isAlive
        };
    }
}

class Ability {
    constructor(name, description, manaCost, damageCalculator) {
        this.name = name;
        this.description = description;
        this.manaCost = manaCost;
        this.damageCalculator = damageCalculator;
    }
    
    use(attacker, target) {
        if (attacker.mana < this.manaCost) {
            return { success: false, message: `Not enough mana for ${this.name}!` };
        }
        
        attacker.useMana(this.manaCost);
        const damage = this.damageCalculator(target);
        
        if (this.name === 'Heal') {
            attacker.heal(damage);
            return { success: true, damage: 0, healing: damage, message: `${attacker.name} healed for ${damage} HP!` };
        } else if (this.name === 'Defend') {
            attacker.defenseBoost = 10;
            return { success: true, damage: 0, message: `${attacker.name} took a defensive stance!` };
        } else {
            const actualDamage = target.takeDamage(damage);
            return { success: true, damage: actualDamage, message: `${attacker.name} used ${this.name} for ${Math.round(actualDamage)} damage!` };
        }
    }
}