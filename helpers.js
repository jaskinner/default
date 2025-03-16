function spawnHelper() {
    const counts = {
        creep: Object.keys(Game.creeps).length,
        harvester: _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length,
        upgrader: _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length,
        builder: _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length,
        truck: _.filter(Game.creeps, (creep) => creep.memory.type === 'truck').length,
        shovel: _.filter(Game.creeps, (creep) => creep.memory.type === 'shovel').length,
        repairer: _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer').length,
        construction: _.filter(Game.constructionSites, (site) => site.my)
    };

    const bodyParts = {
        default: [MOVE, WORK, CARRY],
        harvester: {
            shovel: [MOVE, WORK],
            truck: [MOVE, CARRY]
        },
    };

    function createCreep(body, role, type) {
        const creep = Game.spawns['Spawn1'].spawnCreep(body, role + Game.time, {
            memory: { role, type }
        });
        
        return creep;
    }

    let creep;

    if (counts.harvester < 4) {
        if (counts.harvester === 0 || counts.shovel < 2 && counts.truck > 0) {
            creep = createCreep(bodyParts.harvester.shovel, 'harvester', 'shovel');
            console.log('Harvester-Shovel: ' + creep);
        } else {
            creep = createCreep(bodyParts.harvester.truck, 'harvester', 'truck');
            console.log('Harvester-Truck: ' + creep);
        }
    }

    if (counts.harvester >= 2 && counts.upgrader >= 2) {
        if (counts.construction.length && counts.builder < 2) {
            creep = Game.spawns['Spawn1'].spawnCreep(bodyParts.default, 'Builder' + Game.time, {
                memory: { role: 'builder' }
            });

            console.log('Builder: ' + creep);
        }

        if (counts.repairer < 1 && !counts.construction.length) {
            creep = Game.spawns['Spawn1'].spawnCreep(bodyParts.default, 'Repairer' + Game.time, {
                memory: { role: 'repairer' }
            });

            console.log('Repairer: ' + creep);
        }
    }

    if (counts.upgrader < 3 && counts.harvester >= 2) {
        creep = Game.spawns['Spawn1'].spawnCreep(bodyParts.default, 'Upgrader' + Game.time, {
            memory: { role: 'upgrader' }
        });

        console.log('Upgrader: ' + creep);
    }
}

function memoryCleanup() {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            console.log('Clearing non-existing creep memory:', creepName);
            delete Memory.creeps[creepName];
        }
    }
}

module.exports = {
    memoryCleanup,
    spawnHelper,
};
