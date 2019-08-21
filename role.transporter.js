function load(creep) {
    if (_.sum(creep.carry) == creep.carryCapacity) {
        return false;
    }

    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            (structure.store.energy > 50)
    });
    if (target != null) {
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ff7711"}});
        }
        return true;
    } else {
        creep.memory.state = "transfer";
        return false;
    }
}


function transfer(creep) {
    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
            (_.sum(structure.store) < structure.storeCapacity)
    });

    if (target != null) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        creep.memory.state = "load";
        return false;
    }
}

var roleTransporter = {
    /** @param {Creep} creep **/
    run: function(creep) {
        switch (creep.memory.state) {
            default:
            case "load":
                creep.memory.state = "load";
                if (harvest(creep)) {
                    break;
                }
            case "transfer":
                creep.memory.state = "transfer";
                if (transfer(creep)) {
                    break;
                }
        }
    }
};

module.exports = roleTransporter;
