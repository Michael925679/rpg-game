class Battle extends Phaser.Scene {
    constructor() {
        super({ key: 'Battle' });
    }
    
    create() {
        // Initialize player and enemies
        this.player = new Player(1, 'Hero', 0);
        this.enemies = new EnemyGroup(3, this.player.level);
        
        this.currentTurn = 0;
        this.battleLog = [];
        this.selectedAbility = null;
        this.selectedTarget = null;
        this.battleActive = true;
        this.turnDelay = 0;
        
        // UI Setup
        this.setupUI();
        this.updateDisplay();
    }
    
    setupUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Battle title
        this.add.text(width / 2, 20, 'BATTLE', {
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '#00ff00'
        }).setOrigin(0.5);
        
        // Player info panel
        this.playerPanel = this.add.rectangle(50, 100, 200, 150, 0x1a1a2e, 0.8);
        this.playerPanel.setStrokeStyle(2, 0x4ECDC4);
        
        this.playerNameText = this.add.text(60, 110, '', {
            fontSize: '16px',
            fontStyle: 'bold',
            fill: '#00ff00'
        });
        this.playerStatsText = this.add.text(60, 135, '', {
            fontSize: '12px',
            fill: '#ffffff'
        });
        
        // Enemies panel
        this.enemiesPanel = this.add.rectangle(width - 150, 100, 200, 150, 0x1a1a2e, 0.8);
        this.enemiesPanel.setStrokeStyle(2, 0xFF6B6B);
        this.enemiesText = this.add.text(width - 140, 110, '', {
            fontSize: '12px',
            fill: '#FF6B6B'
        });
        
        // Battle log
        this.logPanel = this.add.rectangle(width / 2, 280, width - 100, 120, 0x1a1a2e, 0.8);
        this.logPanel.setStrokeStyle(2, 0xFFD700);
        this.logText = this.add.text(width / 2 - 180, 225, '', {
            fontSize: '12px',
            fill: '#ffffff',
            wordWrap: { width: 350 }
        });
        
        // Abilities section
        this.add.text(50, 320, 'Abilities:', {
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#4ECDC4'
        });
        
        this.abilityButtons = [];
        this.player.abilities.forEach((ability, index) => {
            this.createAbilityButton(ability, index);
        });
        
        // Action text
        this.actionText = this.add.text(width / 2, 550, '', {
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#FFD700',
            align: 'center',
            wordWrap: { width: 300 }
        }).setOrigin(0.5);
    }
    
    createAbilityButton(ability, index) {
        const x = 50 + (index % 2) * 210;
        const y = 360 + Math.floor(index / 2) * 50;
        
        const button = this.add.rectangle(x, y, 180, 40, 0x4ECDC4, 0.7);
        button.setInteractive();
        button.on('pointerover', () => button.setFillStyle(0x45B7D1));
        button.on('pointerout', () => button.setFillStyle(0x4ECDC4));
        button.on('pointerdown', () => this.selectAbility(ability, index));
        
        const text = this.add.text(x, y, `${ability.name} (${ability.manaCost}MP)`, {
            fontSize: '12px',
            fontStyle: 'bold',
            fill: '#000000'
        }).setOrigin(0.5);
        
        this.abilityButtons.push({ button, text, ability });
    }
    
    selectAbility(ability, index) {
        if (!this.battleActive || !this.player.isAlive) return;
        
        if (!this.player.useMana(ability.manaCost)) {
            this.actionText.setText('Not enough mana!');
            return;
        }
        
        // Restore mana for display
        this.player.mana += ability.manaCost;
        
        if (ability.name === 'Defend') {
            this.executePlayerAction(ability, null);
        } else if (ability.name === 'Heal') {
            this.executePlayerAction(ability, null);
        } else {
            // Select target
            this.actionText.setText('Click an enemy to target');
            this.selectedAbility = ability;
            this.targetSelectMode = true;
        }
    }
    
    executePlayerAction(ability, target) {
        this.selectedAbility = null;
        this.targetSelectMode = false;
        
        if (!this.player.useMana(ability.manaCost)) return;
        
        const result = ability.use(this.player, target);
        this.addBattleLog(result.message);
        
        // Enemy turns
        this.time.delayedCall(1000, () => this.executeEnemyTurns());
    }
    
    executeEnemyTurns() {
        const aliveEnemies = this.enemies.getAliveEnemies();
        
        if (aliveEnemies.length === 0) {
            this.endBattle(true);
            return;
        }
        
        let enemyIndex = 0;
        
        const executeNextEnemyAttack = () => {
            if (enemyIndex >= aliveEnemies.length) {
                this.updateDisplay();
                this.actionText.setText('Your Turn!');
                return;
            }
            
            const enemy = aliveEnemies[enemyIndex];
            const damage = enemy.getAttackDamage();
            const actualDamage = this.player.takeDamage(damage);
            
            this.addBattleLog(`${enemy.name} attacks for ${Math.round(actualDamage)} damage!`);
            
            if (this.player.health <= 0) {
                this.endBattle(false);
                return;
            }
            
            enemyIndex++;
            this.time.delayedCall(800, executeNextEnemyAttack);
        };
        
        executeNextEnemyAttack();
    }
    
    addBattleLog(message) {
        this.battleLog.push(message);
        if (this.battleLog.length > 5) {
            this.battleLog.shift();
        }
        this.logText.setText(this.battleLog.join('\n'));
    }
    
    updateDisplay() {
        // Player stats
        const playerStats = this.player.getStats();
        this.playerNameText.setText(`${playerStats.name} - Lv. ${playerStats.level}`);
        this.playerStatsText.setText(
            `HP: ${Math.round(playerStats.health)}/${playerStats.maxHealth}\n` +
            `MP: ${Math.round(playerStats.mana)}/${playerStats.maxMana}\n` +
            `ATK: ${Math.round(playerStats.attack)} DEF: ${Math.round(playerStats.defense)}\n` +
            `EXP: ${playerStats.experience}/100`
        );
        
        // Enemies
        let enemiesText = 'Enemies:\n';
        this.enemies.enemies.forEach((enemy, i) => {
            const hpPercent = Math.round((enemy.health / enemy.maxHealth) * 100);
            enemiesText += `${enemy.name}\nHP: ${Math.round(enemy.health)}/${Math.round(enemy.maxHealth)}\n\n`;
        });
        this.enemiesText.setText(enemiesText);
    }
    
    endBattle(victory) {
        this.battleActive = false;
        
        if (victory) {
            const totalExp = this.enemies.enemies.reduce((sum, e) => sum + e.experienceReward, 0);
            this.player.gainExperience(totalExp);
            this.actionText.setText(`Victory! Gained ${totalExp} EXP!`);
        } else {
            this.actionText.setText('Defeat! Game Over...');
        }
        
        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenu');
        });
    }
}