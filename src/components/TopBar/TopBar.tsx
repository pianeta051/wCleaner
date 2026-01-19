import { FC, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Tooltip,
  Divider,
  Paper,
  List,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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
  MobileDrawer,
  DrawerHeader,
  DrawerBrand,
  DrawerClose,
  DrawerBody,
  DrawerItemButton,
  DrawerItemIcon,
  DrawerItemText,
  DrawerFooter,
  UserButton,
  CalendarButton,
  UserPopover,
  UserPopoverHeader,
  UserPopoverHeaderText,
  UserPopoverTitle,
  UserPopoverEmailRow,
  UserPopoverEmailText,
  UserPopoverList,
  UserActionButton,
  UserActionIcon,
} from "./TopBar.style";

type Page = {
  label: string;
  url: string;
  exclusiveFor?: string;
  icon?: React.ReactNode;
};

export const TopBar: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { logOut, isInGroup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pages: Page[] = useMemo(
    () =>
      [
        {
          label: "Customers",
          url: "/admin/customers",
          exclusiveFor: "Admin",
          icon: <PeopleIcon fontSize="small" />,
        },
        {
          label: "Users",
          url: "/admin/users",
          exclusiveFor: "Admin",
          icon: <GroupIcon fontSize="small" />,
        },
        {
          label: "Jobs",
          url: "/admin/jobs",
          icon: <WorkIcon fontSize="small" />,
        },
      ].filter((p) => (p.exclusiveFor ? isInGroup(p.exclusiveFor) : true)),
    [isInGroup]
  );

  const openUserMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(e.currentTarget);
  const closeUserMenu = () => setAnchorElUser(null);

  const go = (url: string) => {
    navigate(url);
    setMobileOpen(false);
  };

  const toProfile = () => {
    navigate("/admin/profile");
    closeUserMenu();
    setMobileOpen(false);
  };

  const toCalendarMonth = () => {
    navigate("/admin/jobs?view=month");
    closeUserMenu();
    setMobileOpen(false);
  };

  const logOutHandler = async () => {
    if (logOut) await logOut();
    closeUserMenu();
    setMobileOpen(false);
    navigate("/");
  };

  const isActive = (url: string) => {
    const [path] = url.split("?");
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const userMenuOpen = Boolean(anchorElUser);

  return (
    <AppBar position="fixed" elevation={2}>
      <Bar disableGutters>
        <BurgerButton
          color="inherit"
          aria-label="open main menu"
          onClick={() => setMobileOpen(true)}
          edge="start"
        >
          <MenuIcon />
        </BurgerButton>

        <Brand variant="h6" onClick={() => navigate("/")} role="link">
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
          <Tooltip title="Calendar">
            <CalendarButton onClick={toCalendarMonth} aria-label="calendar">
              <CalendarMonthIcon />
            </CalendarButton>
          </Tooltip>

          <Tooltip title="Account">
            <UserButton onClick={openUserMenu} aria-label="account">
              <ProfileIcon />
            </UserButton>
          </Tooltip>
        </RightZone>
      </Bar>

      <MobileDrawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true, disableScrollLock: true }}
      >
        <DrawerHeader>
          <DrawerBrand>
            <Box sx={{ fontWeight: 900, letterSpacing: ".08em" }}>
              Window Cleaner
            </Box>
            <Box sx={{ fontSize: 12, opacity: 0.7 }}>Admin</Box>
          </DrawerBrand>

          <DrawerClose
            aria-label="close menu"
            onClick={() => setMobileOpen(false)}
          >
            <CloseIcon />
          </DrawerClose>
        </DrawerHeader>

        <Divider />

        <DrawerBody>
          {pages.map((p) => (
            <DrawerItemButton
              key={p.url}
              onClick={() => go(p.url)}
              $active={isActive(p.url)}
            >
              <DrawerItemIcon>{p.icon}</DrawerItemIcon>
              <DrawerItemText>{p.label}</DrawerItemText>
            </DrawerItemButton>
          ))}
        </DrawerBody>

        <Divider />

        <DrawerFooter>
          <DrawerItemButton
            onClick={toProfile}
            $active={isActive("/admin/profile")}
          >
            <DrawerItemIcon>
              <PersonIcon fontSize="small" />
            </DrawerItemIcon>
            <DrawerItemText>Profile</DrawerItemText>
          </DrawerItemButton>

          <DrawerItemButton onClick={logOutHandler}>
            <DrawerItemIcon>
              <LogoutIcon fontSize="small" />
            </DrawerItemIcon>
            <DrawerItemText>Log out</DrawerItemText>
          </DrawerItemButton>

          {user?.attributes?.email && (
            <>
              <Divider />
              <Typography
                variant="caption"
                sx={{ opacity: 0.75, px: 1, mt: 1 }}
              >
                Signed in as
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, px: 1 }} noWrap>
                {user.attributes.email}
              </Typography>
            </>
          )}
        </DrawerFooter>
      </MobileDrawer>

      <UserPopover
        open={userMenuOpen}
        anchorEl={anchorElUser}
        onClose={closeUserMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Paper elevation={0}>
          <UserPopoverHeader>
            <Avatar sx={{ width: 36, height: 36 }}>
              {user?.attributes?.email?.[0]?.toUpperCase() ?? "U"}
            </Avatar>

            <UserPopoverHeaderText>
              <UserPopoverTitle>Account</UserPopoverTitle>

              {user?.attributes?.email && (
                <UserPopoverEmailRow>
                  <MailOutlineIcon fontSize="small" />
                  <UserPopoverEmailText
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    {user.attributes.email}
                  </UserPopoverEmailText>
                </UserPopoverEmailRow>
              )}
            </UserPopoverHeaderText>
          </UserPopoverHeader>

          <Divider />

          <UserPopoverList>
            <List dense disablePadding>
              <UserActionButton onClick={toProfile}>
                <UserActionIcon>
                  <PersonIcon fontSize="small" />
                </UserActionIcon>
                <ListItemText
                  primary="Profile"
                  slotProps={{
                    primary: {
                      fontWeight: 700,
                    },
                  }}
                />
              </UserActionButton>

              <UserActionButton onClick={toCalendarMonth}>
                <UserActionIcon>
                  <CalendarMonthIcon fontSize="small" />
                </UserActionIcon>
                <ListItemText
                  primary="Calendar"
                  slotProps={{
                    primary: {
                      fontWeight: 700,
                    },
                  }}
                />
              </UserActionButton>

              <UserActionButton onClick={logOutHandler}>
                <UserActionIcon>
                  <LogoutIcon fontSize="small" />
                </UserActionIcon>
                <ListItemText
                  primary="Log out"
                  slotProps={{
                    primary: {
                      fontWeight: 700,
                    },
                  }}
                />
              </UserActionButton>
            </List>
          </UserPopoverList>
        </Paper>
      </UserPopover>
    </AppBar>
  );
};
