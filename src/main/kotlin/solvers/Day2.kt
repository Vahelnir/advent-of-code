package fr.vahelnir.solvers

import fr.vahelnir.DaySolver

class Day2 : DaySolver {
    override fun solve(input: List<String>) {
        val code = input[0]
            .split(",")
            .map { it.toInt() }
            .toMutableList()

        val firstProgram = code.toMutableList()
        val result = run(firstProgram, 12, 2)
        println("Part 1: $result")
        println("Part 2: ${solvePartTwo(code)}")
    }

    fun solvePartTwo(program: List<Int>): Int {
        for (noun in 0..99) {
            for (verb in 0..99) {
                val output = run(program, noun, verb)
                if (output == 19690720) {
                    return 100 * noun + verb
                }
            }
        }

        return 0
    }

    fun run(program: List<Int>, noun: Int, verb: Int): Int {
        val code = program.toMutableList()
        code[1] = noun
        code[2] = verb
        var index = 0
        while (index < code.size) {
            when (val opcode = code[index++]) {
                99 -> break
                1 -> {
                    val position1 = code[index++]
                    val position2 = code[index++]
                    val position3 = code[index++]
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