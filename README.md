# Turn-Based RPG Game

A multiplayer turn-based RPG game built with Phaser 3, featuring character progression, abilities, and team-based combat.

## Features

✅ **Turn-Based Combat System**
- Strategic ability selection
- Real-time enemy AI reactions
- Damage calculation with defense mechanics

✅ **Character Progression**
- Level up system with stat increases
- Experience gain from defeating enemies
- Ability unlocking at level 5

✅ **Ability System**
- Attack: Basic damage
- Power Strike: 1.5x damage (10 mana)
- Defend: Reduce incoming damage (5 mana)
- Heal: Restore health (15 mana)
- Ultimate: Massive attack at level 5 (25 mana)

✅ **Enemy Encounters**
- Multiple enemy types: Goblins, Orcs, Trolls, Dragons
- Dynamic difficulty scaling
- Group battles (3+ enemies)

✅ **Multiplayer Backend** (Node.js + WebSocket)
- Real-time player synchronization
- Game room management
- Shared battle state

## Quick Start

### Single Player (Browser)

1. Open `index.html` in your web browser
2. Click "Start Battle"
3. Select abilities and defeat enemies!

### Multiplayer (Local Server)

```bash
# Install dependencies
npm install

# Start the server
npm start

# Server runs on http://localhost:3000
```

## Game Mechanics

### Stats
- **Health (HP)**: Determines how much damage you can take
- **Mana (MP)**: Required to use abilities
- **Attack**: Increases damage dealt
- **Defense**: Reduces incoming damage

### Leveling
- Defeat enemies to gain experience
- Reach 100 EXP to level up
- Each level increases all stats
- Unlock Ultimate ability at level 5

### Combat Flow
1. Select an ability
2. Enemies take their turns
3. Repeat until victory or defeat

## File Structure

```
rpg-game/
├── index.html                 # Main game page
├── js/
│   ├── config.js             # Game configuration
│   ├── game.js               # Phaser initialization
│   ├── classes/
│   │   ├── Player.js         # Player class
│   │   └── Enemy.js          # Enemy class
│   └── scenes/
│       ├── MainMenu.js       # Menu scene
│       └── Battle.js         # Battle scene
├── server/
│   └── multiplayer.js        # WebSocket server
└── package.json              # Node.js dependencies
```

## Technologies

- **Phaser 3** - Game framework
- **WebSocket** - Real-time multiplayer communication
- **Node.js + Express** - Backend server
- **Vanilla JavaScript** - Core game logic

## Future Enhancements

- [ ] Persistent player progression
- [ ] More enemy types and bosses
- [ ] Item/equipment system
- [ ] PvP arena battles
- [ ] Quests and storyline
- [ ] Skill tree customization
- [ ] Guilds and team features
- [ ] Database integration

## License

MIT License - Feel free to modify and use!