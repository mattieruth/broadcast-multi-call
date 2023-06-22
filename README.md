# Broadcast Across Multiple Daily Calls Demo

_Note: We generally recommend using [manual track subscriptions](https://www.daily.co/blog/create-dynamic-meetings-using-track-subscriptions/) to achieve this effect.
This demo is for cases where this isn't possible, e.g. when migrating a large codebase
from one provider to Daily._

This demo shows how to embed multiple call objects in iFrames with Daily to acheive a "broadcast" feature across rooms.

## Setup

To run the project, create a `.env` file with your `DAILY_API_KEY` and `DAILY_DOMAIN`. Then
run the following commands:

```
nvm use
npm install
npm run create-rooms
npm start
```

## To test:

1. Open up [main_frame.html](http://localhost:8015/src/main_frame) in four different tabs.
2. In each tab, click a different (1, 2, 3, and as speaker) to join 3 different rooms. Note: the speaker joins room 1 in addition to the speaker room.
3. In the tab you've joined as a speaker, toggle the "broadcast" button to start/stop the broadcast.

## How it works:

There are three main rooms, `listener-room-1`, `listener-room-2`, `listener-room-3` along with one special-cased `speaker-room`. The idea is that a participant joins one of the three main rooms as they normally would, but also loads an iframe in which a separate call instance is created and joins the special `speaker-room`, effectively having every client in two rooms.

The `speaker-room` is set up with default permissions set to `has-presence: false` so that only participants with an owner token can send media or be visible in any way (like in the `call.participants()` list).

When you click one of the `join 1/2/3` buttons, the `listener_frame.html` is loaded in the iframe and the iframe joins the speaker room without a token, simply listening for `track-started`/`track-stopped` events to render the speaker whenever they speak. The code also makes use of app messaging to pass events between the parent and child frames so that the separate ui's can react to whatever may be happening in the other frame. For instance, you'll see the `main_frame.html` update the border around the iframe whenever the `listener_frame` notifies it that the speaker is unmuted. And the `listener_frame` will properly leave the call whenever the main room is left.

When you click `join as speaker`, the `speaker_frame.html` is loaded in the iframe. This page is nearly identical to `listener_frame` except that it takes a token in the app message that triggers it to join the `speaker-room` so that it joins as owner and is allowed to send media. It also renders the broadcast button which calls `setLocalVideo`/`setLocalAudio` to toggle on/off the speaker's media. Note: the speaker joins `listener-room-1` in the main call instance.
