/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { ResumeData } from '../types';

export const resumeService = {
  async upload(
    file: File, 
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ResumeData> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ResumeData>('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  async getLatest(): Promise<ResumeData | null> {
    const response = await apiClient.get<ResumeData | null>('/resume/latest');
    return response.data;
  },

  async getById(id: string): Promise<ResumeData> {
    const response = await apiClient.get<ResumeData>(`/resume/${id}`);
    return response.data;
  }
};
