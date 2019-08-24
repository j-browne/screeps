function load(creep) {
    if (_.sum(creep.carry) == creep.carryCapacity) {
        return false;
    }

    var target = creep.room.storage;
    if (target != null) {
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ff7711"}});
        }
        return true;
    } else {
        return false;
    }
}

function build(creep) {
    var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
    if (target != null) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range:3, visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

function repairCritical(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_RAMPART && structure.hits < 1000
    });

    if (target != null) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range:3, visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

function repair(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.hits < 1000 || s.structureType != STRUCTURE_WALL) && s.hits < s.hitsMax / 2
    });

    if (target != null) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range:3, visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

function repairWall(creep) {
    creep.memory.cooldown -= 1;
    if (!("cooldown" in creep.memory) || creep.memory.cooldown <= 0 || !("targetId" in creep.memory)) {
        creep.memory.cooldown = 100;

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (targets.length == 0) {
            return false;
        }

        var target = _.sample(_.take(_.sortBy(targets, (t) => t.hits/t.hitsMax), 5));
        creep.memory.targetId = target.id;
    }

    var target = Game.getObjectById(creep.memory.targetId);
    if (target != null) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 3, visualizePathStyle: {stroke: "#0000ff"}});
        }
        return true;
    } else {
        creep.memory.cooldown = 0;
        return false;
    }
}

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.state = "load";
        }

        switch (creep.memory.state) {
            default:
            case "load":
                creep.memory.state = "load";
                if (load(creep)) {
                    break;
                }
            case "repairCritical":
            case "build":
            case "repair":
            case "repairWall":
                creep.memory.state = "repairCritical";
                if (repairCritical(creep)) {
                    break;
                }
                creep.memory.state = "build";
                if (build(creep)) {
                    break;
                }
                creep.memory.state = "repair";
                if (repair(creep)) {
                    break;
                }
                creep.memory.state = "repairWall";
                if (repairWall(creep)) {
                    break;
                }
                creep.memory.state = "wait";
                break;
        }
    }
};

module.exports = roleBuilder;
