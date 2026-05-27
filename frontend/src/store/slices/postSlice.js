import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchPosts = createAsyncThunk('posts/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/posts', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchTrending = createAsyncThunk('posts/trending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/posts/trending');
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createPost = createAsyncThunk('posts/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const votePost = createAsyncThunk('posts/vote', async ({ postId, vote }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/posts/${postId}/vote`, { vote });
    return { postId, ...data };
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deletePost = createAsyncThunk('posts/delete', async (postId, { rejectWithValue }) => {
  try {
    await api.delete(`/posts/${postId}`);
    return postId;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], trending: [], loading: false, error: null, total: 0, page: 1, hasMore: true },
  reducers: {
    addLivePost: (state, action) => { state.posts.unshift(action.payload); },
    clearPosts: (state) => { state.posts = []; state.page = 1; state.hasMore = true; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, total, page, pages } = action.payload;
        if (parseInt(page) === 1) state.posts = posts;
        else state.posts = [...state.posts, ...posts];
        state.total = total;
        state.page = parseInt(page);
        state.hasMore = parseInt(page) < pages;
      })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTrending.fulfilled, (state, action) => { state.trending = action.payload.posts; })
      .addCase(createPost.fulfilled, (state, action) => { state.posts.unshift(action.payload.post); })
      .addCase(votePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) { post.upvotes = new Array(action.payload.upvotes).fill(null); post.downvotes = new Array(action.payload.downvotes).fill(null); }
      })
      .addCase(deletePost.fulfilled, (state, action) => { state.posts = state.posts.filter(p => p._id !== action.payload); });
  },
});

export const { addLivePost, clearPosts } = postSlice.actions;
export default postSlice.reducer;
