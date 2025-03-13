var Harvester = require('Harvester');

module.exports = class Truck extends Harvester {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    harvest() {
        var source = this.getLargestDroppedEnergy();
        var tombstone = this.pos().findClosestByRange(FIND_TOMBSTONES);

        console.log(source, tombstone);
        if (tombstone) {
            this.withdrawFrom(tombstone, RESOURCE_ENERGY);
        } else if (source) {
            this.pickup(source);
        }
    }

    transfer() {
        var targets = this.getRoom().energyAvailable < this.getRoom().energyCapacityAvailable ? this.getRoom().find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }) : this.getRoom().find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (targets.length > 0) {
            this.transferTo(targets[0], RESOURCE_ENERGY);
        }
    }
}
