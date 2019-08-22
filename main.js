var names = require("names");

var roles = {
    "harvester": require("role.harvester"),
    "transporter": require("role.transporter"),
    "builder": require("role.builder"),
    "upgrader": require("role.upgrader")
};

var equips = {
    "default": [WORK, CARRY, MOVE],
    "harvester": [WORK, WORK, WORK, WORK, WORK, MOVE],
    "upgrader": [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
    "builder": [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
    "transporter": [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
};

var numCreeps = {
    "default": 0,
    "harvester": 2,
    "builder": 3,
    "upgrader": 3,
    "transporter": 1
};

var pauseSpawning = false;

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            console.log("Clearing memory: " + name + " (" + Memory.creeps[name].role + ")");
            delete Memory.creeps[name];
        }
    }

    for (var role in roles) {
        var numMin = (role in numCreeps) ? (numCreeps[role]) : (numCreeps["default"]);
        var num = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.ticksToLive > 200).length;
        if (!pauseSpawning && num < numMin) {
            var newNames = _.filter(names, (n) => !(n in Game.creeps));
            var newName = (newNames.length > 0) ? (_.sample(newNames)) : ("Creep" + Game.time);

            var equip = (role in equips) ? (equips[role]) : (equips["default"]);

            var spawnStatus = Game.spawns["Spawn1"].spawnCreep(equip, newName, {memory: {role: role}});
            if (spawnStatus == 0) {
                console.log("Spawning new " + role + ": " + newName);
            }

        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.room.visual.text(`${creep.name} (${creep.memory.role})`, creep.pos, {font: "10px", opacity: 0.7, stroke: "black", strokeWidth: 0.07});
        if (creep.memory.role in roles && creep.memory.state != "ignore") {
            roles[creep.memory.role].run(creep);
        }
    }
}
