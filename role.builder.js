var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.task = "harvest";
        }

        if (creep.memory.task == "harvest" && _.sum(creep.carry) != creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ff7711"}});
            }
            return;
        }

        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, (s) => s.structureType == STRUCTURE_CONTAINER);
        if (target == null) {
            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        }
        if (target != null) {
            creep.memory.task = "build";
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
            }
            return;
        }

        var targets = _.filter(creep.room.find(FIND_STRUCTURES), (structure) => structure.hits != structure.hitsMax);
        if (targets.length) {
            creep.memory.task = "repair";
            var target = _.sortBy(targets, ["hits"])[0];
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
            }
            return;
        }

        creep.memory.task = "wait";
    }
};

module.exports = roleBuilder;
