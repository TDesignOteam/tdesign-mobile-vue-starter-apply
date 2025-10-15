import type { Theme } from 'vitepress'
// https://vitepress.dev/guide/custom-theme
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import 'virtual:group-icons.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { page } = useData()
    return h(DefaultTheme.Layout, { class: page.value.frontmatter.layout === 'home' ? 'home-page' : '' })
  },
  enhanceApp() {
    // ...
  },
} satisfies Theme
