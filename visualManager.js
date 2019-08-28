var visualManager = {
    run: function(config) {
        if (config.visuals.includes("hitBars")) {
            for (let room of Object.values(Game.rooms)) {
                let structs = room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
                });
                for (let struct of structs) {
                    let frac = struct.hits / struct.hitsMax;
                    room.visual
                        .rect(
                            struct.pos.x - 0.25,
                            struct.pos.y - 0.25,
                            0.5,
                            0.1,
                            {
                                fill: "#000000",
                                stroke: "#888888",
                                strokeWidth: 0.01,
                                opacity: 1.0
                            }
                        )
                        .rect(
                            struct.pos.x - 0.24,
                            struct.pos.y - 0.24,
                            0.48 * frac,
                            0.08,
                            {
                                fill: `rgb(${255 * (1 - frac)}, ${191 * frac}, 0)`,
                                opacity:1.0
                            }
                        );
                }
            }
        }

        if (config.visuals.includes("creepNames")) {
            for (let creep of Object.values(Game.creeps)) {
                creep.room.visual
                    .text(
                        `${creep.name}`,
                        creep.pos.x,
                        creep.pos.y - 0.05,
                        {
                            font: "0.2",
                            stroke: "black",
                            strokeWidth: 0.08
                        }
                    )
                    .text(
                        `(${creep.memory.role})`,
                        creep.pos.x,
                        creep.pos.y + 0.2,
                        {
                            font: "0.2",
                            stroke: "black",
                            strokeWidth: 0.08
                        }
                    );
            }
        }
    }
};

module.exports = visualManager;
