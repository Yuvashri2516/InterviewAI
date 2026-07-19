/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { User } from '../types';

export const profileService = {
  async get(): Promise<User> {
    const response = await apiClient.get<User>('/profile');
    return response.data;
  },

  async update(profileData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/profile', profileData);
    return response.data;
  }
};
