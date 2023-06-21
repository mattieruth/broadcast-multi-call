# Broadcast Across Multiple Daily Calls Demo

_Note: We generally recommend using [manual track subscriptions](https://www.daily.co/blog/create-dynamic-meetings-using-track-subscriptions/) to achieve this effect.
This demo is for cases where this isn't possible, e.g. when migrating a large codebase
from one provider to Daily._

This demo shows how to embed multiple call objects in iFrames with Daily to acheive a "broadcast" feature across rooms.

## Setup

To run the project, create a `.env` file with your `DAILY_API_KEY`. Then
run the following commands:

```
nvm use
npm install
npm run create-rooms
npm start
```

To test:

1. Open up [main_frame.html](http://localhost:8015/main_frame) in four different tabs.
2. Click join 1, 2, 3, and join as speaker separately in each tab.
3. In the tab you've joined as a speaker, click "broadcast" to begin the broadcast.
