import { defaultTheme, defineUserConfig } from 'vuepress'

export default defineUserConfig({
    title: 'Kismet.ts',
    description: 'Create kismet from code',
    theme: defaultTheme({
        navbar: [
            {
                text: 'Guide',
                link: '/guide/'
            },
            {
                text: 'Reference',
                link: '/reference/'
            },
            {
                text: `Version 0.1.0`,
                link: 'https://github.com/ghostrider-05/kismet.ts/blob/master/CHANGELOG.md',
            }
        ]
    })
})