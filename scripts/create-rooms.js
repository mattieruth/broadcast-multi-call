#!/usr/bin/env node
// @ts-check

import { error } from "console";
import "dotenv/config";

// Your Daily.co API key
const apiKey = process.env.DAILY_API_KEY;

if (!apiKey) {
  throw new Error(
    "No DAILY_API_KEY found. Have you set the environment variable?"
  );
}

// Function to create a new Daily.co room
async function createRoom(roomName) {
  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        exp: Math.floor(Date.now() / 1000) + 1800, // 30 minutes expiration time
      }),
    });

    const roomData = await response.json();
    const roomUrl = roomData.url;

    if (!roomUrl) {
      console.log(`${roomName} already exists`);
    } else {
      console.log(`New room created: ${roomUrl}`);
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
    "speaker-room",
  ].map(createRoom);

  Promise.all(roomNames).catch((err) => {
    console.error(err);
  });
}

// Run the program
createMultipleRooms();
