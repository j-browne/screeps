var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (job in creep.memory) {
            switch (creep.memory.job.type) {
                case "harvest":
                    var source = Game.getObjectById(creep.memory.job.sourceId);
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {range: 1, visualizePathStyle: {stroke: "#ffaa00"}});
                    }
                    break;
            }
        }
    }
};

module.exports = roleHarvester;
