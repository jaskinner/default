var Creep = require('Creep');

module.exports = class Harvester extends Creep {
    constructor(creep) {
        super(creep);
        if (!this.getMemory().state) {
            this.getMemory().state = 'harvesting';
        }
    }

    setPFocus(target) {
        this.getMemory().pfocus = target.id;
    }

    getPFocus() {
        return Game.getObjectById(this.getMemory().pfocus);
    }

    setTFocus(target) {
        this.getMemory().tfocus = target.id;
    }

    getTFocus() {
        return Game.getObjectById(this.getMemory().tfocus);
    }

    getLargestSource() {
        return this.getRoom().find(FIND_SOURCES_ACTIVE).sort((a, b) => {
            return b.energy - a.energy;
        })[0];
    }

    getClosestEnergySource() {
        return this.pos().findClosestByPath(FIND_SOURCES_ACTIVE, {range: 1, ignoreCreeps: true});
    }

    getType() {
        return this.getMemory().type;
    }

    harvestFrom(target) {
        if (this.getCreep().harvest(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    harvest() {
        let source;
        
        if (this.getPFocus()) {
            source = this.getPFocus();
        } else {
            source = this.getLargestSource();
            this.setPFocus(source.id);
        }

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
