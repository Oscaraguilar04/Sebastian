import type { EditorialMedia } from "./journeys";

export type Neighborhood = {
  id: string;
  name: string;
  question: string;
  copy: string;
  discuss: string;
  media: EditorialMedia;
};

export const neighborhoodDisclosure =
  "Neighborhood names are real places in Bakersfield. Photography and notes are illustrative for this portfolio concept and are not market data.";

export const neighborhoods: Neighborhood[] = [
  {
    id: "seven-oaks",
    name: "Seven Oaks",
    question: "Do you want room to settle, and a quieter street rhythm?",
    copy: "Seven Oaks is often the starting point for households who want space and an established residential feeling. Sebastian uses a visit here to talk about how a house actually lives—not a brochure version of the area.",
    discuss:
      "In a conversation, he would ask how you use a typical week, what “enough room” means, and which tradeoffs you will not make.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-8583638",
      alt: "Illustrative residence standing in for Seven Oaks",
      objectPosition: "center 40%",
    },
  },
  {
    id: "highgate",
    name: "Highgate",
    question: "Are you comparing newer streetscapes and a cleaner first impression?",
    copy: "Highgate, in this demonstration, represents the kind of residential pocket many buyers place on a first shortlist. The useful question is fit: scale, light, and how the house sits on its lot.",
    discuss:
      "Sebastian would walk the approach with you and name what the home does well before talking about what to change.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-5071130",
      alt: "Illustrative residence standing in for Highgate",
      objectPosition: "center 42%",
    },
  },
  {
    id: "riverlakes",
    name: "Riverlakes",
    question: "Is everyday ease more important than a larger footprint?",
    copy: "Riverlakes is included as a more compact, light-filled idea of home. The conversation is about how the rooms connect, and whether that matches the way you already live.",
    discuss:
      "He would ask what you need on a weekday morning, and what you can leave behind.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-10827225",
      alt: "Illustrative residence standing in for Riverlakes",
      objectPosition: "center 30%",
    },
  },
  {
    id: "rosedale",
    name: "Rosedale",
    question: "Do you want a place that is ready for people to gather?",
    copy: "Rosedale stands here for a porch-and-gathering kind of street. Sebastian would look first at how guests arrive, and where the household actually spends its time.",
    discuss:
      "The discussion is about welcome, privacy, and whether the house supports both.",
    media: {
      kind: "property",
      name: "pexels-curtis-adams-1694007-3958954",
      alt: "Illustrative residence standing in for Rosedale",
      objectPosition: "58% 38%",
    },
  },
  {
    id: "northwest",
    name: "Northwest Bakersfield",
    question: "Are you still choosing a side of town, not a single street?",
    copy: "Northwest Bakersfield is a broader compass many clients use before they name a neighborhood. This page does not assign prices, schools, or commute claims. It shows how Sebastian would open that discussion.",
    discuss:
      "He would map your days first—work, family, and the feeling you want when you turn toward home—then decide which streets deserve a closer look.",
    media: {
      kind: "sebastian",
      name: "clients",
      alt: "Sebastian Alvarez speaking with clients about where they want to live",
      objectPosition: "62% 28%",
    },
  },
];
