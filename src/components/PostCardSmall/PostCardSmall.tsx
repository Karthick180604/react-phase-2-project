import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

type PostCardSmallProps = {
  id: number;
  title: string;
  body: string;
  onReadMore: () => void;
};

const PostCardSmall: React.FC<PostCardSmallProps> = ({
  title,
  body,
  id,
  onReadMore,
}) => {
  const imageUrl = `https://picsum.photos/id/${id}/600/400`;

  return (
    <Card
      data-testid="postcard-small"
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
        data-testid="postcard-image"
        sx={{
          width: "100%",
          pt: "56.25%",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <CardContent data-testid="postcard-content" sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600 }}
          data-testid="postcard-title"
        >
          {title.length > 60 ? title.slice(0, 60) + "..." : title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          data-testid="postcard-body"
        >
          {body.length > 100 ? `${body.slice(0, 100)}... ` : body + " "}
          <Typography
            component="span"
            data-testid="postcard-readmore"
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
