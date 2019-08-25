var spawnController = require("spawnController");
var towerController = require("towerController");

var config = {
    roles: {
        "H": require("roleHarvester"),
        "T": require("roleTransporter"),
        "B": require("roleBuilder"),
        "U": require("roleUpgrader"),
        "A": require("roleAttacker")
    },
    equips: {
        "H": [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        "U": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "B": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "T": [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        "A": [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
    },
    spawnRoles: {
        "W43N47": ["T", "H", "H", "B", "B", "B", "U", "U"]
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
        creep.room.visual.text(`${creep.name}`, creep.pos.x, creep.pos.y - 0.05, {font: "10px", stroke: "black", strokeWidth: 0.08});
        creep.room.visual.text(`(${creep.memory.role})`, creep.pos.x, creep.pos.y + 0.2, {font: "10px", stroke: "black", strokeWidth: 0.08});
        if (creep.memory.role in config.roles && creep.memory.state != "ignore") {
            config.roles[creep.memory.role].run(creep);
        }
    }

    //var room = Game.rooms["W43N47"];
    //var structs = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
    //for (var structName in structs) {
    //    var struct = structs[structName];
    //    room.visual.rect(struct.pos.x - 0.25, struct.pos.y - 0.25, 0.5, 0.1, {fill: "#000000", stroke: "#888888", opacity: 1.0});
    //    room.visual.rect(struct.pos.x - 0.24, struct.pos.y - 0.24, 0.48*(struct.hits/struct.hitsMax), 0.08, {fill: "#FF0000", opacity:1.0});
    //}
}
