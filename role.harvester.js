function harvest(creep) {
    if (_.sum(creep.carry) < creep.carryCapacity) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES, {filter: (source) => source.energy > 0});
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
        return true;
    } else {
        creep.memory.state = "transfer";
        return false;
    }
}

function transfer(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (creep.pos.inRangeTo(structure, 5)) &&
            (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            (_.sum(structure.store) < structure.storeCapacity)
    });
    if (target != null) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        creep.memory.state = "harvest";
        return false;
    }
}

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.state = "harvest";
        }

        switch (creep.memory.state) {
            default:
                creep.memory.state = "harvest";
            case "harvest":
                if (harvest(creep)) {
                    break;
                }
            case "transfer":
                if (transfer(creep)) {
                    break;
                }
        }
    }
};

module.exports = roleHarvester;
