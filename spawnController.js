var spawnController = {
    /**
     * @param {Room} room
     * @param config
     */
    run: function(room, config) {
        if (config.pauseSpawning[room.name]) {
            return;
        }

        var spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length == 0) {
            return;
        }
        var spawn = spawns[0];

        var numRolesCurr = {};
        for (role in config.roles) {
            numRolesCurr[role] = room.find(FIND_MY_CREEPS, {filter: (c) => (c.memory.role == role) && (c.ticksToLive > 200)}).length;
        }

        var spawnRoles = config.spawnRoles[room.name];
        for (roleNum in spawnRoles) {
            var role = spawnRoles[roleNum];
            if (!(role in numRolesCurr) || numRolesCurr[role] == 0) {
                var newNames = _.filter(config.names, (n) => !(n in Game.creeps));
                var newName = (newNames.length > 0) ? (_.sample(newNames)) : ("Creep" + Game.time);

                var spawnStatus = spawn.spawnCreep(config.equips[role], newName, {memory: {role: role}});
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
