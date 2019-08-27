function attack(creep) {
    var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (enemy != null) {
        creep.moveTo(enemy);
        creep.attack(enemy);
    }
}

function fortify(creep) {
    var structures = creep.pos.lookFor(LOOK_STRUCTURES);
    for (var struct of structures) {
        if (struct.structureType == STRUCTURE_RAMPART) {
            return;
        }
    }

    var rampart = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_RAMPART && s.pos.lookFor(LOOK_CREEPS).length == 0
    });
    if (rampart != null) {
        creep.moveTo(rampart);
    }
}

var roleAttacker = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            attack(creep)
        } else {
            fortify(creep)
        }
    }
};

module.exports = roleAttacker;

