var spawnController = {
    /**
     * @param {Room} room
     * @param config
     */
    run: function(room, config) {
        if (config.pauseSpawning[room.name]) {
            return;
        }

        let spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length == 0) {
            return;
        }
        let spawn = spawns[0];

        let numRolesCurr = _.mapValues(
            config.roles,
            (_, role) => room.find(FIND_MY_CREEPS, {filter: (c) => (c.memory.role == role) && (c.ticksToLive > 150)}).length
        );

        let spawnRoles = config.spawnRoles[room.name];
        for (let role of spawnRoles) {
            if (!(role in numRolesCurr) || numRolesCurr[role] == 0) {
                let newNames = _.filter(config.names, (n) => !(n in Game.creeps));
                let newName = (newNames.length > 0) ? (_.sample(newNames)) : ("Creep" + Game.time);

                let spawnStatus = spawn.spawnCreep(config.equips[role], newName, {memory: {role: role}});
                if (spawnStatus == OK) {
                    console.log(`Spawning: ${newName} (${role})`);
                }
                return;
            } else {
                numRolesCurr[role] -= 1;
            }
        }
    }
};

module.exports = spawnController;
