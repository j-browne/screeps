function harvest(creep) {
    if (creep.carryCapacity == 0 || _.sum(creep.carry) < creep.carryCapacity) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES, {filter: (source) => source.energy > 0});
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
        moveIfContainerFull(creep);
        return true;
    } else {
        creep.memory.state = "transfer";
        return false;
    }
}

function moveIfContainerFull(creep) {
    var structures = creep.pos.lookFor(LOOK_STRUCTURES);
    for (i in structures) {
        var s = structures[s];
        if (s.structureType == STRUCTURE_CONTAINER && s.store == s.storeCapacity) {
            var newS = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: s.structureType == STRUCTURE_CONTAINER && s.store != s.storeCapacity});
            if (newS != null) {
                creep.moveTo(newS);
            }
        }
    }
}

function transfer(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
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
