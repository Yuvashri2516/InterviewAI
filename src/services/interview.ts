/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { InterviewConfig, InterviewSession, InterviewAnswer } from '../types';

export const interviewService = {
  async setup(config: InterviewConfig): Promise<InterviewSession> {
    const response = await apiClient.post<InterviewSession>('/interview/setup', config);
    return response.data;
  },

  async getSession(id: string): Promise<InterviewSession> {
    const response = await apiClient.get<InterviewSession>(`/interview/session/${id}`);
    return response.data;
  },

  async submitAnswer(
    sessionId: string, 
    questionId: string, 
    userAnswer: string,
    timeSpent: number
  ): Promise<InterviewAnswer> {
    const response = await apiClient.post<InterviewAnswer>(`/interview/session/${sessionId}/answer`, {
      questionId,
      userAnswer,
      timeSpent
    });
    return response.data;
  },

  async finish(sessionId: string): Promise<InterviewSession> {
    const response = await apiClient.post<InterviewSession>(`/interview/session/${sessionId}/finish`);
    return response.data;
  }
};
