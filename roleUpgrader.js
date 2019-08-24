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

function upgrade(creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {range: 3, visualizePathStyle: {stroke: "#ffffff"}});
    }
    return true;
}

var roleUpgrader = {
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
            case "upgrade":
                creep.memory.state = "upgrade";
                if (upgrade(creep)) {
                    break;
                }
        }
    }
};

module.exports = roleUpgrader;
