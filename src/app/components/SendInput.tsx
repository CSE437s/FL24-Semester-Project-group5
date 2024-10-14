import React from "react";
import { Box, Input, Button } from "@mui/material";

interface SendInputProps {
  // uncomment these once socket.io functionality returns
  // message: string;
  // setMessage: (msg: string) => void;
  onClick?: () => void;
}

// const SendInput: React.FC<SendInputProps> = ({ message, setMessage, onClick }) => {
const SendInput: React.FC<SendInputProps> = ({onClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center", // Ensures the input and button align vertically
        gap: 2, // Adds spacing between the input and button
        mt: 2, // Adds some margin to the top
      }}
    >
      {/* Using Input instead of TextField */}
      <Input
        fullWidth
        placeholder="Send a message..."
        // value={message}
        // onChange={(e) => setMessage(e.target.value)}
        disableUnderline={true} // Removes the underline for a cleaner look
        sx={{
          padding: "10px", // Adds padding inside the input
          border: "1px solid #ccc", // Adds a border to mimic the appearance of TextField
          borderRadius: "8px", // Rounds the corners
          backgroundColor: "#f9f9f9", // Adds a subtle background color
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={onClick}
        sx={{
          height: "40px", // Matches the height of the Input
          textTransform: "none", // Keeps button text normal case
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default SendInput;
