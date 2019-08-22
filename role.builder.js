function load(creep) {
    if (_.sum(creep.carry) == creep.carryCapacity) {
        return false;
    }

    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            (structure.store.energy > creep.carryCapacity)
    });
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
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

function repairCritical(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_RAMPART
    });

    if (target != null) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

function repair(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });

    if (target != null) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
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
                creep.memory.state = "repairCritical";
                if (repairCritical(creep)) {
                    break;
                }
            case "build":
                creep.memory.state = "build";
                if (build(creep)) {
                    break;
                }
            case "repair":
                creep.memory.state = "repair";
                if (repair(creep)) {
                    break;
                }
            case "wait":
                creep.memory.state = "wait";
                break;
        }
    }
};

module.exports = roleBuilder;
