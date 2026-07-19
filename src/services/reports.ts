/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { PerformanceReport } from '../types';

export const reportsService = {
  async getAll(): Promise<PerformanceReport[]> {
    const response = await apiClient.get<PerformanceReport[]>('/reports');
    return response.data;
  },

  async getById(id: string): Promise<PerformanceReport> {
    const response = await apiClient.get<PerformanceReport>(`/reports/${id}`);
    return response.data;
  },

  async getBySessionId(sessionId: string): Promise<PerformanceReport> {
    const response = await apiClient.get<PerformanceReport>(`/reports/session/${sessionId}`);
    return response.data;
  }
};
