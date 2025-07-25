import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Stack } from "@mui/material";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <Button
          color="tertiary"
          variant={
            location.pathname.includes("/posts") ? "contained" : "outlined"
          }
          onClick={() => navigate("/search/posts")}
        >
          Posts
        </Button>
        <Button
          color="tertiary"
          variant={
            location.pathname.includes("/users") ? "contained" : "outlined"
          }
          onClick={() => navigate("/search/users")}
        >
          Users
        </Button>
      </Stack>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Search;
