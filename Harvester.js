var Creep = require('Creep');

module.exports = class Harvester extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    getClosestEnergySource() {
        return this.pos().findClosestByPath(FIND_SOURCES_ACTIVE);
    }

    getType() {
        return this.getMemory().type;
    }

    harvest() {
        var source = this.getClosestEnergySource();

        if (source) {
            this.harvestFrom(source);
        } else {
            this.getMemory().state = 'transfering';
        }
    }

    transfer() {
        this.getCreep().drop(RESOURCE_ENERGY);
    }

    run() {
        this.decideState();

        if (this.getMemory().state === 'harvesting') {
            this.harvest()
        } else if (this.getMemory().state === 'transfering') {
            this.transfer();
        } else if (this.getMemory().state === 'recycling') {
            this.death();
        }
    }
}
