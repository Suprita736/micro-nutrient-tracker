export interface Supplement {
    id: string;
    name: string;
    unit: string;
    nutrientKey: string;
}

export const supplements: Supplement[] = [
    {
        id: "vitaminD",
        name: "Vitamin D3",
        unit: "IU",
        nutrientKey: "vitaminD",
    },
    {
        id: "magnesium",
        name: "Magnesium",
        unit: "mg",
        nutrientKey: "magnesium",
    },
    {
        id: "zinc",
        name: "Zinc",
        unit: "mg",
        nutrientKey: "zinc",
    },
    {
        id: "iron",
        name: "Iron",
        unit: "mg",
        nutrientKey: "iron",
    },
    {
        id: "omega3",
        name: "Omega 3",
        unit: "mg",
        nutrientKey: "omega3",
    },
    {
        id: "vitaminB12",
        name: "Vitamin B12",
        unit: "mcg",
        nutrientKey: "vitaminB12",
    },
    {
        id: "vitaminC",
        name: "Vitamin C",
        unit: "mg",
        nutrientKey: "vitaminC",
    },
];