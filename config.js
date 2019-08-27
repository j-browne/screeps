var config = {
    roles: {
        "H": require("roleHarvester"),
        "T": require("roleTransporter"),
        "B": require("roleBuilder"),
        "U": require("roleUpgrader"),
        "A": require("roleAttacker")
    },
    equips: {
        "H": [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        "U": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "B": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "T": [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        "A": [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
    },
    spawnRoles: {
        "W43N47": ["T", "H", "H", "B", "B", "B", "U", "U"]
    },
    names: require("names"),
    pauseSpawning: {
        "W43N47": false
    },
    visuals: ["creepNames"],
    userWhitelist: ["NEZAJAC"]
};

module.exports = config;
