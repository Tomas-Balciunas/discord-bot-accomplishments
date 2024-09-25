import { migrateToLatest } from "@/database/migrate";
import { env } from "@/utils/env";

const {TEST_DATABASE_URL} = env

migrateToLatest(TEST_DATABASE_URL)