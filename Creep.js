module.exports = class Creep {
    constructor(creep) {
        this.creep = creep;
    }

    getCreep() {
        return this.creep;
    }

    getMemory() {
        return this.creep.memory;
    }

    getRoom() {
        return this.creep.room;
    }

    getTicksToLive() {
        return this.creep.ticksToLive
    }

    harvestFrom(target) {
        this.creep.harvest(target);
    }

    moveTo(target) {
        this.creep.moveTo(target);
    }

    say(message) {
        this.creep.say(message);
    }

    transferTo(target, resourceType, amount) {
        this.creep.transfer(target, resourceType, amount);
    }

    decideState() {
        if (this.getMemory().state === 'harvesting' && this.creep.store.getFreeCapacity() === 0) {
            this.getMemory().state = 'transfering';
        } else if (this.getMemory().state === 'transfering' && this.creep.store.getUsedCapacity() === 0) {
            this.getMemory().state = 'harvesting';
        }
    }
}
