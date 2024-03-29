var memoryManager = {
    run: function() {
        for (let name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                console.log(`Clearing creep memory: ${name} (${Memory.creeps[name].role})`);
                delete Memory.creeps[name];
            }
        }
        for (let name in Memory.flags) {
            if (!(name in Game.flags)) {
                console.log(`Clearing flag memory: ${name}`);
                delete Memory.flags[name];
            }
        }
        for (let name in Memory.spawns) {
            if (!(name in Game.spawns)) {
                console.log(`Clearing spawn memory: ${name}`);
                delete Memory.spawns[name];
            }
        }
    }
};

module.exports = memoryManager;
