import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
} from "@mui/material";


// PostCardSmall.tsx
type PostCardSmallProps = {
  id: number;
  title: string;
  body: string;
  onReadMore: () => void; // <-- new prop
};

const PostCardSmall: React.FC<PostCardSmallProps> = ({ title, body, id, onReadMore }) => {
  const imageUrl = `https://picsum.photos/id/${id}/600/400`;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          pt: "56.25%",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title.length > 60 ? title.slice(0, 60) + "..." : title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {body.length > 100 ? `${body.slice(0, 100)}... ` : body + " "}
          <Typography
            component="span"
            sx={{ color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
            onClick={onReadMore}
          >
            Read more
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCardSmall;
