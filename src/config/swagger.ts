import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API",
      version: "1.0.0",
      description: "Backend API for a role-based finance dashboard system",
    },
    servers: [
  { url: "https://financedashboard-mqwy.onrender.com", description: "Production" },
  { url: "http://localhost:3000", description: "Local development" },
],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerJsdoc(options);