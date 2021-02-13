export async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  const rawGroupsAnswers = fileContent.split("\r\n\r\n");

  let totalAnswers = 0;
  let totalGroupAnswers = 0;
  for (const rawGroupAnswers of rawGroupsAnswers) {
    const groupAnswers = rawGroupAnswers.split("\r\n");
    const groupAnswersSet = new Set<string>();
    const answers = new Map<string, number>();
    for (const rawPersonAnswer of groupAnswers) {
      for (const rawQuestionAnswer of rawPersonAnswer) {
        groupAnswersSet.add(rawQuestionAnswer);
        const previousValue = answers.get(rawQuestionAnswer);
        answers.set(rawQuestionAnswer, (previousValue ?? 0) + 1);
      }
    }
    totalGroupAnswers += groupAnswersSet.size;
    totalAnswers += [...answers.entries()].filter(
      ([key, value]) => value === groupAnswers.length
    ).length;
  }
  console.log("first half:", totalGroupAnswers);
  console.log("second half:", totalAnswers);
}

await start();
