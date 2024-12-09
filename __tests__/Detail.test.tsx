import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DetailScreen from '../src/screens/Detail';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('DetailScreen Component', () => {
  const mockNavigation = {
    setParams: jest.fn(),
    goBack: jest.fn(),
  };

  const mockRoute = {
    params: {
      id: '1',
      judul: 'Test Anime',
      tahun: 2022,
      genre: 'Action',
      image: 'https://example.com/test.jpg',
      jumlah_episode: 12,
      durasi: 24,
      studio: 'Test Studio',
      status: 'Completed',
      sinopsis: 'A test anime synopsis',
      tautan: 'https://example.com'
    }
  };

  it('should toggle edit mode and update data', async () => {
    let mockAxios = new MockAdapter(axios);
    mockAxios.onPut(`https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar/1`).reply(200);
    mockAxios.onPut(`https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail/1`).reply(200);

    const { getByText, getByPlaceholderText } = render(
      <DetailScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    const editButton = getByText('Edit');
    fireEvent.press(editButton);

    const judulInput = getByPlaceholderText('Judul');
    fireEvent.changeText(judulInput, 'Updated Anime');

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Data updated successfully')).toBeTruthy();
    });
  });
});