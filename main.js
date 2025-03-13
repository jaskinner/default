var Harvester = require('Harvester');
var Truck = require('Truck');
var Upgrader = require('Upgrader');
var Builder = require('Builder');
var Repairer = require('Repairer');

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
        repairer: _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer').length,
        construction: _.filter(Game.constructionSites, (site) => site.my)
    };

    if (counts.harvester < 4) {
        if (counts.harvester === 0 || counts.shovel < 2) {
            let creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, WORK, WORK, WORK, WORK], 'Harvester-Shovel' + Game.time, {
                memory: { role: 'harvester', type: 'shovel' }
            });

            console.log('Spawning new Harvester-Shovel');
        } else {
            let creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], 'Harvester-Truck' + Game.time, {
                memory: { role: 'harvester', type: 'truck' }
            });

            console.log('Spawning new Harvester-Shovel');
        }
    }

    if (counts.upgrader < 2 && counts.harvester >= 2) {
        let creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, WORK, WORK, CARRY, CARRY, CARRY], 'Upgrader' + Game.time, {
            memory: { role: 'upgrader' }
        });
    }

    if (counts.construction.length && counts.harvester >= 2 && counts.upgrader >= 2 && counts.builder < 2) {
        let creep = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY], 'Builder' + Game.time, {
            memory: { role: 'builder' }
        });
    }

    if (counts.harvester >= 2 && counts.upgrader >= 2 && counts.repairer < 2 && !counts.construction.length) {
        let creep = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], 'Repairer' + Game.time, {
            memory: { role: 'repairer' }
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
        } else if (creep.memory.role === 'repairer') {
            let repairer = new Repairer(creep);
            repairer.run();
        }
    }
}
