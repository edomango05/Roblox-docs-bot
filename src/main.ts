import {config} from "dotenv";
import { ExtendedClient } from "./Client/Client";
config(); 
console.log("Hi there")
const client = new ExtendedClient()
