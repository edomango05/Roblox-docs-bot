import {config} from "dotenv";
import { ExtendedClient } from "./Client/Client";
config(); 

const client = new ExtendedClient()