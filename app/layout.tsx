import "./global.css"

export const metadata = {
  title: "My Next.js App",
  description: "A simple Next.js application",
}


const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout