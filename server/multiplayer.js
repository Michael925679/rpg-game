const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('../'));

// Game server state
const games = new Map();
const players = new Map();

class GameRoom {
    constructor(roomId, maxPlayers = 4) {
        this.roomId = roomId;
        this.players = [];
        this.maxPlayers = maxPlayers;
        this.battleActive = false;
        this.enemies = null;
        this.currentTurn = 0;
    }
    
    addPlayer(player) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
            return true;
        }
        return false;
    }
    
    removePlayer(playerId) {
        this.players = this.players.filter(p => p.id !== playerId);
    }
    
    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }
    
    broadcast(message) {
        this.players.forEach(player => {
            if (player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(JSON.stringify(message));
            }
        });
    }
    
    startBattle() {
        this.battleActive = true;
        this.enemies = [
            { id: 1, type: 'goblin', health: 50, maxHealth: 50 },
            { id: 2, type: 'orc', health: 80, maxHealth: 80 }
        ];
        this.broadcast({
            type: 'battleStart',
            enemies: this.enemies,
            players: this.players.map(p => p.getStats())
        });
    }
    
    handleAction(playerId, actionData) {
        const player = this.getPlayer(playerId);
        if (!player) return;
        
        this.broadcast({
            type: 'playerAction',
            player: player.name,
            action: actionData.action,
            target: actionData.target,
            damage: actionData.damage
        });
    }
}

class GamePlayer {
    constructor(id, name, ws) {
        this.id = id;
        this.name = name;
        this.ws = ws;
        this.level = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.mana = 50;
        this.maxMana = 50;
    }
    
    getStats() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana: this.maxMana
        };
    }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'joinGame':
                    handleJoinGame(ws, message);
                    break;
                case 'playerAction':
                    handlePlayerAction(ws, message);
                    break;
                case 'startBattle':
                    handleStartBattle(ws, message);
                    break;
            }
        } catch (error) {
            console.error('Message error:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
        // Clean up player
        for (let [roomId, room] of games) {
            for (let player of room.players) {
                if (player.ws === ws) {
                    room.removePlayer(player.id);
                    room.broadcast({
                        type: 'playerLeft',
                        playerId: player.id,
                        players: room.players.map(p => p.getStats())
                    });
                    if (room.players.length === 0) {
                        games.delete(roomId);
                    }
                }
            }
        }
    });
});

function handleJoinGame(ws, message) {
    const { roomId, playerName } = message;
    let room = games.get(roomId);
    
    if (!room) {
        room = new GameRoom(roomId);
        games.set(roomId, room);
    }
    
    const playerId = Math.random().toString(36).substr(2, 9);
    const player = new GamePlayer(playerId, playerName, ws);
    
    if (room.addPlayer(player)) {
        players.set(playerId, { roomId, player });
        
        ws.send(JSON.stringify({
            type: 'joinSuccess',
            playerId: playerId,
            players: room.players.map(p => p.getStats())
        }));
        
        room.broadcast({
            type: 'playerJoined',
            player: player.getStats(),
            players: room.players.map(p => p.getStats())
        });
    } else {
        ws.send(JSON.stringify({
            type: 'joinFailed',
            message: 'Room is full'
        }));
    }
}

function handlePlayerAction(ws, message) {
    for (let [playerId, data] of players) {
        if (data.player.ws === ws) {
            const room = games.get(data.roomId);
            if (room) {
                room.handleAction(playerId, message);
            }
        }
    }
}

function handleStartBattle(ws, message) {
    for (let [playerId, data] of players) {
        if (data.player.ws === ws) {
            const room = games.get(data.roomId);
            if (room) {
                room.startBattle();
            }
        }
    }
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`RPG Server running on port ${PORT}`);
});