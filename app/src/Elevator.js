import React, { useState, useEffect } from 'react';

export default function Elevator () {

  // state variables to track the current and destination floors
  const [currentFloor, setCurrentFloor] = useState(1)
  const [destinationFloor, setDestinationFloor] = useState(null)

  // queue of requests for the elevator
  const [requestQueue, setRequestQueue] = useState([])

  // move the elevator towards its destination floor
  useEffect(() => {
    // only start moving the elevator if there is a destination floor set
    if (destinationFloor) {
      const interval = setInterval(() => {
        // check if the elevator has reached its destination
        if (currentFloor === destinationFloor) {
          // remove the current destination from the queue
          setRequestQueue(requestQueue.slice(1));
          // if there are more requests in the queue, set the next one as the destination
          if (requestQueue.length > 0) {
            setDestinationFloor(requestQueue[0]);
          } else {
            // otherwise, reset the destination floor
            setDestinationFloor(null);
            clearInterval(interval);
          }
        } else {
          // move the elevator closer to its destination
          setCurrentFloor(currentFloor + (currentFloor < destinationFloor ? 1 : -1));
        }
      }, 1000)

      // clean up the interval when the component unmounts
      return () => clearInterval(interval)
    }
  }, [currentFloor, destinationFloor, requestQueue])

  // calculate the position of the elevator based on the current floor
  const elevatorPosition = 100 - currentFloor * 10

  // render the elevator component
  return (
    <div>
      <h1>Elevator</h1>
      <p>Current floor: {currentFloor}</p>
      <p>Destination floor: {destinationFloor || 'none'}</p>
      <p>Request queue: {requestQueue.join(', ') || 'none'}</p>
      {/* render the building, with the elevator at the calculated position */}
      <div style={{ position: 'relative', height: '1000px' }}>
        <div style={{ position: 'absolute', top: `${elevatorPosition}%` }}>
          Elevator
        </div>
        {/* render buttons for each floor */}
        {[...Array(10)].map((_, index) => (
          <button
            key={index}
            style={{ top: `${100 - (index + 1) * 10}%` }}
            disabled={index === currentFloor || requestQueue.includes(index + 1)}
            onClick={() => {
              // add the request to the queue
              setRequestQueue([...requestQueue, index + 1]);
              // if the elevator is not moving, set the request as the destination
              if (!destinationFloor) {
                setDestinationFloor(index + 1);
              }
            }}
          >
            Floor {index + 1}
          </button>
        ))}
      </div>
    </div>
  );

}