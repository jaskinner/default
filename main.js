var Harvester = require('Harvester');
var Upgrader = require('Upgrader');
var Builder = require('Builder');

module.exports.loop = function () {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            console.log('Clearing non-existing creep memory:', creepName);
            delete Memory.creeps[creepName];
        }
    }

    const counts = {
        creep: Object.keys(Game.creeps).length,
        harvester: _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length,
        upgrader: _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length,
    };

    if (counts.harvester < 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, WORK, WORK], 'Harvester' + Game.time, {
            memory: { role: 'harvester' }
        });
    }

    if (counts.upgrader < 2 && counts.harvester >= 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, MOVE, MOVE, CARRY, CARRY], 'Upgrader' + Game.time, {
            memory: { role: 'upgrader' }
        });
    }

    if (counts.construction && counts.harvester >= 2 && counts.upgrader >= 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY, CARRY, CARRY, CARRY], 'Builder' + Game.time, {
            memory: { role: 'builder' }
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
        } else if (creep.memory.role === 'builder') {
            let builder = new Builder(creep);
            builder.run();
        }
    }
}
