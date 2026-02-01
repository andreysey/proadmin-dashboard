import type { Meta, StoryObj } from '@storybook/react-vite'
import { ModeToggle } from './mode-toggle'

const meta: Meta<typeof ModeToggle> = {
  title: 'Shared/UI/ModeToggle',
  component: ModeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ModeToggle>

export const Default: Story = {}
