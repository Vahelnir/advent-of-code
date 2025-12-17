package fr.vahelnir.solvers

import fr.vahelnir.DaySolver
import kotlin.math.floor

class Day1 : DaySolver {
    override fun solve(input: List<String>) {
        val sum = input
            .filter { it.isNotEmpty() }
            .map { it.toInt() }
            .map { calculateFuel(it) }
            .reduce { acc, d -> acc + d }

        println("Day 1 - Part 1 : $sum")

        val totalSum = input
            .filter { it.isNotEmpty() }
            .map { it.toInt() }
            .map { calculateTotalFuel(it) }
            .reduce { acc, d -> acc + d }
        println("Day 1 - Part 2 : $totalSum")
    }

    fun calculateFuel(mass: Int): Int = floor((mass / 3).toDouble()).toInt() - 2
    fun calculateTotalFuel(mass: Int): Int {
        var totalFuel = 0
        var fuel = calculateFuel(mass)
        while (fuel > 0) {
            totalFuel += fuel
            fuel = calculateFuel(fuel)
        }

        return totalFuel
    }
}