# Dither

A modern, web-based image dithering tool built with Next.js and React. Apply various dithering algorithms and retro color palettes to your images directly in the browser.

## Features

- **Multiple Dithering Algorithms**: Choose from classic error diffusion algorithms including:
  - Floyd-Steinberg
  - Atkinson
  - Stucki
  - Burkes
  - Sierra
  - Jarvis, Judice, and Ninke
  - None (Pixelate only)
- **Retro Color Palettes**: Apply preset color filters such as:
  - Black & White
  - Gameboy
  - CGA (Standard & Warm)
  - EGA
  - Macintosh
  - Sepia
  - Vaporwave
  - Cyberpunk
  - Nord
  - Gruvbox
- **Real-time Customization**:
  - Adjust pixel size (1px - 5px) for varying levels of detail.
  - Zoom controls to inspect the dither patterns.
- **Modern UI**:
  - Clean, responsive interface built with shadcn/ui.
  - Dark/Light mode support.
- **Privacy Focused**: All image processing happens client-side in your browser. No images are uploaded to any server.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/dither.git
    cd dither
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1.  **Upload an Image**: Click "Upload Image" or drag and drop a file.
2.  **Select Algorithm**: Choose a dithering algorithm from the dropdown (e.g., Floyd-Steinberg).
3.  **Choose Filter**: Select a color palette (e.g., Gameboy, Cyberpunk).
4.  **Adjust Settings**: Use the slider to change pixel size.
5.  **Download**: Click the "DOWNLOAD" button to save your dithered image.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
