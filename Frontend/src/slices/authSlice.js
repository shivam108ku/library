import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../config/axios';
import { mapBookingToFrontend, mapUserToFrontend} from "../utils/helperFunctions";

// login admin
export const loginAdmin = createAsyncThunk('auth/admin/login',
  async (credentials, {rejectWithValue}) => {
    try{
      
      // making login request to backend
      const response = await axiosClient.post("/auth/admin/login", credentials);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }   
  }
)

// authenticate admin
export const authenticateAdmin = createAsyncThunk('auth/admin/check',
  async ( _ , {rejectWithValue}) => {
    try{

      // making authentication request to backend
      const response = await axiosClient.get("/auth/admin/check");
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }   
  }
)

// logout admin
export const logoutAdmin = createAsyncThunk('auth/admin/logout',
  async ( _ , {rejectWithValue}) => {
    try{
      
      // making logout request to backend
      await axiosClient.post("/auth/admin/logout");
      return null;
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }   
  }
)


// authSlice
const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    admin: null,
    users: null,
    bookings: null,
    loading: true,
    isAuthenticated: false,
    error: null
  },
  reducers: {
    updateAdminProfile: (state, action) => {
       const { adminName } = action.payload;
       state.admin.adminName = adminName;
    },
    updateAdminProfileImage: (state, action) => {
       const { profileImageUrl } = action.payload;
       state.admin.profileImageUrl = profileImageUrl;
    },
    setUsers: (state, action) => {
      const { newUser } = action.payload;
      state.users = [...state.users, newUser];
    },
    updateUsers: (state, action) => {
      const { updatedUser } = action.payload;
      state.users = state.users.map(u => (u.id === updatedUser.id ? updatedUser : u));
    },
    deleteUsers: (state, action) => {
      const { userId } = action.payload;
      state.users = state.users.filter(u => u.id !== userId);
      state.bookings = state.bookings.filter(b => b.userId !== userId) //cascade delete
    },
    setBookings: (state, action) => {
      const { newBooking } = action.payload;
      state.bookings = [...state.bookings, newBooking];
    },
    updateBookings: (state, action) => {
      const { updatedBooking } = action.payload;
      state.users = state.users.map(u => (u.id === updatedBooking.id ? updatedBooking : u));
    },
    deleteBookings: (state, action) => {
      const { bookingId } = action.payload;
      state.bookings = state.bookings.filter(b => b.bookingId !== bookingId) 
    },
  },
  extraReducers: (builder) => {
    builder
    // login admin cases
    .addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = !!action.payload;
      state.admin = action.payload.admin;
      state.users = action.payload.users.map(mapUserToFrontend);
      state.bookings = action.payload.seats.map(mapBookingToFrontend);
    })
    .addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.admin = null;
      state.users = null;
      state.bookings = null;
    })

    // authenticate admin cases
    .addCase(authenticateAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(authenticateAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = !!action.payload;
      state.admin = action.payload.admin;
      state.users = action.payload.users.map(mapUserToFrontend);
      state.bookings = action.payload.seats.map(mapBookingToFrontend);
    })
    .addCase(authenticateAdmin.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.admin = null;
      state.users = null;
      state.bookings = null;
    })

    // logout admin cases
    .addCase(logoutAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(logoutAdmin.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.admin = null;
      state.users = null;
      state.bookings = null;
      state.error = null
    })
    .addCase(logoutAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.admin = null;
      state.users = null;
      state.bookings = null;
    })
  }
})

export const { updateAdminProfile, updateAdminProfileImage, setUsers, updateUsers, deleteUsers, setBookings, updateBookings, deleteBookings } = authSlice.actions;
export default authSlice.reducer;