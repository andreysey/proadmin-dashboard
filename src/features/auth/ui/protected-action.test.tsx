import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProtectedAction } from './protected-action'
import { usePermission } from '../model/use-permission'

vi.mock('../model/use-permission', () => ({
  usePermission: vi.fn(),
}))

describe('ProtectedAction', () => {
  const mockPermission = 'users:view'

  it('should render children when user has permission', () => {
    vi.mocked(usePermission).mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(true),
      role: 'admin',
    })

    render(
      <ProtectedAction permission={mockPermission}>
        <div>Protected Content</div>
      </ProtectedAction>
    )

    expect(screen.getByText('Protected Content')).toBeDefined()
  })

  it('should render fallback when user lacks permission', () => {
    vi.mocked(usePermission).mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
      role: 'admin',
    })

    render(
      <ProtectedAction permission={mockPermission} fallback={<div>Fallback</div>}>
        <div>Protected Content</div>
      </ProtectedAction>
    )

    expect(screen.queryByText('Protected Content')).toBeNull()
    expect(screen.getByText('Fallback')).toBeDefined()
  })

  it('should render nothing when user lacks permission and no fallback', () => {
    vi.mocked(usePermission).mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
      role: 'admin',
    })

    const { container } = render(
      <ProtectedAction permission={mockPermission}>
        <div>Protected Content</div>
      </ProtectedAction>
    )

    expect(screen.queryByText('Protected Content')).toBeNull()
    expect(container.firstChild).toBeNull()
  })
})
