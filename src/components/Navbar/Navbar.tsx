import {
  Typography,
  IconButton,
  Box,
  List,
  ListItemText,
  ListItemButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  Paper,
} from "@mui/material";
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ElectricalServices as ElectricalServicesIcon,
} from "@mui/icons-material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/Actions/userActions";

const navItems = [
  { label: "Home", path: "/home", icon: <HomeIcon />, testid: "navlink-home" },
  {
    label: "Explore",
    path: "/home/explore",
    icon: <ExploreIcon />,
    testid: "navlink-explore",
  },
  {
    label: "Search Users",
    path: "/home/search",
    icon: <SearchIcon />,
    testid: "navlink-search",
  },
  {
    label: "My Profile",
    path: "/home/profile/me",
    icon: <AccountCircleIcon />,
    testid: "navlink-profile",
  },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
const isMobile = useMediaQuery("(max-width: 600px)");
const isTablet = useMediaQuery("(min-width: 601px) and (max-width: 960px)");


  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const isExactPath = (targetPath: string) => location.pathname === targetPath;

  if (isMobile) {
    return (
      <Paper
        data-testid="navbar-mobile"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: theme.palette.primary.main,
        }}
        elevation={3}
      >
        <BottomNavigation
          value={location.pathname}
          showLabels
          sx={{ bgcolor: theme.palette.primary.main }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={item.icon}
              component={NavLink}
              to={item.path}
              value={item.path}
              data-testid={item.testid}
              sx={{
                "&.Mui-selected": {
                  color: theme.palette.tertiary.main,
                  bgcolor: `${theme.palette.tertiary.main}22`,
                  borderRadius: 2,
                  mx: 0.5,
                },
                color: theme.palette.secondary.main,
              }}
            />
          ))}
          <BottomNavigationAction
            label="Logout"
            icon={<LogoutIcon />}
            onClick={handleLogout}
            data-testid="nav-logout"
            sx={{ color: theme.palette.secondary.main }}
          />
        </BottomNavigation>
      </Paper>
    );
  }

  if (isTablet) {
    return (
      <Box
        data-testid="navbar-tablet"
        sx={{
          width: 72,
          height: "100vh",
          position: "fixed",
          bgcolor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          boxShadow: 2,
        }}
      >
        {navItems.map((item) => (
          <IconButton
            key={item.label}
            component={NavLink}
            to={item.path}
            data-testid={item.testid}
            sx={{
              color: isExactPath(item.path)
                ? theme.palette.tertiary.main
                : theme.palette.secondary.main,
              mb: 3,
              borderRadius: 2,
              backgroundColor: isExactPath(item.path)
                ? `${theme.palette.tertiary.main}22`
                : "transparent",
              "&:hover": {
                backgroundColor: "transparent !important",
              },
            }}
          >
            {item.icon}
          </IconButton>
        ))}
        <IconButton
          onClick={handleLogout}
          data-testid="nav-logout"
          sx={{ mt: 2, color: theme.palette.secondary.main }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      data-testid="navbar-desktop"
      sx={{
        width: 220,
        height: "100vh",
        position: "fixed",
        bgcolor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        display: "flex",
        flexDirection: "column",
        pt: 3,
        boxShadow: 3,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
        <ElectricalServicesIcon
          sx={{ mr: 1, color: theme.palette.secondary.main }}
        />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}
        >
          Connectify
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <List disablePadding>
          {navItems.map((item) => {
            const active = isExactPath(item.path);
            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <ListItemButton
                  data-testid={item.testid}
                  sx={{
                    color: active
                      ? theme.palette.primary.contrastText
                      : theme.palette.secondary.main,
                    bgcolor: active
                      ? theme.palette.tertiary.main
                      : "transparent",
                    borderRadius: "12px",
                    mx: 2,
                    mb: 1,
                    "&:hover": { backgroundColor: "transparent !important" },
                  }}
                >
                  {item.icon}
                  <ListItemText primary={item.label} sx={{ ml: 2 }} />
                </ListItemButton>
              </NavLink>
            );
          })}
        </List>
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.secondary.main}44`,
          }}
        >
          <ListItemButton
            onClick={handleLogout}
            data-testid="nav-logout"
            sx={{
              color: theme.palette.secondary.main,
              pl: 3,
              "&:hover": { backgroundColor: "transparent !important" },
            }}
          >
            <LogoutIcon />
            <ListItemText primary="Logout" sx={{ ml: 2 }} />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
