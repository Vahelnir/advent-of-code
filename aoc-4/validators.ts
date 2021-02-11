export interface Validator {
  property: string;
  required: boolean;
  validator: (value: string) => boolean;
}

function yearBetweenValidator(min: number, max: number) {
  return (value: string) => {
    const year = parseInt(value, 10);
    return value.length === 4 && year <= max && year >= min;
  };
}

const hexRegex = /#[a-z0-9]{6}/;

export const validators: Validator[] = [
  {
    property: "byr",
    required: true,
    validator: yearBetweenValidator(1920, 2002),
  },
  {
    property: "iyr",
    required: true,
    validator: yearBetweenValidator(2010, 2020),
  },
  {
    property: "eyr",
    required: true,
    validator: yearBetweenValidator(2020, 2030),
  },
  {
    property: "hgt",
    required: true,
    validator(value: string) {
      const unit = value.slice(-2);
      const height = parseInt(value.slice(0, -2), 10);
      if (unit === "cm") {
        return height >= 150 && height <= 193;
      }
      return height >= 59 && height <= 76;
    },
  },
  {
    property: "hcl",
    required: true,
    validator(value) {
      return value.length === 7 && hexRegex.test(value);
    },
  },
  {
    property: "ecl",
    required: true,
    validator(value: string) {
      return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value);
    },
  },
  {
    property: "pid",
    required: true,
    validator(value: string) {
      if (value.length === 9) {
        for (const letter of value) {
          if (letter < "0" || letter > "9") {
            return false;
          }
        }
        return true;
      }
      return false;
    },
  },
  { property: "cid", required: false, validator: () => true },
];
