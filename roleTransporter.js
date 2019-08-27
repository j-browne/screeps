function load(creep) {
    if (_.sum(creep.carry) == creep.carryCapacity) {
        return false;
    }

    var target = _.max(creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER}), (t) = > t.store["energy"]);

    if (target != null) {
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ff7711"}});
        }
        return true;
    } else {
        return false;
    }
}

function transfer(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
            (structure.energy < structure.energyCapacity)
    });

    if (target != null) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

function transferTower(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER &&
            ((structure.energy <= structure.energyCapacity / 2) ||
            (structure.energy <= (structure.energyCapacity - creep.carryCapacity)))
    });

    if (target != null) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

function transferStorage(creep) {
    var target = creep.room.storage;

    if (target != null) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
        }
        return true;
    } else {
        return false;
    }
}

var roleTransporter = {
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
            case "transfer":
            case "transferTower":
            case "transferStorage":
                creep.memory.state = "transfer";
                if (transfer(creep)) {
                    break;
                }
                creep.memory.state = "transferTower";
                if (transferTower(creep)) {
                    break;
                }
                creep.memory.state = "transferStorage";
                if (transferStorage(creep)) {
                    break;
                }
        }
    }
};

module.exports = roleTransporter;
