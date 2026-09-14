class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        this.add.text(width / 2, 80, 'TURN-BASED RPG', {
            fontSize: '48px',
            fontStyle: 'bold',
            fill: '#00ff00',
            align: 'center'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(width / 2, 140, 'Multiplayer Battle Arena', {
            fontSize: '24px',
            fill: '#4ECDC4',
            align: 'center'
        }).setOrigin(0.5);
        
        // Instructions
        const instructions = [
            'Level Up • Gain Abilities • Battle Together',
            '',
            'Single Player Mode:',
            'Fight enemies, gain experience, and unlock new abilities!'
        ];
        
        let y = 220;
        instructions.forEach(line => {
            this.add.text(width / 2, y, line, {
                fontSize: '16px',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            y += 30;
        });
        
        // Start Button
        this.createButton(width / 2, 420, 'Start Battle', () => {
            this.scene.start('Battle');
        });
        
        // Instructions Button
        this.createButton(width / 2, 480, 'How to Play', () => {
            this.showInstructions();
        });
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 200, 50, 0x4ECDC4);
        button.setInteractive();
        button.on('pointerover', () => button.setFillStyle(0x45B7D1));
        button.on('pointerout', () => button.setFillStyle(0x4ECDC4));
        button.on('pointerdown', callback);
        
        this.add.text(x, y, text, {
            fontSize: '20px',
            fontStyle: 'bold',
            fill: '#000000'
        }).setOrigin(0.5);
    }
    
    showInstructions() {
        alert('HOW TO PLAY:\n\n' +
            '• Choose an ability each turn\n' +
            '• Attack: Deal basic damage\n' +
            '• Power Strike: Deal 1.5x damage (10 mana)\n' +
            '• Defend: Reduce next damage taken (5 mana)\n' +
            '• Heal: Restore health (15 mana)\n\n' +
            '• Defeat enemies to gain experience\n' +
            '• Level up to increase all stats\n' +
            '• Unlock new abilities at level 5\n\n' +
            'Victory: Defeat all enemies\n' +
            'Defeat: Your health reaches 0');
    }
}