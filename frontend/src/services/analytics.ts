/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { DashboardData } from '../types';

export const analyticsService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/analytics/dashboard');
    return response.data;
  },

  async getPerformanceHistory(): Promise<any> {
    const response = await apiClient.get<any>('/analytics/performance');
    return response.data;
  }
};
