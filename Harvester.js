var Creep = require('Creep');

module.exports = class Harvester extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    run() {
        this.decideState();

        if (this.getTicksToLive() < 50) {
            if (this.getCreep().store.getUsedCapacity() === 0) {
                this.getCreep().suicide();
            }

            this.getMemory().state = 'transfering';
            this.say('I am dying');
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, {
                memory: { role: 'harvester' }
            });
        }

        if (this.getMemory().state === 'harvesting') {
            var sources = this.getRoom().find(FIND_SOURCES);
            this.moveTo(sources[0]);
            this.harvestFrom(sources[0]);
        } else if (this.getMemory().state === 'transfering') {
            var targets = this.getRoom().find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (targets.length > 0) {
                this.moveTo(targets[0]);
                this.transferTo(targets[0], RESOURCE_ENERGY);
            }
        }
    }
}
