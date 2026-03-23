import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '../ProductForm';

describe('ProductForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('renders all form fields', () => {
    render(
      <ProductForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/available for order/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(
      <ProductForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create product/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates price is greater than 0', async () => {
    render(
      <ProductForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '0' } });

    const submitButton = screen.getByRole('button', { name: /create product/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ProductForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ProductForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'Test Product' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'This is a test product description' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '99.99' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Nepali' },
    });

    const submitButton = screen.getByRole('button', { name: /create product/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'This is a test product description',
        price: 99.99,
        category: 'Nepali',
        image_url: '',
        is_available: true,
      });
    });
  });

  it('pre-fills form when editing a product', () => {
    const product = {
      _id: '1',
      name: 'Existing Product',
      description: 'Existing description',
      price: 50,
      category: 'Western',
      image_url: 'https://example.com/image.jpg',
      is_available: false,
      is_deleted: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    render(
      <ProductForm
        product={product}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/product name/i)).toHaveValue('Existing Product');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Existing description');
    expect(screen.getByLabelText(/price/i)).toHaveValue(50);
    expect(screen.getByLabelText(/category/i)).toHaveValue('Western');
    expect(screen.getByLabelText(/image url/i)).toHaveValue('https://example.com/image.jpg');
    expect(screen.getByLabelText(/available for order/i)).not.toBeChecked();
    expect(screen.getByRole('button', { name: /update product/i })).toBeInTheDocument();
  });
});
