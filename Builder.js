var Creep = require('Creep');

module.exports = class Builder extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    decideState() {
        if (this.getTicksToLive() < 50) {
            this.getMemory().state = 'recycling';
        } else if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'building';
        } else if (this.getMemory().state === 'building' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }

    decideTarget() {
        const sites = this.getRoom().find(FIND_MY_CONSTRUCTION_SITES);

        if (!sites) {
            return null;
        }

        const target = sites.reduce((best, current) => {
            const bestProgress = best.progress / best.progressTotal;
            const currentProgress = current.progress / current.progressTotal;
            return currentProgress > bestProgress ? current : best;
        }, sites[0]);

        return target;
    }

    run() {
        this.decideState();

        if (this.getMemory().type === 'init') {
            var path = this.pos().findPathTo(this.getRoom().controller, { range: 4 });

            if (path.length) {
                this.moveTo(this.getRoom().controller);
            }

            if (path.length <= 4) {
                this.getRoom().createConstructionSite(this.pos(), STRUCTURE_CONTAINER);
                this.getMemory().type = 'hybrid';
            }
        } else if (this.getMemory().state === 'harvesting') {
            var container = this.pos().findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (container) {
                this.withdrawFrom(container, RESOURCE_ENERGY);
            } else {
                this.moveTo(Game.spawns.Spawn1)
            }
        } else if (this.getMemory().state === 'building') {
            var target = this.decideTarget();

            if (!target) {
                this.getMemory().state = 'recycling';
            } else {
                this.build(target);
            }
        } else if (this.getMemory().state === 'recycling') {
            this.death();
        }
    }
}
