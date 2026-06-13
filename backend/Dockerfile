# Usa una imagen base con Java 21
FROM eclipse-temurin:21-jdk

# Establece el directorio de trabajo
WORKDIR /app

# Copia el contenido del backend
COPY . .

# Da permisos de ejecución al wrapper de Maven
RUN chmod +x mvnw

# Compila el proyecto
RUN ./mvnw clean package -DskipTests

EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]