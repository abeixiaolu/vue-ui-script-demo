import type { RenderOptions } from '@testing-library/vue'
import Icon from '@/ui/Icon/Icon.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('icon', () => {
  const name = 'i-lucide-alarm-clock'

  it.each<RenderOptions<typeof Icon>[]>([
    // Props
    [{ props: { name } }],
    [{ props: { name, as: 'div' } }],
    [{ props: { name, class: 'custom-class' } }],
  ])('should have the correct structure (%s)', (options) => {
    render(Icon, {
      attrs: {
        'data-testid': 'icon',
      },
      ...options,
    })

    expect(screen.getByTestId('icon')).matchSnapshot()
  })
})
