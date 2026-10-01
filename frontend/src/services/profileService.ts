import { mockUsers } from '../lib/mockDb';

function getToken(): string {
  return localStorage.getItem('token') || '';
}

export const profileService = {
  getProfile: async () => {
    const data = await mockUsers.getMe(getToken());
    return { data };
  },

  updateProfile: async (profileData: any) => {
    const data = await mockUsers.updateMe(getToken(), profileData);
    return { data };
  },
};
