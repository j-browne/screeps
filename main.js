var spawnController = require("spawnController");
var towerController = require("towerController");

var config = {
    roles: {
        "harvester": require("roleHarvester"),
        "transporter": require("roleTransporter"),
        "builder": require("roleBuilder"),
        "upgrader": require("roleUpgrader"),
        "attacker": require("roleAttacker")
    },
    equips: {
        "harvester": [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        "upgrader": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "builder": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "transporter": [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        "attacker": [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
    },
    spawnRoles: {
        "W43N47": ["transporter", "harvester", "harvester", "builder", "builder", "builder", "upgrader", "builder", "upgrader"]
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

    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        spawnController.run(room, config);
        towerController.run(room, config);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.room.visual.text(`${creep.name} (${creep.memory.role})`, creep.pos, {font: "10px", stroke: "black", strokeWidth: 0.08});
        if (creep.memory.role in config.roles && creep.memory.state != "ignore") {
            config.roles[creep.memory.role].run(creep);
        }
    }
}
