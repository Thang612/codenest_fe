import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider
        attribute="class" // Quan trọng: ép next-themes dùng class thay vì data-theme
        defaultTheme="system"
        enableSystem
        {...props}
    >{children}</NextThemesProvider>
}