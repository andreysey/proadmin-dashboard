import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'Shared/UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'date'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Type something...',
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    value: 'Pre-filled value',
    onChange: () => {}, // No-op to avoid React warning without state
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'user@example.com',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '********',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This is disabled',
  },
}

export const Error: Story = {
  args: {
    'aria-invalid': true,
    placeholder: 'Invalid input',
  },
}
