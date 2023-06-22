#!/usr/bin/env node
// @ts-check

require("dotenv").config();
const fs = require("fs");

// Your Daily.co API key
const apiKey = process.env.DAILY_API_KEY;
if (!apiKey) {
  throw new Error(
    "No DAILY_API_KEY found. Have you set the environment variable?"
  );
}
const domain = process.env.DAILY_DOMAIN;
if (!domain) {
  throw new Error("No DOMAIN found. Have you set the environment variable?");
}

// Function to create a new Daily.co room
async function createRoom(roomName, properties) {
  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp: Math.floor(Date.now() / 1000) + 300, // 30 minutes expiration time
          ...properties,
        },
      }),
    });

    const roomData = await response.json();
    if (roomData.error) {
      if (roomData.info.includes("already exists")) {
        console.log(`${roomName} already exists`);
      } else {
        console.error(`ERROR (${roomData.error}): ${roomData.info}`);
      }
      return;
    } else if (!roomData.url) {
      console.log(`Unknown issue creating ${roomName}`);
    } else {
      console.log(`New room created: ${roomData.url}`);
    }
  } catch (error) {
    console.error("Error creating room:", error);
  }
}

// Create four new rooms
async function createMultipleRooms() {
  const roomNames = [
    "listener-room-1",
    "listener-room-2",
    "listener-room-3",
  ].map(createRoom);

  Promise.all(roomNames).catch((err) => {
    console.error(err);
  });

  await createRoom("speaker-room", { permissions: { hasPresence: false } });
}

async function generateTokenAndSave(roomName) {
  let response = await fetch("https://api.daily.co/v1/meeting-tokens", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      properties: { is_owner: true, room_name: roomName },
    }),
  });

  let tokenData = await response.json();
  if (tokenData.error) {
    console.error(`ERROR (${tokenData.error}): ${tokenData.info}`);
    return;
  }
  console.log(process.env.DOMAIN);
  let content = `
window.domain = "${domain}"
window.token = "${tokenData.token}"`;

  fs.writeFile("src/util.js", content, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// Run the program
createMultipleRooms();
generateTokenAndSave("speaker-room");
