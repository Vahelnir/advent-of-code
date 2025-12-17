package fr.vahelnir

fun readInputFile(day: Int): List<String> = object {}
    .javaClass
    .getResource("/input/$day.txt")
    ?.readText(Charsets.UTF_8)
    ?.lines()
    ?: error("File not found")

val solvers = mapOf<Int, DaySolver>(
    1 to fr.vahelnir.solvers.Day1()
)

fun main() {
    val day = 1
    val solver = solvers[day]
    if (solver == null) {
        println("No solver found for day $day")
        return
    }

    val fileContent = readInputFile(day)
    solver.solve(fileContent)
}