plugins {
  kotlin("jvm") version "2.2.21"
}

group = "fr.vahelnir"
version = "1.0-SNAPSHOT"

repositories {
  mavenCentral()
}

dependencies {
  testImplementation(kotlin("test"))
}

kotlin {
  jvmToolchain(21)
}

tasks.test {
  useJUnitPlatform()
}

tasks.register<JavaExec>("start") {
  group = "application"
  description = "Lance l'application principale."

  mainClass.set("fr.vahelnir.MainKt")
  classpath = sourceSets["main"].runtimeClasspath
}
