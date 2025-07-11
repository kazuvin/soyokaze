import React, { useState, useEffect } from 'react';
import { createSoyokazeApiClient, ApiClientError } from '../client';
import type { User } from '../client';

// Create API client instance
const apiClient = createSoyokazeApiClient({
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
});

// Example 1: Simple user list component
export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getUsers({ limit: 10 });
        setUsers(response.users);
        setError(null);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(`API Error: ${err.message}`);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({users.length})</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
            {user.is_active ? ' ✅' : ' ❌'}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 2: User detail component with error handling
interface UserDetailProps {
  userId: string;
}

export function UserDetail({ userId }: UserDetailProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await apiClient.getUser(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        if (err instanceof ApiClientError) {
          if (err.status === 404) {
            setError('User not found');
          } else {
            setError(`API Error: ${err.message}`);
          }
        } else {
          setError('An unknown error occurred');
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>User Details</h2>
      <div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}</p>
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
        {user.avatar_url && (
          <img src={user.avatar_url} alt={user.name} width="100" height="100" />
        )}
        <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        {user.last_login && (
          <p><strong>Last Login:</strong> {new Date(user.last_login).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}

// Example 3: Paginated user list with loading states
export function PaginatedUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 0,
  });

  const fetchUsers = async (limit: number, offset: number) => {
    try {
      setLoading(true);
      const response = await apiClient.getUsers({ limit, offset });
      setUsers(response.users);
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.total,
      });
      setError(null);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(`API Error: ${err.message}`);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.limit, pagination.offset);
  }, []);

  const handleNextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      fetchUsers(pagination.limit, newOffset);
    }
  };

  const handlePrevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    fetchUsers(pagination.limit, newOffset);
  };

  const canGoNext = pagination.offset + pagination.limit < pagination.total;
  const canGoPrev = pagination.offset > 0;

  return (
    <div>
      <h2>Paginated Users</h2>
      
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      
      <div>
        <p>
          Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} users
        </p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
              {user.is_active ? ' ✅' : ' ❌'}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handlePrevPage} 
          disabled={!canGoPrev || loading}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={!canGoNext || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Example 4: Custom hook for user data
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await apiClient.getUser(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
}

// Example 5: Custom hook for users list
export function useUsers(limit: number = 10, offset: number = 0) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getUsers({ limit, offset });
        setUsers(response.users);
        setTotal(response.total);
        setError(null);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [limit, offset]);

  return { users, loading, error, total };
}

// Example 6: Component using the custom hook
export function UserListWithHook() {
  const { users, loading, error } = useUsers(5, 0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users (using custom hook)</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 7: Search component
export function UserSearch() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    try {
      setLoading(true);
      const results = await apiClient.getUsersByEmail(searchEmail);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Users by Email</h2>
      <form onSubmit={handleSearch}>
        <input
          type="email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Enter email to search"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {searchResults.length > 0 && (
        <div>
          <h3>Search Results ({searchResults.length})</h3>
          <ul>
            {searchResults.map(user => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}