# -------- BUILD --------
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN chmod +x mvnw

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw dependency:go-offline

COPY src ./src

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw clean package -DskipTests

# -------- RUNTIME --------
FROM eclipse-temurin:21.0.2_13-jre-jammy
WORKDIR /app

RUN useradd -ms /bin/bash appuser

ARG PORT=8080
ENV PORT=${PORT}

COPY --from=builder --chown=appuser:appuser /app/target/*.jar app.jar

USER appuser

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:InitialRAMPercentage=30.0", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
