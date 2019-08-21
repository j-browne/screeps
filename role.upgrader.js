function load(creep) {
    if (_.sum(creep.carry) == creep.carryCapacity) {
        return false;
    }

    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            (structure.store.energy > 50)
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

function upgrade(creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: "#ffffff"}});
    }
}

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        switch (creep.memory.state) {
            default:
                creep.memory.state = "load";
            case "load":
                if (load(creep)) {
                    break;
                }
            case "upgrade":
                break;
        }
    }
};

module.exports = roleUpgrader;
