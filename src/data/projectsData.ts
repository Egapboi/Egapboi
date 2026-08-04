export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  repo: string;
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "ytdlp-qt",
    title: "yt-dlp Qt",
    description: "A sleek Qt-based GUI desktop client for yt-dlp.",
    tech: ["Python", "Qt", "yt-dlp"],
    repo: "https://github.com/Egapboi/ytdlp_qt",
    image: "https://files.catbox.moe/u1lul8.png",
    featured: true,
  },
  {
    id: "cps-tester",
    title: "CPS Tester",
    description:
      "A Qt-based GUI application to test CPS (clicks per second).",
    tech: ["Python", "Qt"],
    repo: "https://github.com/Egapboi/CPS-Test",
  },
  {
    id: "fruit",
    title: "Fruit",
    description:
      "A modern full-stack plant care application with AI-powered features, built with React and Node.js.",
    tech: [
      "React 18",
      "Vite",
      "Framer Motion",
      "Node.js",
      "Express",
      "SQLite",
      "Google Gemini",
      "JWT",
    ],
    repo: "https://github.com/Egapboi/fruit",
  },
];
