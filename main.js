var { Harvester, Truck } = require('Harvester');
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
        builder: _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length,
        truck: _.filter(Game.creeps, (creep) => creep.memory.type === 'truck').length,
        shovel: _.filter(Game.creeps, (creep) => creep.memory.type === 'shovel').length,
        construction: Game.constructionSites
    };

    if (counts.harvester < 2) {
        if (counts.harvester === 0 || counts.truck > 0) {
            Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, WORK, WORK], 'Harvester-Shovel' + Game.time, {
                memory: { role: 'harvester', type: 'shovel' }
            });
        } else {
            Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], 'Harvester-Truck' + Game.time, {
                memory: { role: 'harvester', type: 'truck' }
            });
        }
    }

    if (counts.upgrader < 2 && counts.harvester >= 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, MOVE, MOVE, CARRY, CARRY], 'Upgrader' + Game.time, {
            memory: { role: 'upgrader' }
        });
    }

    if (counts.construction && counts.harvester >= 2 && counts.upgrader >= 2 && counts.builder < 2) {
        let creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY, CARRY, CARRY, CARRY], 'Builder' + Game.time, {
            memory: { role: 'builder' }
        });
    }

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.memory.role === 'harvester') {
            if (creep.memory.type === 'truck') {
                let truck = new Truck(creep);
                truck.run();
            } else {
                let harvester = new Harvester(creep);
                harvester.run();
            }
        } else if (creep.memory.role === 'upgrader') {
            let upgrader = new Upgrader(creep);
            upgrader.run();
        } else if (creep.memory.role === 'builder') {
            let builder = new Builder(creep);
            builder.run();
        }
    }
}
