import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Alert } from 'react-native';
import AddAnime from '../src/screens/AddAnime';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

describe('AddAnime Component', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    mockAxios.restore();
    jest.clearAllMocks();
  });

  it('should prevent submission with incomplete data', async () => {
    const { getByText, getByPlaceholderText } = render(<AddAnime />);

    const judulInput = getByPlaceholderText('Judul');
    fireEvent.changeText(judulInput, 'Test Anime');

    const submitButton = getByText('Submit Anime Data');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all required fields.');
    });
  });
});
