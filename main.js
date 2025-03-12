var Harvester = require('Harvester');
var Upgrader = require('Upgrader');

module.exports.loop = function () {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            console.log('Clearing non-existing creep memory:', creepName);
            delete Memory.creeps[creepName];
        }
    }

    const creepCount = Object.keys(Game.creeps).length;

    if (creepCount === 0) {
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester', {
            memory: { role: 'harvester' }
        });
    } else if (creepCount < 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Upgrader', {
            memory: { role: 'upgrader' }
        });
    }

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.memory.role === 'harvester') {
            let harvester = new Harvester(creep);
            harvester.run();
        } else if (creep.memory.role === 'upgrader') {
            let upgrader = new Upgrader(creep);
            upgrader.run();
        }
    }
}
