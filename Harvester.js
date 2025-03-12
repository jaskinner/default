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
        const energyStores = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_CONTAINER];

        if (this.getMemory().state === 'harvesting') {
            var droppedSource = this.pos().findClosestByRange(FIND_DROPPED_RESOURCES) || this.pos().findClosestByRange(FIND_TOMBSTONES);
            var source = this.pos().findClosestByRange(FIND_SOURCES_ACTIVE);

            if (droppedSource) {
                this.pickup(droppedSource);
            } else {
                this.harvestFrom(source);
            }
            this.harvestFrom(source);
        } else if (this.getMemory().state === 'transfering') {
            var targets = this.getRoom().find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (energyStores.includes(structure.structureType)) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (targets.length > 0) {
                this.transferTo(targets[0], RESOURCE_ENERGY);
            } else {
                this.getCreep().drop(RESOURCE_ENERGY);
            }
        } else if (this.getMemory().state === 'recycling') {
            if (Game.spawns['Spawn1'].recycleCreep(this.getCreep()) === ERR_NOT_IN_RANGE) {
                this.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
}
