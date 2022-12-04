import { DayEntryPoint } from "../../types/DayEntryPoint";

type SectionRange = [number, number];

function section_string_to_section(section_string: string): SectionRange {
  return section_string.split("-").map((str) => +str) as SectionRange;
}

function section_contains_another(
  first_range: SectionRange,
  second_range: SectionRange
) {
  return first_range[0] <= second_range[0] && second_range[1] <= first_range[1];
}

function point_is_in_section(section: SectionRange, point: number) {
  return section[0] <= point && section[1] >= point;
}

function section_overlap_another(
  first_range: SectionRange,
  second_range: SectionRange
) {
  return (
    point_is_in_section(first_range, second_range[0]) ||
    point_is_in_section(first_range, second_range[1]) ||
    point_is_in_section(second_range, first_range[0]) ||
    point_is_in_section(second_range, first_range[1])
  );
}

export const run: DayEntryPoint = (input) => {
  const pairs = input.split("\n");
  let total_pairs_containing_each_other = 0;
  let total_pairs_overlapping = 0;
  for (const pair of pairs) {
    const [first_section, second_section] = pair
      .split(",")
      .map(section_string_to_section);
    if (
      section_contains_another(first_section, second_section) ||
      section_contains_another(second_section, first_section)
    ) {
      total_pairs_containing_each_other++;
    }

    if (section_overlap_another(first_section, second_section)) {
      total_pairs_overlapping++;
    }
  }

  console.log("first results:", total_pairs_containing_each_other);
  console.log("second results:", total_pairs_overlapping);
};
