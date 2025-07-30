import {
  fetchPosts,
  type Post,
  type PostActionType,
} from '../postsActions';
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from '../../ActionTypes/postsActionTypes';
import { getAllPosts, getSingleUser } from '../../../services/apiCalls';
import type { UserType } from '../../../types/types';
import type { RootState } from '../../Store/store';

jest.mock('../../../services/apiCalls', () => ({
  getAllPosts: jest.fn(),
  getSingleUser: jest.fn(),
}));

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const mockGetSingleUser = getSingleUser as jest.MockedFunction<typeof getSingleUser>;

describe('Posts Actions', () => {
  let mockDispatch: jest.Mock;
  let mockGetState: jest.Mock;
  let mockRootState: RootState;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockGetState = jest.fn();
    mockRootState = {
      posts: {
        posts: [],
        loading: false,
        error: null,
        currentPage: 1,
      },
      error: {
        hasApiError: false,
      },
    } as RootState;
    mockGetState.mockReturnValue(mockRootState);
    jest.clearAllMocks();
  });

  describe('fetchPosts', () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Test Post 1',
        body: 'This is test post 1',
        tags: ['test', 'post'],
        reactions: {
          likes: 10,
          dislikes: 2,
        },
        views: 100,
        userId: 1,
      },
      {
        id: 2,
        title: 'Test Post 2',
        body: 'This is test post 2',
        tags: ['test', 'another'],
        reactions: {
          likes: 5,
          dislikes: 1,
        },
        views: 50,
        userId: 2,
      },
    ];

    const mockUsers: UserType[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        image: 'https://example.com/john.jpg',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        image: 'https://example.com/jane.jpg',
      },
    ];

    it('should dispatch FETCH_POSTS_REQUEST when fetchPosts is called', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: [] } });

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_REQUEST,
      });
    });

    it('should fetch posts with default parameters (page=1, limit=10)', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: [] } });

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockGetAllPosts).toHaveBeenCalledWith(10, 0); 
    });

    it('should fetch posts with custom parameters', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: [] } });

      const thunk = fetchPosts(3, 5);
      await thunk(mockDispatch, mockGetState);

      expect(mockGetAllPosts).toHaveBeenCalledWith(5, 10); 
    });

    it('should calculate skip correctly for different pages', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: [] } });

      let thunk = fetchPosts(1, 10);
      await thunk(mockDispatch, mockGetState);
      expect(mockGetAllPosts).toHaveBeenLastCalledWith(10, 0);

      thunk = fetchPosts(2, 10);
      await thunk(mockDispatch, mockGetState);
      expect(mockGetAllPosts).toHaveBeenLastCalledWith(10, 10);

      thunk = fetchPosts(3, 10);
      await thunk(mockDispatch, mockGetState);
      expect(mockGetAllPosts).toHaveBeenLastCalledWith(10, 20);
    });

    it('should successfully fetch posts and dispatch FETCH_POSTS_SUCCESS', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: mockPosts } });
      mockGetSingleUser
        .mockResolvedValueOnce({ data: mockUsers[0] })
        .mockResolvedValueOnce({ data: mockUsers[1] });

      const thunk = fetchPosts(1, 10);
      await thunk(mockDispatch, mockGetState);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_REQUEST,
      });

      expect(mockGetSingleUser).toHaveBeenCalledTimes(2);
      expect(mockGetSingleUser).toHaveBeenCalledWith(1);
      expect(mockGetSingleUser).toHaveBeenCalledWith(2);

      const expectedPostData: Post[] = [
        {
          ...mockPosts[0],
          username: mockUsers[0].firstName,
          image: mockUsers[0].image,
        },
        {
          ...mockPosts[1],
          username: mockUsers[1].firstName,
          image: mockUsers[1].image,
        },
      ];

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_SUCCESS,
        payload: expectedPostData,
        meta: { page: 1 },
      });
    });

    it('should handle empty posts array', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: [] } });

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockGetSingleUser).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_SUCCESS,
        payload: [],
        meta: { page: 1 },
      });
    });

    it('should dispatch FETCH_POSTS_FAILURE when getAllPosts fails', async () => {
      const errorMessage = 'Network error';
      mockGetAllPosts.mockRejectedValue(new Error(errorMessage));

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_REQUEST,
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_FAILURE,
        payload: errorMessage,
      });
    });

    it('should handle error without message and use default error message', async () => {
      mockGetAllPosts.mockRejectedValue({});

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_FAILURE,
        payload: 'Something went wrong',
      });
    });

    it('should handle error with empty message and use default error message', async () => {
      mockGetAllPosts.mockRejectedValue(new Error(''));

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_FAILURE,
        payload: 'Something went wrong',
      });
    });

    it('should fetch user data for each post sequentially', async () => {
      const singlePost = [mockPosts[0]];
      mockGetAllPosts.mockResolvedValue({ data: { posts: singlePost } });
      mockGetSingleUser.mockResolvedValue({ data: mockUsers[0] });

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockGetSingleUser).toHaveBeenCalledTimes(1);
      expect(mockGetSingleUser).toHaveBeenCalledWith(1);

      const expectedPostData: Post[] = [
        {
          ...mockPosts[0],
          username: mockUsers[0].firstName,
          image: mockUsers[0].image,
        },
      ];

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_SUCCESS,
        payload: expectedPostData,
        meta: { page: 1 },
      });
    });

    it('should preserve all original post properties when adding user data', async () => {
      const postWithAllProps = {
        id: 1,
        title: 'Complete Post',
        body: 'Post body',
        tags: ['tag1', 'tag2'],
        reactions: {
          likes: 15,
          dislikes: 3,
        },
        views: 200,
        userId: 1,
      };

      mockGetAllPosts.mockResolvedValue({ data: { posts: [postWithAllProps] } });
      mockGetSingleUser.mockResolvedValue({ data: mockUsers[0] });

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      const expectedPostData: Post[] = [
        {
          ...postWithAllProps,
          username: mockUsers[0].firstName,
          image: mockUsers[0].image,
        },
      ];

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_SUCCESS,
        payload: expectedPostData,
        meta: { page: 1 },
      });
    });

    it('should pass correct page number in meta when fetching different pages', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: [] } });

      const thunk = fetchPosts(5);
      await thunk(mockDispatch, mockGetState);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_SUCCESS,
        payload: [],
        meta: { page: 5 },
      });
    });

    it('should handle Promise.all correctly when fetching multiple users', async () => {
      mockGetAllPosts.mockResolvedValue({ data: { posts: mockPosts } });
      
      mockGetSingleUser
        .mockImplementationOnce(() => 
          new Promise(resolve => setTimeout(() => resolve({ data: mockUsers[0] }), 50))
        )
        .mockImplementationOnce(() => 
          new Promise(resolve => setTimeout(() => resolve({ data: mockUsers[1] }), 10))
        );

      const thunk = fetchPosts();
      await thunk(mockDispatch, mockGetState);

      expect(mockGetSingleUser).toHaveBeenCalledTimes(2);
      
      const expectedPostData: Post[] = [
        {
          ...mockPosts[0],
          username: mockUsers[0].firstName,
          image: mockUsers[0].image,
        },
        {
          ...mockPosts[1],
          username: mockUsers[1].firstName,
          image: mockUsers[1].image,
        },
      ];

      expect(mockDispatch).toHaveBeenCalledWith({
        type: FETCH_POSTS_SUCCESS,
        payload: expectedPostData,
        meta: { page: 1 },
      });
    });
  });

  describe('Action Types', () => {
    it('should have correct action type values', () => {
      expect(FETCH_POSTS_REQUEST).toBe('FETCH_PRODUCTS_REQUEST');
      expect(FETCH_POSTS_SUCCESS).toBe('FETCH_PRODUCTS_SUCCESS');
      expect(FETCH_POSTS_FAILURE).toBe('FETCH_PRODUCTS_FAILURE');
    });
  });

  describe('Type Definitions', () => {
    it('should create correct action objects', () => {
      const requestAction: PostActionType = {
        type: FETCH_POSTS_REQUEST,
      };

      const successAction: PostActionType = {
        type: FETCH_POSTS_SUCCESS,
        payload: [],
        meta: { page: 1 },
      };

      const failureAction: PostActionType = {
        type: FETCH_POSTS_FAILURE,
        payload: 'Error message',
      };

      expect(requestAction.type).toBe(FETCH_POSTS_REQUEST);
      expect(successAction.type).toBe(FETCH_POSTS_SUCCESS);
      expect(failureAction.type).toBe(FETCH_POSTS_FAILURE);
    });
  });
});