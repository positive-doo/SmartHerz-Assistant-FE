"use client";

import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "6fr 4fr" },
      }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          borderRight: { xs: "none", md: "1px solid #e5e5e5" },
          p: 3,
        }}
      >
        LEFT
      </Box>
      <Box sx={{ minHeight: "100vh", p: 3 }}>RIGHT</Box>
    </Box>
  );
}
