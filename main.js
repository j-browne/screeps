var memoryManager = require("memoryManager");
var visualManager = require("visualManager");
var spawnController = require("spawnController");
var harvesterController = require("harvesterController");
var towerController = require("towerController");
var config = require("config");

module.exports.loop = function () {
    memoryManager.run();

    for (let room of Object.values(Game.rooms)) {
        spawnController.run(room, config);
        harvesterController.run(room, config);
        towerController.run(room, config);
    }

    for (let creep of Object.values(Game.creeps)) {
        if ((creep.memory.role in config.roles) && (creep.memory.state != "ignore")) {
            config.roles[creep.memory.role].run(creep);
        }
    }

    visualManager.run(config);
}
