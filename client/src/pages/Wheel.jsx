// Jun Long
import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const WheelContainer = styled(Box)`
  position: relative;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #000; /* Black border around the wheel */
`;

const WheelContent = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: conic-gradient(${({ colorSegments }) => colorSegments});
  border-radius: 50%;
  transition: transform 5s ease-out;
`;

const Pointer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid #000; /* Black pointer */
  transform: translate(-50%, -50%) rotate(0deg); /* Center and point downwards */
  z-index: 2;
`;

const Spinner = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  animation: ${spinAnimation} 5s ease-out;
`;

// Define colors and their points
const colors = [
  "red",
  "blue",
  "yellow",
  "red",
  "blue",
  "yellow",
  "red",
  "blue",
  "yellow",
  "red",
  "blue",
  "green",
];

const points = [50, 100, 200, 50, 100, 200, 50, 100, 200, 50, 100, 500];

const Wheel = ({ onFinish }) => {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (reward !== null) {
      const segmentAngle = 360 / colors.length;
      const finalRotation = rotation % 360;
      const winningIndex =
        Math.floor((360 - finalRotation) / segmentAngle) % colors.length;
      const selectedPoints = points[winningIndex];

      setTimeout(() => {
        setSpinning(false);
        setTimeout(() => {
          onFinish(selectedPoints);
        }, 3000); // Pause for 3 seconds before finalizing
      }, 5000); // Match spin duration
    }
  }, [reward]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setShowButton(false);

    // Determine the number of rotations and the final angle
    const additionalRotation = Math.floor(Math.random() * 360);
    const totalRotation = additionalRotation + 360 * 5; // 5 full rotations
    setRotation(totalRotation);

    // Set the reward and start spinning
    const totalSegments = colors.length;
    const randomIndex = Math.floor(Math.random() * totalSegments);
    setReward({ index: randomIndex });
  };

  // Create conic-gradient background for the wheel
  const colorSegments = colors
    .map(
      (color, i) =>
        `${color} ${i * (360 / colors.length)}deg ${
          (i + 1) * (360 / colors.length)
        }deg`
    )
    .join(", ");

  return (
    <Box>
      <WheelContainer>
        {spinning && <Spinner />}
        <WheelContent
          colorSegments={colorSegments}
          sx={{ transform: `rotate(${rotation}deg)` }}
        />
        <Pointer />
      </WheelContainer>
      {showButton && (
        <Button variant="contained" color="primary" onClick={handleSpin}>
          Spin
        </Button>
      )}
    </Box>
  );
};

export default Wheel;
