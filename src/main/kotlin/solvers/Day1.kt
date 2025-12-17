package fr.vahelnir.solvers

import fr.vahelnir.DaySolver
import kotlin.math.floor

class Day1 : DaySolver {
    override fun solve(input: List<String>) {
        val sum = input
            .filter { it.isNotEmpty() }
            .map { it.toInt() }
            .map { floor((it / 3).toDouble()) - 2 }
            .reduce { acc, d -> acc + d }

        println("Day 1 - Part 1 : $sum")
    }
}