export type ProcessStep = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  image: string;
  outcomes: string[];
  activities: string[];
  deliverables: string[];
};

export const processSteps: ProcessStep[] = [
  {
    slug: "discover",
    title: "Discover",
    short:
      "Clarify goals, users, constraints, and what success looks like before writing code.",
    summary:
      "Discovery turns vague ideas into a sharp brief. We define who the product serves, what must ship first, and which constraints shape the architecture.",
    image: "/images/process-discover.png",
    outcomes: [
      "Shared understanding of the problem and audience",
      "Prioritized MVP scope with clear success metrics",
      "Technical constraints and integration requirements mapped",
    ],
    activities: [
      "Stakeholder and product discovery conversations",
      "User journey and feature prioritization",
      "Risk, timeline, and stack assessment",
    ],
    deliverables: [
      "Discovery summary",
      "Recommended scope for the first release",
      "High-level architecture direction",
    ],
  },
  {
    slug: "design",
    title: "Design",
    short:
      "Map the product architecture, screens, and data flow into a clear build plan.",
    summary:
      "Design translates discovery into structure. Screens, flows, APIs, and data models are planned so building stays intentional instead of reactive.",
    image: "/images/process-design.png",
    outcomes: [
      "A product structure the team can execute against",
      "Clear information architecture and key screens",
      "Aligned frontend, backend, and data decisions",
    ],
    activities: [
      "Wireframes and interaction planning",
      "System and database design",
      "Milestone and delivery sequencing",
    ],
    deliverables: [
      "Screen and flow plan",
      "Technical build blueprint",
      "Milestone roadmap",
    ],
  },
  {
    slug: "build",
    title: "Build",
    short:
      "Ship in visible slices — interface, API, and database moving forward together.",
    summary:
      "Build is where the product takes form. Work moves in reviewable slices so you can see progress early and steer decisions while the system is still flexible.",
    image: "/images/process-build.png",
    outcomes: [
      "Working features in production-minded code",
      "Visible progress through incremental releases",
      "Frontend, API, and data staying in sync",
    ],
    activities: [
      "UI implementation and interaction polish",
      "API, auth, and database development",
      "Continuous review and iteration",
    ],
    deliverables: [
      "Working product increments",
      "Staging environment for feedback",
      "Clean, maintainable codebase",
    ],
  },
  {
    slug: "launch",
    title: "Launch",
    short:
      "Test, harden security, deploy, and hand over a stable production system.",
    summary:
      "Launch prepares the product for real users. We validate critical flows, harden security, deploy cleanly, and make sure the handoff is ready for production use.",
    image: "/images/process-launch.png",
    outcomes: [
      "Production deployment with confidence",
      "Validated core user journeys",
      "Secure and documented release",
    ],
    activities: [
      "QA across key flows and devices",
      "Security and access review",
      "Deployment, monitoring, and release notes",
    ],
    deliverables: [
      "Live production release",
      "Launch checklist and notes",
      "Handoff documentation",
    ],
  },
  {
    slug: "support",
    title: "Support",
    short:
      "Stay available for fixes, iterations, and the next version of the product.",
    summary:
      "Support keeps momentum after launch. Fixes, improvements, and future features are handled with the same clarity as the original build.",
    image: "/images/process-support.png",
    outcomes: [
      "Stable product after go-live",
      "Fast response to issues and improvements",
      "A clear path into the next version",
    ],
    activities: [
      "Bug fixes and performance tuning",
      "Feature iterations based on real usage",
      "Guidance on next-phase priorities",
    ],
    deliverables: [
      "Ongoing maintenance support",
      "Improvement backlog",
      "Next-release recommendations",
    ],
  },
];

export function getProcessStep(slug: string) {
  return processSteps.find((step) => step.slug === slug);
}
