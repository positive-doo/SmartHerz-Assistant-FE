import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type RightPaneProps = {
  title?: string;
};

export default function RightPane({ title = "AI asistent vam preporučuje" }: RightPaneProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>

      <Box sx={{ height: 1, backgroundColor: "#a855f7", opacity: 0.6, mb: 2, width: "795px" }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#6d28d9" }}>
          Aktivni filteri
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <FilterPill label="Unesi odredište" />
        <FilterPill label="Unesi datum" />
        <FilterPill label="Unesi interesovanje" />
      </Box>
    </Box>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      sx={{
        borderRadius: 999,
        textTransform: "none",
        borderColor: "#a855f7",
        color: "#111827",
        "&:hover": { borderColor: "#6d28d9" },
      }}
    >
      {label}
    </Button>
  );
}