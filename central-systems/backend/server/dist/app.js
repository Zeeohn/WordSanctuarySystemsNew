"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const profiles_router_1 = __importDefault(require("./routers/profiles.router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const kpi_router_1 = __importDefault(require("./routers/kpi.router"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4999;
dotenv_1.default.config(); // call the dotenv package to use the env variables
app.use(express_1.default.json()); // middleware for parsing body of requests
app.use((0, cookie_parser_1.default)()); // allows us to read and set cookies
// Define CORS options (optional)
const corsOptions = {
  origin: "https://central-systems.wordsanctuaryglobal.com", // specify the allowed domain or use '*' to allow all
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
  credentials: true, // allow cookies to be sent across domains
};
// Enable CORS for all routes (if you want it to be global)
app.use((0, cors_1.default)(corsOptions));
app.get("/", (req, res) => {
  res.send("hello, central-systems server running");
});
app.use("/cms/api/auth", auth_router_1.default);
app.use("/cms/api/profiles", profiles_router_1.default);
app.use("/cms/api/departments", kpi_router_1.default);
// Graceful shutdown - Disconnect Prisma Clients when the server shuts down
process.on("SIGINT", () =>
  __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Closing Prisma clients...');
    // await mongoDbClient.$disconnect();  // Disconnect MongoDB client
    // await postgresClient.$disconnect(); // Disconnect PostgreSQL client
    process;
  })
);
app.listen(PORT, () => {
  console.log("central-systems server running on port ", PORT);
});
