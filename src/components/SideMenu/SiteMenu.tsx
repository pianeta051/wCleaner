import { FC } from "react";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";

export type Section = { id: string; label: string };

type SideMenuProps = {
  sections: Section[];
  currentSection: string;
  onSelect: (id: string) => void;
  dense?: boolean;
};

export const SideMenu: FC<SideMenuProps> = ({
  sections,
  currentSection,
  onSelect,
  dense,
}) => (
  <Box
    sx={{ position: "fixed", top: 80, width: "100%", maxWidth: 100, mt: 10 }}
  >
    <List component="nav" sx={dense ? { px: 0.5 } : undefined}>
      {sections.map(({ id, label }) => (
        <ListItemButton
          key={id}
          selected={currentSection === id}
          onClick={() => onSelect(id)}
          sx={{ pl: 2 }}
        >
          <ListItemText
            primary={label}
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      ))}
    </List>
  </Box>
);
