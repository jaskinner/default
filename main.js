var Harvester = require('Harvester');

module.exports.loop = function () {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            console.log('Clearing non-existing creep memory:', creepName);
            delete Memory.creeps[creepName];
        }
    }

    const creepCount = Object.keys(Game.creeps).length;
    
    if (creepCount === 0) {
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester1', {
            memory: { role: 'harvester' }
        });
    }
    
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.memory.role === 'harvester') {
            let harvester = new Harvester(creep);
            harvester.decideState();
            harvester.run();
        }
    }
}
