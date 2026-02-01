import type { Meta, StoryObj } from '@storybook/react-vite'
import { MeshGradient } from './mesh-gradient'

const meta: Meta<typeof MeshGradient> = {
  title: 'Shared/UI/MeshGradient',
  component: MeshGradient,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof MeshGradient>

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="relative h-[500px] w-full overflow-hidden rounded-md border">
        <Story />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <h1 className="from-primary to-accent z-20 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
            Mesh Gradient
          </h1>
        </div>
      </div>
    ),
  ],
}
