# Usa una imagen base con Java 21
FROM eclipse-temurin:21-jdk

# Establece el directorio de trabajo
WORKDIR /app

# Copia el contenido del backend
COPY . .

# Compila el proyecto con Maven
RUN ./mvnw clean package -DskipTests

# Expone el puerto del backend
EXPOSE 8080

# Ejecuta el JAR generado
CMD ["java", "-jar", "target/*.jar"]