var helpers = require('helpers');
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

    helpers.spawnHelper();

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        let newCreep;
        if (creep.memory.role === 'harvester') {
            if (creep.memory.type === 'truck') {
                newCreep = new Truck(creep);
            }
            newCreep = new Harvester(creep);
        } else if (creep.memory.role === 'upgrader') {
            newCreep = new Upgrader(creep);
        } else if (creep.memory.role === 'builder') {
            newCreep = new Builder(creep);
        } else if (creep.memory.role === 'repairer') {
            newCreep = new Repairer(creep);
        }
        newCreep.run();
    }
}
