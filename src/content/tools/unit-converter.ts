import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const unitConverterArticle: ToolArticleContent = {
  intro: [
    "Unit conversion is the kind of thing you do fifty times a year and never remember the factor for. A recipe in Fahrenheit, a bike part in inches, a tyre pressure in bar, a shipping weight in pounds.",
    "This converter covers nine categories - length, weight, temperature, area, volume, time, speed, pressure and energy - across metric and imperial. What follows is the small number of places where conversion is genuinely tricky rather than just a multiplication, because those are the ones that cause real mistakes.",
  ],
  sections: [
    {
      heading: "Temperature is the odd one out",
      body: [
        "Every other conversion here is a multiplication. Temperature is not, and that difference matters more than it looks.",
        "Celsius and Fahrenheit have different zero points as well as different degree sizes, so converting requires both a scale and an offset. Twenty degrees Celsius is 68 Fahrenheit, but forty Celsius is 104 - double the Celsius figure, nowhere near double the Fahrenheit.",
        "The practical consequence: you cannot convert a temperature difference the same way you convert a temperature. If a process runs ten degrees Celsius warmer than another, that is eighteen Fahrenheit degrees warmer, not fifty. Getting this backwards is a classic error in anything involving tolerances or rates.",
        "Kelvin shares Celsius's degree size with a different zero, so Celsius to Kelvin is offset only.",
      ],
    },
    {
      heading: "The same word, different quantities",
      body: [
        "Several units share a name across systems and are not the same size, which is where the genuinely expensive mistakes live.",
        "A US gallon is about 3.79 litres. An imperial gallon is about 4.55. That is a 20% difference hiding behind an identical word, and it propagates into pints, quarts and fluid ounces. A US fluid ounce and an imperial fluid ounce differ by about 4%, in the opposite direction from what the gallon difference would suggest.",
        "Ounces are worse, because there are two unrelated kinds. A fluid ounce is a volume; an ounce avoirdupois is a mass. A recipe calling for eight ounces of flour and eight ounces of milk means two different measurements, and they do not correspond.",
        "Tons: a US short ton is 2,000 pounds, an imperial long ton is 2,240, and a metric tonne is 1,000 kilograms - roughly 2,205 pounds. All three get written as a ton.",
      ],
      bullets: [
        "US gallon 3.785 L vs imperial gallon 4.546 L - a 20% gap.",
        "Fluid ounce is volume; ounce is mass. Not interchangeable.",
        "Short ton, long ton and tonne are three different quantities.",
        "Always check which system a source is using before converting from it.",
      ],
    },
    {
      heading: "Mass and weight, and why it usually does not matter",
      body: [
        "Strictly, a kilogram is mass and a pound-force is weight, and converting between them assumes standard gravity. In everyday use nobody cares, because everything is happening on the same planet.",
        "Where it starts to matter is pressure, which is force per unit area and inherits the same ambiguity. PSI is pounds-force per square inch. A bar is 100,000 pascals, and one atmosphere is 101,325 pascals - close to a bar but not equal, which is why tyre pressures quoted in bar and in atmospheres differ slightly and both get rounded to the same number on the gauge.",
        "For ordinary purposes, treat the conversions here as exact. For engineering work where the distinction between mass and force is load-bearing, use the units the specification uses and do not round-trip through another system.",
      ],
    },
    {
      heading: "Rounding, and how errors accumulate",
      body: [
        "Most conversion factors are irrational or long decimals. An inch is exactly 25.4 millimetres, which is unusually tidy. A mile is 1,609.344 metres. A pound is 0.45359237 kilograms.",
        "Round once, at the end, to the precision you actually need. Rounding at each step of a chain of conversions compounds the error, and a few hops is enough for it to show up in a total.",
        "Think about significant figures rather than decimal places. If you measured something as 5 inches with a ruler, converting to 127.0000 millimetres implies a precision you do not have. 127 mm is the honest answer.",
        "Where an exact answer is required - machining, dosing, structural work - work in the units the specification is written in and convert only for display. Every conversion is an opportunity to introduce an error that is invisible until it is expensive.",
      ],
    },
  ],
  example: {
    title: "The gallon trap",
    input: "A US recipe: 2 gallons of stock\nA UK recipe: 2 gallons of stock",
    output: "US:       2 x 3.785 L = 7.57 litres\nImperial: 2 x 4.546 L = 9.09 litres\n\nDifference: 1.52 litres, or about 20%",
    note: "Same word, same number, a litre and a half apart. This is why a converter that quietly assumes one system is worse than no converter - you get a confident wrong answer. When a source does not say which gallon it means, the publication's country is usually the tell, and post-1970s British recipes have generally moved to metric anyway.",
  },
  limitations: [
    "Conversions assume standard conditions. Anything where gravity, temperature or pressure varies materially needs the specific formula for that situation, not a general factor.",
    "Where a unit name is ambiguous - gallon, ton, ounce - the tool converts the variant you pick. It cannot tell you which one your source meant.",
    "Currency is not a unit conversion. Exchange rates move; nothing here applies.",
    "No support for compound or derived units such as kilowatt-hours per hundred kilometres, or miles per gallon converted to litres per hundred kilometres - those are ratios and invert as well as scale.",
    "Rounding is for display. For work where precision is critical, use the source units and convert only at the end.",
  ],
};
