package fr.vahelnir.solvers

import fr.vahelnir.DaySolver
import kotlin.math.abs

class Day3 : DaySolver {
    override fun solve(input: List<String>) {
        val paths = input.map { path ->
            path.split(",").map { Movement.fromString(it) }
        }

        val startPosition = Point2D(0, 0)
        val pathSets = paths.map {
            val pointsInPath = mutableSetOf<Point2D>()
            var currentPosition = startPosition.copy()
            for (movement in it) {
                for (i in 1..movement.amount) {
                    currentPosition = when (movement.direction) {
                        Direction.UP -> Point2D(currentPosition.x, currentPosition.y - 1)
                        Direction.DOWN -> Point2D(currentPosition.x, currentPosition.y + 1)
                        Direction.LEFT -> Point2D(currentPosition.x - 1, currentPosition.y)
                        Direction.RIGHT -> Point2D(currentPosition.x + 1, currentPosition.y)
                    }
                    pointsInPath.add(currentPosition)
                }
            }

            pointsInPath
        }

        // generate grid from max and min dimensions of pathSets
//        val minX = pathSets.flatMap { it.map { point -> point.x } }.minOrNull() ?: 0
//        val maxX = pathSets.flatMap { it.map { point -> point.x } }.maxOrNull() ?: 0
//        val minY = pathSets.flatMap { it.map { point -> point.y } }.minOrNull() ?: 0
//        val maxY = pathSets.flatMap { it.map { point -> point.y } }.maxOrNull() ?: 0
//        val grid = Array(maxY - minY + 1) {
//            CharArray(maxX - minX + 1) { '.' }
//        }
//        println("Grid size: ${grid.size} x ${grid[0].size} (from ($minX,$minY) to ($maxX,$maxY))")
//
//        pathSets.forEach { pathSet ->
//            for (point in pathSet) {
//                val gridX = point.x - minX
//                val gridY = point.y - minY
//                grid[gridY][gridX] = '#'
//            }
//        }
//
//        grid[maxY - minY][0] = 'O'
//
//        println(grid.joinToString("\n") { String(it) })

        val intersections = pathSets[0].intersect(pathSets[1])
        val closestIntersection = intersections.minByOrNull { it.manhattanDistanceTo(startPosition) }
        println("Part 1: ${closestIntersection?.manhattanDistanceTo(startPosition)}")
    }
}

data class Movement(val direction: Direction, val amount: Int) {
    companion object {
        fun fromString(s: String): Movement {
            val direction = Direction.fromChar(s[0])
            val amount = s.slice(1 until s.length).toInt()
            return Movement(direction, amount)
        }
    }
}

data class Point2D(val x: Int, val y: Int) {
    fun manhattanDistanceTo(point: Point2D): Int = abs(this.x - point.x) + abs(this.y - point.y)
}

enum class Direction(value: String) {
    UP("U"),
    DOWN("D"),
    LEFT("L"),
    RIGHT("R");

    companion object {
        fun fromChar(c: Char): Direction {
            return entries.first { it.name[0] == c }
        }
    }
}