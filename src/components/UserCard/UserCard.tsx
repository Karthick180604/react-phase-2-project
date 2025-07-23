// src/components/UserCard/UserCard.tsx
import React from 'react';
import { Card, Typography, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  id:number;
  image: string;
  name: string;
}

const UserCard: React.FC<UserCardProps> = ({ image, name, id }) => {
    const navigate = useNavigate();
  return (
    <Card
       onClick={() => navigate(`profile/${id}`)}
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'scale(1.03)' },
      }}
    >
      <Avatar
        src={image}
        alt={name}
        sx={{ width: 72, height: 72, mb: 2 }}
      />
      <Typography variant="subtitle1" fontWeight={600} noWrap>
        {name}
      </Typography>
    </Card>
  );
};

export default UserCard;
