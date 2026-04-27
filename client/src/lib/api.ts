const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};
export const live = {
  start: async (data: { title?: string; message?: string; guild_id?: string }) => {
    const response = await fetch(`${API_URL}/live/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to start Go Live');
    }
    return response.json();
  },
};

export const auth = {
  register: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  discordLogin: async (code: string, redirect_uri: string) => {
    const response = await fetch(`${API_URL}/auth/discord-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Discord login failed');
    }

    return response.json();
  }
};

export const twitch = {
  getOauthUrl: async (): Promise<{ url: string }> => {
    const response = await fetch(`${API_URL}/twitch/oauth/url`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get Twitch OAuth URL');
    return response.json();
  },
};

export const user = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (data: { display_name: string }) => {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  linkTwitch: async () => {
    const response = await fetch(`${API_URL}/user/link-twitch`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to link Twitch');
    return response.json();
  }
};

export const streams = {
  sync: async () => {
    const response = await fetch(`${API_URL}/streams/sync`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync streams');
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/streams`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch streams');
    return response.json();
  },

  mockStart: async (data?: { title?: string; category?: string; platform?: string }) => {
    const response = await fetch(`${API_URL}/streams/mock/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data || {}),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to start test stream');
    }
    return response.json();
  },

  mockStop: async () => {
    const response = await fetch(`${API_URL}/streams/mock/stop`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to stop test stream');
    }
    return response.json();
  }
};

export const discord = {
  getConnections: async () => {
    const response = await fetch(`${API_URL}/discord/connections`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch Discord connections');
    return response.json();
  },
  getCommunities: async () => {
    const response = await fetch(`${API_URL}/discord/communities`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch communities');
    return response.json();
  },
  upsertCommunity: async (data: { guild_id: string; channel_id?: string; game_name?: string }) => {
    const response = await fetch(`${API_URL}/discord/communities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to save community');
    }
    return response.json();
  },
  deleteCommunity: async (guild_id: string) => {
    const response = await fetch(`${API_URL}/discord/communities/${guild_id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete community');
    }
    return response.json();
  },
  getLink: async () => {
    const response = await fetch(`${API_URL}/discord/link`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch Discord link');
    return response.json();
  }
};

export const owner = {
  register: async (guild_id: string, name: string) => {
    const response = await fetch(`${API_URL}/owner/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ guild_id, name }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to register community');
    }
    return response.json();
  },
  getList: async () => {
    const response = await fetch(`${API_URL}/owner/list`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch communities');
    return response.json();
  },
  getMembers: async (guild_id: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/members`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  },
  getPerks: async (guild_id: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/perks`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch perks');
    return response.json();
  },
  upsertPerk: async (guild_id: string, data: { reward_key: string, hours_required?: number, tickets_required?: number, criteria_type?: string, description: string, reward_type?: string, reward_value?: string }) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/perks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to save perk');
    }
    return response.json();
  },
  deletePerk: async (guild_id: string, reward_key: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/perks/${reward_key}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete perk');
    return response.json();
  },
  getRoles: async (guild_id: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/roles`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
  },
  testRole: async (guild_id: string, role_id: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/roles/test`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role_id }),
    });
    if (!response.ok) throw new Error('Failed to test role assignment');
    return response.json();
  },
  getStaffRoles: async (guild_id: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/staff-roles`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch staff roles');
    return response.json();
  },
  addStaffRole: async (guild_id: string, role_id: string, role_name: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/staff-roles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ role_id, role_name }),
    });
    if (!response.ok) throw new Error('Failed to add staff role');
    return response.json();
  },
  removeStaffRole: async (guild_id: string, role_id: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/staff-roles/${role_id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to remove staff role');
    return response.json();
  },
  getSettings: async (guild_id: string) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/settings`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },
  updateSettings: async (guild_id: string, settings: { require_ticket_review: boolean }) => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  },
  getTicketQueue: async (guild_id: string, status?: string) => {
    const url = status ? `${API_URL}/owner/${guild_id}/tickets?status=${status}` : `${API_URL}/owner/${guild_id}/tickets`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
  },
  reviewTicket: async (guild_id: string, ticket_id: number, status: 'approved' | 'rejected') => {
    const response = await fetch(`${API_URL}/owner/${guild_id}/tickets/${ticket_id}/review`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to review ticket');
    return response.json();
  }
};

export const staff = {
    getCommunities: async () => {
        const response = await fetch(`${API_URL}/staff/communities`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch staff communities');
        return response.json();
    },
    logTicket: async (data: { guild_id: string, ticket_ref: string, notes?: string }) => {
        const response = await fetch(`${API_URL}/staff/tickets`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to log ticket');
        return response.json();
    },
    getStats: async (guild_id: string) => {
        const response = await fetch(`${API_URL}/staff/${guild_id}/stats`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch staff stats');
        return response.json();
    }
};

export const health = {
  log: async (data: { type: 'sleep' | 'mood', value: number, notes?: string }) => {
    const response = await fetch(`${API_URL}/health`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to log health data');
    return response.json();
  },

  getLogs: async (type?: 'sleep' | 'mood') => {
    const url = type ? `${API_URL}/health?type=${type}` : `${API_URL}/health`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch health logs');
    return response.json();
  }
};
