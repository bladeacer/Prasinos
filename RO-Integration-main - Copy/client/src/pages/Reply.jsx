import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function Reply({ reply, setReply }) {
  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: "150px"}}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Reply
      </Typography>
      <TextField
        label="Reply"
        variant="outlined"
        value={reply}
        onChange={handleReplyChange}
        multiline
        rows={4}
        sx={{ width: '80%', mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}

export default Reply;
