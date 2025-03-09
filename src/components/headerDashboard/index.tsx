import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const HeaderTitle = () => {
  const viewtheme = useTheme();
  const {
    palette: { mode: isTheme },
  } = viewtheme;

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      flexWrap={"wrap"}
      gap={"0.5rem"}
      marginLeft={"1rem"}
    >
      <Typography fontWeight={"600"}>Task Management</Typography>
      <Box
        component={"img"}
        src={
          isTheme === "dark"
            ? "/white-taskmanagement.png"
            : "/taskmanagement.png"
        }
        alt="Gerenciador de Tarefas"
        maxWidth={"24px"}
      />
    </Box>
  );
};

export default HeaderTitle;
