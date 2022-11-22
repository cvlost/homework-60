import React from 'react';
import {Box, CircularProgress} from "@mui/material";

interface Props {
  visible: boolean;
}

const Preloader: React.FC<Props> = ({visible}) => {
  return (
    <Box sx={{
      display: "flex",
      opacity: visible ? 1 : 0,
      transition: "opacity .3s",
      marginLeft: "auto",
      alignItems: "center"
    }}>
      <CircularProgress/>
    </Box>
  );
};

export default Preloader;