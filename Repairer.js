var Creep = require('Creep');

module.exports = class Repairer extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    repairTarget(target) {
        if (this.getCreep().repair(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    decideState() {
        if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'repairing';
        } else if (this.getMemory().state === 'repairing' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            var container = this.pos().findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if (container) {
                this.withdrawFrom(container, RESOURCE_ENERGY);
            }
        } else if (this.getMemory().state === 'repairing') {
            var target = this.pos().findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax;
                }
            });

            this.repairTarget(target);
        } else if (this.getMemory().state === 'recycling') {
            this.death();
        }
    }
}
