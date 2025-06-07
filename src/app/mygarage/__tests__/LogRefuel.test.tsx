import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogRefuelModal from '../LogRefuel';

describe('LogRefuelModal', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when closed', () => {
    render(<LogRefuelModal isOpen={false} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.queryByText(/Log Refuel/i)).not.toBeInTheDocument();
  });

  test('renders modal when open', () => {
    render(<LogRefuelModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByText(/Log Refuel/i)).toBeInTheDocument();
  });

  test('inputs update correctly', async () => {
    render(<LogRefuelModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    const gallonsInput = screen.getByLabelText(/Gallons Added/i);
    const costInput = screen.getByLabelText(/Money Spent/i);
    const gasTypeSelect = screen.getByLabelText(/Gas Type/i);

    await userEvent.clear(gallonsInput);
    await userEvent.type(gallonsInput, '10.5');
    expect(gallonsInput).toHaveValue('10.5');

    await userEvent.clear(costInput);
    await userEvent.type(costInput, '25.75');
    expect(costInput).toHaveValue('25.75');

    await userEvent.selectOptions(gasTypeSelect, 'Premium');
    expect(gasTypeSelect).toHaveValue('Premium');
  });

  test('submit button disabled when form invalid', () => {
    render(<LogRefuelModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    expect(submitBtn).toBeDisabled();
  });

  test('submit button enabled when form valid', async () => {
    render(<LogRefuelModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    const gallonsInput = screen.getByLabelText(/Gallons Added/i);
    const costInput = screen.getByLabelText(/Money Spent/i);
    const submitBtn = screen.getByRole('button', { name: /Submit/i });

    await userEvent.type(gallonsInput, '10');
    await userEvent.type(costInput, '25');

    expect(submitBtn).toBeEnabled();
  });

  test('calls onSubmit with correct data and closes on submit', async () => {
    render(<LogRefuelModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    const gallonsInput = screen.getByLabelText(/Gallons Added/i);
    const costInput = screen.getByLabelText(/Money Spent/i);
    const gasTypeSelect = screen.getByLabelText(/Gas Type/i);
    const submitBtn = screen.getByRole('button', { name: /Submit/i });

    await userEvent.selectOptions(gasTypeSelect, 'Diesel');
    await userEvent.type(gallonsInput, '15');
    await userEvent.type(costInput, '40');

    await userEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith({
      gasType: 'Diesel',
      gallons: 15,
      cost: 40,
    });
    expect(onClose).toHaveBeenCalled();
  });

  test('shows confirmation dialog when closing with dirty form', async () => {
    render(<LogRefuelModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    const gallonsInput = screen.getByLabelText(/Gallons Added/i);
    await userEvent.type(gallonsInput, '1');

    // Click Cancel on the main modal
    const modalCancelBtn = screen.getAllByRole('button', { name: /Cancel/i })[0];
    await userEvent.click(modalCancelBtn);

    // Confirmation dialog appears
    const confirmDialog = screen.getByText(/Discard changes\?/i).closest('div')!;
    expect(confirmDialog).toBeInTheDocument();

    // Click Cancel inside confirmation dialog
    const cancelConfirmBtn = within(confirmDialog).getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelConfirmBtn);

    expect(screen.queryByText(/Discard changes\?/i)).not.toBeInTheDocument();

    // Click Cancel again on main modal
    await userEvent.click(modalCancelBtn);

    // Click "Close Anyway" on the confirmation dialog
    const closeAnywayBtn = within(screen.getByText(/Discard changes\?/i).closest('div')!)
      .getByRole('button', { name: /Close Anyway/i });
    await userEvent.click(closeAnywayBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('closes immediately when form is not dirty', async () => {
    render(<LogRefuelModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Form is clean initially
    const cancelButtons = screen.getAllByRole('button', { name: /Cancel/i });
    // cancelButtons[0] is the one in the main modal
    // cancelButtons[1] is the one in the confirmation dialog

    await userEvent.click(cancelButtons[1]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
