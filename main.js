module.exports.loop = function () {
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    for (var x in Game.creeps) {
        var creep = Game.creeps[x]
        
        // if (creep.ticksToLive < 300) { 
        //     goDump(creep)
        //     continue
        // }
        
        // if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity() && !creep.memory.dump) {
        //     goHarvest(creep)
        // } else {
        //     goDump(creep)
        // }
    }
}

function goHarvest(creep) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
    var stone = creep.pos.findClosestByRange(FIND_TOMBSTONES)
    
    if (stone) {
        if (creep.transfer(stone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(stone);
        }
    }
    
    if (source) {
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
}

function goDump(creep) {
    creep.memory.dump = creep.store.getCapacity() > creep.store.getFreeCapacity()

    // const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    // let isSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES).length
    // let creepCount = creep.room.find(FIND_MY_CREEPS).filter((x) => x.memory.role == 'builder').length < isSites
    
    // if (!target && creep.memory.role == "builder") {
    //     creep.memory.role = null
    // }

    for (var i in Game.spawns) {
        let spawn = Game.spawns[i]
        // let body = target ? [WORK, MOVE, CARRY, MOVE] : [WORK, MOVE, CARRY, CARRY, CARRY]
        // let babyCreep = spawn.spawnCreep(body, spawn.name + Math.random(), {
        //     memory: {
        //         role: target && creepCount ? "builder" : null, 
        //         dump: false
        //     }
        // })
        
        // if (creep.ticksToLive < 300) {
        //     creep.say("die")
        //     if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(spawn)
        //     }
        // } 
        
        creep.memory.spawnId = spawn.store.getFreeCapacity([RESOURCE_ENERGY]) == 0 ? null : spawn.id
    }
    
    // if (target) {
    //     if(creep.build(target) == ERR_NOT_IN_RANGE) {
    //         creep.moveTo(target);
    //     }
    // } 
    
    if (creep.room.controller && !creep.memory.spawnId) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        } 
    } else {
        spawn = Game.getObjectById(creep.memory.spawnId)

        if (spawn.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
            creep.memory.spawnId = null
        }
        
        if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn)
        }
    }
}
