import React from "react";
import { Box, Input, Button, Grid2, Fab, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

interface SendInputProps {
  // uncomment these once socket.io functionality returns
  // message: string;
  // setMessage: (msg: string) => void;
  onClick?: () => void;
}
// const SendInput: React.FC<SendInputProps> = ({ message, setMessage, onClick }) => {
const SendInput: React.FC<SendInputProps> = ({onClick }) => {
  return (
    <Grid2 container sx={{ padding: '20px' }}>
    <Grid2 size={{xs:11}}>
      <TextField id="message" label="Send a Message..." fullWidth />
    </Grid2>
    <Grid2 size={{xs:1}} sx={{display:'flex', justifyContent:"right"}}>
      <Fab color="primary" aria-label="send">
        <SendIcon/>
      </Fab>
    </Grid2>
  </Grid2>
  );
};

export default SendInput;