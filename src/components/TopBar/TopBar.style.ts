import { styled } from "@mui/material/styles";
import { Toolbar, Typography, Button, IconButton, Box } from "@mui/material";

/** --- Contenedor principal del AppBar --- */
export const Bar = styled(Toolbar)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  minHeight: 70,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    justifyContent: "flex-start",
  },
}));

/** --- Marca / Logo clickable --- */
export const Brand = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  letterSpacing: ".15rem",
  cursor: "pointer",
  userSelect: "none",
  color: "inherit",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

/** --- Menú principal centrado (solo visible en desktop) --- */
export const DesktopNav = styled("nav")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing(2.5),
  },
}));

/** --- Botón hamburguesa visible solo en móvil --- */
export const BurgerButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

/** --- Zona derecha (perfil, etc.) --- */
export const RightZone = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: {
    marginLeft: "auto",
  },
}));

/** --- Separador flexible --- */
export const Spacer = styled("div")(() => ({
  flex: 1,
}));

/** --- Botón de navegación con estado activo --- */
export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active?: boolean }>(({ theme, $active }) => ({
  color: theme.palette.common.white,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  letterSpacing: "0.02em",
  paddingInline: theme.spacing(1.5),
  height: 42,
  borderRadius: 999,
  transition: "background-color 0.2s ease",
  ...($active
    ? {
        backgroundColor: "rgba(255,255,255,0.16)",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.28)" },
      }
    : {
        backgroundColor: "transparent",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
      }),
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.contrastText}`,
    outlineOffset: 2,
  },
}));
