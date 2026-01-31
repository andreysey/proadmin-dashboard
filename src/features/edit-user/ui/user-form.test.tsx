import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserForm } from './user-form'

// Mock UI components
vi.mock('@/shared/ui/input', async () => {
  const React = await import('react')
  return {
    Input: React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      (props, ref) => <input ref={ref} {...props} />
    ),
  }
})

vi.mock('@/shared/ui/button', () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
}))

vi.mock('@/shared/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}))

describe('UserForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  }

  it('should render form fields', () => {
    render(<UserForm {...defaultProps} />)
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('should show validation errors on submit with empty fields', async () => {
    const user = userEvent.setup()
    render(<UserForm {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText(/first name must be at least/i)).toBeInTheDocument()
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it.skip('should submit valid data', async () => {
    const onSubmit = vi.fn()
    render(<UserForm {...defaultProps} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'johndoe' } })

    // Explicitly select role
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'admin' } })

    const submitBtn = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          username: 'johndoe',
          role: 'admin',
        })
      )
    })
  })

  it('should pre-fill data when editing', () => {
    const initialData = {
      firstName: 'Alice',
      lastName: 'Wonder',
      email: 'alice@example.com',
      username: 'alice',
      role: 'admin' as const,
    }

    render(<UserForm {...defaultProps} initialData={initialData} />)

    expect(screen.getByRole('textbox', { name: /first name/i })).toHaveValue('Alice')
    expect(screen.getByRole('textbox', { name: /last name/i })).toHaveValue('Wonder')
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('alice@example.com')
    // Role is a combobox (select)
    expect(screen.getByRole('combobox', { name: /role/i })).toHaveValue('admin')
  })

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    render(<UserForm {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })
})
