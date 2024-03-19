const processLookAlgorithm = (currentFloor, pickupFloors, dropoffFloors, callback) => {
    let direction = 'UP';
    let visitedFloors = []; // Use an array to track visited floors

    const isFloorVisited = (floor) => {
        for (let i = 0; i < visitedFloors.length; i++) {
            if (visitedFloors[i] === floor) {
                return true;
            }
        }
        return false;
    };

    const getNextFloor = () => {
        let combinedFloors = [];
        // Combine and deduplicate floors manually
        pickupFloors.concat(dropoffFloors).forEach(floor => {
            if (combinedFloors.indexOf(floor) === -1 && !isFloorVisited(floor)) {
                combinedFloors.push(floor);
            }
        });

        // Manual closest floor determination based on direction
        let nextFloor = null;
        let minDistance = Infinity;
        combinedFloors.forEach(floor => {
            let distance = Math.abs(floor - currentFloor);
            if (direction === 'UP' && floor > currentFloor && distance < minDistance) {
                minDistance = distance;
                nextFloor = floor;
            } else if (direction === 'DOWN' && floor < currentFloor && distance < minDistance) {
                minDistance = distance;
                nextFloor = floor;
            }
        });
        return nextFloor;
    };

    const processFloors = () => {
        let nextFloor = getNextFloor();

        if (nextFloor === null) {
            // Switch direction if no more floors in the current direction
            direction = direction === 'UP' ? 'DOWN' : 'UP';
            nextFloor = getNextFloor(); // Attempt to find next floor in new direction
        }

        if (nextFloor !== null) {
            setTimeout(() => {
                visitedFloors.push(nextFloor); // Mark this floor as visited
                currentFloor = nextFloor; // Update the current floor
                callback(nextFloor, direction); // Invoke the callback
                processFloors(); // Continue processing
            }, 1000); // Simulate processing delay
        } else {
            callback(null, 'IDLE'); // No more floors to process
        }
    };

    processFloors();
};

export { processLookAlgorithm };
