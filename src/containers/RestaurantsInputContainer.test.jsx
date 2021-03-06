import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { useDispatch, useSelector } from 'react-redux';
import {
  updateRestaurantProperty, addRestaurant,
} from '../stores/action/action-creators';

import RESTAURANTS from '../__fixtures__/restaurants.json';

import RestaurantsInputContainer from './RestaurantsInputContainer';

jest.mock('react-redux');

function renderComponent() {
  return render(<RestaurantsInputContainer />);
}

describe('<RestaurantsInputContainer />', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    useDispatch.mockImplementation(() => dispatch);
    useSelector.mockImplementation((selector) => selector({
      restaurants: [],
      restaurant: {},
    }));
  });

  // Given
  const restaurant = RESTAURANTS[0];

  it('display restaurant input-boxes ', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('textbox')).toHaveLength(3);
  });

  it('input restaurant', () => {
    const { getAllByRole } = renderComponent();
    getAllByRole('textbox').forEach((inputBox) => {
      const infoProperty = inputBox.name;
      const infoValue = restaurant[infoProperty];
      // When
      fireEvent.change(inputBox, { target: { value: infoValue } });
      // Then
      expect(dispatch).toBeCalledWith(updateRestaurantProperty(infoProperty, infoValue));
      expect(inputBox.value).toBe(infoValue);
    });
  });

  it('add new restaurant', () => {
    const { getAllByRole, getByRole } = renderComponent();
    getAllByRole('textbox').forEach((inputBox) => {
      const infoProperty = inputBox.name;
      const infoValue = restaurant[infoProperty];
      fireEvent.change(inputBox, { target: { value: infoValue } });
    });
    // When
    fireEvent.click(getByRole('button'));
    // Then
    expect(dispatch).toBeCalledWith(addRestaurant());
  });
});
