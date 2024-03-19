import React, { useState } from 'react';
import './App.css';
import DropOffFloorPopup from './components/utility/DropOffFloorPopup';
import { processLookAlgorithm } from './components/ElevatorHelper';

const totalFloors = 10;
const initialHeadPosition = 5;

function App() {
  const [elevator, setElevator] = useState({
    headPosition: initialHeadPosition,
    pickups: [],
    dropoffs: [],
    isRunning: false,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [selectedPickupFloor, setSelectedPickupFloor] = useState(null);

  const handleFloorClick = (floor) => {
    setSelectedPickupFloor(floor);
    setShowPopup(true);
  };

  const handleDropOffSelect = (dropoffFloor) => {
    // Adjustments might be needed here based on how your DropOffFloorPopup component passes the dropoff floor
    setElevator(prevElevator => ({
      ...prevElevator,
      pickups: [...prevElevator.pickups, selectedPickupFloor],
      dropoffs: [...prevElevator.dropoffs, dropoffFloor],
    }));
    setShowPopup(false);
    setSelectedPickupFloor(null);
  };

  const serviceFloor = (floor) => {
    setElevator((prevElevator) => {
      const newPickups = prevElevator.pickups.filter((p) => p !== floor);
      const newDropoffs = prevElevator.dropoffs.filter((d) => d !== floor);
      return {
        ...prevElevator,
        pickups: newPickups,
        dropoffs: newDropoffs,
      };
    });
  };

  // This function starts the elevator process by calling processLookAlgorithm
  const startElevator = () => {
    if (!elevator.isRunning && elevator.pickups.length > 0) {
      setElevator(prevElevator => ({ ...prevElevator, isRunning: true }));
      // Call processLookAlgorithm with the current state and a callback to handle state updates
      processLookAlgorithm(elevator.headPosition, elevator.pickups, elevator.dropoffs, (nextFloor, isPickup) => {
        // Update the state based on the algorithm's output
        setElevator(prevElevator => {
          const newHeadPosition = nextFloor;
          let newPickups = [...prevElevator.pickups];
          let newDropoffs = [...prevElevator.dropoffs];
          if (isPickup) {
            // If it's a pickup, remove the floor from pickups
            newPickups = newPickups.filter(floor => floor !== nextFloor);
          } else {
            // If it's a dropoff, remove the floor from dropoffs
            newDropoffs = newDropoffs.filter(floor => floor !== nextFloor);
          }

          if (nextFloor !== null) {
            serviceFloor(nextFloor);

            return {
              ...prevElevator,
              headPosition: newHeadPosition,
              pickups: newPickups,
              dropoffs: newDropoffs,
              // Continue running if there are more floors to service
              isRunning: newPickups.length > 0 || newDropoffs.length > 0,
            };
          } else {
            // No more floors to process, keep the last headPosition and update other states
            return {
              ...prevElevator,
              isRunning: false,
              direction: 'IDLE',
            };
          }
        });
      });
    }
  };

  return (
    <div className="App">
      <h1>Elevator Simulation</h1>
      <button onClick={startElevator} disabled={elevator.isRunning}>Start Elevator</button>
      <div className="display-screen">
        <p>Current Floor: {elevator.headPosition}</p>
      </div>
      <div className="elevator-system">
        <div className="floors-column">
          {[...Array(totalFloors)].map((_, index) => {
            const floorNumber = totalFloors - index;
            return (
              <div key={floorNumber} onClick={() => handleFloorClick(floorNumber)} className="floor-button">
                Floor {floorNumber}
              </div>
            );
          })}
        </div>
        <div className="elevator-column">
          {[...Array(totalFloors)].map((_, index) => {
            const floorNumber = totalFloors - index;
            const isActive = elevator.headPosition === floorNumber;
            return (
              <div key={floorNumber} className={`floor ${isActive ? 'active' : ''}`}>
                {isActive && <div className="elevator">Elevator</div>}
              </div>
            );
          })}
        </div>
      </div>
      {showPopup && (
        <DropOffFloorPopup
          totalFloors={totalFloors}
          onSelectFloor={handleDropOffSelect}
          onClose={() => setShowPopup(false)}
        />
      )}
      <h2>Elevator Queue</h2>
      <table>
        <thead>
          <tr>
            <th>Pickup Floors</th>
            <th>Dropoff Floors</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over the pickups and dropoffs arrays to create the table rows */}
          {elevator.pickups.map((pickupFloor, index) => (
            <tr key={index}>
              <td>{pickupFloor}</td>
              {/* Safely access the corresponding dropoff floor, if it exists */}
              <td>{elevator.dropoffs[index] ?? 'Waiting...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
