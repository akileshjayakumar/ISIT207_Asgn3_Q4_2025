/**
 * Database Initialization Service
 * Automatically initializes Supabase database schema on first app startup
 *
 * Note: Supabase requires schema.sql to be run once manually via SQL Editor.
 * This service verifies the database is set up correctly.
 */

import { supabase } from "../config/supabaseConfig";
import { createClient } from "@supabase/supabase-js";

/**
 * Check if database tables exist
 */
const checkTablesExist = async () => {
  try {
    // Try to query each table - if they exist, queries will succeed
    const [membersCheck, applicationsCheck, surrenderCheck] = await Promise.all(
      [
        supabase.from("members").select("id").limit(1),
        supabase.from("adoption_applications").select("id").limit(1),
        supabase.from("pet_surrender_requests").select("id").limit(1),
      ]
    );

    const allExist =
      membersCheck.error === null &&
      applicationsCheck.error === null &&
      surrenderCheck.error === null;

    return allExist;
  } catch (error) {
    console.error("Error checking tables:", error);
    return false;
  }
};

/**
 * Initialize database schema using service role key if available
 * Uses Supabase REST API to execute SQL
 */
const initializeDatabaseWithServiceKey = async () => {
  const serviceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return { success: false, error: "Service role key not available" };
  }

  try {
    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Try to call the initialization function via RPC
    // This function should exist after schema.sql is run once
    const { data, error } = await adminClient.rpc("initialize_database");

    if (error) {
      // Function doesn't exist yet - schema.sql needs to be run
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error initializing with service key:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Main initialization function
 * Checks if database is initialized
 */
export const initDatabase = async () => {
  try {
    // Check if tables exist
    const tablesExist = await checkTablesExist();

    if (tablesExist) {
      return { success: true, initialized: true };
    }

    // Try to initialize with service role key if available
    const initResult = await initializeDatabaseWithServiceKey();

    if (initResult.success) {
      return { success: true, initialized: true };
    }

    // Silently return - don't show errors to users
    return {
      success: false,
      initialized: false,
    };
  } catch (error) {
    // Silently fail - errors logged to console only
    console.error("Database initialization error:", error);
    return {
      success: false,
      initialized: false,
    };
  }
};

/**
 * Verify database is ready for use
 */
export const verifyDatabase = async () => {
  return await checkTablesExist();
};
