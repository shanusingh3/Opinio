# Opinio Mobile App - Frontend Architecture

## Overview

Opinio is a React Native mobile application that allows users to share opinions through questions and polls. The app follows a feature-based architecture with Redux Toolkit for state management.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native | Cross-platform mobile framework |
| TypeScript | Type-safe JavaScript |
| Redux Toolkit | State management |
| React Navigation | Navigation library |
| Axios | HTTP client |
| React Native Safe Area Context | Safe area handling |

## Project Structure

```
apps/mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── PostCard/        # Post display component
│   │   ├── PollOptions/     # Poll voting component
│   │   ├── CommentCard/     # Comment display component
│   │   └── index.ts         # Component exports
│   │
│   ├── features/            # Feature modules
│   │   ├── auth/            # Authentication feature
│   │   │   ├── api/         # Auth API definitions
│   │   │   ├── context/     # AuthContext provider
│   │   │   ├── screens/     # Auth screens (Welcome, PhoneInput, OTP)
│   │   │   ├── services/    # Auth service layer
│   │   │   └── state/       # Auth Redux slice
│   │   │
│   │   ├── posts/           # Posts feature
│   │   │   ├── api/         # Posts API definitions
│   │   │   ├── repository/  # Posts data repository
│   │   │   ├── screens/     # Post screens (Feed, Detail, Create)
│   │   │   └── state/       # Posts Redux slice & thunks
│   │   │
│   │   ├── comments/        # Comments feature
│   │   │   ├── api/         # Comments API
│   │   │   └── services/    # Comments service
│   │   │
│   │   ├── likes/           # Likes feature
│   │   │   └── services/    # Likes service
│   │   │
│   │   ├── votes/           # Votes feature
│   │   │   └── services/    # Votes service
│   │   │
│   │   └── profile/         # Profile feature
│   │       └── screens/     # Profile, MyPosts, EditProfile
│   │
│   ├── navigation/          # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   ├── routes.ts        # Route constants
│   │   └── types.ts         # Navigation types
│   │
│   ├── store/               # Redux store configuration
│   │   └── index.ts
│   │
│   ├── theme/               # Design system
│   │   ├── colors.ts        # Color palette
│   │   ├── spacing.ts       # Spacing constants
│   │   ├── typography.ts    # Text styles
│   │   └── index.ts
│   │
│   └── utils/               # Utility functions
│       └── storage.ts       # AsyncStorage helpers
│
├── App.tsx                  # App entry point
└── package.json
```

## Architecture Patterns

### 1. Atomic Design Pattern

Components are organized following the Atomic Design methodology:

```
components/
├── atoms/           # Basic building blocks
│   ├── Button.tsx   # Reusable button with variants
│   ├── Input.tsx    # Text input with validation
│   ├── Avatar.tsx   # User avatar with initials/image
│   ├── Badge.tsx    # Status badges
│   ├── IconButton.tsx
│   └── Text.tsx     # Typography component
│
├── molecules/       # Combinations of atoms
│   ├── PhoneInput.tsx   # Country code + input
│   ├── Header.tsx       # Navigation header
│   ├── Card.tsx         # Container with shadow
│   └── ActionButton.tsx # Icon + label button
│
└── organisms/       # Complex components
    ├── PostCard/    # Full post display
    ├── PollOptions/ # Poll voting UI
    └── CommentCard/ # Comment display
```

**Usage Example:**
```typescript
import { Button, Text, Avatar } from '@/components/atoms';
import { PhoneInput, Header } from '@/components/molecules';
import { PostCard } from '@/components';
```

### 2. Feature-Based Architecture

Each feature is self-contained with its own:
- **API layer**: Type definitions and API contracts
- **Services**: HTTP calls and business logic
- **State**: Redux slices and async thunks
- **Screens**: UI components for the feature
- **Repository**: Data access abstraction (optional)

### 3. State Management (Redux Toolkit - Feature Slice Pattern)

We use **Feature Slice Pattern** (not pure Ducks):

| Pattern | Description | Our Approach |
|---------|-------------|--------------|
| **Ducks** | Everything in one file | ❌ Not used |
| **Feature Slice** | Split by concern within feature | ✅ Used |

```
features/posts/state/
├── index.ts          # Re-exports everything
├── postsSlice.ts     # Slice + reducers + selectors
├── postsThunks.ts    # Async thunks (separate for clarity)
└── postsTypes.ts     # TypeScript types
```

**Why not pure Ducks?**
- Better code organization for larger features
- Easier to navigate and maintain
- Thunks can get complex and deserve their own file
- Types are reusable across the feature

