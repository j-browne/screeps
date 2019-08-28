var towerController = {
    /**
     * @param {Room} room
     * @param config
     */
    run: function(room, config) {
        let towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        for (let tower of towers) {
            let enemy = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{
                //filter: (c) => (c.getActiveBodyparts(ATTACK) != 0) || (c.getActiveBodyparts(RANGED_ATTACK) != 0),
                filter: (c) => (!config.userWhitelist.includes(c.owner.username)),
                ignoreCreeps: true
            });
            if (enemy != null) {
                tower.attack(enemy);
            }

            /*
            let enemy = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{
                filter: (c) => (c.getActiveBodyparts(HEAL) != 0),
                ignoreCreeps: true
            });
            if (enemy != null) {
                tower.attack(enemy);
            }

            let creep = _.min(room.find(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax}), (c) => c.hits);
            if (creep != null) {
                tower.heal(creep);
            }

            if ((enemy == null) && (tower.energy > tower.energyCapacity / 2)) {
                let structure = _.min(room.find(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL}), (s) => s.hits / s.hitsMax);
                tower.repair(structure);
            }
            */
        }
    }
};

module.exports = towerController;
