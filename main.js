var memoryManager = require("memoryManager");
var visualManager = require("visualManager");
var spawnController = require("spawnController");
var towerController = require("towerController");
var config = require("config");

module.exports.loop = function () {
    memoryManager.run();

    for (room of Object.values(Game.rooms)) {
        spawnController.run(room, config);
        towerController.run(room, config);
    }

    for (creep of Object.values(Game.creeps)) {
        if ((creep.memory.role in config.roles) && (creep.memory.state != "ignore")) {
            config.roles[creep.memory.role].run(creep);
        }
    }

    visualManager.run(config);
}
