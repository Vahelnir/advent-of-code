package fr.vahelnir.solvers

import fr.vahelnir.DaySolver

class Day2 : DaySolver {
    override fun solve(input: List<String>) {
        val code = input[0]
            .split(",")
            .map { it.toInt() }
            .toMutableList()

        val firstProgram = code.toMutableList()
        firstProgram[1] = 12
        firstProgram[2] = 2
        val result = run(firstProgram)
        println("Part 1: ${result}")
    }

    fun run(program: List<Int>): Int {
        val code = program.toMutableList()
        var index = 0
        while (index < code.size) {
            val opcode = code[index++]
            println(opcode)

            when (opcode) {
                99 -> break
                1 -> {
                    val position1 = code[index++]
                    val position2 = code[index++]
                    val position3 = code[index++]
                    println("$position1, $position2, $position3")
                    code[position3] = code[position1] + code[position2]
                }

                2 -> {
                    val position1 = code[index++]
                    val position2 = code[index++]
                    val position3 = code[index++]
                    code[position3] = code[position1] * code[position2]
                }

                else -> error("Unknown opcode: $opcode at index $index")
            }
        }

        return code[0]
    }
}