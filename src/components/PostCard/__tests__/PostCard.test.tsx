import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import PostCard from "../PostCard";
import type { Post } from "../../../redux/Actions/postsActions";

jest.mock("../PostCard.css", () => ({}));

describe("PostCard Component", () => {
  const mockOnLikeHandler = jest.fn();
  const mockOnDislikeHandler = jest.fn();
  const mockSetSelectedPost = jest.fn();

  const mockPost: Post = {
    id: 1,
    title: "Test Post Title",
    body: "This is a test post body content that should be displayed in the card. It contains multiple sentences to test the text truncation feature.",
    tags: ["technology", "react", "testing"],
    reactions: {
      likes: 10,
      dislikes: 2,
    },
    views: 100,
    userId: 5,
    username: "testuser",
    image: "https://example.com/avatar.jpg",
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      post: mockPost,
      onLikeHandler: mockOnLikeHandler,
      onDislikeHandler: mockOnDislikeHandler,
      setSelectedPost: mockSetSelectedPost,
      like: false,
      dislike: false,
    };

    return render(
      <BrowserRouter>
        <PostCard {...defaultProps} {...props} />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders post card with all basic elements", () => {
      renderComponent();

      expect(screen.getByTestId("post-card")).toBeInTheDocument();
      expect(screen.getByTestId("post-image")).toBeInTheDocument();
      expect(screen.getByTestId("post-title")).toHaveTextContent(
        "Test Post Title",
      );
      expect(screen.getByTestId("post-body")).toHaveTextContent(mockPost.body);
      expect(screen.getByTestId("post-tags")).toBeInTheDocument();
    });

    it("displays correct post image with proper attributes", () => {
      renderComponent();

      const postImage = screen.getByTestId("post-image");
      expect(postImage).toHaveAttribute("alt", "Post Image");
      expect(postImage).toHaveAttribute(
        "src",
        `https://picsum.photos/seed/${mockPost.id}/300/200`,
      );
    });

    it("displays user information correctly", () => {
      renderComponent();

      const userLink = screen.getByTestId("user-link");
      expect(userLink).toBeInTheDocument();
      expect(userLink).toHaveAttribute(
        "href",
        `/home/search/profile/${mockPost.userId}`,
      );
      expect(screen.getByText(mockPost.username)).toBeInTheDocument();

      const avatar = screen.getByAltText(mockPost.username);
      expect(avatar).toHaveAttribute("src", mockPost.image);
    });

    it("displays all post tags correctly", () => {
      renderComponent();

      const tagsContainer = screen.getByTestId("post-tags");
      expect(tagsContainer).toBeInTheDocument();

      mockPost.tags.forEach((tag) => {
        expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
      });
    });

    it("displays post statistics correctly", () => {
      renderComponent();

      expect(screen.getByTestId("like-count")).toHaveTextContent("10");
      expect(screen.getByTestId("dislike-count")).toHaveTextContent("2");
      expect(screen.getByTestId("view-count")).toHaveTextContent("100");
    });

    it("displays read more link", () => {
      renderComponent();

      const readMoreLink = screen.getByTestId("read-more");
      expect(readMoreLink).toHaveTextContent("Read more");
    });
  });

  describe("Like/Dislike Functionality", () => {
    it("displays outlined like icon when not liked", () => {
      renderComponent({ like: false });

      const likeButton = screen.getByTestId("like-button");
      expect(likeButton).toBeInTheDocument();
    });

    it("displays filled like icon when liked", () => {
      renderComponent({ like: true });

      const likeButton = screen.getByTestId("like-button");
      expect(likeButton).toBeInTheDocument();
      expect(screen.getByTestId("like-count")).toHaveTextContent("11");
    });

    it("displays outlined dislike icon when not disliked", () => {
      renderComponent({ dislike: false });

      const dislikeButton = screen.getByTestId("dislike-button");
      expect(dislikeButton).toBeInTheDocument();
    });

    it("displays filled dislike icon when disliked", () => {
      renderComponent({ dislike: true });

      const dislikeButton = screen.getByTestId("dislike-button");
      expect(dislikeButton).toBeInTheDocument();
      expect(screen.getByTestId("dislike-count")).toHaveTextContent("3");
    });

    it("calls onLikeHandler with correct parameters when like button is clicked", async () => {
      renderComponent({ like: false });

      const likeButton = screen.getByTestId("like-button");
      await userEvent.click(likeButton);

      expect(mockOnLikeHandler).toHaveBeenCalledWith(mockPost.id, false);
      expect(mockOnLikeHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onLikeHandler with correct parameters when already liked", async () => {
      renderComponent({ like: true });

      const likeButton = screen.getByTestId("like-button");
      await userEvent.click(likeButton);

      expect(mockOnLikeHandler).toHaveBeenCalledWith(mockPost.id, true);
    });

    it("calls onDislikeHandler with correct parameters when dislike button is clicked", async () => {
      renderComponent({ dislike: false });

      const dislikeButton = screen.getByTestId("dislike-button");
      await userEvent.click(dislikeButton);

      expect(mockOnDislikeHandler).toHaveBeenCalledWith(mockPost.id, false);
      expect(mockOnDislikeHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDislikeHandler with correct parameters when already disliked", async () => {
      renderComponent({ dislike: true });

      const dislikeButton = screen.getByTestId("dislike-button");
      await userEvent.click(dislikeButton);

      expect(mockOnDislikeHandler).toHaveBeenCalledWith(mockPost.id, true);
    });

    it("updates like count correctly when liked", () => {
      renderComponent({ like: true });

      const likeCount = screen.getByTestId("like-count");
      expect(likeCount).toHaveTextContent("11");
    });

    it("updates dislike count correctly when disliked", () => {
      renderComponent({ dislike: true });

      const dislikeCount = screen.getByTestId("dislike-count");
      expect(dislikeCount).toHaveTextContent("3");
    });

    it("handles both like and dislike states simultaneously", () => {
      renderComponent({ like: true, dislike: true });

      expect(screen.getByTestId("like-count")).toHaveTextContent("11");
      expect(screen.getByTestId("dislike-count")).toHaveTextContent("3");
    });
  });

  describe("Comment Functionality", () => {
    it("calls setSelectedPost when comment button is clicked", async () => {
      renderComponent();

      const commentButton = screen.getByTestId("comment-button");
      await userEvent.click(commentButton);

      expect(mockSetSelectedPost).toHaveBeenCalledWith(mockPost);
      expect(mockSetSelectedPost).toHaveBeenCalledTimes(1);
    });

    it("calls setSelectedPost when read more is clicked", async () => {
      renderComponent();

      const readMoreLink = screen.getByTestId("read-more");
      await userEvent.click(readMoreLink);

      expect(mockSetSelectedPost).toHaveBeenCalledWith(mockPost);
    });

    it("displays comment button with correct label", () => {
      renderComponent();

      expect(screen.getByText("Comments")).toBeInTheDocument();
    });
  });

  describe("Image Loading", () => {
    it("generates correct image URL based on post ID", async () => {
      renderComponent();

      await waitFor(() => {
        const postImage = screen.getByTestId("post-image");
        expect(postImage).toHaveAttribute(
          "src",
          `https://picsum.photos/seed/${mockPost.id}/300/200`,
        );
      });
    });

    it("updates image URL when post ID changes", async () => {
      const { rerender } = renderComponent();

      await waitFor(() => {
        const postImage = screen.getByTestId("post-image");
        expect(postImage).toHaveAttribute(
          "src",
          "https://picsum.photos/seed/1/300/200",
        );
      });

      const newPost = { ...mockPost, id: 2 };
      rerender(
        <BrowserRouter>
          <PostCard
            post={newPost}
            onLikeHandler={mockOnLikeHandler}
            onDislikeHandler={mockOnDislikeHandler}
            setSelectedPost={mockSetSelectedPost}
            like={false}
            dislike={false}
          />
        </BrowserRouter>,
      );

      await waitFor(() => {
        const postImage = screen.getByTestId("post-image");
        expect(postImage).toHaveAttribute(
          "src",
          "https://picsum.photos/seed/2/300/200",
        );
      });
    });
  });

  describe("Post Content Display", () => {
    it("displays post title correctly", () => {
      renderComponent();

      const title = screen.getByTestId("post-title");
      expect(title).toHaveTextContent(mockPost.title);
    });

    it("displays post body content", () => {
      renderComponent();

      const body = screen.getByTestId("post-body");
      expect(body).toHaveTextContent(mockPost.body);
    });

    it("handles empty tags array", () => {
      const postWithNoTags = { ...mockPost, tags: [] };
      renderComponent({ post: postWithNoTags });

      const tagsContainer = screen.getByTestId("post-tags");
      expect(tagsContainer).toBeInTheDocument();
      expect(tagsContainer).toBeEmptyDOMElement();
    });

    it("handles single tag", () => {
      const postWithOneTag = { ...mockPost, tags: ["solo"] };
      renderComponent({ post: postWithOneTag });

      expect(screen.getByText("#solo")).toBeInTheDocument();
    });

    it("handles many tags", () => {
      const manyTags = ["tag1", "tag2", "tag3", "tag4", "tag5"];
      const postWithManyTags = { ...mockPost, tags: manyTags };
      renderComponent({ post: postWithManyTags });

      manyTags.forEach((tag) => {
        expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles zero likes and dislikes", () => {
      const postWithZeroReactions = {
        ...mockPost,
        reactions: { likes: 0, dislikes: 0 },
      };
      renderComponent({ post: postWithZeroReactions });

      expect(screen.getByTestId("like-count")).toHaveTextContent("0");
      expect(screen.getByTestId("dislike-count")).toHaveTextContent("0");
    });

    it("handles zero views", () => {
      const postWithZeroViews = { ...mockPost, views: 0 };
      renderComponent({ post: postWithZeroViews });

      expect(screen.getByTestId("view-count")).toHaveTextContent("0");
    });

    it("handles long post title", () => {
      const longTitle =
        "This is a very long post title that might wrap to multiple lines and should still be displayed correctly";
      const postWithLongTitle = { ...mockPost, title: longTitle };
      renderComponent({ post: postWithLongTitle });

      expect(screen.getByTestId("post-title")).toHaveTextContent(longTitle);
    });

    it("handles long post body", () => {
      const longBody =
        "This is a very long post body content that should be truncated with ellipsis when displayed in the card component. ".repeat(
          10,
        );
      const postWithLongBody = { ...mockPost, body: longBody };
      renderComponent({ post: postWithLongBody });

      const bodyElement = screen.getByTestId("post-body");
      expect(bodyElement).toBeInTheDocument();
      expect(bodyElement.textContent).toContain(
        "This is a very long post body content",
      );
    });

    it("handles missing user image", () => {
      const postWithoutImage = { ...mockPost, image: "" };

      expect(() => renderComponent({ post: postWithoutImage })).not.toThrow();

      expect(screen.getByTestId("post-card")).toBeInTheDocument();
      expect(screen.getByText(mockPost.username)).toBeInTheDocument();
    });

    it("handles special characters in username", () => {
      const postWithSpecialUsername = {
        ...mockPost,
        username: "user@test.com",
      };
      renderComponent({ post: postWithSpecialUsername });

      expect(screen.getByText("user@test.com")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper alt text for post image", () => {
      renderComponent();

      const postImage = screen.getByTestId("post-image");
      expect(postImage).toHaveAttribute("alt", "Post Image");
    });

    it("has proper alt text for user avatar", () => {
      renderComponent();

      const avatar = screen.getByAltText(mockPost.username);
      expect(avatar).toBeInTheDocument();
    });

    it("has clickable elements that are properly interactive", async () => {
      renderComponent();

      const likeButton = screen.getByTestId("like-button");
      const dislikeButton = screen.getByTestId("dislike-button");
      const commentButton = screen.getByTestId("comment-button");
      const readMore = screen.getByTestId("read-more");

      expect(likeButton).toBeInTheDocument();
      expect(dislikeButton).toBeInTheDocument();
      expect(commentButton).toBeInTheDocument();
      expect(readMore).toBeInTheDocument();

      await userEvent.click(likeButton);
      await userEvent.click(dislikeButton);
      await userEvent.click(commentButton);
      await userEvent.click(readMore);

      expect(mockOnLikeHandler).toHaveBeenCalled();
      expect(mockOnDislikeHandler).toHaveBeenCalled();
      expect(mockSetSelectedPost).toHaveBeenCalledTimes(2);
    });
  });

  describe("Navigation", () => {
    it("creates correct user profile link", () => {
      renderComponent();

      const userLink = screen.getByTestId("user-link");
      expect(userLink).toHaveAttribute(
        "href",
        `/home/search/profile/${mockPost.userId}`,
      );
    });

    it("handles different user IDs in links", () => {
      const postWithDifferentUserId = { ...mockPost, userId: 999 };
      renderComponent({ post: postWithDifferentUserId });

      const userLink = screen.getByTestId("user-link");
      expect(userLink).toHaveAttribute("href", "/home/search/profile/999");
    });
  });
});
