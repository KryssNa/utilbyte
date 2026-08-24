"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Calculator, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type UnitType = "length" | "weight" | "temperature" | "area" | "volume" | "time" | "speed" | "pressure" | "energy";

interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const unitDefinitions: Record<UnitType, Record<string, UnitDefinition>> = {
  length: {
    millimeter: { name: "Millimeter", symbol: "mm", toBase: v => v / 1000, fromBase: v => v * 1000 },
    centimeter: { name: "Centimeter", symbol: "cm", toBase: v => v / 100, fromBase: v => v * 100 },
    meter: { name: "Meter", symbol: "m", toBase: v => v, fromBase: v => v },
    kilometer: { name: "Kilometer", symbol: "km", toBase: v => v * 1000, fromBase: v => v / 1000 },
    inch: { name: "Inch", symbol: "in", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    foot: { name: "Foot", symbol: "ft", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    yard: { name: "Yard", symbol: "yd", toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    mile: { name: "Mile", symbol: "mi", toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
  },
  weight: {
    milligram: { name: "Milligram", symbol: "mg", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    gram: { name: "Gram", symbol: "g", toBase: v => v / 1000, fromBase: v => v * 1000 },
    kilogram: { name: "Kilogram", symbol: "kg", toBase: v => v, fromBase: v => v },
    tonne: { name: "Tonne", symbol: "t", toBase: v => v * 1000, fromBase: v => v / 1000 },
    ounce: { name: "Ounce", symbol: "oz", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    pound: { name: "Pound", symbol: "lb", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    stone: { name: "Stone", symbol: "st", toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
  },
  temperature: {
    celsius: {
      name: "Celsius",
      symbol: "°C",
      toBase: v => v,
      fromBase: v => v
    },
    fahrenheit: {
      name: "Fahrenheit",
      symbol: "°F",
      toBase: v => (v - 32) * 5 / 9,
      fromBase: v => v * 9 / 5 + 32
    },
    kelvin: {
      name: "Kelvin",
      symbol: "K",
      toBase: v => v - 273.15,
      fromBase: v => v + 273.15
    },
  },
  area: {
    "square-millimeter": { name: "Square Millimeter", symbol: "mm²", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    "square-centimeter": { name: "Square Centimeter", symbol: "cm²", toBase: v => v / 10000, fromBase: v => v * 10000 },
    "square-meter": { name: "Square Meter", symbol: "m²", toBase: v => v, fromBase: v => v },
    "square-kilometer": { name: "Square Kilometer", symbol: "km²", toBase: v => v * 1000000, fromBase: v => v / 1000000 },
    "square-inch": { name: "Square Inch", symbol: "in²", toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
    "square-foot": { name: "Square Foot", symbol: "ft²", toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    "square-yard": { name: "Square Yard", symbol: "yd²", toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
    acre: { name: "Acre", symbol: "ac", toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  },
  volume: {
    "cubic-millimeter": { name: "Cubic Millimeter", symbol: "mm³", toBase: v => v / 1000000000, fromBase: v => v * 1000000000 },
    "cubic-centimeter": { name: "Cubic Centimeter", symbol: "cm³", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    "cubic-meter": { name: "Cubic Meter", symbol: "m³", toBase: v => v, fromBase: v => v },
    liter: { name: "Liter", symbol: "L", toBase: v => v / 1000, fromBase: v => v * 1000 },
    "cubic-inch": { name: "Cubic Inch", symbol: "in³", toBase: v => v * 0.0000163871, fromBase: v => v / 0.0000163871 },
    "cubic-foot": { name: "Cubic Foot", symbol: "ft³", toBase: v => v * 0.0283168, fromBase: v => v / 0.0283168 },
    gallon: { name: "US Gallon", symbol: "gal", toBase: v => v * 0.00378541, fromBase: v => v / 0.00378541 },
  },
  time: {
    nanosecond: { name: "Nanosecond", symbol: "ns", toBase: v => v / 1000000000, fromBase: v => v * 1000000000 },
    microsecond: { name: "Microsecond", symbol: "μs", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    millisecond: { name: "Millisecond", symbol: "ms", toBase: v => v / 1000, fromBase: v => v * 1000 },
    second: { name: "Second", symbol: "s", toBase: v => v, fromBase: v => v },
    minute: { name: "Minute", symbol: "min", toBase: v => v * 60, fromBase: v => v / 60 },
    hour: { name: "Hour", symbol: "h", toBase: v => v * 3600, fromBase: v => v / 3600 },
    day: { name: "Day", symbol: "d", toBase: v => v * 86400, fromBase: v => v / 86400 },
    week: { name: "Week", symbol: "wk", toBase: v => v * 604800, fromBase: v => v / 604800 },
  },
  speed: {
    "meter-per-second": { name: "Meter per Second", symbol: "m/s", toBase: v => v, fromBase: v => v },
    "kilometer-per-hour": { name: "Kilometer per Hour", symbol: "km/h", toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    "mile-per-hour": { name: "Mile per Hour", symbol: "mph", toBase: v => v / 2.23694, fromBase: v => v * 2.23694 },
    knot: { name: "Knot", symbol: "kn", toBase: v => v / 1.94384, fromBase: v => v * 1.94384 },
  },
  pressure: {
    pascal: { name: "Pascal", symbol: "Pa", toBase: v => v, fromBase: v => v },
    kilopascal: { name: "Kilopascal", symbol: "kPa", toBase: v => v * 1000, fromBase: v => v / 1000 },
    "bar": { name: "Bar", symbol: "bar", toBase: v => v * 100000, fromBase: v => v / 100000 },
    "psi": { name: "PSI", symbol: "psi", toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
    atmosphere: { name: "Atmosphere", symbol: "atm", toBase: v => v * 101325, fromBase: v => v / 101325 },
  },
  energy: {
    joule: { name: "Joule", symbol: "J", toBase: v => v, fromBase: v => v },
    kilojoule: { name: "Kilojoule", symbol: "kJ", toBase: v => v * 1000, fromBase: v => v / 1000 },
    calorie: { name: "Calorie", symbol: "cal", toBase: v => v * 4.184, fromBase: v => v / 4.184 },
    kilocalorie: { name: "Kilocalorie", symbol: "kcal", toBase: v => v * 4184, fromBase: v => v / 4184 },
    "watt-hour": { name: "Watt Hour", symbol: "Wh", toBase: v => v * 3600, fromBase: v => v / 3600 },
    "kilowatt-hour": { name: "Kilowatt Hour", symbol: "kWh", toBase: v => v * 3600000, fromBase: v => v / 3600000 },
  },
};

const unitTypeNames: Record<UnitType, string> = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  area: "Area",
  volume: "Volume",
  time: "Time",
  speed: "Speed",
  pressure: "Pressure",
  energy: "Energy",
};

export default function UnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>("length");
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("foot");
  const [fromValue, setFromValue] = useState<string>("1");
  const [toValue, setToValue] = useState<string>("");

  const convertValue = useCallback((value: number, from: string, to: string, type: UnitType): number => {
    const units = unitDefinitions[type];
    if (!units[from] || !units[to]) return 0;

    // Convert to base unit, then to target unit
    const baseValue = units[from].toBase(value);
    return units[to].fromBase(baseValue);
  }, []);

  const calculateConversion = useMemo(() => {
    const inputValue = parseFloat(fromValue);
    if (isNaN(inputValue)) return "";

    const result = convertValue(inputValue, fromUnit, toUnit, unitType);
    return result.toLocaleString(undefined, { maximumFractionDigits: 10 });
  }, [fromValue, fromUnit, toUnit, unitType, convertValue]);

  const handleUnitTypeChange = (newType: UnitType) => {
    setUnitType(newType);
    // Reset to first units of new type
    const units = Object.keys(unitDefinitions[newType]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const handleReset = () => {
    setFromValue("1");
    setToValue("");
  };

  // Update toValue when conversion changes
  useMemo(() => {
    setToValue(calculateConversion);
  }, [calculateConversion]);

  const availableUnits = Object.keys(unitDefinitions[unitType]);

  const faqs = [
    {
      question: "How accurate are the conversions?",
      answer: "All conversions use standard conversion factors and are accurate to at least 10 decimal places.",
    },
    {
      question: "What unit types are supported?",
      answer: "We support length, weight, temperature, area, volume, time, speed, pressure, and energy conversions.",
    },
    {
      question: "Can I convert between metric and imperial units?",
      answer: "Yes! The converter supports both metric and imperial/US customary units for most categories.",
    },
  ];

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement. Supports length, weight, temperature, area, volume, time, speed, pressure, and energy."
      category="utility"
      categoryLabel="Utility Tools"
      icon={Calculator}
      faqs={faqs}
      relatedTools={[
        { title: "Color Converter", description: "Convert color formats", href: "/utility-tools/color-converter", icon: Calculator, category: "utility" },
        { title: "Timestamp Converter", description: "Convert timestamps", href: "/utility-tools/timestamp", icon: Calculator, category: "utility" },
        { title: "Barcode Generator", description: "Generate barcodes", href: "/utility-tools/barcode", icon: Calculator, category: "utility" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Unit Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Unit Type</CardTitle>
            <CardDescription>Choose the type of units you want to convert</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {Object.entries(unitTypeNames).map(([key, name]) => (
                <Button
                  key={key}
                  variant={unitType === key ? "default" : "outline"}
                  onClick={() => handleUnitTypeChange(key as UnitType)}
                  className="text-sm"
                >
                  {name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {unitTypeNames[unitType]} Converter
              <Badge variant="secondary">{Object.keys(unitDefinitions[unitType]).length} units</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              {/* From */}
              <div className="space-y-2">
                <Label>From</Label>
                <Input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="Enter value"
                  className="text-lg"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unitDefinitions[unitType][unit].name} ({unitDefinitions[unitType][unit].symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleSwap} className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Swap
                </Button>
              </div>

              {/* To */}
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  type="number"
                  value={toValue}
                  readOnly
                  placeholder="Result"
                  className="text-lg bg-muted"
                />
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unitDefinitions[unitType][unit].name} ({unitDefinitions[unitType][unit].symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Conversions */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Conversions</CardTitle>
            <CardDescription>Quick access to common unit conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {unitType === "length" && (
                <>
                  <div className="text-sm">
                    <strong>1 meter =</strong> 3.28084 feet<br />
                    <strong>1 kilometer =</strong> 0.621371 miles<br />
                    <strong>1 inch =</strong> 2.54 centimeters
                  </div>
                  <div className="text-sm">
                    <strong>1 foot =</strong> 0.3048 meters<br />
                    <strong>1 mile =</strong> 1.60934 kilometers<br />
                    <strong>1 yard =</strong> 0.9144 meters
                  </div>
                </>
              )}
              {unitType === "weight" && (
                <>
                  <div className="text-sm">
                    <strong>1 kilogram =</strong> 2.20462 pounds<br />
                    <strong>1 gram =</strong> 0.035274 ounces<br />
                    <strong>1 tonne =</strong> 1000 kilograms
                  </div>
                  <div className="text-sm">
                    <strong>1 pound =</strong> 0.453592 kilograms<br />
                    <strong>1 ounce =</strong> 28.3495 grams<br />
                    <strong>1 stone =</strong> 6.35029 kilograms
                  </div>
                </>
              )}
              {unitType === "temperature" && (
                <div className="text-sm col-span-2">
                  <strong>Water freezes at:</strong> 0°C = 32°F = 273.15K<br />
                  <strong>Water boils at:</strong> 100°C = 212°F = 373.15K<br />
                  <strong>Room temperature:</strong> ~20°C = 68°F = 293.15K
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
