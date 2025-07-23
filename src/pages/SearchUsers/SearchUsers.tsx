// src/pages/Search/SearchUsers.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { getAllUsers, getSearchedUsers } from '../../services/apiCalls';
import UserCard from '../../components/UserCard/UserCard';
import {
  Grid,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
}

const SearchUsers = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchSearchedUsers = async () => {
    try {
      if(searchTerm.trim() === '') {
        setFilteredUsers(userList);
        return;
      }
      else
      {
        const response= await getSearchedUsers(searchTerm);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      console.log(error)
    }
  }



  // const filteredUsers = useMemo(() => {
  //   return userList.filter(user =>
  //     `${user.firstName} ${user.lastName}`
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase())
  //   );
  // }, [userList, searchTerm]);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Explore Users
      </Typography>

      <Box mb={4}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchSearchedUsers();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {filteredUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={user.id}>
            <UserCard
              id={user.id}
              image={user.image}
              name={`${user.firstName} ${user.lastName}`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchUsers;
