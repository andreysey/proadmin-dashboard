import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotFound } from './not-found'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'

// Mock Router for the NotFound page link
const rootRoute = createRootRoute()
const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
})

const meta: Meta<typeof NotFound> = {
  title: 'Shared/UI/NotFound',
  component: NotFound,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [(Story) => <RouterProvider router={router} defaultComponent={Story} />],
}

export default meta
type Story = StoryObj<typeof NotFound>

export const Default: Story = {}
