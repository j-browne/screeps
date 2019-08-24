var spawnController = require("spawnController");

var config = {
    roles: {
        "harvester": require("roleHarvester"),
        "transporter": require("roleTransporter"),
        "builder": require("roleBuilder"),
        "upgrader": require("roleUpgrader"),
        "attacker": require("roleAttacker")
    },
    equips: {
        "harvester": [WORK, WORK, WORK, WORK, WORK, MOVE],
        "upgrader": [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
        "builder": [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "transporter": [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "attacker": [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
    },
    spawnRoles: {
        "W43N47": ["transporter", "harvester", "harvester", "attacker", "builder", "builder", "transporter", "upgrader", "builder", "upgrader", "builder", "upgrader"]
    },
    names: require("names"),
    pauseSpawning: {
        "W43N47": false
    }
};

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            console.log(`Clearing memory: ${name} (${Memory.creeps[name].role})`);
            delete Memory.creeps[name];
        }
    }

    for (roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        spawnController.run(room, config);
    }

    for (var r in Game.rooms) {
        var walls = Game.rooms[r].find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL});
        for (var i in walls) {
            var w = walls[i];
            w.room.visual.text(`${w.hits}`, w.pos, {font: "7px", stroke: "black", strokeWidth: 0.08});
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.room.visual.text(`${creep.name} (${creep.memory.role})`, creep.pos, {font: "10px", stroke: "black", strokeWidth: 0.08});
        if (creep.memory.role in config.roles && creep.memory.state != "ignore") {
            config.roles[creep.memory.role].run(creep);
        }
    }

    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        for (var towerName in towers) {
            var tower = towers[towerName];

            var enemies = room.find(FIND_HOSTILE_CREEPS);
            for (enemyName in enemies) {
                tower.attack(enemies[enemyName]);
            }
            if (enemies.length == 0) {
                for (creepName in _.filter(Game.creeps, (c) => c.hits < c.hitsMax)) {
                    tower.heal(Game.creeps[creepName]);
                }
            }
        }
    }
}
