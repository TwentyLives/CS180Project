import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

import AddVehiclePage from '../AddVehiclePage';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('AddVehiclePage', () => {
  beforeEach(() => {
    render(<AddVehiclePage />);
  });

  it('renders all input fields', () => {
    expect(screen.getByLabelText(/Make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trim/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tank Capacity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MPG/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Miles/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Type$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Fuel Type$/i)).toBeInTheDocument();
    expect(screen.getByText(/Fuel Side/i)).toBeInTheDocument();
  });

  it('shows error on invalid year input', async () => {
    const yearInput = screen.getByLabelText(/Year/i);
    userEvent.clear(yearInput);
    userEvent.type(yearInput, '1700');

    fireEvent.blur(yearInput); // Trigger validation
    await waitFor(() => {
      expect(screen.getByText(/Year must be 4 digits/)).toBeInTheDocument();
    });
  });

  it('fills and submits the form with valid data', async () => {
  // Await userEvent.type so test waits for each input update
  await userEvent.type(screen.getByLabelText(/Make/i), 'Toyota');
  await userEvent.type(screen.getByLabelText(/Model/i), 'Camry');
  await userEvent.type(screen.getByLabelText(/Year/i), '2020');
  await userEvent.type(screen.getByLabelText(/Trim/i), 'XLE');
  await userEvent.type(screen.getByLabelText(/Tank Capacity/i), '14.5');
  await userEvent.type(screen.getByLabelText(/MPG/i), '32');
  await userEvent.type(screen.getByLabelText(/Current Miles/i), '10000');

  // Await selectOptions (async)
  await userEvent.selectOptions(screen.getByLabelText(/^Type$/i), 'SUV');
  await userEvent.selectOptions(screen.getByLabelText(/^Fuel Type$/i), 'Premium');

  const rightRadio = screen.getByLabelText('Right');
  await userEvent.click(rightRadio);
  expect(rightRadio).toBeChecked();

  // Mock fetch BEFORE submitting (better to mock once per test file in beforeEach)
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;

  const submitButton = screen.getByRole('button', { name: /Save Vehicle/i });
  await userEvent.click(submitButton);

  // Use findByText to wait for async text to appear instead of waitFor + getByText
  await screen.findByText("✅ Add Vehicle Successfully!");
});


});
