import { publicUrl } from "../lib/publicUrl";

export type PropertyView = {
  caption: string;
  alt: string;
  imagePosition: string;
};

export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  beds: number;
  baths: string;
  squareFeet: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  description: string;
  detail: string;
  highlights: string[];
  gallery: PropertyView[];
};

export const propertyDisclosure =
  "Portfolio concept. Property imagery is used for demonstration purposes; property names, pricing, and details are illustrative.";

export function propertyImageUrl(
  property: Property | string,
  width: 640 | 1200,
) {
  const image = typeof property === "string" ? property : property.image;
  return publicUrl(`images/properties/${image}-${width}.webp`);
}

export const properties: Property[] = [
  {
    id: "highgate",
    name: "Highgate Residence",
    location: "Bakersfield, California",
    price: "$649,000",
    beds: 4,
    baths: "3.5",
    squareFeet: "2,930",
    image: "pexels-curtis-adams-1694007-5071130",
    imageAlt: "Gray two-story home with a double garage and a green front lawn",
    imagePosition: "center 42%",
    description: "Considered details. Everyday comfort.",
    detail:
      "A fresh perspective on California living, with an airy palette and spaces designed to feel connected. This concept residence pairs practical comfort with a composed sense of style, from the first impression to the everyday details.",
    highlights: [
      "A clear, calm first impression from the street",
      "A plan imagined for everyday gathering and retreat",
      "Light and proportion as the primary luxury",
    ],
    gallery: [
      {
        caption: "Street presence",
        alt: "Front elevation of the Highgate concept residence",
        imagePosition: "center 42%",
      },
      {
        caption: "Approach",
        alt: "Driveway and lawn leading to the Highgate concept residence",
        imagePosition: "center 78%",
      },
      {
        caption: "Elevation",
        alt: "Upper facade of the Highgate concept residence",
        imagePosition: "center 12%",
      },
    ],
  },
  {
    id: "seven-oaks",
    name: "Seven Oaks Residence",
    location: "Bakersfield, California",
    price: "$749,000",
    beds: 5,
    baths: "3.5",
    squareFeet: "3,240",
    image: "pexels-curtis-adams-1694007-8583638",
    imageAlt:
      "Pale green home with a covered porch, brown garage doors, and a wide driveway",
    imagePosition: "center 40%",
    description: "A little more space for what matters.",
    detail:
      "An expansive home imagined for unhurried living and effortless hosting. Refined finishes, generous gathering spaces, and a welcoming atmosphere offer a backdrop for everything the next chapter might hold.",
    highlights: [
      "A covered arrival that makes the house feel welcoming",
      "Scale intended for both quiet days and company",
      "A lot that gives the residence room to breathe",
    ],
    gallery: [
      {
        caption: "Arrival",
        alt: "Covered porch of the Seven Oaks concept residence",
        imagePosition: "32% 40%",
      },
      {
        caption: "Approach",
        alt: "Wide driveway and lawn at the Seven Oaks concept residence",
        imagePosition: "78% 55%",
      },
      {
        caption: "Setting",
        alt: "Full lot view of the Seven Oaks concept residence",
        imagePosition: "center 28%",
      },
    ],
  },
  {
    id: "rosedale",
    name: "Rosedale Residence",
    location: "Bakersfield, California",
    price: "$559,000",
    beds: 4,
    baths: "3",
    squareFeet: "2,470",
    image: "pexels-curtis-adams-1694007-3958954",
    imageAlt: "Two-story home with a covered front porch and a blue-gray gable",
    imagePosition: "58% 38%",
    description: "Room to gather. Space to settle in.",
    detail:
      "Generous proportions meet a warm, welcoming atmosphere in this illustrative Rosedale home. A thoughtful balance of shared living areas and personal retreats makes space for quiet mornings and evenings with company.",
    highlights: [
      "A porch that makes arriving feel personal",
      "Rooms imagined for gathering without losing quiet",
      "A street presence that reads as established, not staged",
    ],
    gallery: [
      {
        caption: "Porch",
        alt: "Covered front porch of the Rosedale concept residence",
        imagePosition: "72% 40%",
      },
      {
        caption: "Elevation",
        alt: "Gable and windows of the Rosedale concept residence",
        imagePosition: "58% 8%",
      },
      {
        caption: "Street",
        alt: "Street view of the Rosedale concept residence",
        imagePosition: "20% 40%",
      },
    ],
  },
  {
    id: "riverlakes",
    name: "Riverlakes Residence",
    location: "Bakersfield, California",
    price: "$489,000",
    beds: 4,
    baths: "2.5",
    squareFeet: "2,180",
    image: "pexels-curtis-adams-1694007-10827225",
    imageAlt: "Two-story gabled home with a white garage and broad driveway",
    imagePosition: "center 30%",
    description: "Light-filled spaces. An easy sense of home.",
    detail:
      "An inviting residence imagined around the rhythms of everyday life. Open gathering spaces, considered finishes, and room to make yourself at home create a comfortable setting for your next chapter.",
    highlights: [
      "A simple, readable elevation from the street",
      "A plan sized for everyday living rather than spectacle",
      "Light as the first impression, inside and out",
    ],
    gallery: [
      {
        caption: "Elevation",
        alt: "Front gable of the Riverlakes concept residence",
        imagePosition: "center 18%",
      },
      {
        caption: "Approach",
        alt: "Driveway leading to the Riverlakes concept residence",
        imagePosition: "center 80%",
      },
      {
        caption: "Street presence",
        alt: "Full front view of the Riverlakes concept residence",
        imagePosition: "center 36%",
      },
    ],
  },
];
