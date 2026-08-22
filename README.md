# MatchUp Elite

Create a mobile-responsive web application for a Badminton "Athlete-on-Demand" & Skill-Upgradation platform called "MatchUp" (or a generic sport-tech name). The core philosophy is "Play & Earn Freelance Jobs for Athletes" combined with a "Pay-Per-Match (Anti-Fatigue) Valuation" for casual players.

Implement the following design specifications and technical architecture screen-by-screen:

1. THEME & VISUAL IDENTITY:

- Use a modern, energetic premium sports theme.

- Dominant colors: Deep Matte Black/Dark Charcoal background with Electric Cyber Neon Green accents. 

- Clean, minimalist cards with sharp typography suitable for high-density scannability.

2. AUTHENTICATION & ROLE SELECTION:

- A unified landing screen allowing users to toggle between two distinct interfaces: "I want to Play/Hire" (Client View) and "I want to Work/Earn" (Player View).

3. CLIENT VIEW (User looking for an Opponent):

- Dashboard displaying active courts nearby and available players sorted by distance.

- Wallet balance card prominently displayed at the top showing "Coins/Rupees" with a quick-action "Add Money (Dummy UPI)" modal.

- Player Discovery List: Displays profile cards with: Player Photo, Verified Badge, Rating Tier, Distance (e.g., 1.2 km away), and their custom Per-Match Rate.

- Filter options: Filter by Skill Tier (Bronze, Silver, Gold, Platinum).

4. PLAYER VIEW (Athlete looking for Freelance Gigs):

- Status Control: A prominent "Go Online / Go Offline" toggle switch at the top.

- Geo-Radius Constraint: A slider that restricts booking requests to a strict radius (e.g., set from 1km up to 5km max).

- Time-Slot Scheduler: A clean calendar view where the player can tap and mark their specific free hours (e.g., 7:00 PM - 9:00 PM) for the week.

- Incoming Booking Request Card: A real-time popup notification showing the Client's Name, Court Location, and the structural "Accept / Decline" buttons.

5. THE REVOLUTIONARY "PAY-PER-MATCH" WALLET & TIER SYSTEM:

- Enforce a strict "No Hourly Metering" system to protect clients from fatigue overpayment. Base all transactions on an individual 21-point standard match setup.

- Tiered Pricing Constraints: Restrict the player's pricing inputs based on their validated ID Level:

  * D-Tier (Bronze - Casual/Club): ₹20 to ₹50 per match.

  * C-Tier (Silver - District/University): ₹100 to ₹250 per match.

  * B-Tier (Gold - State/National Rank): ₹300 to ₹500 per match.

  * A-Tier (Platinum - International/Elite Pro): ₹800+ per match.

- In-App Escrow Wallet: When a match is booked, lock the match amount from the client's balance into escrow. 

6. MATCH ESCROW VALIDATION & RECOGNITION SCREEN:

- Post-Match Scoring Form: A simple interface where either player can input the final score (e.g., 21-18, 21-15).

- Include a "Coach / Courtyard Admin Verification" toggle to serve as the ultimate anti-fraud referee system. Once validated, release funds instantly from escrow to the Player's digital wallet.

Generate all essential operational views, dynamic navigation tab bars, and interactive buttons so both client and player workflows function seamlessly.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3112af63-0724-4632-90e4-d7dad52def88).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
