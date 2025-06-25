import { FC, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "./TopBar.style";
import { useAuth } from "../../context/AuthContext";
import { ProfileIcon } from "../ProfileIcon/ProfileIcon";
import { Divider, ListItemText, Tooltip } from "@mui/material";

type Page = {
  label: string;
  url: string;
  exclusiveFor?: string;
};

export const TopBar: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logOut, isInGroup, user } = useAuth();
  const isAdmin = isInGroup("Admin");
  const navigate = useNavigate();

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const openIconMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const pages: Page[] = [
    { label: "customers", url: "/admin/customers", exclusiveFor: "Admin" },
    { label: "users", url: "/admin/users", exclusiveFor: "Admin" },
    { label: "jobs  ", url: "/admin/jobs" },
  ];
  const open = Boolean(anchorEl);
  const closeUserMenu = () => {
    setAnchorElUser(null);
  };
  const closeMenuIconHandler = () => {
    setAnchorEl(null);
  };

  const toProfile = () => navigate("/admin/profile");
  const toCustomers = () => navigate("/admin/customers");

  const toUsers = () => navigate("/admin/users");
  const toJobs = () => navigate("/admin/jobs");

  const logOutHandler = async () => {
    if (logOut) {
      await logOut();
    }
    closeUserMenu();
    navigate("/");
  };

  const menuClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    const url = pages.find(
      (page) => page.label === (event.target as HTMLElement).textContent
    )?.url;
    if (url) {
      navigate(url);
    }
  };

  const menuItems = pages.map((page) => {
    if (page.exclusiveFor && !isInGroup(page.exclusiveFor)) {
      return null;
    }
    return (
      <MenuButton key={page.url} onClick={menuClickHandler}>
        {page.label}
      </MenuButton>
    );
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FormGroup></FormGroup>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={openIconMenu}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorEl)}
            onClose={closeMenuIconHandler}
          >
            {" "}
            {isAdmin && (
              <>
                <MenuItem onClick={toCustomers}>Customers</MenuItem>
                <MenuItem onClick={toUsers}>Users</MenuItem>
              </>
            )}
            <MenuItem onClick={toJobs}>Jobs</MenuItem>
          </Menu>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Window Cleaner
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {menuItems}
          </Box>
          <div>
            <Tooltip title="Open settings">
              <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
                <ProfileIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
            >
              {user?.attributes?.email && (
                <MenuItem>
                  <ListItemText>{user?.attributes?.email}</ListItemText>
                </MenuItem>
              )}
              {user?.attributes?.email && <Divider />}
              <MenuItem onClick={toProfile}>Profile</MenuItem>
              <MenuItem onClick={logOutHandler}>Log out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};
