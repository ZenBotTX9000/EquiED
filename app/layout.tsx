import type React from "react"
import type { Metadata } from "next"
import "../globals.css" // Updated path
import PerformanceOptimizerWrapper from "@/components/performance-optimizer-wrapper"

export const metadata: Metadata = {
  title: "Equidistributed Salary Chatbot",
  description: "Learn about the National Equidistributed Salary model",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <meta name="theme-color" content="#1e293b" />
        <title>Equidistributed Salary Aide</title>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Improved scroll reset script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if (history.scrollRestoration) {
              history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
            document.addEventListener('DOMContentLoaded', function() {
              // Optimize initial render
              setTimeout(function() {
                const images = document.querySelectorAll('img');
                if (images.length) {
                  images.forEach(img => {
                    if (!img.complete) {
                      img.setAttribute('loading', 'lazy');
                    }
                  });
                }
              }, 100);
            });
            // Fix for mobile viewport height issues
            function setVH() {
              let vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            }
            setVH();
            window.addEventListener('resize', setVH);
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Add meta tags for better mobile experience */}
        {/* Force hardware acceleration for smoother animations */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html, body {
              -webkit-overflow-scrolling: touch;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
            }
            `,
          }}
        />
      </head>
      <body className="overflow-hidden">
        {children}
        <PerformanceOptimizerWrapper />
      </body>
    </html>
  )
}
