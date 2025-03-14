var Creep = require('Creep');

module.exports = class Upgrader extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    upgradeController(controller) {
        if (this.getCreep().upgradeController(controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(controller);
        }
    }

    decideState() {
        if (this.getTicksToLive() < 50) {
            this.getMemory().state = 'recycling';
        } else if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'upgrading';
        } else if (this.getMemory().state === 'upgrading' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            var container = this.pos().findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (container) {
                this.withdrawFrom(container, RESOURCE_ENERGY);
                // } else {
                //     let source = this.getLargestDroppedEnergy()
                //     this.pickup(source)
            }
        } else if (this.getMemory().state === 'upgrading') {
            var controller = this.getRoom().controller;
            this.upgradeController(controller);
        } else if (this.getMemory().state === 'recycling') {
            this.death();
        }
    }
}
