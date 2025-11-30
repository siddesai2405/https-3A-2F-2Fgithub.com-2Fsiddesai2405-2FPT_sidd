import { db, User, Gynecologist } from "./db";
import { registerUser } from "./auth";

export async function initializeDatabase() {
  try {
    // Check if any users exist
    const userCount = await db.users.count();

    if (userCount === 0) {
      // Create demo user
      await registerUser("Demo User", "demo@example.com", "demo123", "user");
    }

    // Check if gynecologists data exists
    const gynecologistCount = await db.gynecologists.count();

    if (gynecologistCount === 0) {
      // Add sample gynecologist data
      const sampleGynecologists: Omit<Gynecologist, "id" | "createdAt">[] = [
        {
          name: "Dr. Sarah Johnson",
          clinic: "Women's Health Center",
          address: "123 Main St, Medical Plaza",
          phone: "+1-555-0101",
          specialization: "OB/GYN",
          lat: 40.7128,
          lng: -74.006,
          notes: "Experienced in reproductive health",
        },
        {
          name: "Dr. Emily Chen",
          clinic: "City Women's Clinic",
          address: "456 Oak Ave, Suite 200",
          phone: "+1-555-0102",
          specialization: "Gynecology",
          lat: 40.7589,
          lng: -73.9851,
          notes: "Specializes in cycle management",
        },
        {
          name: "Dr. Patricia Williams",
          clinic: "Wellness Medical Group",
          address: "789 Elm Street, Building B",
          phone: "+1-555-0103",
          specialization: "Women's Medicine",
          lat: 40.7614,
          lng: -73.9776,
          notes: "Holistic approach to women's health",
        },
      ];

      await db.gynecologists.bulkAdd(
        sampleGynecologists.map((g) => ({
          ...g,
          createdAt: Date.now(),
        })),
      );
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}
