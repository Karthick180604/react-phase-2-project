import MockAdapter from "axios-mock-adapter";
import api from "../axiosInterceptor";
import {
  getAllUsers,
  getSingleUser,
  getSearchedUsers,
  getAllPosts,
  getSingleUserPosts,
  getPostComments,
  getSearchedPosts,
  getAllPostTags,
  getAllPostTagsArray,
} from "../apiCalls";

describe("API Service", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should fetch all users", async () => {
    mock
      .onGet("/users?limit=208")
      .reply(200, { users: [{ id: 1, name: "Test" }] });

    const response = await getAllUsers();
    expect(response.status).toBe(200);
    expect(response.data.users).toHaveLength(1);
  });

  it("should fetch a single user", async () => {
    mock.onGet("/users/5").reply(200, { id: 5, name: "Jane" });

    const response = await getSingleUser(5);
    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Jane");
  });

  it("should search users", async () => {
    mock.onGet("/users/search?q=john").reply(200, { users: [] });

    const response = await getSearchedUsers("john");
    expect(response.status).toBe(200);
  });

  it("should fetch posts with pagination", async () => {
    mock.onGet("/posts?limit=10&skip=0").reply(200, { posts: [] });

    const response = await getAllPosts();
    expect(response.status).toBe(200);
  });

  it("should fetch posts by user", async () => {
    mock.onGet("/posts/user/10").reply(200, { posts: [{ id: 1 }] });

    const response = await getSingleUserPosts(10);
    expect(response.data.posts[0].id).toBe(1);
  });

  it("should fetch post comments", async () => {
    mock.onGet("/comments/post/3").reply(200, { comments: [] });

    const response = await getPostComments(3);
    expect(response.status).toBe(200);
  });

  it("should search posts", async () => {
    mock.onGet("/posts/search?q=react").reply(200, { posts: [] });

    const response = await getSearchedPosts("react");
    expect(response.status).toBe(200);
  });

  it("should fetch post tags", async () => {
    mock.onGet("/posts/tags").reply(200, { tags: ["news", "tech"] });

    const response = await getAllPostTags();
    expect(response.data.tags).toContain("tech");
  });

  it("should fetch post tags array", async () => {
    mock.onGet("/posts/tag-list").reply(200, ["news", "fun"]);

    const response = await getAllPostTagsArray();
    expect(response.data).toContain("fun");
  });
});
