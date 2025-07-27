import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllUsers, getSearchedUsers } from "../../services/apiCalls";
import UserCard from "../../components/UserCard/UserCard";
import {
  Grid,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash.debounce";
import NoResults from "../../components/NoResults/NoResults";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/Store/store";
import ApiError from "../../components/ApiError/ApiError";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
}

const SearchUsers = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const hasError = useSelector((state: RootState) => state.error.hasApiError);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUserList(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSearchedUsers = useCallback(
    async (term: string) => {
      try {
        if (term.trim() === "") {
          setFilteredUsers(userList);
          return;
        } else {
          const response = await getSearchedUsers(term);
          setFilteredUsers(response.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [userList],
  );

  const debouncedSearch = useMemo(
    () => debounce((value: string) => fetchSearchedUsers(value), 500),
    [fetchSearchedUsers],
  );

  if (hasError) {
    return <ApiError data-testid="api-error" />;
  }

  return (
    <Container sx={{ py: 5 }} data-testid="search-users-container">
      <Typography
        variant="h4"
        mb={3}
        fontWeight={700}
        data-testid="search-users-title"
      >
        Explore Users
      </Typography>

      <Box mb={4}>
        <TextField
          color="tertiary"
          variant="outlined"
          fullWidth
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedSearch(value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          inputProps={{ "data-testid": "search-input" }}
        />
      </Box>

      {filteredUsers.length === 0 ? (
        <NoResults message="No users found" data-testid="no-users" />
      ) : (
        <Grid container spacing={4} data-testid="user-list">
          {filteredUsers.map((user) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2.4}
              key={user.id}
              data-testid={`user-card-${user.id}`}
            >
              <UserCard
                id={user.id}
                image={user.image}
                name={`${user.firstName} ${user.lastName}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchUsers;
