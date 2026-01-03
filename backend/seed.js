// Script to seed the database with sample teams and candidates
const mongoose = require("mongoose");
require("dotenv").config();

const Team = require("./src/models/Team");
const Candidate = require("./src/models/Candidate");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data
    await Team.deleteMany({});
    await Candidate.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create teams
    const team1 = await Team.create({
      name: "Tech Innovators",
      description: "Leading the way in technology and innovation",
      isActive: true,
    });

    const team2 = await Team.create({
      name: "Design Masters",
      description: "Creative excellence in design and user experience",
      isActive: true,
    });

    console.log("✅ Created teams");

    // Create candidates for Team 1
    await Candidate.create({
      name: "John Doe",
      description: "Senior Software Engineer with 10+ years of experience in full-stack development",
      linkedinUrl: "https://www.linkedin.com/in/johndoe",
      teamId: team1._id,
    });

    await Candidate.create({
      name: "Jane Smith",
      description: "Tech Lead specializing in cloud architecture and DevOps practices",
      linkedinUrl: "https://www.linkedin.com/in/janesmith",
      teamId: team1._id,
    });

    // Create candidates for Team 2
    await Candidate.create({
      name: "Alice Johnson",
      description: "UX Designer with expertise in user research and interface design",
      linkedinUrl: "https://www.linkedin.com/in/alicejohnson",
      teamId: team2._id,
    });

    await Candidate.create({
      name: "Bob Williams",
      description: "Creative Director with a passion for brand identity and visual storytelling",
      linkedinUrl: "https://www.linkedin.com/in/bobwilliams",
      teamId: team2._id,
    });

    console.log("✅ Created candidates");
    console.log("🎉 Database seeded successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
