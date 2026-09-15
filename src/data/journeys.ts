export type EditorialMedia = {
  kind: "sebastian" | "property";
  name: string;
  alt: string;
  objectPosition: string;
};

export type JourneyStage = {
  id: string;
  number: string;
  title: string;
  support: string;
  media: EditorialMedia;
};

export const buyingStages: JourneyStage[] = [
  {
    id: "define",
    number: "01",
    title: "Define the Search",
    support:
      "Sebastian starts with the life behind the move: who it is for, what must be true, and what can wait. The search is framed before a single home is opened.",
    media: {
      kind: "sebastian",
      name: "filing",
      alt: "Sebastian Alvarez reviewing plans with clients at a table",
      objectPosition: "48% 28%",
    },
  },
  {
    id: "discover",
    number: "02",
    title: "Discover Homes",
    support:
      "Homes are introduced in context—how they live, not only how they appear. He narrows the field with you so time is spent on places that can actually work.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-5071130",
      alt: "A two-story residence used to illustrate how Sebastian introduces homes in context",
      objectPosition: "center 42%",
    },
  },
  {
    id: "evaluate",
    number: "03",
    title: "Evaluate the Fit",
    support:
      "Walkthroughs become conversations. Tradeoffs are named clearly so a house is judged against your actual days, not a generic checklist.",
    media: {
      kind: "sebastian",
      name: "showing",
      alt: "Sebastian Alvarez walking a client through a home",
      objectPosition: "62% 22%",
    },
  },
  {
    id: "offer",
    number: "04",
    title: "Build the Offer",
    support:
      "The offer is prepared as a strategy: terms, timing, and tone that fit the home and the moment, explained in language you can stand behind.",
    media: {
      kind: "sebastian",
      name: "filing",
      alt: "Sebastian Alvarez working through documents with clients",
      objectPosition: "30% 40%",
    },
  },
  {
    id: "forward",
    number: "05",
    title: "Move Forward",
    support:
      "From accepted terms to the keys, the next step stays visible. You know what is happening, why it matters, and what is asked of you.",
    media: {
      kind: "sebastian",
      name: "clients",
      alt: "Sebastian Alvarez greeting clients outside a home",
      objectPosition: "62% 30%",
    },
  },
];

export const sellingStages: JourneyStage[] = [
  {
    id: "understand",
    number: "01",
    title: "Understand the Property",
    support:
      "Before advice, he studies the house as a buyer would: light, flow, first impression, and the story it is already telling.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-8583638",
      alt: "A residence studied as a buyer would see it from the street",
      objectPosition: "center 36%",
    },
  },
  {
    id: "prepare",
    number: "02",
    title: "Prepare",
    support:
      "Preparation is selective, not theatrical. The work is the work that changes how the home is received—not a list of tasks for their own sake.",
    media: {
      kind: "sebastian",
      name: "filing",
      alt: "Sebastian Alvarez preparing next steps with clients",
      objectPosition: "52% 24%",
    },
  },
  {
    id: "position",
    number: "03",
    title: "Position",
    support:
      "The home is placed in a clear context—who it is for, and why it should be seen that way—before it is asked to compete.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-3958954",
      alt: "A porch-front residence used to illustrate how a home is positioned",
      objectPosition: "58% 38%",
    },
  },
  {
    id: "present",
    number: "04",
    title: "Present",
    support:
      "Presentation is calm and complete. Every view should help a visitor understand how life would unfold here.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-10827225",
      alt: "A light-filled residence used to illustrate how a home is presented",
      objectPosition: "center 30%",
    },
  },
  {
    id: "launch",
    number: "05",
    title: "Launch",
    support:
      "The launch is paced, not rushed. Timing, access, and communication are set so the first impression is the intended one.",
    media: {
      kind: "sebastian",
      name: "hero",
      alt: "Sebastian Alvarez arriving at a residence with a portfolio",
      objectPosition: "54% 18%",
    },
  },
  {
    id: "close",
    number: "06",
    title: "Negotiate & Close",
    support:
      "Negotiation continues the strategy. You stay close to the reasoning—not only the result—until the work is finished.",
    media: {
      kind: "sebastian",
      name: "clients",
      alt: "Sebastian Alvarez shaking hands with clients",
      objectPosition: "58% 32%",
    },
  },
];
