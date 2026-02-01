import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Toaster } from './sonner'
import { Button } from './button'

const meta: Meta<typeof Toaster> = {
  title: 'Shared/UI/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Default: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast
      </Button>
    </div>
  ),
}

export const Success: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toaster />
      <Button onClick={() => toast.success('Operation successful!')}>Show Success</Button>
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toaster />
      <Button variant="destructive" onClick={() => toast.error('Something went wrong')}>
        Show Error
      </Button>
    </div>
  ),
}
