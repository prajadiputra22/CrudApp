import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import SearchScreen from '../src/screens/Search';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('SearchScreen Component', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should filter anime list based on search input', async () => {
    // Mock API responses
    const mockInfoDasarData = [
      { id: '1', judul: 'Naruto', genre: 'Action', image: 'https://example.com/naruto.jpg' },
      { id: '2', judul: 'One Piece', genre: 'Adventure', image: 'https://example.com/onepiece.jpg' }
    ];
    const mockDetailData = [
      { id: '1', jumlah_episode: 220, durasi: 24, studio: 'Studio Pierrot' },
      { id: '2', jumlah_episode: 1000, durasi: 24, studio: 'Toei Animation' }
    ];

    mockAxios.onGet('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar').reply(200, mockInfoDasarData);
    mockAxios.onGet('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail').reply(200, mockDetailData);

    const { getByPlaceholderText, getByText, queryByText } = render(<SearchScreen />);

    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Naruto')).toBeTruthy();
      expect(getByText('One Piece')).toBeTruthy();
    });

    // Search for an anime
    const searchInput = getByPlaceholderText('Search anime...');
    fireEvent.changeText(searchInput, 'Naruto');

    // Check if only Naruto is displayed
    await waitFor(() => {
      expect(getByText('Naruto')).toBeTruthy();
      expect(queryByText('One Piece')).toBeNull();
    });
  });
});