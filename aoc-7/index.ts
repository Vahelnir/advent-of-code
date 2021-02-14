interface Bag {
  label: string;
  contents: BagContentItem[];
}

interface BagContentItem {
  label: string;
  count: number;
}

function transformRawRule(rawRule: string): [string, string[]] {
  const [bag, rules] = rawRule.split("contain");
  return [bag.trim(), rules.split(",").map((rule) => rule.trim())];
}

function sanitiseBagName(rawBagName: string) {
  if (rawBagName.endsWith(".")) {
    rawBagName = rawBagName.slice(0, rawBagName.length - 1);
  }
  return rawBagName.replace(/bags?/, "").trim();
}

function parseRule(rawRule: string) {
  if (rawRule === "no other bags.") {
    return undefined;
  }
  const splitPosition = rawRule.indexOf(" ");
  const count = parseInt(rawRule.slice(0, splitPosition), 10);
  const label = sanitiseBagName(rawRule.slice(splitPosition));
  return { label, count };
}

function parseBags(rawBags: string[]) {
  const bags = new Map<string, Bag>();
  for (const rawBag of rawBags) {
    const [bagName, rules] = transformRawRule(rawBag);
    const bag = {
      label: sanitiseBagName(bagName),
      contents: rules
        .map(parseRule)
        .filter((rule): rule is BagContentItem => rule !== undefined),
    };

    bags.set(bag.label, bag);
  }
  return bags;
}

function getBagsContaining(
  bags: Map<string, Bag>,
  searchBag: Bag
): Set<string> {
  const bagSet = new Set<string>(
    [...bags.values()]
      .filter((bag) =>
        bag.contents.some((item) => item.label === searchBag.label)
      )
      .flatMap((bag) => [bag.label, ...getBagsContaining(bags, bag)])
  );
  return bagSet;
}

function getBagCountRecursively(bags: Map<string, Bag>, bag: Bag): number {
  const contentCounters = bag.contents.flatMap((content) => {
    const newBag = bags.get(content.label);
    const contentCount = newBag ? getBagCountRecursively(bags, newBag) : 0;
    return content.count * (1 + contentCount);
  });
  return contentCounters.reduce((acc, val) => acc + val, 0);
}

export async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  const rawBags = fileContent.split("\r\n");
  const bags = parseBags(rawBags);
  const shinyGoldBag = [...bags.values()].find(
    (bag) => bag.label === "shiny gold"
  );
  if (!shinyGoldBag) {
    throw new Error("shinyGoldBag should not be undefined");
  }
  const containers = getBagsContaining(bags, shinyGoldBag);
  console.log("shiny gold bag containers count:", containers.size);

  const count = getBagCountRecursively(bags, shinyGoldBag);
  console.log("individual bags count:", count);
}

await start();