```
┌─────────────────────────────────────────────────────────┐
│                      Redux Store                         │
├─────────────────┬─────────────────┬─────────────────────┤
│   Auth Slice    │   Posts Slice   │   Other Slices      │
│  - user         │  - feed         │                     │
│  - isAuth       │  - userPosts    │                     │
│  - isLoading    │  - likedPosts   │                     │
│                 │  - votedOptions │                     │
└─────────────────┴─────────────────┴─────────────────────┘
```

**Slice Structure:**
```typescript
// postsSlice.ts
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Sync actions
    clearCurrentPost: (state) => { ... },
    updatePostLikeCount: (state, action) => { ... },
  },
  extraReducers: (builder) => {
    // Handle async thunk states
    builder.addCase(fetchFeed.fulfilled, (state, action) => { ... });
  },
});

// Export actions, selectors, and reducer
export const { clearCurrentPost, updatePostLikeCount } = postsSlice.actions;
export const selectFeed = (state) => state.posts.feed;
export default postsSlice.reducer;
```

**Async Operations**: Use `createAsyncThunk` for API calls

```typescript
// postsThunks.ts
export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async ({ skip, take }, { rejectWithValue }) => {
    try {
      const posts = await postsRepository.getFeed(skip, take);
      return { posts, isRefresh };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 3. Navigation Structure

```
RootNavigator
├── AuthNavigator (when not authenticated)
│   ├── Welcome
│   ├── PhoneInput
│   └── OTPVerification
│
└── MainNavigator (when authenticated)
    ├── Feed
    ├── PostDetail
    ├── CreatePost (modal)
    ├── Profile
    ├── MyPosts
    └── EditProfile
```

### 4. Component Architecture

```
┌─────────────────────────────────────────┐
│              Screen Component            │
│  (FeedScreen, PostDetailScreen, etc.)   │
├─────────────────────────────────────────┤
│         Reusable Components              │
│  (PostCard, PollOptions, CommentCard)   │
├─────────────────────────────────────────┤
│            Theme System                  │
│  (colors, spacing, typography)          │
└─────────────────────────────────────────┘
```

## Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Screen  │────▶│  Thunk   │────▶│ Service  │────▶│   API    │
│          │     │          │     │          │     │          │
│  (UI)    │◀────│ (Redux)  │◀────│ (Logic)  │◀────│ (HTTP)   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

1. **Screen** dispatches an action (thunk)
2. **Thunk** calls the service layer
3. **Service** makes HTTP request via Axios
4. **Response** flows back, updating Redux state
5. **Screen** re-renders with new data

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Welcome   │────▶│ PhoneInput  │────▶│     OTP     │
│   Screen    │     │   Screen    │     │ Verification│
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Send OTP   │     │ Verify OTP  │
                    │    API      │     │    API      │
                    └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Store Token │
                                        │ AsyncStorage│
                                        └─────────────┘
```

## Key Components

### PostCard
Displays a single post with:
- Author info (avatar, name, timestamp)
- Post content
- Poll options (if poll type)
- Action buttons (like, comment, share)

### PollOptions
Interactive poll component:
- Radio buttons for voting
- Progress bars for results
- Vote count and deadline

### CommentCard
Chat-bubble style comment display:
- Author avatar with connector line
- Comment content
- Timestamp

## Theme System

### Colors
```typescript
colors = {
  primary: '#6366F1',      // Indigo
  secondary: '#EC4899',    // Pink
  accent: '#06B6D4',       // Cyan
  background: '#F8FAFC',   // Light gray
  surface: '#FFFFFF',      // White
  text: '#1E293B',         // Dark slate
  // ... more colors
}
```

### Spacing
```typescript
spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}
```

## API Integration

All API calls go through service layers:

```typescript
// Example: likesService
export const likesService = {
  likePost: (postId: string) => 
    api.post(`/likes/post/${postId}`),
  
  unlikePost: (postId: string) => 
    api.delete(`/likes/post/${postId}`),
};
```

## Error Handling

- **API Errors**: Caught in thunks, stored in slice state
- **UI Errors**: Displayed via Alert or inline messages
- **Auth Errors**: Redirect to login if token invalid

## Performance Optimizations

1. **FlatList** for large lists with `keyExtractor`
2. **useCallback** for memoized handlers
3. **Optimistic updates** for likes/votes
4. **Pagination** with infinite scroll

## Future Improvements

- [ ] Offline support with data persistence
- [ ] Push notifications
- [ ] Image uploads for posts
- [ ] Dark mode support
- [ ] Localization (i18n)
