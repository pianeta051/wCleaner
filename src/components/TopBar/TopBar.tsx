import { FC, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  MenuItem,
  Menu,
  Tooltip,
  Divider,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ProfileIcon } from "../ProfileIcon/ProfileIcon";

import {
  Bar,
  Brand,
  DesktopNav,
  BurgerButton,
  Spacer,
  NavButton,
  RightZone,
} from "./TopBar.style";

type Page = {
  label: string;
  url: string;
  exclusiveFor?: string;
};

export const TopBar: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);

  const { logOut, isInGroup, user } = useAuth();
  const isAdmin = isInGroup("Admin");

  const navigate = useNavigate();
  const location = useLocation();

  const pages: Page[] = useMemo(
    () =>
      [
        { label: "Customers", url: "/admin/customers", exclusiveFor: "Admin" },
        { label: "Users", url: "/admin/users", exclusiveFor: "Admin" },
        { label: "Jobs", url: "/admin/jobs" },
      ].filter((p) => (p.exclusiveFor ? isInGroup(p.exclusiveFor) : true)),
    [isAdmin]
  );

  const openUserMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(e.currentTarget);
  const closeUserMenu = () => setAnchorElUser(null);

  const openMainMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElMenu(e.currentTarget);
  const closeMainMenu = () => setAnchorElMenu(null);

  const go = (url: string) => {
    navigate(url);
    closeMainMenu();
  };

  const toProfile = () => {
    navigate("/admin/profile");
    closeUserMenu();
  };

  const logOutHandler = async () => {
    if (logOut) await logOut();
    closeUserMenu();
    navigate("/");
  };

  const isActive = (url: string) =>
    location.pathname === url || location.pathname.startsWith(url + "/");

  return (
    <AppBar position="fixed" elevation={2}>
      <Bar disableGutters>
        <BurgerButton
          color="inherit"
          aria-label="open main menu"
          onClick={openMainMenu}
          edge="start"
        >
          <MenuIcon />
        </BurgerButton>

        <Brand
          variant="h6"
          onClick={() => navigate("/")}
          role="link"
          aria-label="Go home"
        >
          Window Cleaner
        </Brand>

        <DesktopNav>
          {pages.map((p) => (
            <NavButton
              key={p.url}
              onClick={() => go(p.url)}
              $active={isActive(p.url)}
            >
              {p.label}
            </NavButton>
          ))}
        </DesktopNav>

        <Spacer />

        <RightZone>
          <Tooltip title="Open settings">
            <Box component="span">
              <NavButton onClick={openUserMenu}>
                <ProfileIcon />
              </NavButton>
            </Box>
          </Tooltip>
        </RightZone>
      </Bar>

      <Menu
        id="main-menu"
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={closeMainMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
      >
        {pages.map((p) => (
          <MenuItem
            key={p.url}
            onClick={() => go(p.url)}
            selected={isActive(p.url)}
            dense
          >
            {p.label}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id="user-menu"
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={closeUserMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
      >
        {user?.attributes?.email && (
          <>
            <MenuItem disableRipple>
              <ListItemText primary={user.attributes.email} />
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem onClick={toProfile}>Profile</MenuItem>
        <MenuItem onClick={logOutHandler}>Log out</MenuItem>
      </Menu>
    </AppBar>
  );
};
