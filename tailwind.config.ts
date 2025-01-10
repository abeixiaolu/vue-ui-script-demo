import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

/** @type {import('tailwindcss/tailwind-config')} */
export default {
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['lucide']),
    }),
  ],
}
