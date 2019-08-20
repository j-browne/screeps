var names = require('names');

var roles = {
    "harvester": require('role.harvester'),
    "upgrader": require('role.upgrader'),
    "builder": require('role.builder')
};

var equips = {
    "default": [WORK, CARRY, MOVE],
    "harvester": [WORK, CARRY, CARRY, MOVE, MOVE],
    "upgrader": [WORK, CARRY, CARRY, MOVE, MOVE],
    "builder": [WORK, CARRY, CARRY, MOVE, MOVE],
    "transporter": [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
};

var numCreeps = {
    "default": 0,
    "harvester": 1,
    "builder": 3,
    "upgrader": 0
};

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            console.log("Clearing memory: " + name + " (" + Memory.creeps[name].role + ")");
            delete Memory.creeps[name];
        }
    }

    for (var role in roles) {
        var numMin = (role in numCreeps) ? (numCreeps[role]) : (numCreeps["default"]);
        var num = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
        if (num < numMin) {
            var newNames = _.filter(names, (n) => !(n in Game.creeps));
            var newName = (newNames.length > 0) ? (_.sample(newNames)) : ("Creep" + Game.time);

            var equip = (role in equips) ? (equips[role]) : (equips["default"]);

            var spawnStatus = Game.spawns["Spawn1"].spawnCreep(equip, newName, {memory: {role: role}});
            if (spawnStatus == 0) {
                console.log("Spawning new " + role + ": " + newName);
            }

        }
    }

    if (Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        roles[creep.memory.role].run(creep);
    }
}
