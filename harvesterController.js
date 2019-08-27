var harvesterController = {
    /**
     * @param {Room} room
     * @param config
     */
    run: function(room, config) {
        var harvesters = room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == "H"});
        var sources = room.find(FIND_SOURCES);

        if (harvesters.length == 0 || sources.length == 0) {
            return;
        }

        var [harvestersWorking, harvestersNotWorking] = _.partition(harvesters, (h) => "job" in h.memory);
        var sourcesWorked = _.map(harvestersWorking, (h) => Game.getObjectById(h.memory.job.sourceId));
        var sourcesNotWorked = _.difference(sources, sourcesWorked);

        // Iterate until we run out of sources or non-working harvesters. If
        // there are still harvesters left over, they'll be handled in the next
        // loop
        for (var i = 0; i < Math.min(sourcesNotWorked.length, harvestersNotWorking.length); i++) {
            var h = harvestersNotWorking.pop();
            harvestersWorking.push(h);
            var closestSource = h.pos.findClosestByPath(sourcesNotWorked);
            sourcesWorked.push(closestSource);
            _.remove(sourcesNotWorked, (s) => s === closestSource);
            h.memory.job = {
                type: "harvest",
                sourceId: closestSource.id
            }
        }

        // Replace the oldest harvesters first (negative sign is so that they
        // are at the end of the array)
        harvestersWorking = _.sortBy(harvestersWorking, (h) => -h.ticksToLive);
        for (h of harvestersNotWorking) {
            var oldHarvester = harvestersWorking.pop();

            // If oldHarvester is undefined, that is because there are more
            // non-working harvesters than working harvesters. This means that
            // there are over double the number of harvesters per source. At
            // that point, we can just defer giving the rest of the non-working
            // harvesters jobs until the next iteration.
            if (oldHarvester == undefined) {
                return;
            }

            // Just in case oldHarvester has an invalid sourceId, let's check
            // it so that we don't perpetuate this problem
            if (sources.includes(Game.getObjectById(oldHarvester.memory.job.sourceId))) {
                h.memory.job = oldHarvester.memory.job;
            }
        }
    }
};

module.exports = harvesterController;
