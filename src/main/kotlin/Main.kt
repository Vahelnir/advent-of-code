package fr.vahelnir

fun readInputFile(day: Int): List<String> = object {}
    .javaClass
    .getResource("/input/$day.txt")
    ?.readText(Charsets.UTF_8)
    ?.lines()
    ?: error("File not found")

val solvers = mapOf<Int, DaySolver>(
    1 to fr.vahelnir.solvers.Day1()
    // ...ajoute d'autres solvers ici si besoin...
)

fun main(args: Array<String>) {
    if (args.isEmpty()) {
        println("Usage: <jour>")
        return
    }

    val day = args[0].toIntOrNull()
    if (day == null) {
        println("Argument invalide: ${args[0]}")
        return
    }
    
    val solver = solvers[day]
    if (solver == null) {
        println("No solver found for day $day")
        return
    }

    val fileContent = readInputFile(day)
    solver.solve(fileContent)
}