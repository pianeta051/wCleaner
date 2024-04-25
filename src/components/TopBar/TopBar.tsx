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
import { Tooltip } from "@mui/material";

type Page = {
  label: string;
  url: string;
  exclusiveFor?: string;
};

export const TopBar: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const { isInGroup } = useAuth();
  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const pages: Page[] = [
    { label: "customers", url: "/admin/customers" },
    { label: "users", url: "/admin/users", exclusiveFor: "Admin" },
    { label: "jobs  ", url: "/admin/jobs" },
  ];
  const closeUserMenu = () => {
    setAnchorElUser(null);
  };

  const toProfile = () => navigate("/admin/profile");

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
          >
            <MenuIcon />
          </IconButton>
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
