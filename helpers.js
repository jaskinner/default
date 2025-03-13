function spawnHelper() {
    const counts = {
        creep: Object.keys(Game.creeps).length,
        harvester: _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length,
        upgrader: _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length,
        builder: _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length,
        truck: _.filter(Game.creeps, (creep) => creep.memory.type === 'truck').length,
        shovel: _.filter(Game.creeps, (creep) => creep.memory.type === 'shovel').length,
        repairer: _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer').length,
        construction: _.filter(Game.constructionSites, (site) => site.my)
    };

    let creep;

    if (counts.harvester < 2) {
        if (counts.harvester === 0 || counts.shovel < 1) {
            creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, WORK, WORK, WORK, WORK], 'Harvester-Shovel' + Game.time, {
                memory: { role: 'harvester', type: 'shovel' }
            });
        } else {
            creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], 'Harvester-Truck' + Game.time, {
                memory: { role: 'harvester', type: 'truck' }
            });
        }
    }

    if (counts.harvester >= 2 && counts.upgrader >= 2) {
        if (counts.construction.length && counts.builder < 2) {
            creep = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY], 'Builder' + Game.time, {
                memory: { role: 'builder' }
            });
        }

        if (counts.repairer < 1 && !counts.construction.length) {
            creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], 'Repairer' + Game.time, {
                memory: { role: 'repairer' }
            });
        }
    }

    if (counts.upgrader < 2 && counts.harvester >= 2) {
        creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, WORK, WORK, CARRY, CARRY, CARRY], 'Upgrader' + Game.time, {
            memory: { role: 'upgrader' }
        });
    }
}

function memoryCleanup() {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            console.log('Clearing non-existing creep memory:', creepName);
            delete Memory.creeps[creepName];
        }
    }
}

module.exports = {
    memoryCleanup,
    spawnHelper
};
