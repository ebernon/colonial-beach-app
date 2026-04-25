
import { useState, useEffect, useRef, useCallback } from "react";

// ─── UTILITY HELPERS ──────────────────────────────────────────────────────────
const toTel = (p) => p ? p.replace(/\D/g, "") : "";
const phoneHref = (p) => `tel:+1${toTel(p)}`;
const mapsHref = (a) => `https://maps.google.com?q=${encodeURIComponent(a)}`;

// Tappable phone number
const Ph = ({ phone }) => !phone ? null : (
  <a href={phoneHref(phone)} aria-label={`Call ${phone}`}
    style={{ color:"#f9ca24", fontSize:13, textDecoration:"none", display:"block" }}>
    📞 {phone}
  </a>
);

// Tappable address → opens Google Maps
const Addr = ({ address }) => {
  if (!address) return null;
  const isVague = !address || address.includes("Various") || address.split(",").length < 2;
  const inner = <><span style={{ marginRight:3 }}>📍</span>{address}{!isVague && <span style={{ opacity:.4, fontSize:10 }}> ↗</span>}</>;
  return isVague
    ? <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>{inner}</div>
    : <a href={mapsHref(address)} target="_blank" rel="noopener noreferrer"
        aria-label={`Open ${address} in maps`}
        style={{ color:"rgba(255,255,255,0.7)", fontSize:12, textDecoration:"none", display:"block" }}>
        {inner}
      </a>;
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const CAFES = [
  {
    name: "Love Bites Coffee & Pastries",
    address: "234 Colonial Ave, Colonial Beach, VA 22443",
    phone: "(251) 599-9498",
    hours: "Tue–Sat 8am–2pm · Closed Sunday & Monday",
    desc: "Where disco meets coffee. CB's most charming café — organic and locally sourced, with homemade pastries baked fresh every morning. Bold lattes, specialty drinks, sweet treats, and a curated boutique all in one sparkly little house next to the fire station on Colonial Ave. Vibes are fun, fabulous, and a little bit extra.",
    best: ["Cinnamon roll with cream cheese icing", "Caramel Apple Latte", "Coconut Dream", "Chai Me", "Seasonal specialty drinks", "Gluten-free salted caramel chocolate chip cookies"],
    notes: "First come, first served on baked goods — they sell out! Also sells fresh flowers and boutique clothing. Heart-shaped straws and free stickers included.",
    website: "https://lovebitescoffee.com",
    facebook: "https://www.facebook.com/p/Love-Bites-Coffee-Pastries-61566500874643/",
    featured: true,
  },
  {
    name: "Colonial Buzz Espresso Bar",
    address: "215 Washington Ave (inside Colonial Beach Brewing), Colonial Beach, VA 22443",
    phone: "(804) 410-2005",
    hours: "Mon–Fri 8am–1pm · Sat–Sun 8am–noon",
    desc: "CB's original coffee shop, opened 2019 by locals Donna and Pam — because Colonial Beach needed a coffee shop! Now located inside Colonial Beach Brewing on Washington Ave. Hot, iced, and frozen specialty espresso drinks and teas, locally roasted coffees, and small baked goods. Environmentally conscious — compostable straws, sustainable sourcing.",
    best: ["Specialty lattes", "Cold brew", "Frozen coffee drinks", "Cinnamon rolls", "Local roast drip coffee"],
    notes: "Great spot before a morning on the water. Shares space with CB Brewing so grab a coffee and check out the brewery too.",
    website: "https://www.colonialbuzz.com",
    facebook: "https://www.facebook.com/colonialbuzz/",
  },
];

const RESTAURANTS = [
  {
    name: "High Tides on the Potomac",
    address: "205 Taylor St (Boardwalk), Colonial Beach, VA",
    phone: "(804) 224-8433",
    facebook: "https://www.facebook.com/HighTidesOnThePotomac",
    hours: "Closed Dec–Feb. Call for seasonal hours.",
    best: ["Steamed crabs", "Fish & chips", "Crab soup", "Bushwhacker frozen cocktail"],
    desc: "Waterfront steak & seafood with stunning Potomac views. Adjoining Black Pearl Tiki Bar has live music on the beach all summer.",
    liveMusicNote: "🎵 Live music at Black Pearl Tiki Bar most weekends — follow their Facebook for weekly band schedule.",
    heroColor: "#1a4a6e",
    heroEmoji: "🦀",
  },
  {
    name: "Dockside Restaurant & Tiki Bar",
    address: "1787 Castlewood Dr (The Point), Colonial Beach, VA",
    phone: "(804) 224-8726",
    facebook: "https://www.facebook.com/DocksideTikiBar",
    website: "https://docksidetikibar.com",
    hours: "Check website for current hours",
    best: ["Fish tacos with dirty rice", "Sautéed chicken medallions with angel hair", "Weekend brunch", "🍊 Orange Crush", "🪣 Cruzan Rum Buckets"],
    desc: "Full-service waterfront restaurant and tiki bar at The Point. Brunch on weekends. Great views of the Potomac. The Orange Crush and Cruzan Rum buckets are the local favorite drinks — you'll spot them at every table on a summer afternoon.",
    liveMusicNote: "🎵 Live music regularly — check Facebook or website for schedule.",
    heroColor: "#2d5a3d",
    heroEmoji: "🌴",
  },
  {
    name: "Wilkerson's Seafood Restaurant",
    address: "McKinney Blvd (Potomac Beach), Colonial Beach, VA",
    phone: "(804) 224-7117",
    hours: "Seasonal — call ahead",
    best: ["All-you-can-eat crab feast", "Steamed crabs by the dozen", "Crab imperial", "Oysters on the half shell"],
    desc: "A Colonial Beach institution. Classic waterfront seafood house — the place for crabs. Cash-friendly, casual, and beloved by locals.",
    heroColor: "#5a2d0c",
    heroEmoji: "🦞",
  },
  {
    name: "Lenny's Restaurant",
    address: "301 Colonial Ave, Colonial Beach, VA",
    phone: "(804) 224-9675",
    facebook: "https://www.facebook.com/LennysRestaurant",
    hours: "Breakfast & lunch daily; dinner Fri–Sun",
    best: ["Breakfast plates", "Crab soup", "Fried scallops", "Daily lunch specials"],
    desc: "Classic local diner beloved by residents. Great breakfast, solid lunch, now serving dinner on weekends.",
    badge: "🍳 Breakfast Favorite",
    heroColor: "#7a4a1a",
    heroEmoji: "🍳",
  },
  {
    name: "Drift Seafood + Bar",
    address: "101 Taylor St, Suite 100B, Colonial Beach, VA",
    phone: "(804) 224-8950",
    hours: "Thu–Fri 5–10pm · Sat 9am–10pm · Sun 9am–8pm · Closed Mon–Wed · Seasonal — check website",
    best: ["Fresh local oysters", "Gourmet seafood pizza", "Oyster mushroom sandwich", "Weekend brunch"],
    desc: "Creative, elevated low-country cuisine steps from the beach. Everything made in-house daily with fresh seasonal and local ingredients. Connected with Muse Pizzeria & Arcade next door. Great brunch on weekends.",
    website: "https://www.driftmuse.com",
    facebook: "https://www.facebook.com/driftmusecb",
  },
  {
    name: "Los Hermanos Cantina",
    address: "11 Monroe Bay Ave, Colonial Beach, VA",
    phone: "(804) 410-2039",
    hours: "Check for current hours",
    best: ["Tacos", "Table-side guacamole", "Margaritas", "Enchiladas"],
    desc: "Authentic Mexican cantina in a great waterfront-adjacent spot. Lively atmosphere, generous portions.",
  },
  {
    name: "Orchid Thai Cuisine",
    address: "119 Hawthorn St, Colonial Beach, VA",
    phone: "(804) 410-2103",
    hours: "Check for current hours",
    best: ["Drunken noodles", "Thai curry", "Pad Thai", "Tom Kha soup"],
    desc: "Authentic Thai cuisine. Consistently rated among CB's best dining experiences. Reservations recommended on weekends.",
  },
  {
    name: "Sunflower Thai & French",
    address: "Washington Ave, Colonial Beach, VA",
    phone: "(804) 410-2084",
    hours: "Check for current hours",
    best: ["Thai dishes", "French classics — escargot, filet mignon", "Sushi bar", "Waterfront terrace views"],
    desc: "Unique Thai and French fusion restaurant with a full sushi bar. Casual atmosphere on Washington Ave with Potomac terrace views. One of CB's most eclectic dining options.",
  },
  {
    name: "Margarita Restaurant",
    address: "21 Wilder Ave (off Washington), Colonial Beach, VA",
    phone: "(804) 410-2078",
    hours: "Check for current hours",
    best: ["Peruvian ceviche", "Latin American plates", "Tamales", "Fresh-squeezed limeade"],
    desc: "Latin American cuisine with standout Peruvian dishes. A newer addition that's quickly become a local favorite.",
  },
  {
    name: "El Toro Authentic Mexican Restaurant",
    address: "Beachgate Shopping Center, Colonial Beach, VA",
    phone: "(804) 313-1864",
    hours: "Check for current hours",
    best: ["Street tacos", "Burritos", "Chile rellenos", "Horchata"],
    desc: "Casual, authentic Mexican. Great value and generous portions. Popular with locals for takeout.",
  },
  {
    name: "Raven's Point Café",
    address: "322 Washington Ave, Colonial Beach, VA",
    phone: "(804) 214-0411",
    hours: "Check for current hours",
    best: ["BBQ sandwich", "Mexican-style plates", "Subs", "Homemade desserts"],
    desc: "Casual spot with BBQ, Mexican, and sub options. Eclectic menu, great for a relaxed meal or takeout.",
  },
  {
    name: "Pier 909",
    address: "Colonial Beach waterfront area",
    phone: "(804) 410-2033",
    hours: "Seasonal — check for current hours",
    best: ["Waterfront views", "Seafood", "Cocktails"],
    desc: "Waterfront dining with great sunset views. Popular for drinks and apps after a day on the water.",
  },
  {
    name: "Ola's Country Kitchen (Homestyle Kitchen reboot)",
    address: "1010 McKinney Blvd, Colonial Beach, VA",
    phone: "Call for number",
    hours: "Check for current hours",
    best: ["Southern comfort food", "Breakfast plates", "Homestyle daily specials"],
    desc: "A CB legend re-opened! Classic Southern homestyle cooking — the kind of place locals have missed.",
  },
  {
    name: "Muse Pizzeria & Arcade",
    address: "Colonial Beach, VA",
    phone: "(804) 410-2015",
    hours: "Check for current hours",
    best: ["Stromboli", "Square pizza", "Wings", "Arcade games for kids"],
    desc: "Pizza, pasta, and an arcade — great for families. Good value, fun atmosphere.",
  },
  {
    name: "Ice House Brewery, Kitchen & Marina",
    address: "Monroe Bay Ave, Colonial Beach, VA",
    phone: "(804) 224-2334",
    facebook: "https://www.facebook.com/IceHouseCB",
    hours: "Check for current hours",
    best: ["Craft beers on tap", "Sandwiches & hot dogs", "Ice cold local brews", "Waterfront deck"],
    desc: "Craft brewery with a casual kitchen and marina location. Formerly Eugene's — now Ice House Café. Great spot for a cold beer on the water.",
    liveMusicNote: "🎵 Occasional live music — check Facebook for events."
  },
  {
    name: "Circa 1892 Wine & Cheese",
    address: "Hawthorn Ave, Colonial Beach, VA",
    phone: "(804) 604-9909",
    hours: "Check for current hours",
    best: ["Charcuterie boards", "Local and regional wines", "Artisan cheeses", "Specialty foods"],
    desc: "Gourmet wine and cheese shop with café service. Great for a sophisticated snack or gift. Beloved by locals.",
  },
  {
    name: "Colonial Beach Brewing",
    address: "Colonial Beach, VA",
    phone: "(804) 224-2334",
    facebook: "https://www.facebook.com/ColonialBeachBrewing",
    hours: "Check for current hours",
    best: ["Rotating craft ales", "IPAs", "Seasonal brews", "Taproom atmosphere"],
    desc: "Local craft brewery taproom. One of two CB breweries — rotating taps and a relaxed vibe.",
    liveMusicNote: "🎵 Live music events — follow Facebook for schedule."
  },
  {
    name: "Ledo Pizza & Pasta",
    address: "Beachgate Shopping Center, Colonial Beach, VA",
    phone: "(804) 224-5336",
    hours: "Check for current hours",
    best: ["Square-cut pizza", "Pasta dishes", "Subs", "Family meal deals"],
    desc: "Maryland-style pizza chain. A reliable go-to for families and pizza lovers.",
  },
  {
    name: "The Riverboat on the Potomac",
    address: "301 Beach Terrace, Colonial Beach, VA",
    phone: "(804) 224-7055",
    hours: "Seasonal — call ahead",
    best: ["Steamed seafood", "Burgers", "Sunset cocktails"],
    desc: "Casual waterfront dining with Potomac views. Good for a relaxed meal or drinks.",
  },
  {
    name: "Willey's BBQ",
    address: "117 Washington Ave, Colonial Beach, VA",
    hours: "Check for current hours",
    best: ["BBQ pork sandwich", "Lima beans", "Smoked ribs", "Pulled chicken"],
    desc: "Local BBQ staple. Willey's lima beans are legendary among regulars. Simple, satisfying, and authentically CB.",
  },
  {
    name: "Guacamole II",
    address: "Colonial Beach, VA",
    hours: "Check for current hours",
    best: ["Guacamole", "Tacos", "Mexican classics"],
    desc: "Mexican restaurant and a favorite with CB locals and visitors. Check Facebook or call for current hours and location details.",
  },
  {
    name: "Kittrell's Firehouse Chicken & Ribs",
    address: "18620 Ridge Road, Colonial Beach, VA (also Oak Grove Plaza, 2998 Kings Hwy)",
    phone: "(540) 295-3886",
    hours: "Check for current hours — mobile unit also operates seasonally",
    best: ["Firehouse chicken", "BBQ ribs", "Smoked meats"],
    desc: "Local CB favorite for BBQ chicken and ribs. Mobile unit also appears at events around the area. Great for takeout.",
  },
  {
    name: "Crazy Jack's Sandwich Shack",
    address: "Beachgate Shopping Center, Colonial Beach, VA",
    hours: "Check for current hours",
    best: ["Hot subs", "Cold subs", "Daily specials"],
    desc: "Casual sub and sandwich shop. Quick, filling, and affordable.",
  },
  {
    name: "Hunan Diner",
    address: "Corner of Washington & Colonial Ave, Colonial Beach, VA",
    phone: "(804) 224-8754",
    hours: "Check for current hours",
    best: ["Chinese-American classics", "General Tso's chicken", "Lo mein", "Lunch specials"],
    desc: "Local Chinese-American diner in a distinctive old train car building on Washington and Colonial Avenue. Entrance accessible from the back. Good value lunch specials.",
  },
];

const SHOPPING = [
  { name: "Magnolia Hall", address: "823 Colonial Ave, Colonial Beach, VA 22443", phone: "(804) 761-1594", desc: "Opened in 2024 in a charming 1900 Victorian house near the corner of Washington and Colonial Avenues. Carefully curated coastal home décor, clothing, cool gadgets, and unique gifts. Owner Scott has an eye for beautiful, unexpected finds. A welcome addition to CB's shopping scene — locals love it!", featured: true, facebook: "https://www.facebook.com/magnoliahallcbva" },
  { name: "Hawthorn Mercantile", address: "100 Hawthorn St, Colonial Beach, VA 22443", phone: "(804) 619-2290", desc: "A charming shop for homewares, unique gifts, and eclectic finds in the heart of downtown. Known for curated selections that reflect the coastal character of Colonial Beach. A must-stop on any downtown stroll.", featured: true },
  { name: "Colonial Beach Boardwalk Shops", address: "Boardwalk, Colonial Beach, VA", desc: "Beachwear, souvenirs, sunscreen, and local art along the main boardwalk strip. Great for picking up last-minute beach essentials." },
  { name: "Everything's Beachy & The Beach Bazaar", address: "Boardwalk, Colonial Beach, VA", phone: "(804) 224-7191", desc: "On the boardwalk — beachwear, inflatables, beach toys, chairs, snorkels, and kites. Everything for a day on the water." },
  { name: "Circa 1892 — Wine, Cheese & Specialty Foods", address: "Hawthorn Ave, Colonial Beach, VA", phone: "(804) 604-9909", desc: "Gourmet wine shop, artisan cheese, charcuterie, and local specialty foods. Great for gifts and pre-dinner provisions." },
  { name: "Beach Paws Pet Boutique", address: "116B Hawthorn, Colonial Beach, VA", desc: "Boutique pet supplies, accessories, and gifts for animal lovers and their four-legged visitors." },
  { name: "Custom Cartz at the Beach", address: "614 Colonial Ave, Colonial Beach, VA", phone: "(804) 214-6011", desc: "Golf cart sales, rentals, and customization. Need a cart decked out for the golf cart parade? This is your place." },
];


const GOLF_CARTS = [
  { name: "T and T Cart Rental and Sales", address: "500 Colonial Ave, Colonial Beach, VA 22443", phone: "(540) 280-7009", hours: "Mon–Sat 10am–5pm (call for availability — after-hours pickup possible)", rates: "Call for current rates · Delivery available for a fee", notes: "Family owned. Rental and custom cart sales. Book by phone — call to reserve. Cancellations must be made 10+ days in advance.", website: "https://www.tandtcarts.com", facebook: "https://www.facebook.com/tandtcartrental" },
  { name: "Custom Cartz LLC", address: "614 Colonial Ave, Colonial Beach, VA", phone: "(804) 214-6011", hours: "Call for current hours", rates: "Rentals by the hour, day, week, or month · 4 and 6-seat carts available", notes: "Delivers the cart to your front door and picks it up when you're done. Full tank of gas included — no refueling required. Just bring a driver's license and insurance card.", website: "https://www.custom-cartz.com" },
];

const THRIFT = [
  {
    name: "St. Mary's Episcopal Church Thrift Shop",
    address: "St. Mary's Episcopal Church, Colonial Beach, VA",
    phone: "(804) 224-8021",
    hours: "Fri & Sat 10am–1pm, year-round",
    notes: "A longtime CB institution run by the Episcopal Church Women (ECW). Clothing, housewares, books, and more. Proceeds support local charities including women's shelters and St. Jude's.",
    church: true,
    link: "https://www.stmaryscb.org/thrift-shop",
  },
  {
    name: "St. Peter's Episcopal Church Thrift Shop",
    address: "4065 Kings Hwy (at Rt. 3 & Bowie Rd), Oak Grove, VA",
    phone: "(804) 224-7121",
    hours: "Sat 9am–3pm (confirm current hours)",
    notes: "100% volunteer-run ministry located inside space generously provided by Bowie's Hardware. Proceeds fund scholarships, free meals, and local community charities.",
    church: true,
    link: "https://www.stpetersoakgrove.org/home/outreach-ministries-and-resources/thrift-shop",
  },
  {
    name: "Colonial Beach UMW Opportunity Shop",
    address: "Colonial Beach, VA",
    hours: "Call for current hours",
    notes: "Run by the United Methodist Women. Classic church thrift shop with clothing, household items, and bric-a-brac at bargain prices. Proceeds support UMW mission projects.",
    church: true,
  },
  {
    name: "Drift and Thrift",
    address: "234 Colonial Ave, Colonial Beach, VA",
    hours: "Wed & Sat 10am–4pm (confirm seasonally)",
    notes: "In-town thrift shop right near the waterfront. Eclectic mix of clothing, kitchenware, and home goods. Cozy setup in a converted house.",
    church: false,
  },
  {
    name: "This & That Thrift Shop",
    address: "4115 Kings Hwy, Oak Grove, VA",
    hours: "Call for current hours",
    notes: "Community thrift shop in Oak Grove, just a short drive from Colonial Beach. Good variety of household items and clothing.",
    church: false,
  },
  {
    name: "Mason Jar Thrift Store",
    address: "King George area (~20 min drive)",
    hours: "Call for current hours",
    notes: "Well-regarded local thrift store — rated highly for selection and fair pricing.",
    church: false,
  },
  {
    name: "Goodwill – Rappahannock Donation Center",
    address: "King George, VA (~20 min drive)",
    hours: "Call for current hours",
    notes: "Nearest Goodwill to Colonial Beach. Good for larger hauls.",
    church: false,
  },
];

const PARKING = [
  {
    name: "Zone 1 — Downtown Business District",
    address: "Colonial Ave, Washington Ave & downtown streets, Colonial Beach, VA",
    price: "$2/hr · $20/day",
    rules: "Paid parking in effect 7 days a week. Pay at Flowbird Pay Stations (cash or credit card) or use the Flowbird mobile app (iOS & Android — $0.35 app fee per transaction). Pay by text also available. Enter your license plate number to pay.",
    free: "15-minute complimentary spaces available at select locations for quick stops and carry-out pickup.",
    zone: "1",
  },
  {
    name: "Zone 2 — Beach District",
    address: "Beachfront, Taylor St Boardwalk, Irving Ave & Beach Terrace, Colonial Beach, VA",
    price: "$3/hr · $25/day",
    rules: "Higher rate applies in the beach zone. Paid 7 days a week. Same Flowbird Pay Station / app payment system. No overnight parking.",
    zone: "2",
  },
  {
    name: "Zone 3 — Oversized Vehicles & Trailers",
    address: "Castlewood/Wilder Parking Lots (Castlewood Park area), Colonial Beach, VA",
    price: "$35/day flat fee",
    rules: "Oversized vehicles and those towing trailers MUST use the designated green-marked spaces in the Castlewood or Wilder parking lots. Do not attempt to park oversized vehicles in Zones 1 or 2.",
    zone: "3",
  },
  {
    name: "Boat Ramp / Monroe Bay Area",
    address: "Monroe Bay Ave & Castlewood Dr, Colonial Beach, VA",
    price: "See Zone 3 for trailer fees",
    rules: "Boat trailer parking in designated green spaces in Castlewood lot ($35/day flat fee). Ramp access available.",
    zone: null,
  },
];

const PARKING_EXEMPTIONS = [
  { icon: "♿", title: "Handicap Parking — FREE", desc: "Free at all public parking spaces and lots in downtown Colonial Beach. Must display a valid handicap license plate or placard." },
  { icon: "🎖", title: "Purple Heart Veterans — FREE", desc: "Vehicles displaying valid Purple Heart license plates are exempt from all parking fees." },
  { icon: "🏠", title: "Town Residents — FREE", desc: "Residents with vehicles registered and garaged within Colonial Beach who have paid Vehicle Personal Property taxes are enrolled in the automated system for free parking. A $30 annual vehicle licensing fee applies for new or additional vehicles — contact Town Hall to register." },
];

const LODGING = [
  // ── HOTELS & MOTELS ──────────────────────────────────────────────────────────
  { name: "Riverview Inn", type: "Motel", address: "24 Hawthorne St, Colonial Beach, VA 22443", phone: "(804) 224-4200", link: "https://www.colonialbeachriverview.com", notes: "★ #1 rated in Colonial Beach on TripAdvisor. Built in the 1950s, lovingly restored to its original teal-and-red retro glory. 21 uniquely themed rooms — no two alike. Steps from the boardwalk and beach. Free Wi-Fi, refrigerators in rooms. Preferred lodging partner for the Virginia Osprey Festival.", featured: true },
  { name: "River Edge Inn", type: "Hotel", address: "30 Colonial Ave, Colonial Beach, VA 22443", phone: "(804) 410-2024", link: "https://www.riveredgeinncolonialbeach.com", notes: "60 recently renovated rooms — one of CB's largest hotels. Free parking, high-speed WiFi, outdoor pool. Walking distance to the boardwalk and downtown." },
  { name: "Wakefield Motel", type: "Motel", address: "1513 Irving Ave, Colonial Beach, VA 22443", phone: "(804) 224-7311", link: "https://wakefieldmotel.com", notes: "Waterfront 20-room motel open year-round. Kitchenettes in most rooms, cable TV, private pier on the Potomac. Great for longer stays and fishing trips." },
  { name: "Nightingale Marina & Motel", type: "Motel", address: "101 Monroe Bay Drive, Colonial Beach, VA 22443", phone: "(804) 224-7956", notes: "Motel and marina on Monroe Bay. Convenient for boaters — marina slips available. Call for current rates and availability." },
  // ── BED & BREAKFASTS ──────────────────────────────────────────────────────────
  { name: "Colonial Beach Plaza Bed & Breakfast", type: "B&B", address: "21 Weems St, Colonial Beach, VA 22443", phone: "(804) 410-2895", link: "https://www.colonialbeachplaza.com", notes: "Charming Victorian mansion from the early 1900s, fully restored. Spacious rooms with period furnishings. Seasonal outdoor pool, garden, and free parking. Walkable to shops and waterfront." },
  { name: "Dennison Street Inn", type: "B&B", address: "100 Dennison St, Colonial Beach, VA 22443", phone: "(800) 210-0769", link: "https://www.dennisonstreetinn.com", notes: "Historic inn — former home of Colonial Beach's first mayor, refurbished in period style. Quiet residential location, full B&B hospitality." },
  // ── VACATION RENTALS ──────────────────────────────────────────────────────────
  { name: "Airbnb – Colonial Beach", type: "Vacation Rental", address: "Various Colonial Beach locations", link: "https://airbnb.com/s/Colonial-Beach--VA", notes: "Dozens of beach cottages, waterfront homes, and bungalows throughout town. Great for families and groups." },
  { name: "VRBO – Colonial Beach", type: "Vacation Rental", address: "Various Colonial Beach locations", link: "https://vrbo.com/vacation-rentals/usa/virginia/colonial-beach", notes: "Weekly rentals ideal for families and groups wanting a home base." },
  // ── CAMPGROUNDS & RV ──────────────────────────────────────────────────────────
  { name: "Monroe Bay Campground & Marina", type: "Campground / RV", address: "1412 Monroe Bay Circle, Colonial Beach, VA 22443", phone: "(804) 224-7418", link: "https://monroebaycampground.com", notes: "300+ sites with water & electric (100+ with sewer), 50 amp available, two dump stations, boat ramp, docking pier, camp store with propane & home-cooked meals, playground, game room, and sloping white beach. Marina slips for boats up to 45 ft. Office staffed 7 days/week." },
  { name: "Monroe Bay Mobile Home Park & RV Resort", type: "RV Resort", address: "Monroe Bay Circle, Colonial Beach, VA 22443", phone: "(804) 224-7418", notes: "Adjacent to Monroe Bay Campground. Long-term and seasonal RV sites along Monroe Bay. Call for rates and availability." },
  { name: "Thousand Trails Harbor View", type: "RV Resort / Campground", address: "15 Harbor View Circle, Colonial Beach, VA 22443", phone: "(804) 224-8164", link: "https://thousandtrails.com/virginia/harbor-view-rv-camping-resort", notes: "144 sites, full hookups (30 & 50 amp), open April–December. Pool, putt-putt, playground, basketball, clean bathhouses, shaded tree-covered sites. Thousand Trails membership or Camping Pass required. Reservations: (888) 481-6348. No after-dark arrivals." },
];

const PARKS = [
  { name: "Colonial Beach Town Beach", type: "Town", address: "Beachfront, Colonial Beach, VA", desc: "Mile-long sandy beach on the Potomac, free public access, lifeguards in summer, volleyball nets, playgrounds." },
  { name: "Monroe Bay Town Park", type: "Town", address: "Monroe Bay Ave, Colonial Beach, VA", desc: "Picnic shelters, boat launch, fishing pier, walking trail along Monroe Bay." },
  { name: "Westmoreland State Park", type: "State Park", address: "1650 State Park Rd, Montross, VA", phone: "(804) 493-8821", desc: "Potomac River cliffs, fossil beach (find sharks teeth!), camping, hiking, cabins. ~15 min drive.", link: "https://www.dcr.virginia.gov/state-parks/westmoreland" },
  { name: "Caledon State Park", type: "State Park", address: "11617 Caledon Rd, King George, VA", phone: "(540) 663-3861", desc: "Premier bald eagle viewing site — one of largest eagle concentrations on East Coast. Guided eagle tours Jun–Aug. ~20 min drive.", link: "https://www.dcr.virginia.gov/state-parks/caledon" },
  { name: "George Washington Birthplace", type: "National", address: "1732 Popes Creek Rd, Washington's Birthplace, VA", desc: "National monument with colonial farm, nature trail, and Potomac River access. ~20 min drive." },
];

const WINERIES = [
  { name: "Ingleside Vineyards", address: "5872 Leedstown Rd, Oak Grove, VA (~20 mi)", phone: "(804) 224-8687", desc: "One of Virginia's oldest and most celebrated wineries — a true local favorite. Award-winning wines from both European and hybrid grapes grown on a stunning historic estate dating to the 1800s. Tours, tastings, events, and cabin rentals on-site. A must-visit when in the Colonial Beach area.", link: "https://inglesidevineyards.com", featured: true },
  { name: "Monroe Bay Winery", address: "4786 James Monroe Hwy, Colonial Beach, VA 22443", phone: "(804) 410-5628", desc: "A true local gem — small farm winery and cidery right here in Colonial Beach, situated on part of the original James Monroe Birthplace Farm on the waterfront. Unique tasting room in a stunning strawbale barn built from natural materials and recycled wine bottle walls. Waterfront patio overlooking Monroe Creek. Wines include Cabernet Franc, Petit Verdot, Viognier, Chardonnay, and Blue Heron Red/White/Rosé. Hard ciders include one made from the Virginia Hughes Crab apple variety grown by President Monroe himself! Pet-friendly, bring a picnic, food trucks posted on Facebook. Also available for weddings and private events.", link: "https://monroebaywine.com", facebook: "https://www.facebook.com/MonroeBayWine", hours: "Sat & Sun 12–5pm (Apr–Dec) · Closed Jan–Mar · Open year-round for private events", featured: true },
  { name: "Vault Field Vineyards", address: "Near Hague, VA (~25 mi)", phone: "(804) 580-7373", desc: "Small-batch wines, stunning pastoral views, tasting room weekends." },
  { name: "Potomac Point Winery", address: "275 Decatur Rd, Stafford, VA (~30 mi)", phone: "(540) 446-2266", desc: "Award-winning wines, beautiful grounds, live music. Great venue.", link: "https://potomacpointwinery.com" },
  { name: "Holly Hill Farm Winery", address: "Montross, VA (~15 mi)", phone: "(804) 493-0045", desc: "Family farm winery, lavender fields, seasonal events and pick-your-own." },
  { name: "Caret Cellars", address: "Near Caret, VA (~25 mi)", desc: "Boutique farm winery with lovely picnic grounds and local varietals." },
];

const BREWERIES = [
  {
    name: "Ice House Brewery, Café & Marina",
    address: "119 Monroe Bay Ave, Colonial Beach, VA 22443",
    phone: "(804) 224-2334",
    distance: "🏖 In Town",
    hours: "Mon & Wed–Thu 4:30–9pm · Fri 3–10pm · Sat 8:30am–10pm · Sun 8:30am–8pm · Closed Tue",
    website: "https://www.icehousecb.com",
    facebook: "https://www.facebook.com/icehousecb",
    beers: ["Castaway Cream Ale", "High Tide IPA", "Professor's Pale Ale", "Bayside Belgian"],
    desc: "Waterfront brewery in a stunning 1900s historic ice plant building on Monroe Bay. Craft beer, waterfront café, marina slips, live music, comedy nights, and tiny houseboat rentals coming soon. The heartbeat of Colonial Beach.",
    liveMusicNote: "🎵 Regular live music & events — follow Facebook for weekly schedule.",
  },
  {
    name: "Colonial Beach Brewing",
    address: "215C Washington Ave, Colonial Beach, VA 22443",
    phone: "(804) 410-2005",
    distance: "🏖 In Town",
    hours: "Mon closed · Tue–Thu 5–9pm · Fri 3–10pm · Sat 12–10pm · Sun 12–8pm",
    website: "https://www.cbb.beer",
    facebook: "https://www.facebook.com/colonialbeachbrewing",
    beers: ["Beach Blonde Ale", "Yert Pale Ale", "Smokin' Hot Blonde", "Sunken Sailboat", "Seasonal releases"],
    desc: "Small-batch 3.5bbl craft brewery in the heart of historic downtown CB. Serves fast-casual Mediterranean food alongside handcrafted ales. Dog-friendly beer garden, outdoor seating, live music, trivia, open mic, drag shows, yoga, book club, and more. Gold medal winner. Owners Mitsy & Ted make everyone feel like family.",
    liveMusicNote: "🎵 Live music, trivia & events most weekends — check Facebook.",
  },
  {
    name: "Northern Neck Brewing Company",
    address: "15804 Kings Hwy, Montross, VA 22520",
    phone: "(804) 493-3008",
    distance: "~15 min drive",
    hours: "Wed–Thu 4–9pm · Fri–Sat 11:30am–9pm · Sun 12–6pm · Mon–Tue closed",
    website: "https://nnkbrew.com",
    facebook: "https://www.facebook.com/nnkbrew",
    beers: ["Czech Pilsner", "West Coast IPA", "Farmhouse Saison", "British Brown Ale", "No Neck Lager", "Albariño Oeno (collab with Ingleside)"],
    desc: "Hometown brewery and pub on the corner in downtown Montross, right across from the Westmoreland County Courthouse. Full kitchen with chef-prepared tidewater favorites including beer-battered rockfish sandwiches and smash burgers. 13 rotating taps, indoor and patio seating, live music Fridays and Saturdays.",
    liveMusicNote: "🎵 Live music Fri & Sat nights — follow Facebook for performers.",
  },
  {
    name: "Creekside Farm Brewery",
    address: "Westmoreland County area, VA",
    phone: "Check Facebook",
    distance: "~20–25 min drive",
    hours: "Check website/Facebook for current hours",
    facebook: "https://www.facebook.com/creeksidefarmbrewery",
    beers: ["Rotating farm ales", "Seasonal releases", "Wines also available"],
    desc: "Beloved farm brewery with hops growing on-site and vineyards. Family-owned and operated — regulars rave about the atmosphere and the family that runs it. Beautiful rural setting with outdoor seating, great for a relaxed afternoon.",
    liveMusicNote: "🎵 Occasional live music — check Facebook.",
  },
  {
    name: "Callao Brewing Company",
    address: "Callao, VA (Northern Neck)",
    phone: "Check Facebook",
    distance: "~30 min drive",
    hours: "Check for current hours",
    beers: ["Rotating craft ales and lagers"],
    desc: "Northern Neck craft brewery in the small town of Callao. Worth the scenic drive down the neck.",
  },
  {
    name: "Maltese Brewing",
    address: "King George area, VA",
    phone: "Check Facebook",
    distance: "~20 min drive",
    hours: "Check for current hours",
    beers: ["Rotating taps", "Unique small-batch styles"],
    desc: "Highly rated craft brewery near King George. Known for adventurous and unusual beer styles.",
  },
];

const FESTIVALS = [
  { name: "🎨 2nd Friday Art Walk", date: "2nd Friday of every month, March–December · 6–9pm", month: null, day: null, recurring: "2nd-friday", location: "Downtown Colonial Beach — 15+ venues", desc: "FREE monthly art walk by the Colonial Beach Artists' Guild. Artists display work across 15+ downtown venues. No admission, ample street parking.", link: "https://colonialbeach.org/calendar/2nd-friday-art-walk/" },
  { name: "St. Patrick's Day Pub Crawl", date: "Saturday nearest March 17th", month: 3, day: 15, location: "Downtown Colonial Beach bars & restaurants", desc: "Festive pub crawl through CB's downtown bars. Irish beers, green everything, and good craic." },
  { name: "Annual Easter Egg Hunt", date: "Saturday before Easter", month: 4, day: 19, location: "Town Hill (Colonial & Washington Avenues)", desc: "Family-favorite tradition. Kids arrive with baskets for an egg hunt on the Town Hill gazebo lawn. Free and open to all." },
  { name: "Virginia Osprey Festival", date: "April (typically second weekend) · Annual", month: 4, day: 12, endDay: 13, location: "Colonial Beach — Town Beach & waterfront", desc: "Celebrate the return of ospreys to the Potomac! Nature walks, bird banding demonstrations, kids' activities, art, food, and music.", link: "https://colonialbeach.org/events" },
  { name: "Memorial Day Golf Cart Parade", date: "Memorial Day Weekend (late May)", month: 5, day: 24, endDay: 26, location: "Colonial Ave & downtown streets", desc: "Decorated golf carts parade through town. Residents go all-out with themes. Spectators line the streets." },
  { name: "Annual Potomac River Festival", date: "Mid-June (June 13–15, 2025 — 74th Annual)", month: 6, day: 13, endDay: 15, location: "Downtown Colonial Beach & Boardwalk", desc: "CB's biggest annual event! Fireman's Parade, Grand Feature Parade, Pet Parade, Boat Parade, Kids Zone, live music, food vendors, and fireworks.", link: "https://colonialbeach.org/potomac-river-festival/" },
  { name: "Father's Day Classic Car Show", date: "Father's Day weekend (June)", month: 6, day: 15, location: "Town Hill (Colonial & Washington Avenues)", desc: "18th Annual show hosted by the Colonial Rod Club. One-of-a-kind cars and trucks packed onto Town Hill. Free to attend." },
  { name: "4th of July Fireworks & Golf Cart Parade", date: "July 4th", month: 7, day: 4, location: "Town Beach & Boardwalk", desc: "Fireworks over the Potomac River plus the famous golf cart parade through downtown. Arrive early — the boardwalk fills up fast!" },
  { name: "Rod Run to the Beach", date: "August 16–17, 2025 (annual, mid-August)", month: 8, day: 16, endDay: 17, location: "Colonial Beach downtown & boardwalk", desc: "Classic and custom hot rods and muscle cars take over the waterfront. Runs concurrently with Water Fest." },
  { name: "Water Fest", date: "August 16–17, 2025 — 10am–5pm (10th Annual)", month: 8, day: 16, endDay: 17, location: "Colonial Beach Boardwalk", desc: "Giant water slide, water contests, live music, food vendors, and beach games. Kids love it.", link: "https://colonialbeachevents.com" },
  { name: "Northern Neck Beach Music Festival", date: "September 13–14, 2025 — 7th Annual", month: 9, day: 13, endDay: 14, location: "Colonial Beach", desc: "Two days of shag dancing, beach music, and great vibes on the Potomac." },
  { name: "Boardwalk Arts & Crafts Fair", date: "Late summer / early fall (check for dates)", month: 9, day: 20, location: "Colonial Beach Boardwalk", desc: "Artisans and crafters from across the region. Great for unique gifts, local artwork, handmade jewelry, and beach-themed goods." },
  { name: "Bike Fest", date: "October 9–12, 2025 — 11th Annual (4 days)", month: 10, day: 9, endDay: 12, location: "Town Hill & Boardwalk, Colonial Beach", desc: "Four days of motorcycles, live music (Southern rock headliners), bike show, food & beer vendors, and the Defenders of Freedom Ride.", link: "https://colonialbeachbikefest.com" },
  { name: "Restaurant Week", date: "October 20–26, 2025 (2nd Annual)", month: 10, day: 20, endDay: 26, location: "Participating restaurants throughout Colonial Beach", desc: "Week-long celebration of CB's dining scene. Local restaurants offer exclusive discounts and special menus.", link: "https://colonialbeach.org/restaurant-week/" },
  { name: "Fall Festival & Halloween Golf Cart Parade", date: "Late October (near Halloween)", month: 10, day: 25, location: "Town Hill (Colonial & Washington Avenues)", desc: "Food & craft vendors, inflatables, games, live music, costume contest, and the annual Halloween-themed golf cart parade." },
  { name: "Annual Fall Rockfish Tournament", date: "2nd weekend of November", month: 11, day: 8, endDay: 9, location: "Colonial Beach Yacht Center, 1787 Castlewood Dr", desc: "Fishing competition with $5,000 first-place prize. Captain's Dinner Friday night, fishing Saturday & Sunday." },
  { name: "Annual Lighted Boat Parade", date: "Late November (day after Thanksgiving)", month: 11, day: 28, location: "Potomac River — Monroe Bay to Riverboat and back", desc: "Boats of all sizes decorated with holiday lights parade along the Potomac. Watch from the beach, boardwalk, or your golf cart." },
  { name: "Santa's Wonderland & Winter Festival Parade", date: "First Saturday of December", month: 12, day: 6, location: "Downtown Colonial Beach", desc: "Holiday parade, Santa's arrival, tree lighting, carolers, and a festive market. A magical way to close out the year in CB." },
];


const ARTISTS = [
  { name: "Aivar Viira", address: "Colonial Beach, VA", desc: "Estonian-born artist living and working in Colonial Beach. Specializes in fine art photography and custom pet portrait paintings — capturing the personality and soul of beloved animals in stunning painted works. A wonderful and unique gift for any pet lover. Contact to commission a custom portrait of your pet.", medium: "Photography & Custom Pet Portraits", featured: true, link: "https://www.saatchiart.com/Aivar" },
  { name: "Artists' Alliance at Jarrett Thor Fine Arts", address: "100 Taylor St, Suite 101, Colonial Beach, VA", desc: "Cooperative of 20+ top regional artists. Painting (oil, acrylic, watercolor, pastel), photography, pottery, encaustic, stained glass, and jewelry. Rotating monthly shows — a flagship of CB's art scene.", link: "https://www.artgallerycolonialbeach.com" },
  { name: "Colonial Beach Artists' Guild", address: "Downtown Colonial Beach", desc: "Nearly 70-member guild founded 2004. Sponsors the monthly 2nd Friday Art Walk, the Potomac River Regional Art Show, and community arts education. Pick up a map at any Art Walk stop.", link: "https://colonialbeachartistguild.org" },
  { name: "Pottery By Hand & Studio A", address: "10 & 10A Hawthorn St, Colonial Beach, VA", desc: "Working pottery studio on Hawthorn Street. Functional and decorative pieces, local artwork. Participates in the monthly 2nd Friday Art Walk." },
  { name: "CB Murals — Downtown Walking Tour", address: "Various walls, downtown Colonial Beach", desc: "Community murals celebrating CB's history, watermen culture, and Potomac wildlife. A self-guided walking tour through the colorful public art of downtown. Ask at the Chamber for a map." },
  { name: "BAMM — Beach Arts, Music & Mentoring", address: "Colonial Beach, VA", desc: "Community initiative mentoring local youth in arts and music. Funded through the Colonial Beach Community Foundation." },
];

const CHARTER_BOATS = [
  { name: "Reel M N Fishing Charters", address: "Colonial Beach, VA", phone: "(804) 224-1400", captain: "Captain Frank", species: ["Rockfish (Striped Bass)", "Spot", "Croaker", "Catfish", "Bluefish", "Perch"], desc: "Colonial Beach's go-to fishing charter. Captain Frank knows the Potomac River inside and out. Targets a wide variety of species depending on season. All gear provided, family-friendly. Call to book.", facebook: "https://www.facebook.com/ReelmnFishingCharters/", featured: true },
  { name: "Fish Wish Charters", address: "Colonial Beach, VA", phone: "(804) 224-1400", captain: "Captain Frank Markham", species: ["Striped Bass", "Perch", "Catfish", "Bluefish"], desc: "32-foot Sea Ray Island Hopper, handles parties up to 6. Experienced captain, all gear included. Call to book." },
  { name: "Miss KayLeigh Charters", address: "Colonial Beach, VA", captain: "Captain Wesley Jackson", species: ["Striped Bass", "Perch", "Catfish"], desc: "Fun day on the water or a dinner cruise on the Potomac. Great for groups and special occasions. Contact local marinas for booking." },
  { name: "5th Day Fisheries", address: "Colonial Beach, VA", captain: "Captain on board", species: ["Crabs", "Rockfish", "Sightseeing"], desc: "Crabbing, fishing, and sightseeing on the Potomac. Great for families and first-timers." },
  { name: "Capt. Morgan's Charters", address: "Colonial Beach area, VA", phone: "(804) 214-0492", captain: "Captain Morgan", species: ["Striped Bass", "Perch", "Catfish", "Bluefish"], desc: "Local area charter fishing. Call to inquire about trips and availability." },
];

const KID_ACTIVITIES = [
  { name: "Town Beach Swimming & Sandcastles", desc: "Free beach access, gentle surf, lifeguards in summer. Bring sand toys!", ageRange: "All ages" },
  { name: "Fossil Hunting at Westmoreland State Park", desc: "Wade the Potomac shoreline looking for shark teeth and fossils. Kids go wild for this!", ageRange: "5+" },
  { name: "Golf Cart Rides", desc: "Rent a cart and cruise the streets — kids LOVE it. Many rentals have seats for the whole family.", ageRange: "All ages" },
  { name: "Monroe Bay Kayak & Canoe", desc: "Flat calm bay perfect for first-time paddlers. Rentals available at the boat ramp.", ageRange: "6+" },
  { name: "Caledon Eagle Watching Tour", desc: "Ranger-led tours to see bald eagles nesting. Educational and unforgettable.", ageRange: "5+" },
  { name: "Crab Pot Adventure", desc: "Some charter captains offer kids' crabbing trips — set pots, pull them up, keep your catch!", ageRange: "4+" },
  { name: "Boardwalk Playground", desc: "Playground and splash pad near the boardwalk. Ice cream within walking distance.", ageRange: "2–12" },
  { name: "Miniature Golf", desc: "Seasonal mini-golf near the boardwalk, great for rainy afternoons.", ageRange: "All ages" },
  { name: "The Museum at Colonial Beach", desc: "Fun, kid-friendly exhibits on local history — from Native Americans to steamboats to the wild casino era. Kids love the artifacts and the stories. Great for a rainy day or a cool morning.", ageRange: "6+", address: "128 Hawthorn St, Colonial Beach, VA" },
  { name: "Custom T's Motorsports Park", desc: "50-acre racing facility with a 1/8 mile drag strip on James Monroe Highway. Thrilling for older kids and teens who love cars and speed.", ageRange: "8+", address: "2035 James Monroe Hwy, Colonial Beach, VA" },
];

const BIRD_SPOTS = [
  { id: 1, name: "Caledon State Park Eagle Roost", lat: 38.3621, lng: -77.1548, type: "eagle", desc: "One of the densest bald eagle concentrations on the East Coast. Peak viewing June–August.", confirmed: true },
  { id: 2, name: "Monroe Bay Osprey Nest", lat: 38.2495, lng: -76.9715, type: "osprey", desc: "Active osprey nest on navigation marker at bay entrance. Nesting March–August.", confirmed: true },
  { id: 3, name: "Boardwalk Osprey Platform", lat: 38.2481, lng: -76.9688, type: "osprey", desc: "Town-installed osprey platform. Highly active, easy viewing from the beach.", confirmed: true },
  { id: 4, name: "Westmoreland Bald Eagle", lat: 38.1590, lng: -76.8609, type: "eagle", desc: "Eagle pair nests in tall pines near the park's fossil beach. Visible from hiking trail.", confirmed: true },
  { id: 5, name: "Potomac River North Shore", lat: 38.2650, lng: -76.9400, type: "eagle", desc: "Regular eagle flyover zone, especially at dawn and dusk.", confirmed: true },
];

// Bird species guide — Colonial Beach / Potomac River area
// Categories: raptors, waders, waterfowl, shorebirds, songbirds, others
// Seasons: year-round, spring, summer, fall, winter, migrant
const LOCAL_BIRDS = [
  // ── RAPTORS ──
  {
    category: "🦅 Raptors",
    species: [
      { name: "Osprey", season: "Spring–Fall", when: "Mar–Oct", status: "Breeder", emoji: "🐦", notes: "CB's signature bird. Arrives March, nests through August. Dive-bombs fish talons-first. Multiple active nests on town platforms and bay markers. Migrates to Central/South America for winter." },
      { name: "Bald Eagle", season: "Year-Round", when: "All year", status: "Resident", emoji: "🦅", notes: "Year-round resident — numbers peak in winter. Caledon State Park is one of the densest concentrations on the East Coast. Often harasses osprey to steal their fish." },
      { name: "Red-tailed Hawk", season: "Year-Round", when: "All year", status: "Resident", emoji: "🦅", notes: "Common large hawk. Look for the rusty-red tail in adults. Often seen perched on utility poles along Route 205." },
      { name: "Red-shouldered Hawk", season: "Year-Round", when: "All year", status: "Resident", emoji: "🦅", notes: "Prefers wooded areas near water. Listen for its loud, repetitive call — often mimicked by Blue Jays." },
      { name: "Cooper's Hawk", season: "Year-Round", when: "All year", status: "Resident", emoji: "🦅", notes: "Agile woodland hawk. Frequently raids backyard feeders for songbirds." },
      { name: "Northern Harrier", season: "Fall–Spring", when: "Oct–Apr", status: "Winter visitor", emoji: "🦅", notes: "Low, buoyant flier over marshes and open fields. Look for the white rump patch. Arrives with cold weather." },
      { name: "Peregrine Falcon", season: "Migration", when: "Sep–Nov, Mar–May", status: "Migrant", emoji: "🦅", notes: "World's fastest bird. Passes through during migration, occasionally hunting shorebirds along the riverfront." },
      { name: "Turkey Vulture", season: "Spring–Fall", when: "Mar–Nov", status: "Summer resident", emoji: "🦅", notes: "Soars on thermals in distinctive V-shape (dihedral). Huge numbers roost in trees along the Potomac. Vital cleanup crew." },
      { name: "Black Vulture", season: "Year-Round", when: "All year", status: "Resident", emoji: "🦅", notes: "Shorter tail and white wing-tip patches distinguish it from Turkey Vulture. Roosts communally in trees near water." },
    ]
  },
  // ── HERONS & WADERS ──
  {
    category: "🦢 Herons, Egrets & Waders",
    species: [
      { name: "Great Blue Heron", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Up to 4 feet tall — hard to miss. Stands motionless in shallows waiting to spear fish. Nests in colonies (rookeries) in tall trees. Common along the entire CB shoreline." },
      { name: "Great Egret", season: "Spring–Fall", when: "Apr–Oct", status: "Summer resident", emoji: "🐦", notes: "Large all-white wading bird with yellow bill. Common on mudflats and marshes at low tide." },
      { name: "Snowy Egret", season: "Spring–Fall", when: "Apr–Sep", status: "Summer resident", emoji: "🐦", notes: "Smaller white egret with distinctive yellow feet. Often seen actively chasing fish rather than standing still." },
      { name: "Little Blue Heron", season: "Spring–Fall", when: "Apr–Oct", status: "Summer resident", emoji: "🐦", notes: "Dark blue-grey body in adults; white in first year (easily confused with Snowy Egret). Tidal marshes." },
      { name: "Tricolored Heron", season: "Spring–Fall", when: "May–Sep", status: "Summer visitor", emoji: "🐦", notes: "Slender heron with white belly stripe. Less common — a good find along the marshier stretches of Monroe Bay." },
      { name: "Green Heron", season: "Spring–Fall", when: "Apr–Oct", status: "Breeder", emoji: "🐦", notes: "Small, stocky heron. Often seen crouching along the water's edge in vegetation. Can use bait to lure fish!" },
      { name: "Yellow-crowned Night-Heron", season: "Spring–Fall", when: "Apr–Sep", status: "Summer resident", emoji: "🐦", notes: "Nocturnal heron that feeds heavily on crabs and crayfish. Listen for its croaking call at dusk along the tidal creeks." },
      { name: "Black-crowned Night-Heron", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Stocky, short-necked heron. Active at dawn and dusk. Often roosts in waterside trees during the day." },
      { name: "American Bittern", season: "Migration/Winter", when: "Sep–Apr", status: "Migrant/winter visitor", emoji: "🐦", notes: "Secretive marsh bird. When alarmed, stretches its neck straight up to blend with reeds. Heard more than seen — listen for the deep 'pump-er-lunk' call." },
    ]
  },
  // ── WATERFOWL ──
  {
    category: "🦆 Waterfowl",
    species: [
      { name: "Canada Goose", season: "Year-Round", when: "All year", status: "Resident", emoji: "🦆", notes: "Abundant year-round on the Potomac. Large flocks form in fall and winter." },
      { name: "Tundra Swan", season: "Winter", when: "Nov–Mar", status: "Winter visitor", emoji: "🦢", notes: "Magnificent large white swan. Thousands winter on the Potomac — a spectacular sight. Listen for the musical, high-pitched calls." },
      { name: "Wood Duck", season: "Year-Round", when: "All year", status: "Breeder", emoji: "🦆", notes: "One of the most colorful ducks in North America. Nests in tree cavities. Seen in wooded coves and tidal creeks." },
      { name: "Mallard", season: "Year-Round", when: "All year", status: "Resident", emoji: "🦆", notes: "Most familiar duck. Year-round resident. Large flocks gather on the beach and boardwalk area." },
      { name: "American Black Duck", season: "Fall–Spring", when: "Oct–Apr", status: "Winter visitor", emoji: "🦆", notes: "Looks like a dark female Mallard. Common on the river in colder months. Declining species — always worth noting." },
      { name: "Bufflehead", season: "Winter", when: "Nov–Mar", status: "Winter visitor", emoji: "🦆", notes: "Small, compact diving duck. White head patch on males is unmistakable. Common on the open river in winter." },
      { name: "Ruddy Duck", season: "Winter", when: "Oct–Apr", status: "Winter visitor", emoji: "🦆", notes: "Distinctive stiff-tailed duck. Males turn chestnut-red in spring before departing. Common on Monroe Bay in winter." },
      { name: "Hooded Merganser", season: "Fall–Spring", when: "Oct–Apr", status: "Winter visitor", emoji: "🦆", notes: "Small merganser with a spectacular fan-shaped crest on males. Seen in wooded coves and quieter waters." },
      { name: "Common Merganser", season: "Winter", when: "Nov–Mar", status: "Winter visitor", emoji: "🦆", notes: "Large diving duck. Often seen in big rafts on the open Potomac in winter." },
      { name: "Ring-necked Duck", season: "Winter", when: "Nov–Mar", status: "Winter visitor", emoji: "🦆", notes: "Despite the name, look for the white ring on the bill, not the neck. Common diving duck on the river." },
      { name: "Blue-winged Teal", season: "Migration", when: "Mar–May, Aug–Oct", status: "Migrant", emoji: "🦆", notes: "One of the earliest ducks to migrate south in fall. Look for the pale blue wing patch in flight." },
      { name: "Gadwall", season: "Fall–Spring", when: "Oct–Apr", status: "Winter visitor", emoji: "🦆", notes: "Subtle grey-brown duck — understated but handsome. Common on the river in winter." },
    ]
  },
  // ── SHOREBIRDS ──
  {
    category: "🐦 Shorebirds",
    species: [
      { name: "Spotted Sandpiper", season: "Spring–Fall", when: "Apr–Oct", status: "Breeder", emoji: "🐦", notes: "Most widespread shorebird on the Potomac. Constantly bobs its tail up and down. Nests along the beach and riverbank." },
      { name: "Killdeer", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Loud, boldly-patterned plover. Nests on gravel and open ground — watch your step! Famous for faking a broken wing to lure predators from the nest." },
      { name: "Semipalmated Sandpiper", season: "Migration", when: "Jul–Sep, Apr–May", status: "Migrant", emoji: "🐦", notes: "Small 'peep.' Passes through in large numbers during fall shorebird migration along mudflats." },
      { name: "Least Sandpiper", season: "Migration", when: "Jul–Sep, Apr–May", status: "Migrant", emoji: "🐦", notes: "Smallest sandpiper in the world. Yellowish legs distinguish it from other peeps. Migration brings good numbers." },
      { name: "Greater Yellowlegs", season: "Migration/Winter", when: "Aug–May", status: "Migrant/winter visitor", emoji: "🐦", notes: "Tall, long-legged sandpiper with bright yellow legs. Often heard before seen — loud, ringing call of 3–4 notes." },
      { name: "Lesser Yellowlegs", season: "Migration", when: "Jul–May", status: "Migrant", emoji: "🐦", notes: "Like Greater Yellowlegs but noticeably smaller. Often found together for easy comparison." },
      { name: "American Oystercatcher", season: "Spring–Fall", when: "Apr–Oct", status: "Visitor", emoji: "🐦", notes: "Unmistakable large shorebird with orange-red bill. Occasional visitor to CB's sandy shores and oyster reefs." },
    ]
  },
  // ── TERNS & GULLS ──
  {
    category: "🕊 Terns, Gulls & River Birds",
    species: [
      { name: "Caspian Tern", season: "Spring–Fall", when: "Apr–Oct", status: "Visitor", emoji: "🐦", notes: "World's largest tern — nearly gull-sized. Blood-red bill. Plunge-dives for fish on the Potomac. Often heard with a loud, harsh call." },
      { name: "Common Tern", season: "Spring–Fall", when: "May–Sep", status: "Visitor", emoji: "🐦", notes: "Graceful seabird with forked tail. Migrates through the Potomac in good numbers. Elegant in flight." },
      { name: "Forster's Tern", season: "Spring–Fall", when: "Apr–Oct", status: "Visitor", emoji: "🐦", notes: "Similar to Common Tern but more orange bill. Hovers over water before plunging for fish." },
      { name: "Laughing Gull", season: "Spring–Fall", when: "Apr–Oct", status: "Summer visitor", emoji: "🐦", notes: "Dark-headed gull in summer; white head with dark ear spot in winter. Named for its raucous laughing call." },
      { name: "Herring Gull", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Classic large gull. Year-round on the Potomac, most abundant in winter. Common on the beach and boardwalk." },
      { name: "Ring-billed Gull", season: "Fall–Spring", when: "Sep–Apr", status: "Winter visitor", emoji: "🐦", notes: "Medium-sized gull with a black ring around the yellow bill. Flocks gather on the beach in fall and winter." },
      { name: "Belted Kingfisher", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Heard before seen — machine-gun rattling call. Hovers then dives headfirst for fish. A true character of CB's waterways." },
      { name: "Double-crested Cormorant", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Often seen swimming low in the water or drying its wings on pilings and buoys. Huge numbers roost along the Potomac." },
    ]
  },
  // ── SONGBIRDS & OTHERS ──
  {
    category: "🎵 Songbirds & Woodland Birds",
    species: [
      { name: "Northern Cardinal", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Virginia's state bird. The brilliant red male is unmistakable. Common at feeders year-round." },
      { name: "Carolina Wren", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Surprisingly loud for such a tiny bird. One of the most common year-round residents. Bold and inquisitive." },
      { name: "Carolina Chickadee", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Fearless little bird. Common at feeders. Often the first bird to investigate a new feeder." },
      { name: "Blue Jay", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Bold, noisy, and beautiful. Year-round resident. Migrates in large flocks along the Potomac in fall." },
      { name: "Northern Mockingbird", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Sings day and night, especially in spring. Can mimic dozens of other bird species in a single song." },
      { name: "American Robin", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Familiar orange-breasted bird. Present year-round, but huge flocks arrive in late fall and winter." },
      { name: "Eastern Bluebird", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Brilliant blue and orange. Uses nest boxes. Common along open fields and woodland edges around CB." },
      { name: "Red-winged Blackbird", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Males' red shoulder patches are unmistakable. Nests in marsh reeds. Massive winter flocks along the Potomac." },
      { name: "Baltimore Oriole", season: "Spring–Fall", when: "May–Sep", status: "Summer breeder", emoji: "🐦", notes: "Stunning orange-and-black bird. Hangs woven nest from tree branch tips. Arrives with the blooming of oriole season." },
      { name: "Orchard Oriole", season: "Spring–Fall", when: "May–Aug", status: "Summer breeder", emoji: "🐦", notes: "Smaller than Baltimore Oriole; males are chestnut and black. Common along the Potomac riverbanks in summer." },
      { name: "Purple Martin", season: "Spring–Summer", when: "Mar–Aug", status: "Breeder", emoji: "🐦", notes: "Largest swallow in North America. Colonial nester — look for martin houses near the waterfront. Insect-eating machine." },
      { name: "Tree Swallow", season: "Spring–Fall", when: "Mar–Oct", status: "Breeder/migrant", emoji: "🐦", notes: "Iridescent blue-green above, white below. Huge flocks gather over the Potomac in fall migration — thousands swirl in murmurations." },
      { name: "Barn Swallow", season: "Spring–Fall", when: "Apr–Sep", status: "Breeder", emoji: "🐦", notes: "Deep forked tail is distinctive. Nests under bridges and boat docks. Acrobatic flier." },
      { name: "Yellow Warbler", season: "Spring–Summer", when: "May–Aug", status: "Breeder", emoji: "🐦", notes: "Bright yellow songbird. Nests in shrubs along waterways. One of the most common nesting warblers in CB's area." },
      { name: "Prothonotary Warbler", season: "Spring–Summer", when: "Apr–Aug", status: "Breeder", emoji: "🐦", notes: "Glowing golden-orange head. Nests in cavities over water. A star sighting in CB's tidal swamps — nicknamed 'the swamp canary.'" },
      { name: "Yellow-rumped Warbler", season: "Fall–Spring", when: "Oct–Apr", status: "Winter visitor", emoji: "🐦", notes: "Most abundant warbler in winter. Flocks in bayberry and wax myrtle. The distinctive yellow rump patch is easy to spot in flight." },
      { name: "Downy Woodpecker", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Smallest woodpecker. Common in any wooded area around CB. Frequently visits suet feeders." },
      { name: "Pileated Woodpecker", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Crow-sized woodpecker with blazing red crest — looks prehistoric. Digs large rectangular holes in dead trees." },
      { name: "Eastern Towhee", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Bold black, white, and rufous bird. Scratches loudly in leaf litter. Sings 'drink-your-teeeea.'" },
      { name: "American Goldfinch", season: "Year-Round", when: "All year", status: "Resident", emoji: "🐦", notes: "Brilliant yellow in summer, olive-drab in winter — same bird! Common at thistle feeders." },
      { name: "Indigo Bunting", season: "Spring–Fall", when: "May–Sep", status: "Summer breeder", emoji: "🐦", notes: "Males are an otherworldly electric blue. Common along woodland edges and brushy areas. Easy to hear singing from high perches." },
      { name: "Blue Grosbeak", season: "Spring–Fall", when: "May–Sep", status: "Summer breeder", emoji: "🐦", notes: "Deep blue with rusty wing bars. Similar to Indigo Bunting but larger with a massive bill. Found in shrubby fields." },
    ]
  },
];

// Residents data
const GROCERY = [
  { name: "Food Lion – Colonial Beach", address: "600 McKinney Blvd, Colonial Beach, VA", phone: "(804) 224-2064", hours: "Daily 7am–10pm" },
  { name: "Hall's Supermarket", address: "3895 James Monroe Hwy, Colonial Beach, VA", phone: "(804) 224-9310", hours: "Call for current hours", notes: "Local favorite! A true Colonial Beach institution. Don't miss the homemade strawberry shortcake — a legendary local treat.", highlight: "🍓 Famous for homemade strawberry shortcake!" },
  { name: "Dollar General", address: "45 Boundary St, Colonial Beach, VA", phone: "(804) 224-9090", hours: "Daily 8am–10pm" },
  { name: "King George IGA", address: "10062 Kings Hwy, King George, VA", phone: "(540) 775-2000", hours: "Daily 7am–9pm", notes: "~20 min drive, good local market" },
  { name: "Walmart Supercenter – King George", address: "16375 Merchant Lane, King George, VA 22485", phone: "(540) 413-3037", hours: "Daily 6am–11pm", notes: "~20 min drive. Full supercenter with grocery, pharmacy, garden center, and more." },
];

const CONTRACTORS = [
  { name: "Jared Hensley — Handyman", phone: "(540) 990-3130", services: "General handyman services, repairs, carpentry, painting, and more — trusted local go-to", featured: true },
  { name: "Hall's Design, Inc.", phone: null, services: "Custom design & build, renovations, home improvements, decks, additions — family owned and operated, turning your dreams and ideas into reality", featured: true, facebook: "https://www.facebook.com/hallsdesigninc" },
];

const ISP_LINKS = [
  { name: "Comcast / Xfinity", url: "https://xfinity.com", notes: "Cable internet, check availability at your address" },
  { name: "Verizon Home Internet", url: "https://verizon.com/home/internet", notes: "5G home internet available in select areas" },
  { name: "T-Mobile Home Internet", url: "https://t-mobile.com/home-internet", notes: "Fixed wireless, competitive pricing" },
  { name: "Starlink", url: "https://starlink.com", notes: "Satellite internet — great option for rural CB addresses" },
];

const REALESTATE_AGENTS = [
  { name: "Allen Griffey", company: "Blackwood Real Estate", phone: "(540) 379-9437", email: "allen@blackwoodrealestate.com", specialties: "Colonial Beach waterfront, vacation homes, investment properties", featured: true },
];

// ─── COLORS & BACKGROUNDS ────────────────────────────────────────────────────

const TAB_BACKGROUNDS = {
  restaurants: "linear-gradient(160deg, #0d4f6e 0%, #1a7a8a 40%, #c8860a 100%)",
  cafes:       "linear-gradient(160deg, #5c1a3a 0%, #a0305a 50%, #f7a8c4 100%)",
  shopping: "linear-gradient(160deg, #2d5a27 0%, #4a8c3f 50%, #f4d03f 100%)",
  golfcarts: "linear-gradient(160deg, #8B4513 0%, #d4850a 50%, #f9e4b7 100%)",
  thrift: "linear-gradient(160deg, #5b2d8e 0%, #9b59b6 50%, #f1948a 100%)",
  parking: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  lodging: "linear-gradient(160deg, #1b4f72 0%, #2980b9 60%, #7fb3d3 100%)",
  parks: "linear-gradient(160deg, #1a5276 0%, #117a65 50%, #a9dfbf 100%)",
  wineries: "linear-gradient(160deg, #6c2b6c 0%, #943399 50%, #d5a6c8 100%)",
  breweries: "linear-gradient(160deg, #5d4037 0%, #8d6e63 50%, #f5cba7 100%)",
  festivals: "linear-gradient(160deg, #7d1a1a 0%, #c0392b 50%, #f8c471 100%)",
  artists: "linear-gradient(160deg, #1c2833 0%, #2e4057 50%, #e8daef 100%)",
  weather: "linear-gradient(160deg, #1a3a5c 0%, #2471a3 50%, #aed6f1 100%)",
  tides: "linear-gradient(160deg, #0b3954 0%, #087e8b 50%, #bfd7ea 100%)",
  fishing: "linear-gradient(160deg, #0e3d57 0%, #1a6b8a 50%, #5dade2 100%)",
  kids: "linear-gradient(160deg, #1a5276 0%, #e74c3c 50%, #f9e79f 100%)",
  birds: "linear-gradient(160deg, #1a3c5e 0%, #2980b9 40%, #85c1e9 100%)",
  residents: "linear-gradient(160deg, #2c3e50 0%, #34495e 50%, #95a5a6 100%)",
  contact:   "linear-gradient(160deg, #0d3b5e 0%, #1a6b8a 50%, #5dade2 100%)",
  events:    "linear-gradient(160deg, #1a0533 0%, #4a1090 50%, #9b59b6 100%)",
  map:       "linear-gradient(160deg, #0a2e1a 0%, #1a5c34 50%, #2ecc71 100%)",
  history:   "linear-gradient(160deg, #3d1c02 0%, #7b4a1e 45%, #c9a87c 100%)",
  relax:     "linear-gradient(160deg, #1a3340 0%, #2e6b6b 50%, #a8d5d5 100%)",
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

// Bottom nav categories
const NAV_CATS = [
  { id: "eat",       label: "Eat & Drink", icon: "🍽", tabs: ["restaurants","cafes","breweries","wineries"] },
  { id: "do",        label: "Do",          icon: "🎯", tabs: ["events","festivals","history","artists","kids","relax","golfcarts"] },
  { id: "outdoors",  label: "Outdoors",    icon: "🌴", tabs: ["weather","tides","parks","fishing","birds"] },
  { id: "stay",      label: "Shop & Stay", icon: "🏡", tabs: ["lodging","parking","shopping","thrift"] },
  { id: "map",       label: "Map",         icon: "📍", tabs: ["map"] },
  { id: "residents", label: "Residents",   icon: "🏠", tabs: ["residents"] },
  { id: "contact",   label: "Contact",     icon: "✉️",  tabs: ["contact"] },
];

const MAIN_TABS = [
  { id: "restaurants", label: "🦀 Restaurants",    cat: "eat" },
  { id: "cafes",       label: "☕ Cafés",           cat: "eat" },
  { id: "breweries",   label: "🍺 Breweries",       cat: "eat" },
  { id: "wineries",    label: "🍷 Wineries",         cat: "eat" },
  { id: "events",      label: "📅 Events",          cat: "do" },
  { id: "festivals",   label: "🎉 All Festivals",   cat: "do" },
  { id: "history",     label: "🏛 History",          cat: "do" },
  { id: "artists",     label: "🎨 Artists",          cat: "do" },
  { id: "kids",        label: "👦 Kids",             cat: "do" },
  { id: "relax",       label: "💆 Relax & Spa",      cat: "do" },
  { id: "golfcarts",   label: "🛺 Golf Carts",       cat: "do" },
  { id: "weather",     label: "⛅ Weather",          cat: "outdoors" },
  { id: "tides",       label: "🌊 Tides",            cat: "outdoors" },
  { id: "parks",       label: "🌿 Parks",            cat: "outdoors" },
  { id: "fishing",     label: "🎣 Fishing",          cat: "outdoors" },
  { id: "birds",       label: "🦅 Birdwatching",     cat: "outdoors" },
  { id: "lodging",     label: "🏡 Lodging",          cat: "stay" },
  { id: "parking",     label: "🅿️ Parking",          cat: "stay" },
  { id: "shopping",    label: "🛍 Shopping",         cat: "stay" },
  { id: "thrift",      label: "♻️ Thrift Stores",    cat: "stay" },
  { id: "map",         label: "📍 Map",              cat: "map" },
  { id: "residents",   label: "🏠 Residents",        cat: "residents" },
  { id: "contact",     label: "✉️ Contact Us",        cat: "contact" },
];


const RESIDENT_TABS = [
  { id: "grocery", label: "🛒 Grocery Stores" },
  { id: "pharmacy", label: "💊 Pharmacies" },
  { id: "medical", label: "🏥 Medical Care" },
  { id: "vets", label: "🐾 Veterinarians" },
  { id: "police", label: "🚔 Police & Safety" },
  { id: "contractors", label: "🔧 Contractors" },
  { id: "isp", label: "📡 Internet Service" },
  { id: "realestate", label: "🏡 Real Estate" },
  { id: "dump", label: "🗑 Town Dump" },
  { id: "trash", label: "🚛 Trash Collection" },
  { id: "autorepair", label: "🔧 Auto Repair" },
  { id: "airbnbrules", label: "📋 Airbnb Rules" },
];

const HISTORY_SITES = [
  {
    name: "The Bell House",
    address: "821 Irving Ave, Colonial Beach, VA 22443",
    era: "1883 · Victorian / Stick Style",
    category: "In Town",
    desc: "A National Register of Historic Places landmark and Virginia Historic Landmark. Built in 1883 for Colonel J.O.P. Burnside (son of Civil War General Ambrose Burnside), the house was purchased by Alexander Melville Bell in 1886 as a summer retreat. His son, Alexander Graham Bell — inventor of the telephone — inherited it in 1907 and used it until 1918. Local legend holds that Bell flew experimental kites and 'flying machines' from the widow's walk balcony. The beautiful Victorian Stick Style structure still stands majestically on Irving Avenue.",
    hours: "Private residence — exterior viewing only from the street",
    fun: "Alexander Graham Bell experimented with kites here decades before the Wright Brothers' flight. He also gave land in Colonial Beach for an underprivileged children's home.",
    link: "https://www.cbhistoryandmuseum.org/post/the-bell-house-in-colonial-beach-virginia",
  },
  {
    name: "The Museum at Colonial Beach",
    address: "128 Hawthorn St, Colonial Beach, VA 22443",
    era: "Permanent & rotating exhibits",
    category: "In Town",
    desc: "Housed in one of Colonial Beach's oldest structures, the Museum features permanent and changing exhibits with personal collections, photos, and artifacts that tell the story of CB's colorful history — from Native American presence dating to 500 B.C. through the steamboat era, the Oyster Wars, and the legendary Potomac casino period of the 1940s–50s.",
    hours: "Check current hours — open Sat & Sun · Free admission",
    fun: "CB was once a major gambling destination, with casinos built on piers over the Maryland-controlled Potomac River — technically legal in Virginia because they sat on Maryland water!",
    link: "https://www.cbhistoryandmuseum.org",
  },
  {
    name: "James Monroe Birthplace & Boyhood Home",
    address: "4460 James Monroe Hwy, Colonial Beach, VA 22443",
    era: "1758 · 5th President of the United States",
    category: "Near Town",
    desc: "James Monroe was born here on April 28, 1758 — the 5th President of the United States and author of the Monroe Doctrine. The 74-acre park includes a reconstructed colonial-era farmhouse (built to original specifications), a Commemorative Timeline Walking Trail, canoe launch on Monroe Creek, and an 18th-century garden. The College of William & Mary uncovered the original foundation ruins in 1976. The park grounds are free and open to the public year-round.",
    hours: "Visitor Center & House Tours: Weekends Apr 1–Labor Day, 11am–4pm · Free · Park trails open daily",
    phone: "(804) 224-7485",
    fun: "Monroe is one of three of the first five U.S. Presidents born within a few miles of Colonial Beach. Washington, Jefferson, and Monroe all called this corner of Virginia home.",
    link: "https://www.monroefoundation.org",
  },
  {
    name: "George Washington Birthplace National Monument",
    address: "1732 Popes Creek Rd, Colonial Beach, VA 22443",
    era: "1732 · Birthplace of the 1st President",
    category: "Near Town (~20 min)",
    desc: "George Washington was born here on February 22, 1732, on his father's Popes Creek tobacco plantation. The National Park Service operates a working colonial farm with costumed interpreters recreating 18th-century plantation life. Visitors can tour the Memorial House (built 1931 near the original site), colonial kitchen, spinning shop, barn, and Washington family burial ground — which holds the graves of 32 Washington family members. A 15-minute film plays at the Visitor Center.",
    hours: "Daily 9:30am–5pm · $10 adults, children under 15 free",
    phone: "(804) 224-1732",
    fun: "The original house burned on Christmas Day 1779. Since no one knew exactly what it looked like, a 'Memorial House' was built in 1931 as a representative colonial-era home rather than an exact replica.",
    link: "https://www.nps.gov/gewa",
  },
  {
    name: "Stratford Hall",
    address: "483 Great House Rd, Stratford, VA 22558",
    era: "1730s · Lee Family Plantation",
    category: "~25 min drive",
    desc: "One of Virginia's most magnificent colonial plantations, built by Thomas Lee in the 1730s from bricks fired on the property. Stratford Hall was home to two signers of the Declaration of Independence — Richard Henry Lee and Francis Lightfoot Lee — and is the birthplace of Confederate General Robert E. Lee (born January 19, 1807). The estate features a stunning Great House, 7 nature trails with eagle viewing, a working mill, farm animals, and the famous Stratford Cliffs overlooking the Potomac River.",
    hours: "Daily 9:30am–5pm · Adults $15, children $8 · Special events year-round",
    phone: "(804) 493-8038",
    fun: "Visitors have found a 1,000-pound fossilized baleen whale skull in the Stratford Cliffs! The site also hosts an annual Wine & Oyster Festival and Thanksgiving Dinner that sells out every year.",
    link: "https://www.stratfordhall.org",
  },
  {
    name: "Westmoreland State Park — Fossil Beach",
    address: "1650 State Park Rd, Montross, VA 22520",
    era: "~10–15 million years old · Miocene Epoch",
    category: "~15 min drive",
    desc: "While primarily a state park, the fossil beach along the Potomac River cliffs is one of the most accessible fossil-hunting sites in the eastern U.S. Visitors regularly find shark teeth, whale bones, and other Miocene-era marine fossils eroding out of the 100-foot cliffs. The cliffs have yielded everything from individual teeth to the complete skull of a prehistoric sperm whale. Free to keep what you find!",
    hours: "Daily dawn to dusk · Park entry fee applies",
    phone: "(804) 493-8821",
    fun: "In 2013 visitors found a 1,000-pound baleen whale skull eroding from the cliffs. In 2022 a team uncovered a near-complete skeleton of an ancient whale. You might find a megalodon tooth on your next visit.",
    link: "https://www.dcr.virginia.gov/state-parks/westmoreland",
  },
  {
    name: "Caledon State Park — Bald Eagle History",
    address: "11617 Caledon Rd, King George, VA 22485",
    era: "Conservation landmark since 1974",
    category: "~20 min drive",
    desc: "Once a private estate belonging to the Hopewell family, Caledon became a state park in 1974 specifically to protect one of the largest concentrations of bald eagles on the East Coast. The park's old-growth forest and Potomac River frontage create ideal eagle nesting habitat. Guided eagle tours run June–August when eagles congregate to feed on spawning fish.",
    hours: "Daily 8am–dusk · Eagle tours Jun–Aug (register in advance)",
    phone: "(540) 663-3861",
    fun: "At peak times in summer, 60+ bald eagles have been counted in a single viewing session at Caledon. The park's old-growth forest includes trees over 300 years old — older than the United States.",
    link: "https://www.dcr.virginia.gov/state-parks/caledon",
  },
  {
    name: "Colonial Beach Historic Walking Tour",
    address: "Downtown Colonial Beach, VA",
    era: "1878–present",
    category: "In Town",
    desc: "Colonial Beach's downtown contains a remarkable collection of late 19th and early 20th century architecture. Self-guided walking tour highlights include Victorian-era homes, the original steamboat landing area, town murals depicting the casino era and watermen's life, the historic Dennison Street Inn (home of CB's first mayor), and the Colonial Beach Plaza (a 1900s Victorian mansion). The town's National Register historic district preserves over 100 years of Potomac River resort history.",
    hours: "Self-guided · Anytime · Brochures at the Chamber of Commerce · 106 Hawthorn St",
    fun: "At its peak in the early 1900s, steamboats brought thousands of visitors weekly from Washington D.C. to Colonial Beach's boardwalk hotels and amusements — earning it the nickname 'The Playground of the Potomac.'",
  },
  {
    name: "The Oyster Wars — Potomac River Heritage",
    address: "Colonial Beach & the Potomac River",
    era: "19th century – 1960s",
    category: "Local History",
    desc: "Colonial Beach was the epicenter of the century-long 'Potomac River Oyster Wars.' Because the 1632 Maryland charter granted Maryland ownership of the Potomac River all the way to the Virginia shoreline, Virginia watermen and Maryland officials engaged in decades of armed conflict over oyster harvesting rights. Virginia-commissioned 'Oyster Navy' patrol boats faced off against Maryland watermen in running battles. An anchor and cannon on the boardwalk area commemorate this unique chapter in American history.",
    hours: "Permanent outdoor exhibits on the boardwalk · Always accessible",
    fun: "The same legal quirk that drove the Oyster Wars also made the 1940s–50s Potomac River casinos legal — the piers extended over Maryland water, beyond Virginia's jurisdiction.",
  },
];

const RELAX_SPOTS = [
  {
    name: "Colonial Beach Massage",
    address: "222 Wilder Ave, Colonial Beach, VA 22443",
    phone: "(804) 410-2651",
    hours: "Mon–Fri 9am–7pm · Sat 10am–5pm · Sun 10am–2pm",
    services: ["Swedish Massage", "Deep Tissue", "Hot Stone Massage", "Facials", "Waxing", "Couples Massage", "Spa Parties"],
    desc: "Colonial Beach's premier day spa. Led by Patricia Johnson, CMT — a world-traveled therapist with 15+ years of experience including Indonesian-style and Eastern modalities. Yoga-certified. Waterfront-adjacent location perfect after a day at the beach.",
    highlight: "In Town",
    link: "https://colonialbeachmassage.com",
  },
  {
    name: "Massage & Bodyworks On The Water",
    address: "509 Colonial Ave, Colonial Beach, VA 22443",
    phone: "(540) 684-7536",
    hours: "Mon–Fri 9am–5pm · Sat 10am–7pm · Check website for current hours",
    services: ["Swedish Massage", "Peppermint Swedish", "Deep Tissue", "Hot Stone", "Lymphatic", "Prenatal", "Couples Massage", "Salt Chamber", "Facials & Waxing"],
    desc: "Nature-inspired spa next to the Eagles Aerie on Colonial Ave. Specializes in herb, oil, ocean, and earth-product therapies. Led by Patricia Johnson, CMT — world-traveled therapist with 15+ years of experience including Indonesian-style and Eastern modalities. Also serves Airbnb and vacation rental guests with in-home sessions.",
    highlight: "In Town",
    link: "https://massageandbodyworksonthewater.com",
    facebook: "https://www.facebook.com/p/Massage-and-Bodyworks-On-the-Water-100029060666684/",
  },
  {
    name: "Massage By Cecile LLC",
    address: "Serving Colonial Beach, Westmoreland & King George County, VA",
    phone: "Check Facebook",
    hours: "By appointment",
    services: ["Therapeutic Massage", "Mobile / In-Home Sessions", "Customized therapy for individual needs"],
    desc: "Virginia State Licensed massage therapist Cecile Watts serves Colonial Beach, Westmoreland, and King George County. Mobile therapy available — she comes to you, great for vacation rentals and Airbnb guests.",
    highlight: "Mobile — Comes to You",
    facebook: "https://www.facebook.com/cwmassage4yourhealth",
  },
  {
    name: "Wellness Within Massage & Bodywork",
    address: "Behind Mary Washington Urgent Care, King George, VA (~20 min)",
    phone: "Check Vagaro for booking",
    hours: "By appointment · Check booking site",
    services: ["Therapeutic Massage", "Contemporary Cupping", "Sunlighten Infrared Sauna", "Hot Stone with Warm Bamboo", "Mobile sessions"],
    desc: "Led by Licensed Massage Therapist Amy Lamb. Specializes in therapeutic touch for busy professionals and retirees — improving mobility and reducing physical stress. Offers Sunlighten Infrared Sauna sessions (great for detox and recovery) plus mobile therapy serving Fredericksburg, King George, and Colonial Beach.",
    highlight: "~20 min · Infrared Sauna",
    link: "https://www.vagaro.com/wellnesswithinmassageandbodywork",
  },
  {
    name: "DIY Relaxation — Colonial Beach Style",
    address: "Colonial Beach & Monroe Bay",
    hours: "Sunrise to sunset",
    services: ["Sunrise beach walk", "Kayaking Monroe Bay", "Waterfront yoga", "Hammock at Town Beach", "Sunset from the boardwalk"],
    desc: "Sometimes the best spa is free. Colonial Beach's calm Monroe Bay is perfect for a peaceful sunrise kayak. The Town Beach at dawn is nearly empty — walk the shoreline, feel the sand, and watch ospreys diving for fish. Several local yoga practitioners offer seasonal classes on the beach and at Colonial Beach Brewing.",
    highlight: "Free",
  },
];

// ─── SEARCH INDEX ─────────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  ...CAFES.map(c=>({tab:"cafes",label:c.name,sub:c.address})),
  ...RESTAURANTS.map(r=>({tab:"restaurants",label:r.name,sub:r.address})),
  ...SHOPPING.map(s=>({tab:"shopping",label:s.name,sub:s.desc.slice(0,55)})),
  ...GOLF_CARTS.map(g=>({tab:"golfcarts",label:g.name,sub:g.address})),
  ...THRIFT.map(t=>({tab:"thrift",label:t.name,sub:t.address})),
  ...PARKING.map(p=>({tab:"parking",label:p.name,sub:p.address})),
  ...LODGING.map(l=>({tab:"lodging",label:l.name,sub:l.address})),
  ...PARKS.map(p=>({tab:"parks",label:p.name,sub:p.address})),
  ...WINERIES.map(w=>({tab:"wineries",label:w.name,sub:w.address})),
  ...BREWERIES.map(b=>({tab:"breweries",label:b.name,sub:b.address})),
  ...FESTIVALS.map(f=>({tab:"festivals",label:f.name,sub:f.date})),
  ...ARTISTS.map(a=>({tab:"artists",label:a.name,sub:a.address})),
  ...CHARTER_BOATS.map(c=>({tab:"fishing",label:c.name,sub:c.address})),
  ...KID_ACTIVITIES.map(k=>({tab:"kids",label:k.name,sub:k.desc.slice(0,55)})),
  ...LOCAL_BIRDS.flatMap(cat=>cat.species.map(b=>({tab:"birds",label:b.name,sub:b.when}))),
  ...HISTORY_SITES.map(h=>({tab:"history",label:h.name,sub:h.address})),
  ...RELAX_SPOTS.map(r=>({tab:"relax",label:r.name,sub:r.address})),
  ...GROCERY.map(g=>({tab:"residents",label:g.name,sub:g.address})),
];

function GlobalSearch({ onNavigate, onClose }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const TAB_LBL = {restaurants:"🦀 Restaurants",shopping:"🛍 Shopping",golfcarts:"🛺 Golf Carts",thrift:"♻️ Thrift",parking:"🅿️ Parking",lodging:"🏡 Lodging",parks:"🌿 Parks",history:"🏛 History",relax:"💆 Relax",wineries:"🍷 Wineries",breweries:"🍺 Breweries",festivals:"🎉 Festivals",artists:"🎨 Artists",charter:"🎣 Charter",kids:"👦 Kids",birds:"🦅 Birds",residents:"🏠 Residents",contact:"✉️ Contact"};
  const results = q.length > 1 ? SEARCH_INDEX.filter(it => it.label.toLowerCase().includes(q.toLowerCase()) || (it.sub||"").toLowerCase().includes(q.toLowerCase())).slice(0,12) : [];
  return (
    <div role="dialog" aria-label="Search" style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",backdropFilter:"blur(14px)",padding:"56px 16px 16px",overflowY:"auto"}}>
      <button onClick={onClose} aria-label="Close search" style={{position:"absolute",top:14,right:14,background:"none",border:"none",color:"#fff",fontSize:28,cursor:"pointer",lineHeight:1}}>✕</button>
      <div style={{fontFamily:"'Playfair Display',Georgia,serif",color:"#fff",fontSize:20,fontWeight:700,marginBottom:14,textAlign:"center"}}>🔍 Search Colonial Beach</div>
      <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Restaurants, birds, events, pharmacies…" aria-label="Search all app content"
        style={{width:"100%",padding:"11px 15px",borderRadius:12,border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:16,outline:"none",boxSizing:"border-box"}} />
      {q.length>1&&results.length===0&&<div style={{color:"rgba(255,255,255,0.5)",marginTop:18,textAlign:"center"}}>No results for "{q}"</div>}
      {results.map((r,i)=>(
        <button key={i} onClick={()=>{onNavigate(r.tab);onClose();}}
          style={{width:"100%",textAlign:"left",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 13px",marginTop:7,cursor:"pointer",color:"#fff"}}>
          <div style={{fontWeight:600,fontSize:14}}>{r.label}</div>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,marginTop:2}}>{TAB_LBL[r.tab]||r.tab}{r.sub?` · ${r.sub}`:""}</div>
        </button>
      ))}
    </div>
  );
}

function BirdsTab({ userBirdPins, setUserBirdPins }) {
  const [birdView, setBirdView] = useState("map");

  // Load persisted community pins on mount
  useEffect(() => {
    try {
      window.storage?.get("bird_pins", true).then(r => {
        if (r?.value) setUserBirdPins(JSON.parse(r.value));
      }).catch(() => {});
    } catch(e) {}
  }, []);

  return (
    <div>
      <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 10 }}>🦅 Birdwatching</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["map", "🗺 Nest Map"], ["guide", "📖 Species Guide"], ["tips", "🔭 Viewing Tips"]].map(([id, label]) => (
          <button key={id} onClick={() => setBirdView(id)} style={{
            flex: 1, background: birdView === id ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)",
            border: `1px solid ${birdView === id ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
            color: "#fff", borderRadius: 10, padding: "8px 4px",
            cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif",
            fontWeight: birdView === id ? 700 : 400,
          }}>{label}</button>
        ))}
      </div>

      {birdView === "map" && (
        <>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 14 }}>
            Track osprey and bald eagle nests — pin your own sightings to share with the community!
          </div>
          <BirdMap spots={BIRD_SPOTS} userPins={userBirdPins} onAddPin={(pin) => setUserBirdPins(prev => [...prev, pin])} />
        </>
      )}

      {birdView === "guide" && (
        <>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>
            <strong style={{ color: "#fff" }}>70+ species</strong> recorded in the Colonial Beach / Potomac River area. Tap any bird for field notes.
          </div>
          <BirdGuide />
        </>
      )}

      {birdView === "tips" && (
        <div>
          <Card>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>🔭 Best Viewing Tips</div>
            {[
              ["🌅", "Dawn & dusk", "Peak activity for raptors and herons. Osprey and eagles hunt most actively in the first 2 hours of daylight."],
              ["🌊", "Watch the tide", "Low tide exposes fish in the shallows — eagles and osprey hunt hard. Shorebirds feed on exposed mudflats."],
              ["🍂", "Fall migration", "September–November brings hundreds of eagles through the area, plus massive swallow and warbler flights along the river."],
              ["❄️", "Winter waterfowl", "November–March brings Tundra Swans, Buffleheads, Mergansers, and Ruddy Ducks to the Potomac in large numbers."],
              ["🌸", "Spring songbirds", "May is the peak of warbler migration — dozens of species move through the riverside trees overnight."],
              ["📷", "Gear up", "10x42 binoculars recommended for river watching. A spotting scope helps for distant ducks and eagles."],
              ["🤫", "Nest etiquette", "Stay quiet and 100+ feet from active nests. Never fly drones near nesting ospreys or eagles — it's illegal and harmful."],
              ["📍", "Best local spots", "Monroe Bay at dawn, the Boardwalk osprey platform, Caledon State Park for eagles, and Westmoreland State Park's Potomac bluffs."],
              ["📱", "Use eBird", "The free Cornell Lab eBird app shows real-time sightings from other birders in the area. Search 'Colonial Beach' or 'Caledon' for recent reports."],
            ].map(([icon, title, desc], i) => (
              <div key={i} style={{ borderBottom: i < 8 ? "1px solid rgba(255,255,255,0.08)" : "none", paddingBottom: 10, marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, lineHeight: 1.3 }}>{icon}</span>
                  <div>
                    <div style={{ color: "#f9ca24", fontWeight: 700, fontSize: 13 }}>{title}</div>
                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 8 }}>🏆 Target Species by Season</div>
            {[
              ["Spring (Mar–May)", "#6ab04c", "Ospreys return 🐦 · Prothonotary Warblers · Purple Martins · Baltimore Orioles · Warbler migration peak"],
              ["Summer (Jun–Aug)", "#f9ca24", "Nesting Ospreys & Eagles · Great Blue Herons · Yellow-crowned Night-Herons · All swallow species · Terns"],
              ["Fall (Sep–Nov)", "#f0a500", "Eagle numbers build · Massive swallow flocks · Warbler & shorebird migration · Tundra Swans arrive"],
              ["Winter (Dec–Feb)", "#82b1ff", "Bald Eagle peak at Caledon · Tundra Swans · Diving ducks · Winter sparrow flocks · Yellow-rumped Warblers"],
            ].map(([season, color, birds]) => (
              <div key={season} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{season}</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.6 }}>{birds}</div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── BIRD GUIDE COMPONENT ────────────────────────────────────────────────────

const SEASON_COLORS = {
  "Year-Round":  { bg: "rgba(106,176,76,0.2)",  border: "#6ab04c", text: "#6ab04c" },
  "Spring–Fall": { bg: "rgba(93,173,226,0.2)",  border: "#5dade2", text: "#85c1e9" },
  "Spring–Summer": { bg: "rgba(249,202,36,0.18)", border: "#f9ca24", text: "#f9ca24" },
  "Summer":      { bg: "rgba(249,202,36,0.18)", border: "#f9ca24", text: "#f9ca24" },
  "Fall–Spring": { bg: "rgba(179,157,219,0.2)", border: "#b39ddb", text: "#b39ddb" },
  "Winter":      { bg: "rgba(130,177,255,0.2)", border: "#82b1ff", text: "#82b1ff" },
  "Migration":   { bg: "rgba(255,171,64,0.2)",  border: "#ffab40", text: "#ffab40" },
  "Migration/Winter": { bg: "rgba(255,171,64,0.2)", border: "#ffab40", text: "#ffab40" },
  "Fall–Spring": { bg: "rgba(179,157,219,0.2)", border: "#b39ddb", text: "#b39ddb" },
};

function SeasonBadge({ season }) {
  const colors = SEASON_COLORS[season] || { bg: "rgba(255,255,255,0.1)", border: "rgba(255,255,255,0.3)", text: "rgba(255,255,255,0.7)" };
  return (
    <span style={{
      background: colors.bg, border: `1px solid ${colors.border}`,
      color: colors.text, fontSize: 10, borderRadius: 8,
      padding: "2px 7px", whiteSpace: "nowrap", fontWeight: 600,
    }}>{season}</span>
  );
}

function BirdGuide() {
  const [openCategory, setOpenCategory] = useState(null);
  const [openBird, setOpenBird] = useState(null);
  const [filterSeason, setFilterSeason] = useState("All");

  const seasons = ["All", "Year-Round", "Spring–Fall", "Winter", "Migration", "Summer"];

  const filteredData = LOCAL_BIRDS.map(cat => ({
    ...cat,
    species: filterSeason === "All"
      ? cat.species
      : cat.species.filter(b => b.season.includes(filterSeason) || (filterSeason === "Summer" && (b.season.includes("Spring–Summer") || b.season.includes("Summer")))),
  })).filter(cat => cat.species.length > 0);

  const totalCount = filteredData.reduce((sum, cat) => sum + cat.species.length, 0);

  return (
    <div style={{ marginTop: 8 }}>
      {/* Season filter */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 6 }}>Filter by season:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {seasons.map(s => (
            <button key={s} onClick={() => { setFilterSeason(s); setOpenCategory(null); setOpenBird(null); }} style={{
              background: filterSeason === s ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${filterSeason === s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
              color: "#fff", borderRadius: 16, padding: "5px 12px",
              cursor: "pointer", fontSize: 11, fontFamily: "Georgia, serif",
              fontWeight: filterSeason === s ? 700 : 400,
            }}>{s}</button>
          ))}
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 6 }}>
          Showing {totalCount} species
        </div>
      </div>

      {/* Season legend */}
      <Card style={{ padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Season Key</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            ["Year-Round", "Resident all year"],
            ["Spring–Fall", "Breeding season visitor"],
            ["Winter", "Winter visitor only"],
            ["Migration", "Passes through spring & fall"],
            ["Summer", "Summer breeder"],
            ["Fall–Spring", "Arrives in fall, leaves in spring"],
          ].map(([s, desc]) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 5, minWidth: "45%" }}>
              <SeasonBadge season={s} />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>{desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Bird categories */}
      {filteredData.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 8 }}>
          <button onClick={() => setOpenCategory(openCategory === ci ? null : ci)} style={{
            width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12, padding: "12px 16px", cursor: "pointer", display: "flex",
            justifyContent: "space-between", alignItems: "center", marginBottom: openCategory === ci ? 6 : 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "Georgia, serif" }}>{cat.category}</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
              {cat.species.length} species {openCategory === ci ? "▲" : "▼"}
            </span>
          </button>

          {openCategory === ci && (
            <div style={{ paddingLeft: 4 }}>
              {cat.species.map((bird, bi) => {
                const key = `${ci}-${bi}`;
                return (
                  <div key={bi} style={{
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 6,
                    cursor: "pointer",
                  }} onClick={() => setOpenBird(openBird === key ? null : key)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                        <span style={{ fontSize: 18 }}>{bird.emoji}</span>
                        <div>
                          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{bird.name}</div>
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{bird.when}</div>
                        </div>
                      </div>
                      <SeasonBadge season={bird.season} />
                    </div>
                    {openBird === key && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>
                        {bird.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


// ─── SEASONAL ANIMATION SYSTEM ────────────────────────────────────────────────

const GolfCartSVG = () => (
  <svg aria-hidden="true" width="300" height="180" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gcRoof" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00c9b1"/>
        <stop offset="100%" stopColor="#008f7e"/>
      </linearGradient>
      <linearGradient id="gcBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="60%" stopColor="#eef4f7"/>
        <stop offset="100%" stopColor="#d4e4ec"/>
      </linearGradient>
      <linearGradient id="gcDash" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c8d8e0"/>
        <stop offset="100%" stopColor="#a8bcc8"/>
      </linearGradient>
      <linearGradient id="gcSeat" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2a5fa8"/>
        <stop offset="100%" stopColor="#1a3f78"/>
      </linearGradient>
      <linearGradient id="gcSeatBack" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1e4d90"/>
        <stop offset="100%" stopColor="#2a5fa8"/>
      </linearGradient>
      <radialGradient id="gcTire" cx="38%" cy="32%">
        <stop offset="0%" stopColor="#4a4a4a"/>
        <stop offset="45%" stopColor="#1c1c1c"/>
        <stop offset="100%" stopColor="#080808"/>
      </radialGradient>
      <radialGradient id="gcHub" cx="38%" cy="32%">
        <stop offset="0%" stopColor="#e8e8e8"/>
        <stop offset="70%" stopColor="#c0c0c0"/>
        <stop offset="100%" stopColor="#909090"/>
      </radialGradient>
      <radialGradient id="gcShadow" cx="50%" cy="30%">
        <stop offset="0%" stopColor="rgba(0,0,0,0.35)"/>
        <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
      </radialGradient>
      <linearGradient id="gcFlag" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff6b6b"/>
        <stop offset="100%" stopColor="#ffd93d"/>
      </linearGradient>
      <linearGradient id="gcWind" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(180,230,255,0.55)"/>
        <stop offset="100%" stopColor="rgba(140,200,240,0.25)"/>
      </linearGradient>
      <linearGradient id="gcChrome" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e8e8e8"/>
        <stop offset="50%" stopColor="#b8b8b8"/>
        <stop offset="100%" stopColor="#888"/>
      </linearGradient>
    </defs>

    {/* ── GROUND SHADOW ── */}
    <ellipse cx="152" cy="168" rx="118" ry="9" fill="url(#gcShadow)"/>

    {/* ── REAR WHEEL ── */}
    <circle cx="72" cy="138" r="30" fill="url(#gcTire)"/>
    {/* Tire tread */}
    {[0,36,72,108,144,180,216,252,288,324].map((a,i) => {
      const r1=28, r2=30, rad=a*Math.PI/180;
      return <line key={i} x1={72+r1*Math.cos(rad)} y1={138+r1*Math.sin(rad)} x2={72+r2*Math.cos(rad)} y2={138+r2*Math.sin(rad)} stroke="#333" strokeWidth="2.5"/>;
    })}
    <circle cx="72" cy="138" r="20" fill="#1a1a1a"/>
    {/* Spokes */}
    {[0,60,120,180,240,300].map((a,i) => {
      const rad=a*Math.PI/180;
      return <line key={i} x1={72+6*Math.cos(rad)} y1={138+6*Math.sin(rad)} x2={72+18*Math.cos(rad)} y2={138+18*Math.sin(rad)} stroke="#c8c8c8" strokeWidth="2.5" strokeLinecap="round"/>;
    })}
    <circle cx="72" cy="138" r="7" fill="url(#gcHub)" stroke="#999" strokeWidth="1"/>
    <circle cx="72" cy="138" r="3" fill="#666"/>

    {/* ── FRONT WHEEL ── */}
    <circle cx="228" cy="138" r="30" fill="url(#gcTire)"/>
    {[0,36,72,108,144,180,216,252,288,324].map((a,i) => {
      const r1=28, r2=30, rad=a*Math.PI/180;
      return <line key={i} x1={228+r1*Math.cos(rad)} y1={138+r1*Math.sin(rad)} x2={228+r2*Math.cos(rad)} y2={138+r2*Math.sin(rad)} stroke="#333" strokeWidth="2.5"/>;
    })}
    <circle cx="228" cy="138" r="20" fill="#1a1a1a"/>
    {[0,60,120,180,240,300].map((a,i) => {
      const rad=a*Math.PI/180;
      return <line key={i} x1={228+6*Math.cos(rad)} y1={138+6*Math.sin(rad)} x2={228+18*Math.cos(rad)} y2={138+18*Math.sin(rad)} stroke="#c8c8c8" strokeWidth="2.5" strokeLinecap="round"/>;
    })}
    <circle cx="228" cy="138" r="7" fill="url(#gcHub)" stroke="#999" strokeWidth="1"/>
    <circle cx="228" cy="138" r="3" fill="#666"/>

    {/* ── CHASSIS / MAIN FRAME ── */}
    {/* Main longitudinal frame rail */}
    <rect x="55" y="122" width="188" height="10" rx="5" fill="#b0bec8"/>
    {/* Front axle area */}
    <rect x="208" y="116" width="28" height="14" rx="4" fill="#9aaab8"/>
    {/* Rear axle area */}
    <rect x="55" y="116" width="28" height="14" rx="4" fill="#9aaab8"/>
    {/* Under-body cross bracing */}
    <line x1="83" y1="122" x2="208" y2="122" stroke="#8a9aaa" strokeWidth="4"/>
    {/* Front footrest / step */}
    <rect x="190" y="114" width="48" height="7" rx="3" fill="#c0ccd4"/>

    {/* ── BODY PANELS ── */}
    {/* Main body — the curved front cowl + rear cargo area */}
    <path d="M 58,120 L 58,80 Q 58,72 66,70 L 170,68 Q 180,68 186,76 L 258,76 Q 264,76 264,84 L 264,120 Z" fill="url(#gcBody)"/>
    {/* Body side crease line */}
    <path d="M 66,88 Q 140,85 258,88" stroke="#c8d8e0" strokeWidth="1.5" fill="none"/>
    {/* Front fender curve */}
    <path d="M 228,108 Q 245,106 258,108 Q 265,112 264,120 L 240,120 Q 245,116 228,120Z" fill="#e8f0f4"/>
    {/* Rear fender */}
    <path d="M 58,108 Q 68,104 84,108 Q 88,114 84,120 L 60,120 Q 56,114 58,108Z" fill="#e8f0f4"/>

    {/* ── WINDSHIELD ── */}
    <path d="M 170,68 L 166,38 L 218,36 L 258,76 L 186,76 Z" fill="url(#gcWind)" stroke="rgba(160,210,240,0.5)" strokeWidth="1"/>
    {/* Windshield glare */}
    <path d="M 174,42 L 210,40 L 248,72 L 220,74 Z" fill="rgba(255,255,255,0.18)"/>
    {/* Windshield frame */}
    <path d="M 170,68 L 166,38 L 218,36 L 258,76" stroke="#009d8a" strokeWidth="3" fill="none" strokeLinecap="round"/>

    {/* ── DASHBOARD ── */}
    <path d="M 168,76 L 168,90 Q 168,96 174,96 L 264,96 Q 264,90 264,84 L 264,76 Z" fill="url(#gcDash)"/>
    {/* Steering wheel column */}
    <line x1="220" y1="96" x2="214" y2="116" stroke="#8a9aaa" strokeWidth="4" strokeLinecap="round"/>
    {/* Steering wheel */}
    <circle cx="212" cy="104" r="11" fill="none" stroke="#555" strokeWidth="3"/>
    <circle cx="212" cy="104" r="4" fill="#555"/>
    <line x1="212" y1="93" x2="212" y2="104" stroke="#555" strokeWidth="2.5"/>
    <line x1="203" y1="108" x2="212" y2="104" stroke="#555" strokeWidth="2.5"/>
    <line x1="221" y1="108" x2="212" y2="104" stroke="#555" strokeWidth="2.5"/>
    {/* Speedometer cluster */}
    <ellipse cx="244" cy="86" rx="8" ry="6" fill="#1a2a3a" stroke="#8a9aaa" strokeWidth="1"/>
    <ellipse cx="244" cy="86" rx="5" ry="4" fill="#00c9b1" opacity="0.4"/>

    {/* ── SEATS ── */}
    {/* Rear seat back */}
    <rect x="90" y="72" width="72" height="22" rx="6" fill="url(#gcSeatBack)"/>
    {/* Seat seam */}
    <line x1="126" y1="74" x2="126" y2="92" stroke="#1a3f78" strokeWidth="1.5" strokeDasharray="2,2"/>
    {/* Rear seat cushion */}
    <path d="M 86,94 L 86,108 Q 86,114 92,114 L 166,114 Q 172,114 172,108 L 172,94 Z" fill="url(#gcSeat)"/>
    {/* Seat cushion stitching */}
    <line x1="126" y1="95" x2="126" y2="113" stroke="#1a3f78" strokeWidth="1.5" strokeDasharray="2,2"/>
    {/* Front seat cushion (driver) */}
    <path d="M 172,96 L 172,108 Q 172,114 178,114 L 220,114 Q 226,114 226,108 L 226,96 Z" fill="url(#gcSeat)"/>

    {/* ── PASSENGERS ── */}
    {/* Rear passenger */}
    <circle cx="106" cy="64" r="11" fill="#f5c9a0"/>
    {/* Sunhat */}
    <ellipse cx="106" cy="56" rx="14" ry="4" fill="#ffd93d" stroke="#e0b800" strokeWidth="1"/>
    <path d="M 96,60 Q 106,52 116,60" fill="#ffd93d" stroke="#e0b800" strokeWidth="1"/>
    {/* Sunglasses */}
    <rect x="99" y="62" width="6" height="4" rx="1.5" fill="#1a1a2e" opacity="0.85"/>
    <rect x="107" y="62" width="6" height="4" rx="1.5" fill="#1a1a2e" opacity="0.85"/>
    <line x1="105" y1="64" x2="107" y2="64" stroke="#333" strokeWidth="1"/>
    {/* Waving arm */}
    <path d="M 98,72 Q 86,66 80,58" stroke="#f5c9a0" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <circle cx="79" cy="56" r="5" fill="#f5c9a0"/>
    {/* Body */}
    <rect x="97" y="74" width="18" height="20" rx="4" fill="#5b8fde"/>

    {/* Rear passenger 2 */}
    <circle cx="144" cy="64" r="11" fill="#f5d5b0"/>
    <path d="M 135,60 Q 144,50 153,60" fill="#8B4513"/>
    <rect x="137" y="62" width="6" height="4" rx="1.5" fill="#1a1a2e" opacity="0.85"/>
    <rect x="145" y="62" width="6" height="4" rx="1.5" fill="#1a1a2e" opacity="0.85"/>
    <line x1="143" y1="64" x2="145" y2="64" stroke="#333" strokeWidth="1"/>
    <rect x="135" y="74" width="18" height="20" rx="4" fill="#e74c3c"/>

    {/* ── DOG (front passenger seat, tongue out, ears flapping) ── */}
    {/* Dog body */}
    <ellipse cx="174" cy="102" rx="12" ry="9" fill="#c8860a"/>
    {/* Dog head */}
    <circle cx="174" cy="88" r="10" fill="#c8860a"/>
    {/* Dog snout */}
    <ellipse cx="174" cy="93" rx="6" ry="4" fill="#b07208"/>
    {/* Dog nose */}
    <ellipse cx="174" cy="90" rx="3" ry="2" fill="#1a1a1a"/>
    <circle cx="173" cy="89.5" r="0.8" fill="rgba(255,255,255,0.5)"/>
    {/* Dog eyes */}
    <circle cx="170" cy="85" r="3" fill="#1a1a1a"/>
    <circle cx="178" cy="85" r="3" fill="#1a1a1a"/>
    <circle cx="169.2" cy="84.2" r="1" fill="white"/>
    <circle cx="177.2" cy="84.2" r="1" fill="white"/>
    {/* Floppy ears — flapping back in the wind */}
    <path d="M 164,83 Q 156,78 153,88 Q 155,96 163,92 Q 166,88 164,83Z" fill="#a06008"/>
    <path d="M 184,83 Q 192,78 195,88 Q 193,96 185,92 Q 182,88 184,83Z" fill="#a06008"/>
    {/* Tongue lolling out happily */}
    <path d="M 170,95 Q 174,103 178,95" fill="#ff6b88" stroke="#e84466" strokeWidth="0.8"/>
    <path d="M 170,95 Q 174,100 178,95" fill="#ff8fa8"/>
    {/* Paws on the dashboard */}
    <ellipse cx="167" cy="112" rx="5" ry="4" fill="#b07208"/>
    <ellipse cx="181" cy="112" rx="5" ry="4" fill="#b07208"/>
    {/* Little claw marks */}
    <line x1="165" y1="115" x2="164" y2="117" stroke="#8B5e06" strokeWidth="1" strokeLinecap="round"/>
    <line x1="167" y1="116" x2="167" y2="118" stroke="#8B5e06" strokeWidth="1" strokeLinecap="round"/>
    <line x1="169" y1="115" x2="170" y2="117" stroke="#8B5e06" strokeWidth="1" strokeLinecap="round"/>
    <line x1="179" y1="115" x2="178" y2="117" stroke="#8B5e06" strokeWidth="1" strokeLinecap="round"/>
    <line x1="181" y1="116" x2="181" y2="118" stroke="#8B5e06" strokeWidth="1" strokeLinecap="round"/>
    <line x1="183" y1="115" x2="184" y2="117" stroke="#8B5e06" strokeWidth="1" strokeLinecap="round"/>
    {/* Dog collar */}
    <rect x="167" y="96" width="14" height="4" rx="2" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.8"/>
    <circle cx="174" cy="98" r="1.5" fill="#ffd700"/>

    {/* Driver */}
    <circle cx="195" cy="68" r="10" fill="#f5c9a0"/>
    <path d="M 186,65 Q 195,56 204,65" fill="#4a2800"/>
    <rect x="188" y="66" width="5" height="4" rx="1.5" fill="#1a1a2e" opacity="0.9"/>
    <rect x="195" y="66" width="5" height="4" rx="1.5" fill="#1a1a2e" opacity="0.9"/>
    {/* Driver arm on wheel */}
    <path d="M 188,76 Q 200,80 206,90" stroke="#f5c9a0" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <rect x="186" y="74" width="14" height="18" rx="4" fill="#2ecc71"/>

    {/* ── ROOF POSTS ── */}
    <line x1="68" y1="70" x2="58" y2="26" stroke="#007f6e" strokeWidth="5" strokeLinecap="round"/>
    <line x1="166" y1="68" x2="164" y2="26" stroke="#007f6e" strokeWidth="5" strokeLinecap="round"/>
    {/* Rear roof cross brace */}
    <line x1="58" y1="40" x2="164" y2="36" stroke="#007f6e" strokeWidth="3"/>

    {/* ── ROOF / CANOPY ── */}
    <path d="M 44,26 Q 112,14 174,24 L 174,36 Q 112,26 44,38 Z" fill="url(#gcRoof)"/>
    {/* Roof stripe */}
    <path d="M 44,29 Q 112,18 174,27 L 174,31 Q 112,22 44,33 Z" fill="rgba(255,255,255,0.25)"/>
    {/* Roof scalloped fringe */}
    <path d="M44,38 Q49,46 54,38 Q59,46 64,38 Q69,46 74,38 Q79,46 84,38 Q89,46 94,38 Q99,46 104,38 Q109,46 114,38 Q119,46 124,38 Q129,46 134,38 Q139,46 144,37 Q149,45 154,37 Q159,45 164,37 Q169,44 174,37" fill="#00c9b1" stroke="#008f7e" strokeWidth="0.8"/>

    {/* ── FLAG ── */}
    <line x1="58" y1="26" x2="58" y2="8" stroke="#007f6e" strokeWidth="2.5"/>
    <path d="M 58,8 L 58,22 L 78,15 Z" fill="url(#gcFlag)"/>

    {/* ── HEADLIGHT (front) ── */}
    <ellipse cx="263" cy="94" rx="7" ry="5" fill="#fffde0" stroke="#d4c040" strokeWidth="1.5"/>
    <ellipse cx="263" cy="94" rx="4" ry="3" fill="#fffacc"/>
    {/* Headlight beams */}
    <line x1="269" y1="90" x2="288" y2="84" stroke="rgba(255,250,180,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="270" y1="94" x2="291" y2="94" stroke="rgba(255,250,180,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="269" y1="98" x2="288" y2="104" stroke="rgba(255,250,180,0.4)" strokeWidth="1.5" strokeLinecap="round"/>

    {/* ── TAIL LIGHT ── */}
    <ellipse cx="59" cy="98" rx="6" ry="4.5" fill="#ff3333" stroke="#bb1111" strokeWidth="1"/>

    {/* ── BUMPERS ── */}
    <path d="M 258,116 Q 272,116 274,122 L 274,128 Q 272,132 258,132" fill="none" stroke="url(#gcChrome)" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M 64,116 Q 50,116 48,122 L 48,128 Q 50,132 64,132" fill="none" stroke="url(#gcChrome)" strokeWidth="3.5" strokeLinecap="round"/>

    {/* ── COLONIAL BEACH LETTERING ── */}
    <text x="100" y="106" fontFamily="Georgia, serif" fontSize="10" fontWeight="700" fill="#009d8a" opacity="0.85" letterSpacing="0.5">COLONIAL BEACH</text>
  </svg>
);

function getCurrentTheme() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day   = now.getDate();
  const md    = month * 100 + day;

  // New Year wraps Dec 30 – Jan 3
  if (md >= 1230 || md <= 103) return { id:"newyears" };

  // 2nd Friday of any month → Art Walk
  const dayOfWeek = now.getDay();
  if (dayOfWeek === 5) {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const firstFriday = 1 + ((5 - firstDay + 7) % 7);
    if (day === firstFriday + 7) return { id:"artfriday" };
  }

  const ranges = [
    { id:"valentines",   start: 212, end: 215 },
    { id:"stpatrick",    start: 315, end: 318 },
    { id:"easter",       start: 418, end: 422 },
    { id:"osprey",       start: 410, end: 420 },
    { id:"riverFestival",start: 611, end: 617 },
    { id:"july4",        start: 702, end: 706 },
    { id:"waterfest",    start: 814, end: 819 },
    { id:"beachmusic",   start: 911, end: 916 },
    { id:"crabderby",    start: 830, end: 905 },
    { id:"halloween",    start:1028, end:1031 },
    { id:"thanksgiving", start:1127, end:1130 },
    { id:"bikefest",     start:1007, end:1014 },
    { id:"christmas",    start:1222, end:1226 },
  ];

  return ranges.find(r => md >= r.start && md <= r.end) || null;
}

const OspreySVG2 = () => (
  <svg aria-hidden="true" width="240" height="120" viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wU2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3d2510"/><stop offset="40%" stopColor="#5a3618"/><stop offset="100%" stopColor="#4a2e12"/></linearGradient>
      <linearGradient id="bG2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#3a2210"/><stop offset="45%" stopColor="#5a3618"/><stop offset="100%" stopColor="#f2ede2"/></linearGradient>
      <radialGradient id="eI2" cx="40%" cy="35%"><stop offset="0%" stopColor="#f0c040"/><stop offset="60%" stopColor="#d4a020"/><stop offset="100%" stopColor="#a07010"/></radialGradient>
    </defs>
    <path d="M155,72 C140,65 110,55 80,44 C55,36 28,30 8,28 C4,28 2,30 4,33 C18,38 44,46 65,54 C88,63 118,74 140,80 C148,83 156,80 155,72Z" fill="url(#wU2)"/>
    <path d="M65,54 C52,66 38,80 22,92 C28,86 40,74 52,62Z" fill="#2e1a08"/>
    <path d="M72,58 C60,72 48,88 34,102 C40,94 52,80 62,66Z" fill="#2e1a08"/>
    <path d="M80,62 C70,78 60,95 48,110 C54,100 64,85 74,70Z" fill="#321c09"/>
    <path d="M88,66 C80,83 72,100 62,116 C68,105 76,89 84,73Z" fill="#321c09"/>
    <path d="M96,70 C90,87 84,105 76,120 C80,110 88,93 94,76Z" fill="#3a2010"/>
    <ellipse cx="108" cy="68" rx="14" ry="8" fill="#1e1008" transform="rotate(-20 108 68)" opacity="0.85"/>
    <path d="M165,72 C180,65 210,55 240,44 C265,36 292,30 312,28 C316,28 318,30 316,33 C302,38 276,46 255,54 C232,63 202,74 180,80 C172,83 164,80 165,72Z" fill="url(#wU2)"/>
    <path d="M255,54 C268,66 282,80 298,92 C292,86 280,74 268,62Z" fill="#2e1a08"/>
    <path d="M248,58 C260,72 272,88 286,102 C280,94 268,80 258,66Z" fill="#2e1a08"/>
    <path d="M240,62 C250,78 260,95 272,110 C266,100 256,85 246,70Z" fill="#321c09"/>
    <path d="M232,66 C240,83 248,100 258,116 C252,105 244,89 236,73Z" fill="#3a2010"/>
    <ellipse cx="212" cy="68" rx="14" ry="8" fill="#1e1008" transform="rotate(20 212 68)" opacity="0.85"/>
    <path d="M148,58 C148,52 150,46 154,42 C157,39 163,37 160,37 C165,37 167,39 166,42 C170,46 172,52 172,58 C172,68 170,76 165,80 C162,82 158,82 155,80 C150,76 148,68 148,58Z" fill="url(#bG2)"/>
    <path d="M152,78 C154,82 155,88 155,95 L153,105 C155,108 160,110 165,108 L167,105 L165,95 C165,88 166,82 168,78 C164,82 160,83 156,82 C154,81 152,80 152,78Z" fill="#5a3618"/>
    <path d="M148,42 C148,34 150,27 154,23 C156,21 159,20 162,20 C165,20 168,21 170,23 C174,27 176,34 176,42 C176,48 174,52 170,54 C167,56 163,57 160,57 C157,57 153,56 150,54 C146,52 148,48 148,42Z" fill="#f0ede4"/>
    <path d="M148,38 C150,34 155,32 160,31 C165,32 170,34 172,38 C170,36 165,35 160,35 C155,35 150,36 148,38Z" fill="#2a1808" opacity="0.9"/>
    <path d="M152,40 C150,39 148,39 146,40 C144,41 143,43 144,45 C146,44 148,43 150,42Z" fill="#1e1008"/>
    <path d="M168,40 C170,39 172,39 174,40 C176,41 177,43 176,45 C174,44 172,43 170,42Z" fill="#1e1008"/>
    <circle cx="157" cy="41" r="5.5" fill="#d4a830"/>
    <circle cx="157" cy="41" r="4.5" fill="url(#eI2)"/>
    <circle cx="157" cy="41" r="2.8" fill="#0a0a0a"/>
    <circle cx="155.5" cy="39.5" r="1.1" fill="rgba(255,255,255,0.75)"/>
    <path d="M148,44 C144,44 140,46 138,49 C137,51 138,53 140,54 C142,56 144,55 145,53 C146,51 147,49 148,47Z" fill="#4a5060"/>
    <path d="M157,80 C156,86 155,90 154,94" stroke="#c8b070" strokeWidth="3" strokeLinecap="round"/>
    <path d="M163,80 C164,86 165,90 166,94" stroke="#c8b070" strokeWidth="3" strokeLinecap="round"/>
    <path d="M154,94 C150,104 144,106 138,108 C134,109 132,108 132,106" stroke="#b8a050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M158,100 C158,108 158,114 158,118 C158,120 156,121 155,120" stroke="#b8a050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M164,100 C170,104 176,106 182,108 C186,109 188,108 188,106" stroke="#b8a050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M132,106 C130,104 129,102 130,100" stroke="#1e1a10" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

const HarleySVG = () => (
  <svg aria-hidden="true" width="280" height="160" viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hTank" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ff6600"/><stop offset="50%" stopColor="#cc4400"/><stop offset="100%" stopColor="#991100"/></linearGradient>
      <linearGradient id="hChr" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f0f0f0"/><stop offset="50%" stopColor="#c0c0c0"/><stop offset="100%" stopColor="#808080"/></linearGradient>
      <radialGradient id="hWhl" cx="40%" cy="35%"><stop offset="0%" stopColor="#444"/><stop offset="70%" stopColor="#1a1a1a"/><stop offset="100%" stopColor="#000"/></radialGradient>
      <radialGradient id="hHub" cx="40%" cy="35%"><stop offset="0%" stopColor="#e8e8e8"/><stop offset="100%" stopColor="#aaa"/></radialGradient>
    </defs>
    <ellipse cx="140" cy="150" rx="110" ry="8" fill="rgba(0,0,0,0.2)"/>
    <circle cx="55" cy="120" r="32" fill="url(#hWhl)"/>
    <circle cx="55" cy="120" r="22" fill="#222"/>
    {[0,30,60,90,120,150].map(a=><line key={a} x1={55+23*Math.cos(a*Math.PI/180)} y1={120+23*Math.sin(a*Math.PI/180)} x2={55+31*Math.cos(a*Math.PI/180)} y2={120+31*Math.sin(a*Math.PI/180)} stroke="#333" strokeWidth="3"/>)}
    <circle cx="55" cy="120" r="10" fill="url(#hHub)"/>
    <circle cx="220" cy="120" r="30" fill="url(#hWhl)"/>
    <circle cx="220" cy="120" r="20" fill="#222"/>
    {[0,30,60,90,120,150].map(a=><line key={a} x1={220+21*Math.cos(a*Math.PI/180)} y1={120+21*Math.sin(a*Math.PI/180)} x2={220+29*Math.cos(a*Math.PI/180)} y2={120+29*Math.sin(a*Math.PI/180)} stroke="#333" strokeWidth="3"/>)}
    <circle cx="220" cy="120" r="9" fill="url(#hHub)"/>
    <path d="M55,88 L80,72 L150,68 L210,75 L220,90" stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M80,72 L90,120" stroke="#444" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M150,68 L145,120" stroke="#444" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M210,75 L215,120" stroke="#444" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M80,105 Q50,108 25,116" stroke="url(#hChr)" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M80,113 Q50,118 22,128" stroke="url(#hChr)" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M22,116 Q14,116 10,120" stroke="rgba(255,180,60,0.3)" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M100,58 Q130,48 165,55 Q170,60 165,75 Q130,80 100,73 Z" fill="url(#hTank)"/>
    <text x="118" y="69" fontFamily="Arial Black,sans-serif" fontSize="10" fontWeight="900" fill="#ffd700" opacity="0.9">H-D</text>
    <path d="M110,75 L115,105 L130,105 L130,75Z" fill="#555"/>
    <path d="M130,75 L128,105 L143,105 L145,75Z" fill="#666"/>
    <ellipse cx="112" cy="75" rx="8" ry="5" fill="#777"/>
    <ellipse cx="137" cy="75" rx="8" ry="5" fill="#888"/>
    <path d="M55,88 Q45,90 42,98 Q52,94 70,92Z" fill="#cc4400"/>
    <path d="M195,80 Q218,70 230,80 Q222,88 210,90Z" fill="#cc4400"/>
    <path d="M195,68 L195,50 L210,48 L215,52" stroke="url(#hChr)" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M195,68 L195,50 L180,48 L175,52" stroke="url(#hChr)" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M95,68 Q130,60 160,65 Q155,78 120,80 Q95,78 95,68Z" fill="#1a1a1a"/>
    <rect x="115" y="30" width="28" height="40" rx="5" fill="#1a1a1a"/>
    <line x1="129" y1="32" x2="129" y2="68" stroke="#333" strokeWidth="1.5"/>
    <rect x="118" y="34" width="8" height="5" rx="1" fill="#ff6600" opacity="0.7"/>
    <circle cx="129" cy="22" r="16" fill="#1a1a1a"/>
    <path d="M114,20 Q129,10 144,20" fill="#ff6600" stroke="#cc4400" strokeWidth="1"/>
    <path d="M115,22 Q129,18 143,22 Q140,28 129,29 Q118,28 115,22Z" fill="rgba(100,180,255,0.5)" stroke="#333" strokeWidth="1"/>
    <path d="M115,45 Q100,40 92,38" stroke="#1a1a1a" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M143,45 Q158,40 175,44" stroke="#1a1a1a" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <rect x="110" y="68" width="12" height="8" rx="3" fill="#111"/>
    <rect x="135" y="68" width="12" height="8" rx="3" fill="#111"/>
    <circle cx="238" cy="100" r="10" fill="#fffbe8" stroke="#d4c060" strokeWidth="2"/>
    <circle cx="238" cy="100" r="6" fill="#fff8d0"/>
    <path d="M247,96 L264,88" stroke="rgba(255,248,200,0.5)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M248,100 L266,100" stroke="rgba(255,248,200,0.5)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M247,104 L264,112" stroke="rgba(255,248,200,0.5)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SantaSVG = () => (
  <svg aria-hidden="true" width="180" height="200" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <rect x="72" y="110" width="56" height="65" rx="10" fill="#cc2222"/>
    <rect x="72" y="110" width="56" height="8" rx="3" fill="#f0f0f0"/>
    <rect x="72" y="168" width="56" height="8" rx="3" fill="#f0f0f0"/>
    <rect x="72" y="148" width="56" height="10" rx="2" fill="#1a1a1a"/>
    <rect x="88" y="145" width="24" height="16" rx="2" fill="#ffd700"/>
    <rect x="92" y="149" width="16" height="8" rx="1" fill="#1a1a1a"/>
    <path d="M72,125 Q52,130 44,142" stroke="#cc2222" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <ellipse cx="40" cy="144" rx="10" ry="9" fill="#f5c9a0"/>
    <path d="M128,125 Q148,130 156,142" stroke="#cc2222" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <ellipse cx="160" cy="144" rx="10" ry="9" fill="#f5c9a0"/>
    <circle cx="100" cy="88" r="30" fill="#f5c9a0"/>
    <path d="M71,78 Q100,48 129,78 Q112,74 100,71 Q88,74 71,78Z" fill="#cc2222"/>
    <rect x="70" y="76" width="60" height="10" rx="4" fill="#f0f0f0"/>
    <circle cx="124" cy="50" r="8" fill="#f0f0f0"/>
    <circle cx="92" cy="90" r="4" fill="#1a1a1a"/>
    <circle cx="108" cy="90" r="4" fill="#1a1a1a"/>
    <circle cx="89" cy="97" r="6" fill="rgba(255,120,120,0.4)"/>
    <circle cx="111" cy="97" r="6" fill="rgba(255,120,120,0.4)"/>
    <ellipse cx="100" cy="97" rx="5" ry="4" fill="#e8a080"/>
    <path d="M90,104 Q100,112 110,104" stroke="#cc5533" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M73,98 Q71,118 76,132 Q83,140 100,141 Q117,140 124,132 Q129,118 127,98 Q116,106 100,108 Q84,106 73,98Z" fill="#f0f0f0"/>
    <rect x="78" y="176" width="18" height="22" rx="4" fill="#cc2222"/>
    <rect x="104" y="176" width="18" height="22" rx="4" fill="#cc2222"/>
    <rect x="74" y="192" width="22" height="12" rx="4" fill="#1a1a1a"/>
    <rect x="104" y="192" width="22" height="12" rx="4" fill="#1a1a1a"/>
    <ellipse cx="50" cy="140" rx="16" ry="12" fill="#8B4513"/>
    {[2,7,13,19,24].map(x=><circle key={x} cx={x+36} cy={134} r="3.5" fill="#ffd700"/>)}
    {[[18,50],[170,40],[188,100],[14,130]].map(([x,y],i)=>(
      <g key={i} opacity="0.7">
        <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="white" strokeWidth="1.5"/>
        <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="white" strokeWidth="1.5"/>
        <line x1={x-4} y1={y-4} x2={x+4} y2={y+4} stroke="white" strokeWidth="1.5"/>
        <line x1={x+4} y1={y-4} x2={x-4} y2={y+4} stroke="white" strokeWidth="1.5"/>
      </g>
    ))}
  </svg>
);

const LeprechaunSVG = () => (
  <svg aria-hidden="true" width="140" height="200" viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="110" width="70" height="65" rx="8" fill="#2d8a2d"/>
    <circle cx="80" cy="120" r="4" fill="#ffd700"/>
    <circle cx="80" cy="133" r="4" fill="#ffd700"/>
    <circle cx="80" cy="146" r="4" fill="#ffd700"/>
    <rect x="45" y="162" width="70" height="10" rx="3" fill="#1a1a1a"/>
    <rect x="65" y="160" width="30" height="14" rx="2" fill="#ffd700"/>
    <rect x="69" y="163" width="22" height="8" rx="1" fill="#1a1a1a"/>
    <path d="M45,125 Q25,135 18,148" stroke="#2d8a2d" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <ellipse cx="14" cy="150" rx="11" ry="10" fill="#f5c9a0"/>
    <ellipse cx="8" cy="163" rx="13" ry="9" fill="#1a1a1a"/>
    {[2,7,12,18].map(x=><circle key={x} cx={x} cy={154} r="3" fill="#ffd700"/>)}
    <path d="M115,125 Q138,135 144,145" stroke="#2d8a2d" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <ellipse cx="148" cy="147" rx="11" ry="10" fill="#f5c9a0"/>
    <circle cx="145" cy="138" r="6" fill="#2d8a2d"/>
    <circle cx="155" cy="134" r="6" fill="#2d8a2d"/>
    <circle cx="150" cy="128" r="6" fill="#2d8a2d"/>
    <line x1="150" y1="140" x2="150" y2="158" stroke="#2d8a2d" strokeWidth="3"/>
    <circle cx="80" cy="80" r="32" fill="#f5c9a0"/>
    <path d="M62,68 Q70,64 76,68" stroke="#cc4400" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M84,68 Q90,64 98,68" stroke="#cc4400" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <circle cx="70" cy="76" r="5" fill="#2d8a2d"/>
    <circle cx="90" cy="76" r="5" fill="#2d8a2d"/>
    <circle cx="68" cy="74" r="2" fill="#1a1a1a"/>
    <circle cx="88" cy="74" r="2" fill="#1a1a1a"/>
    <ellipse cx="80" cy="86" rx="7" ry="6" fill="#e8a080"/>
    <path d="M65,95 Q80,108 95,95" stroke="#cc5533" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M52,96 Q48,120 55,135 Q65,145 80,146 Q95,145 105,135 Q112,120 108,96 Q95,108 80,110 Q65,108 52,96Z" fill="#cc4400"/>
    <rect x="55" y="10" width="50" height="52" rx="4" fill="#2d8a2d"/>
    <rect x="40" y="56" width="80" height="10" rx="4" fill="#2d8a2d"/>
    <rect x="65" y="52" width="30" height="16" rx="3" fill="#ffd700"/>
    <rect x="71" y="56" width="18" height="8" rx="2" fill="#2d8a2d"/>
    <rect x="55" y="30" width="50" height="6" fill="#1a7a1a"/>
    <rect x="52" y="172" width="22" height="30" rx="5" fill="#2d8a2d"/>
    <rect x="86" y="172" width="22" height="30" rx="5" fill="#2d8a2d"/>
    <path d="M47,196 Q55,210 75,205 L70,196Z" fill="#1a1a1a"/>
    <rect x="53" y="200" width="12" height="7" rx="2" fill="#ffd700"/>
    <path d="M85,196 Q95,210 113,205 L108,196Z" fill="#1a1a1a"/>
    <rect x="92" y="200" width="12" height="7" rx="2" fill="#ffd700"/>
  </svg>
);

const CupidSVG = () => (
  <svg aria-hidden="true" width="180" height="180" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wPink" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="rgba(255,200,220,0.9)"/><stop offset="100%" stopColor="rgba(255,150,180,0.6)"/></linearGradient>
    </defs>
    <path d="M80,90 C50,70 20,60 10,80 C5,95 20,110 50,105 C65,102 75,96 80,90Z" fill="url(#wPink)" stroke="rgba(255,150,180,0.8)" strokeWidth="1.5"/>
    <path d="M80,90 C60,75 35,80 30,100 C28,115 45,120 60,115 C72,110 78,100 80,90Z" fill="url(#wPink)" stroke="rgba(255,150,180,0.8)" strokeWidth="1.5"/>
    <path d="M120,90 C150,70 180,60 190,80 C195,95 180,110 150,105 C135,102 125,96 120,90Z" fill="url(#wPink)" stroke="rgba(255,150,180,0.8)" strokeWidth="1.5"/>
    <path d="M120,90 C140,75 165,80 170,100 C172,115 155,120 140,115 C128,110 122,100 120,90Z" fill="url(#wPink)" stroke="rgba(255,150,180,0.8)" strokeWidth="1.5"/>
    <ellipse cx="100" cy="120" rx="28" ry="32" fill="#f5c9a0"/>
    <path d="M74,135 Q100,128 126,135 Q122,155 100,158 Q78,155 74,135Z" fill="#f0f0f0"/>
    <circle cx="100" cy="76" r="30" fill="#f5c9a0"/>
    <circle cx="82" cy="82" r="10" fill="rgba(255,180,180,0.4)"/>
    <circle cx="118" cy="82" r="10" fill="rgba(255,180,180,0.4)"/>
    <circle cx="90" cy="72" r="5" fill="#4a3020"/>
    <circle cx="110" cy="72" r="5" fill="#4a3020"/>
    <circle cx="88" cy="70" r="1.5" fill="white"/>
    <circle cx="108" cy="70" r="1.5" fill="white"/>
    <path d="M88,86 Q100,96 112,86" stroke="#cc6644" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="100" cy="82" rx="4" ry="3" fill="#e8a080"/>
    <path d="M72,64 Q75,48 88,44 Q100,40 112,44 Q125,48 128,64" fill="#ffd700" stroke="#d4a800" strokeWidth="1"/>
    <circle cx="76" cy="62" r="8" fill="#ffd700" stroke="#d4a800" strokeWidth="1"/>
    <circle cx="124" cy="62" r="8" fill="#ffd700" stroke="#d4a800" strokeWidth="1"/>
    <circle cx="100" cy="46" r="8" fill="#ffd700" stroke="#d4a800" strokeWidth="1"/>
    <path d="M140,55 Q160,75 140,95" stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <line x1="140" y1="55" x2="140" y2="95" stroke="#cc8844" strokeWidth="1.5" strokeDasharray="3,2"/>
    <line x1="155" y1="68" x2="60" y2="80" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M60,80 L70,74 L68,84Z" fill="#cc4444"/>
    <path d="M155,68 L162,62 L158,70Z" fill="#f0f0f0"/>
    <path d="M155,68 L163,72 L158,70Z" fill="#f0f0f0"/>
    <path d="M126,95 Q135,80 140,70" stroke="#f5c9a0" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M74,95 Q80,80 90,72" stroke="#f5c9a0" strokeWidth="8" fill="none" strokeLinecap="round"/>
    {[[30,30],[165,20],[180,80],[20,100]].map(([x,y],i)=>(
      <path key={i} d={`M${x},${y+4} C${x},${y} ${x-6},${y} ${x-6},${y+4} C${x-6},${y+8} ${x},${y+12} ${x},${y+12} C${x},${y+12} ${x+6},${y+8} ${x+6},${y+4} C${x+6},${y} ${x},${y} ${x},${y+4}`} fill="#ff6b9d" opacity="0.8"/>
    ))}
  </svg>
);

const PumpkinSVG = () => (
  <svg aria-hidden="true" width="150" height="170" viewBox="0 0 160 180" xmlns="http://www.w3.org/2000/svg">
    <path d="M78,30 Q82,10 90,8 Q95,12 88,30" fill="#2d8a2d" stroke="#1a6a1a" strokeWidth="1"/>
    <path d="M82,22 Q95,12 105,20 Q100,28 88,26Z" fill="#2d8a2d"/>
    <path d="M82,22 Q68,15 60,24 Q66,32 80,28Z" fill="#2d8a2d"/>
    <ellipse cx="80" cy="110" rx="62" ry="70" fill="#e85c00"/>
    <line x1="50" y1="45" x2="50" y2="175" stroke="#c04400" strokeWidth="3" opacity="0.5"/>
    <line x1="65" y1="38" x2="65" y2="178" stroke="#c04400" strokeWidth="3" opacity="0.4"/>
    <line x1="80" y1="36" x2="80" y2="180" stroke="#c04400" strokeWidth="3" opacity="0.4"/>
    <line x1="95" y1="38" x2="95" y2="178" stroke="#c04400" strokeWidth="3" opacity="0.4"/>
    <line x1="110" y1="45" x2="110" y2="175" stroke="#c04400" strokeWidth="3" opacity="0.5"/>
    <path d="M52,88 L62,70 L72,88Z" fill="#1a0a00"/>
    <path d="M88,88 L98,70 L108,88Z" fill="#1a0a00"/>
    <path d="M38,112 L50,102 L58,112 L68,100 L80,112 L92,100 L102,112 L110,102 L122,112 L120,130 Q100,140 80,140 Q60,140 40,130 Z" fill="#1a0a00"/>
    <path d="M50,112 L58,112 L58,128 L50,128Z" fill="#e85c00"/>
    <path d="M68,112 L80,112 L80,128 L68,128Z" fill="#e85c00"/>
    <path d="M92,112 L102,112 L102,128 L92,128Z" fill="#e85c00"/>
    <path d="M60,45 L80,5 L100,45Z" fill="#1a1a2e"/>
    <rect x="50" y="42" width="60" height="8" rx="4" fill="#1a1a2e"/>
    <rect x="73" y="38" width="14" height="10" rx="2" fill="#ffd700"/>
    <rect x="76" y="41" width="8" height="4" rx="1" fill="#1a1a2e"/>
    <path d="M15,60 Q20,55 25,60 Q28,55 35,55 Q30,62 25,65 Q20,62 15,60Z" fill="#1a1a2e"/>
    <path d="M130,40 Q135,35 140,40 Q143,35 150,35 Q145,42 140,45 Q135,42 130,40Z" fill="#1a1a2e"/>
  </svg>
);

const TurkeySVG = () => (
  <svg aria-hidden="true" width="180" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    {[
      {a:-70,c:"#e74c3c"},{a:-50,c:"#e67e22"},{a:-30,c:"#f1c40f"},
      {a:-10,c:"#2ecc71"},{a:10,c:"#3498db"},{a:30,c:"#9b59b6"},
      {a:50,c:"#e74c3c"},{a:70,c:"#e67e22"},
    ].map(({a,c},i)=>{
      const r=a*Math.PI/180;
      const ex=100+75*Math.sin(r),ey=120-75*Math.cos(r);
      return <path key={i} d={`M100,120 Q${100+40*Math.sin(r-0.15)},${120-40*Math.cos(r-0.15)} ${ex},${ey} Q${100+40*Math.sin(r+0.15)},${120-40*Math.cos(r+0.15)} 100,120`} fill={c} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>;
    })}
    <ellipse cx="100" cy="140" rx="38" ry="45" fill="#8B4513"/>
    <rect x="88" y="100" width="24" height="30" rx="12" fill="#cc3300"/>
    <circle cx="100" cy="88" r="22" fill="#cc3300"/>
    <path d="M100,100 Q90,112 92,124 Q100,118 108,124 Q110,112 100,100Z" fill="#cc0000"/>
    <path d="M90,88 L78,92 L82,97 L92,93Z" fill="#e8a020"/>
    <circle cx="96" cy="82" r="6" fill="#f0f0f0"/>
    <circle cx="94" cy="82" r="4" fill="#1a1a1a"/>
    <circle cx="93" cy="81" r="1.5" fill="white"/>
    <rect x="82" y="58" width="36" height="26" rx="3" fill="#1a1a2e"/>
    <rect x="76" y="78" width="48" height="8" rx="4" fill="#1a1a2e"/>
    <rect x="88" y="75" width="24" height="12" rx="2" fill="#ffd700"/>
    <rect x="92" y="78" width="16" height="6" rx="1" fill="#1a1a2e"/>
    <line x1="85" y1="182" x2="72" y2="198" stroke="#8B4513" strokeWidth="5" strokeLinecap="round"/>
    <line x1="115" y1="182" x2="128" y2="198" stroke="#8B4513" strokeWidth="5" strokeLinecap="round"/>
    <path d="M60,198 L72,198 L80,190" stroke="#e8a020" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M128,198 L140,198 L135,190" stroke="#e8a020" strokeWidth="4" fill="none" strokeLinecap="round"/>
  </svg>
);

const FireworksSVG = () => (
  <svg aria-hidden="true" width="240" height="180" viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="80" y="10" width="100" height="65" rx="2" fill="#cc2222"/>
    {[1,3,5].map(i=><rect key={i} x="80" y={10+i*10} width="100" height="10" fill="#f0f0f0"/>)}
    <rect x="80" y="10" width="42" height="32" fill="#002868"/>
    {[20,28,36].map(y=>[86,92,98,104,110].map(x=><circle key={`${x}${y}`} cx={x} cy={y} r="2" fill="white"/>))}
    <line x1="80" y1="75" x2="80" y2="180" stroke="#888" strokeWidth="3"/>
    {[
      {cx:40,cy:60,color:"#ff6b6b",rays:10,r:30},
      {cx:200,cy:40,color:"#ffd93d",rays:12,r:35},
      {cx:220,cy:110,color:"#00c9b1",rays:8,r:28},
      {cx:20,cy:130,color:"#b39ddb",rays:10,r:25},
    ].map(({cx,cy,color,rays,r},fi)=>
      Array.from({length:rays}).map((_,i)=>{
        const a=(i/rays)*2*Math.PI;
        return <g key={`${fi}-${i}`}>
          <line x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx={cx+r*Math.cos(a)} cy={cy+r*Math.sin(a)} r="3" fill={color}/>
        </g>;
      })
    )}
    <circle cx="40" cy="60" r="5" fill="#ff8c8c"/>
    <circle cx="200" cy="40" r="5" fill="#ffe566"/>
    <circle cx="220" cy="110" r="5" fill="#4de8d4"/>
    <circle cx="20" cy="130" r="5" fill="#c8b8f0"/>
    <rect x="0" y="185" width="260" height="15" fill="#1a2a4a"/>
    {[20,50,90,140,190,230].map(x=>(
      <g key={x}>
        <circle cx={x} cy={181} r="5" fill="#1a2a4a"/>
        <rect x={x-4} y="184" width="8" height="12" rx="2" fill="#1a2a4a"/>
      </g>
    ))}
  </svg>
);

const EasterSVG = () => (
  <svg aria-hidden="true" width="190" height="170" viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="155" width="200" height="25" rx="4" fill="#4a9a4a"/>
    {[10,30,50,70,90,110,130,150,170,190].map(x=><path key={x} d={`M${x},155 Q${x-5},140 ${x-3},138 Q${x},148 ${x+3},138 Q${x+5},140 ${x},155`} fill="#2d8a2d"/>)}
    <path d="M60,120 Q60,160 60,155 L140,155 Q140,160 140,120Z" fill="#8B4513"/>
    <path d="M60,120 L140,120 Q140,130 100,132 Q60,130 60,120Z" fill="#a05520"/>
    <path d="M75,120 Q100,80 125,120" fill="none" stroke="#8B4513" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="80" cy="118" rx="14" ry="18" fill="#ff6b6b"/>
    <path d="M66,116 Q80,108 94,116" stroke="#ffd93d" strokeWidth="2.5" fill="none"/>
    <ellipse cx="100" cy="115" rx="12" ry="16" fill="#00c9b1"/>
    <circle cx="94" cy="112" r="3" fill="#ffd93d"/>
    <circle cx="106" cy="112" r="3" fill="#ffd93d"/>
    <ellipse cx="120" cy="118" rx="14" ry="17" fill="#b39ddb"/>
    <ellipse cx="155" cy="115" rx="22" ry="30" fill="#f0f0f0"/>
    <circle cx="155" cy="78" r="20" fill="#f0f0f0"/>
    <ellipse cx="145" cy="48" rx="8" ry="22" fill="#f0f0f0"/>
    <ellipse cx="145" cy="48" rx="4" ry="16" fill="#ffb3c6"/>
    <ellipse cx="165" cy="48" rx="8" ry="22" fill="#f0f0f0"/>
    <ellipse cx="165" cy="48" rx="4" ry="16" fill="#ffb3c6"/>
    <circle cx="148" cy="76" r="4" fill="#1a1a1a"/>
    <circle cx="162" cy="76" r="4" fill="#1a1a1a"/>
    <ellipse cx="155" cy="84" rx="5" ry="4" fill="#ffb3c6"/>
    <path d="M148,88 Q155,95 162,88" stroke="#cc6688" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M148,98 L155,103 L148,108 L140,103Z" fill="#ff6b6b"/>
    <path d="M162,98 L155,103 L162,108 L170,103Z" fill="#ff6b6b"/>
    <circle cx="155" cy="103" r="4" fill="#cc2222"/>
    <ellipse cx="140" cy="120" rx="10" ry="8" fill="#f0f0f0"/>
    <ellipse cx="170" cy="120" rx="10" ry="8" fill="#f0f0f0"/>
    <ellipse cx="155" cy="118" rx="13" ry="17" fill="#ffd93d"/>
  </svg>
);

const ArtWalkSVG = () => (
  <svg aria-hidden="true" width="190" height="190" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M60,80 Q40,50 60,30 Q90,10 120,20 Q155,30 160,60 Q165,90 145,110 Q130,125 110,120 Q100,117 95,125 Q85,140 70,135 Q50,128 45,110 Q40,92 60,80Z" fill="#f0ece0" stroke="#c8b898" strokeWidth="2"/>
    <ellipse cx="75" cy="128" rx="12" ry="10" fill="#e0d8c8" stroke="#c8b898" strokeWidth="2"/>
    <circle cx="85" cy="40" r="14" fill="#ff6b6b"/>
    <circle cx="115" cy="35" r="14" fill="#ffd93d"/>
    <circle cx="140" cy="55" r="14" fill="#00c9b1"/>
    <circle cx="148" cy="85" r="14" fill="#5b8fde"/>
    <circle cx="130" cy="108" r="14" fill="#b39ddb"/>
    <circle cx="65" cy="60" r="12" fill="#ff8c42"/>
    <line x1="30" y1="170" x2="110" y2="90" stroke="#8B4513" strokeWidth="6" strokeLinecap="round"/>
    <path d="M105,88 L118,78 L115,92Z" fill="#f0f0f0" stroke="#ccc" strokeWidth="1"/>
    <path d="M107,90 L120,80 L117,94Z" fill="#5b8fde"/>
    <rect x="26" y="167" width="12" height="8" rx="2" fill="#c8a050"/>
    <rect x="115" y="130" width="65" height="60" rx="5" fill="#fffff0" stroke="#8B4513" strokeWidth="4"/>
    <rect x="117" y="132" width="61" height="40" rx="3" fill="#87CEEB"/>
    <path d="M117,172 Q148,152 178,172Z" fill="#4a7a4a"/>
    <circle cx="148" cy="145" r="12" fill="#ffd700"/>
    {[[20,30],[180,50],[195,120],[10,150]].map(([x,y],i)=>(
      <g key={i} opacity="0.8">
        <line x1={x} y1={y-8} x2={x} y2={y+8} stroke="#ffd93d" strokeWidth="2"/>
        <line x1={x-8} y1={y} x2={x+8} y2={y} stroke="#ffd93d" strokeWidth="2"/>
      </g>
    ))}
  </svg>
);

const CrabSVG = () => (
  <svg aria-hidden="true" width="200" height="140" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
    {[[55,90,30,120],[65,95,35,130],[75,98,45,135],[165,90,190,120],[155,95,185,130],[145,98,175,135]].map(([x1,y1,x2,y2],i)=>(
      <path key={i} d={`M${x1},${y1} Q${(x1+x2)/2},${(y1+y2)/2-10} ${x2},${y2}`} stroke="#cc3300" strokeWidth="5" fill="none" strokeLinecap="round"/>
    ))}
    <path d="M45,75 Q20,60 15,45 Q10,30 20,28 Q30,26 35,35 Q38,42 30,48 Q25,52 28,58 Q35,65 45,75Z" fill="#dd3300"/>
    <path d="M175,75 Q200,60 205,45 Q210,30 200,28 Q190,26 185,35 Q182,42 190,48 Q195,52 192,58 Q185,65 175,75Z" fill="#dd3300"/>
    <ellipse cx="110" cy="95" rx="65" ry="48" fill="#dd4400"/>
    <path d="M60,85 Q110,75 160,85" stroke="#cc3300" strokeWidth="2" fill="none"/>
    <path d="M55,95 Q110,82 165,95" stroke="#cc3300" strokeWidth="2" fill="none"/>
    <path d="M60,105 Q110,92 160,105" stroke="#cc3300" strokeWidth="2" fill="none"/>
    <line x1="110" y1="50" x2="110" y2="140" stroke="#cc3300" strokeWidth="2"/>
    <path d="M90,52 Q85,42 82,36" stroke="#cc3300" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <circle cx="81" cy="34" r="8" fill="#f0f0f0"/>
    <circle cx="80" cy="34" r="5" fill="#1a1a1a"/>
    <circle cx="78" cy="32" r="2" fill="white"/>
    <path d="M130,52 Q135,42 138,36" stroke="#cc3300" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <circle cx="139" cy="34" r="8" fill="#f0f0f0"/>
    <circle cx="140" cy="34" r="5" fill="#1a1a1a"/>
    <circle cx="138" cy="32" r="2" fill="white"/>
  </svg>
);

const NewYearSVG = () => (
  <svg aria-hidden="true" width="200" height="190" viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M85,60 Q80,40 82,20 L98,20 Q100,40 95,60Z" fill="#2d6a2d"/>
    <path d="M82,60 Q75,80 75,120 Q75,155 85,165 Q100,172 115,165 Q125,155 125,120 Q125,80 118,60Z" fill="#3a8a3a"/>
    <rect x="83" y="100" width="34" height="30" rx="4" fill="#f0ece0"/>
    <text x="100" y="112" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6" fontWeight="700" fill="#2d6a2d">CHAM</text>
    <text x="100" y="122" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6" fontWeight="700" fill="#2d6a2d">PAGNE</text>
    <path d="M82,60 Q88,55 100,54 Q112,55 118,60 L115,70 Q100,75 85,70Z" fill="#ffd700"/>
    <rect x="95" y="15" width="10" height="12" rx="3" fill="#8B6914"/>
    <path d="M100,18 Q80,5 60,15" stroke="rgba(200,230,255,0.7)" strokeWidth="3" fill="none"/>
    <path d="M100,18 Q90,-5 110,-8" stroke="rgba(200,230,255,0.7)" strokeWidth="3" fill="none"/>
    <path d="M100,18 Q120,5 140,12" stroke="rgba(200,230,255,0.7)" strokeWidth="3" fill="none"/>
    {[[65,14],[112,-8],[138,12],[72,8],[108,2]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="4" fill="rgba(200,230,255,0.7)"/>
    ))}
    <path d="M140,80 L155,80 L148,140 Q148,148 143,148 Q138,148 138,140Z" fill="rgba(180,230,255,0.4)" stroke="rgba(180,230,255,0.8)" strokeWidth="1.5"/>
    <text x="110" y="175" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="900" fill="#ffd700" stroke="#cc9900" strokeWidth="1">2026!</text>
    {[
      [20,50,"#ff6b6b",15],[180,40,"#ffd93d",-20],[30,120,"#00c9b1",10],
      [190,130,"#b39ddb",-15],[15,160,"#ff8c42",25],[200,160,"#5b8fde",-10],
    ].map(([x,y,color,rot],i)=>(
      <rect key={i} x={x} y={y} width="8" height="5" rx="1" fill={color} transform={`rotate(${rot} ${x} ${y})`} opacity="0.85"/>
    ))}
    {[[45,75],[170,65],[195,100],[25,100]].map(([x,y],i)=>(
      <text key={i} x={x} y={y} fontSize="16" fill="#ffd700">&#9733;</text>
    ))}
  </svg>
);

const THEME_CONFIG = {
  valentines:    { svg: <CupidSVG />,       pos:"center", label:"💘 Happy Valentine's Day!" },
  stpatrick:     { svg: <LeprechaunSVG />,   pos:"walk",   label:"☘️ Happy St. Patrick's Day!" },
  easter:        { svg: <EasterSVG />,       pos:"center", label:"🐣 Happy Easter!" },
  july4:         { svg: <FireworksSVG />,    pos:"center", label:"🎆 Happy 4th of July!" },
  halloween:     { svg: <PumpkinSVG />,      pos:"center", label:"🎃 Happy Halloween!" },
  thanksgiving:  { svg: <TurkeySVG />,       pos:"walk",   label:"🦃 Happy Thanksgiving!" },
  christmas:     { svg: <SantaSVG />,        pos:"walk",   label:"🎄 Merry Christmas!" },
  newyears:      { svg: <NewYearSVG />,      pos:"center", label:"🎉 Happy New Year!" },
  osprey:        { svg: <OspreySVG2 />,      pos:"fly",    label:"🦅 Virginia Osprey Festival Week!" },
  bikefest:      { svg: <HarleySVG />,       pos:"drive",  label:"🏍 CB Bike Fest Week!" },
  riverFestival: { svg: <FireworksSVG />,    pos:"center", label:"🎉 Potomac River Festival Week!" },
  waterfest:     { svg: <CrabSVG />,         pos:"walk",   label:"🌊 Water Fest Week!" },
  beachmusic:    { svg: <ArtWalkSVG />,      pos:"center", label:"🎶 Beach Music Festival Week!" },
  crabderby:     { svg: <CrabSVG />,         pos:"walk",   label:"🦀 Crab Derby Week!" },
  artfriday:     { svg: <ArtWalkSVG />,      pos:"center", label:"🎨 2nd Friday Art Walk — Tonight!" },
};

function SeasonalAnimation({ show }) {
  const theme = getCurrentTheme();
  if (!show) return null;

  const svg = theme ? THEME_CONFIG[theme.id]?.svg : <GolfCartSVG />;
  const label = theme ? THEME_CONFIG[theme.id]?.label : null;
  const pos = theme ? (THEME_CONFIG[theme.id]?.pos || "drive") : "drive";

  return (
    <div aria-hidden="true" style={{ position:"fixed", inset:0, zIndex:999, pointerEvents:"none", overflow:"hidden" }}>
      <style>{`
        @keyframes driveAcross { 0%{left:-300px} 100%{left:calc(100vw + 300px)} }
        @keyframes walkAcross  { 0%{left:-250px} 100%{left:calc(100vw + 250px)} }
        @keyframes flyAcross   { 0%{left:-300px;top:8vh;transform:rotate(-3deg)} 33%{top:4vh;transform:rotate(-5deg)} 66%{top:12vh;transform:rotate(-2deg)} 100%{left:calc(100vw + 300px);top:6vh;transform:rotate(-4deg)} }
        @keyframes centerPop   { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.2) rotate(-10deg)} 20%{opacity:1;transform:translate(-50%,-50%) scale(1.1) rotate(3deg)} 35%{transform:translate(-50%,-50%) scale(1.0) rotate(0deg)} 72%{opacity:1;transform:translate(-50%,-50%) scale(1.0)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0.5) rotate(8deg)} }
        @keyframes cartBounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes walkBob     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes labelFade   { 0%,75%{opacity:1} 100%{opacity:0} }
        .anim-drive  { position:fixed; bottom:10vh; left:-320px; animation:driveAcross 4.2s linear forwards; filter:drop-shadow(4px 6px 14px rgba(0,0,0,0.4)); }
        .anim-walk   { position:fixed; bottom:8vh;  left:-220px; animation:walkAcross 3.0s linear forwards; filter:drop-shadow(3px 5px 10px rgba(0,0,0,0.4)); }
        .anim-fly    { position:fixed; top:8vh; left:-280px; animation:flyAcross 2.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards; filter:drop-shadow(4px 8px 14px rgba(0,0,0,0.5)); }
        .anim-center { position:fixed; top:50vh; left:50vw; animation:centerPop 2.6s cubic-bezier(0.34,1.56,0.64,1) forwards; filter:drop-shadow(0 8px 24px rgba(0,0,0,0.4)); }
        .inner-drive { animation:cartBounce 0.4s ease-in-out infinite; }
        .inner-walk  { animation:walkBob 0.5s ease-in-out infinite; }
        .evt-label   { position:fixed; bottom:calc(10vh + 175px); left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.75); color:#fff; border-radius:20px; padding:6px 18px; font-size:13px; font-family:Georgia,serif; font-weight:700; white-space:nowrap; animation:labelFade 2.6s ease-in-out forwards; backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.2); }
      `}</style>

      {label && <div className="evt-label">{label}</div>}

      {(pos === "drive") && <div className="anim-drive"><div className="inner-drive">{svg}</div></div>}
      {(pos === "walk")  && <div className="anim-walk"><div className="inner-walk">{svg}</div></div>}
      {(pos === "fly")   && <div className="anim-fly">{svg}</div>}
      {(pos === "center") && <div className="anim-center">{svg}</div>}
    </div>
  );
}


// ─── CARD COMPONENT ───────────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: 16,
      padding: "18px 20px",
      marginBottom: 14,
      boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── INTERACTIVE BIRD MAP ─────────────────────────────────────────────────────

function BirdMap({ spots, userPins, onAddPin }) {
  const [form, setForm] = useState({ type: "osprey", desc: "", lat: "", lng: "" });
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const allSpots = [...spots, ...userPins];

  const submitPin = async () => {
    if (!form.desc || !form.lat || !form.lng) return;
    const pin = { ...form, id: Date.now(), name: form.desc, userPin: true, confirmed: false };
    onAddPin(pin);
    // Persist to shared storage so all users see it
    try {
      const existing = await window.storage.get("bird_pins", true).catch(() => null);
      const pins = existing ? JSON.parse(existing.value) : [];
      pins.push(pin);
      await window.storage.set("bird_pins", JSON.stringify(pins), true);
    } catch(e) {}
    setSaved(true);
    setForm({ type: "osprey", desc: "", lat: "", lng: "" });
    setShowForm(false);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div>
      {saved && (
        <div style={{ background:"rgba(106,176,76,0.25)", border:"1px solid #6ab04c", borderRadius:10, padding:"10px 14px", marginBottom:12, color:"#fff", fontSize:13 }}>
          ✅ Your pin has been saved and shared with the community!
        </div>
      )}
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: 16, marginBottom: 16, minHeight: 240 }}>
        <div style={{ color: "#fff", marginBottom: 12, fontSize: 14, opacity: 0.8, fontFamily: "Georgia, serif" }}>
          📍 Known Nest & Sighting Locations — Potomac Region
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {allSpots.map((s, i) => (
            <div key={i} style={{
              background: s.type === "eagle" ? "rgba(212,175,55,0.25)" : "rgba(100,180,255,0.2)",
              border: `1px solid ${s.type === "eagle" ? "#d4af37" : "#5dade2"}`,
              borderRadius: 12, padding: "10px 14px", minWidth: 180, flex: "1 1 180px"
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.type === "eagle" ? "🦅" : "🐦"}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.name}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, lineHeight: 1.4 }}>{s.desc}</div>
              {s.userPin && <div style={{ color: "#f9ca24", fontSize: 10, marginTop: 4 }}>📌 Community pin</div>}
              {s.confirmed && <div style={{ color: "#6ab04c", fontSize: 10, marginTop: 4 }}>✅ Confirmed sighting</div>}
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} aria-label="Add a community sighting pin"
        style={{ background: "rgba(212,175,55,0.3)", border: "1px solid #d4af37", color: "#fff", borderRadius: 10, padding: "10px 20px", cursor: "pointer", marginBottom: 12, fontFamily: "Georgia, serif" }}>
        📌 {showForm ? "Cancel" : "Add a Community Sighting Pin"}
      </button>

      {showForm && (
        <Card>
          <div style={{ color: "#fff", fontWeight: 700, marginBottom: 10 }}>Report a Nest / Sighting</div>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} aria-label="Bird type"
            style={{ width: "100%", padding: 8, borderRadius: 8, marginBottom: 8, background: "rgba(0,0,0,0.4)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
            <option value="osprey">🐦 Osprey Nest</option>
            <option value="eagle">🦅 Bald Eagle Nest</option>
          </select>
          <input placeholder="Location name / description" value={form.desc} aria-label="Location description"
            onChange={e => setForm({ ...form, desc: e.target.value })}
            style={{ width: "100%", padding: 8, borderRadius: 8, marginBottom: 8, background: "rgba(0,0,0,0.4)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input placeholder="Latitude (e.g. 38.249)" value={form.lat} aria-label="Latitude"
              onChange={e => setForm({ ...form, lat: e.target.value })}
              style={{ flex: 1, padding: 8, borderRadius: 8, background: "rgba(0,0,0,0.4)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }} />
            <input placeholder="Longitude (e.g. -76.971)" value={form.lng} aria-label="Longitude"
              onChange={e => setForm({ ...form, lng: e.target.value })}
              style={{ flex: 1, padding: 8, borderRadius: 8, background: "rgba(0,0,0,0.4)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }} />
          </div>
          <button onClick={submitPin} aria-label="Submit sighting pin"
            style={{ background: "rgba(106,176,76,0.4)", border: "1px solid #6ab04c", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer" }}>
            Submit Pin
          </button>
        </Card>
      )}
    </div>
  );
}

// ─── TAB CONTENT PANELS ───────────────────────────────────────────────────────

function RestaurantsTab({ favs = [], setFavs = () => {} }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 4 }}>🦀 Restaurants</h2>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 16, fontStyle: "italic" }}>
        Tap any restaurant for details · ❤️ to save favorites
      </div>
      <div style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ color: "#f9ca24", fontSize: 12, fontWeight: 700 }}>📲 Want today's specials & live music?</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 3 }}>
          Follow each restaurant's Facebook page (linked below) for real-time daily specials, band announcements, and hours updates.
        </div>
      </div>
      {RESTAURANTS.map((r, i) => (
        <Card key={i} style={r.badge ? { borderLeft:"3px solid #f9ca24", padding:0, overflow:"hidden" } : { padding:0, overflow:"hidden" }}>
          {/* Hero banner */}
          <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ cursor:"pointer" }}>
            {(r.heroColor || r.image) && (
              <div style={{
                background: r.image
                  ? `url(${r.image}) center/cover no-repeat`
                  : `linear-gradient(135deg, ${r.heroColor || "#0d4f6e"} 0%, ${r.heroColor ? r.heroColor + "aa" : "#1a7a8a"} 100%)`,
                height: 72,
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"0 16px",
                position:"relative", overflow:"hidden",
              }}>
                <div style={{ fontSize:36, filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>{r.heroEmoji}</div>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)" }}/>
                <div style={{ position:"relative", zIndex:1, textAlign:"right" }}>
                  {r.hours && <OpenNowBadge hours={r.hours}/>}
                </div>
              </div>
            )}
            <div style={{ padding:"12px 14px 8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:16, fontFamily:"Georgia, serif" }}>{r.name}</div>
                    {r.badge && <span style={{ background:"rgba(249,202,36,0.2)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px", whiteSpace:"nowrap" }}>{r.badge}</span>}
                    {!r.heroColor && r.hours && <OpenNowBadge hours={r.hours}/>}
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>{r.address}</div>
                  {r.liveMusicNote && <div style={{ color:"#f9ca24", fontSize:11, marginTop:3 }}>{r.liveMusicNote.slice(0,60)}…</div>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                  <HeartBtn id={`rest-${i}`} name={r.name} favs={favs} setFavs={setFavs}/>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:18, paddingLeft:4 }}>{expanded === i ? "▲" : "▼"}</div>
                </div>
              </div>
            </div>
          </div>
          {expanded === i && (
            <div style={{ margin:"0 14px 14px", borderTop:"1px solid rgba(255,255,255,0.15)", paddingTop:10 }}>
              {r.phone && <div style={{ color:"#f9ca24", fontSize:13, marginBottom:4 }}>📞 {r.phone}</div>}
              {r.hours && <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:6 }}>🕐 {r.hours}</div>}
              <div style={{ color:"rgba(255,255,255,0.85)", fontSize:13, marginBottom:8, lineHeight:1.5 }}>{r.desc || r.menu}</div>
              {r.liveMusicNote && (
                <div style={{ background: "rgba(249,202,36,0.12)", border: "1px solid rgba(249,202,36,0.3)", borderRadius: 8, padding: "8px 10px", marginBottom: 8, fontSize: 12, color: "#f9ca24" }}>
                  {r.liveMusicNote}
                </div>
              )}
              <div style={{ color: "#6ab04c", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>⭐ Best to Order:</div>
              <ul style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "0 0 8px 16px", padding: 0 }}>
                {r.best.map((b, j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {r.facebook && (
                  <a href={r.facebook} target="_blank" rel="noopener noreferrer"
                    style={{ background: "rgba(66,103,178,0.4)", border: "1px solid #4267B2", color: "#fff", borderRadius: 8, padding: "6px 12px", textDecoration: "none", fontSize: 12 }}>
                    👍 Facebook (daily specials & music)
                  </a>
                )}
                {r.website && (
                  <a href={r.website} target="_blank" rel="noopener noreferrer"
                    style={{ background: "rgba(93,173,226,0.3)", border: "1px solid #5dade2", color: "#fff", borderRadius: 8, padding: "6px 12px", textDecoration: "none", fontSize: 12 }}>
                    🔗 Website
                  </a>
                )}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function SimpleListTab({ title, items, renderItem }) {
  return (
    <div>
      <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 16 }}>{title}</h2>
      {items.map((item, i) => (
        <Card key={i}>{renderItem(item, i)}</Card>
      ))}
    </div>
  );
}

function WeatherTab() {
  const [wx, setWx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch("https://api.weather.gov/points/38.2481,-76.9688")
      .then(r => r.json()).then(d => fetch(d.properties.forecast))
      .then(r => r.json()).then(d => { setWx(d.properties.periods.slice(0, 6)); setLoading(false); })
      .catch(() => { setErr(true); setLoading(false); });
  }, []);
  const lnk = (href, label) => <a href={href} target="_blank" rel="noopener noreferrer" style={{display:"block",background:"rgba(41,128,185,0.3)",border:"1px solid #5dade2",color:"#fff",borderRadius:10,padding:"10px 16px",textDecoration:"none",marginBottom:8}}>{label}</a>;
  return (
    <div>
      <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>⛅ Weather — Colonial Beach</h2>
      <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:12 }}>Live forecast from National Weather Service</div>
      <SunriseSunset />
      {loading && <div style={{ color:"rgba(255,255,255,0.6)", textAlign:"center", padding:40 }}>Loading forecast…</div>}
      {err && <Card><div style={{ color:"rgba(255,255,255,0.7)", marginBottom:8 }}>Live forecast unavailable. Try these links:</div>{lnk("https://forecast.weather.gov/MapClick.php?CityName=Colonial+Beach&state=VA","🌤 NWS Forecast — Colonial Beach")}{lnk("https://radar.weather.gov/station/KLWX/standard","📡 NOAA Radar (KLWX)")}{lnk("https://windy.com/?38.248,-76.968,10","💨 Windy.com")}</Card>}
      {wx && wx.map((p, i) => (
        <Card key={i} style={{ borderLeft:`3px solid ${p.isDaytime?"#f9ca24":"#5dade2"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{p.name}</div>
              <div style={{ color:p.isDaytime?"#f9ca24":"#5dade2", fontSize:28, fontWeight:900, margin:"3px 0" }}>{p.temperature}°{p.temperatureUnit}</div>
              <div style={{ color:"rgba(255,255,255,0.82)", fontSize:13 }}>{p.shortForecast}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:30 }}>{p.isDaytime ? "☀️" : "🌙"}</div>
              <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, marginTop:4 }}>💨 {p.windSpeed} {p.windDirection}</div>
            </div>
          </div>
          {p.detailedForecast && <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginTop:8, lineHeight:1.5 }}>{p.detailedForecast}</div>}
        </Card>
      ))}
      <Card>
        <div style={{ color:"#fff", fontWeight:700, marginBottom:8 }}>More Resources</div>
        {lnk("https://radar.weather.gov/station/KLWX/standard","📡 NOAA Radar (KLWX)")}
        {lnk("https://windy.com/?38.248,-76.968,10","💨 Windy.com Wind & Wave Map")}
        {lnk("https://www.ndbc.noaa.gov/station_page.php?station=CPTR1","🌊 Potomac River Buoy Data")}
      </Card>
    </div>
  );
}

function TidesTab() {
  const [tides, setTides] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  useEffect(() => {
    const today = new Date();
    const fmt = d => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
    const tom = new Date(today); tom.setDate(today.getDate()+1);
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${fmt(today)}&end_date=${fmt(tom)}&station=8635750&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=colonial_beach_app&format=json`;
    fetch(url).then(r=>r.json()).then(d => { if(d.predictions){setTides(d.predictions.slice(0,8));}else{setErr(true);} setLoading(false); }).catch(()=>{setErr(true);setLoading(false);});
  }, []);
  const fmtTime = t => { const[,time]=t.split(" "); const[h,m]=time.split(":"); const hour=parseInt(h); return`${hour>12?hour-12:hour||12}:${m} ${hour>=12?"PM":"AM"}`; };
  return (
    <div>
      <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>🌊 Tides — Colonial Beach</h2>
      <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:12 }}>NOAA Station 8635750 · Potomac River at Colonial Beach</div>
      {loading && <div style={{ color:"rgba(255,255,255,0.6)", textAlign:"center", padding:40 }}>Loading tide predictions…</div>}
      {err && <Card><div style={{ color:"rgba(255,255,255,0.7)", marginBottom:8 }}>Live tides unavailable.</div><a href="https://tidesandcurrents.noaa.gov/stationhome.html?id=8635750" target="_blank" rel="noopener noreferrer" style={{color:"#5dade2",fontSize:13}}>📊 NOAA Tides Station 8635750</a></Card>}
      {tides && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:12 }}>
          {tides.map((t, i) => (
            <Card key={i} style={{ margin:0, borderLeft:`3px solid ${t.type==="H"?"#5dade2":"#f9ca24"}` }}>
              <div style={{ fontSize:22 }}>{t.type==="H"?"🔺":"🔻"}</div>
              <div style={{ color:t.type==="H"?"#5dade2":"#f9ca24", fontWeight:700, fontSize:13 }}>{t.type==="H"?"High Tide":"Low Tide"}</div>
              <div style={{ color:"#fff", fontSize:22, fontWeight:900 }}>{parseFloat(t.v).toFixed(1)} ft</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>{fmtTime(t.t)}</div>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <div style={{ color:"#f9ca24", fontWeight:700, marginBottom:5 }}>💡 Local Tip</div>
        <div style={{ color:"rgba(255,255,255,0.8)", fontSize:13, lineHeight:1.6 }}>Best fishing and crabbing 2 hours before and after high tide. Osprey and eagle activity peaks at low tide when fish are concentrated in the shallows. Fossil hunting at Westmoreland is best at low tide.</div>
      </Card>
    </div>
  );
}

function PharmacyPanel() {
  return (
    <div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 12, fontStyle: "italic" }}>Always call ahead for prescription readiness.</div>
      <div style={{ color: "#f9ca24", fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>🏖 IN COLONIAL BEACH</div>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Walgreens</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 700 McKinney Blvd, Colonial Beach, VA 22443</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (804) 224-2318</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Store: Mon–Sat 8am–9pm · Sun 10am–8pm</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Pharmacy: Mon–Fri 10am–6pm (closed 1:30–2pm) · Sat–Sun closed</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 3 }}>Drive-up window · Immunizations · Medicare/Medicaid · FedEx</div>
      </Card>
      <div style={{ color: "#f9ca24", fontSize: 11, fontWeight: 700, marginBottom: 6, marginTop: 10, letterSpacing: 1 }}>🚗 KING GEORGE (~20 MIN)</div>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Walmart Pharmacy</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 16375 Merchant Lane, King George, VA 22485</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 413-3144</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Mon–Sat 9am–8pm · Sun 10am–6pm</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 3 }}>Inside King George Walmart Supercenter · Accepts most insurance</div>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>CVS Pharmacy</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 11458 Kings Highway, King George, VA 22485</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 775-2400</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Check CVS app/website for current hours</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 3 }}>MinuteClinic walk-in health services · Drive-thru · EBT accepted</div>
      </Card>
      <div style={{ color: "#f9ca24", fontSize: 11, fontWeight: 700, marginBottom: 6, marginTop: 10, letterSpacing: 1 }}>🚗 MONTROSS (~15 MIN)</div>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Walgreens — Montross</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 Montross, VA</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Check Walgreens app for current hours · Serves Westmoreland County area</div>
      </Card>
      <div style={{ background: "rgba(249,202,36,0.1)", border: "1px solid rgba(249,202,36,0.3)", borderRadius: 10, padding: 10, marginTop: 4 }}>
        <div style={{ color: "#f9ca24", fontSize: 12, fontWeight: 700 }}>💡 Tip</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 3 }}>GoodRx and Walmart+ can significantly cut prescription costs. Many meds are $4–$10 at Walmart Pharmacy without insurance.</div>
      </div>
    </div>
  );
}

function MedicalPanel() {
  return (
    <div>
      <div style={{ background: "rgba(231,76,60,0.25)", border: "2px solid #e74c3c", borderRadius: 12, padding: "10px 14px", marginBottom: 14, textAlign: "center" }}>
        <div style={{ color: "#e74c3c", fontWeight: 900, fontSize: 20 }}>🚨 EMERGENCY: 911</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 3 }}>Nearest ER: Mary Washington Hospital (~27 mi) or Stafford Hospital (~25 mi)</div>
      </div>
      <div style={{ color: "#f9ca24", fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>🏥 HOSPITALS WITH EMERGENCY ROOMS (24/7)</div>
      <Card style={{ borderLeft: "3px solid #e74c3c" }}>
        <div style={{ color: "#fff", fontWeight: 700 }}>Mary Washington Hospital</div>
        <div style={{ color: "#5dade2", fontSize: 11 }}>Level II Trauma Center · Primary Stroke Center · Level III NICU</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 1001 Sam Perry Blvd, Fredericksburg, VA 22401 (~27 mi)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 741-1100</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 3 }}>Largest regional hospital. Full trauma, cardiac, stroke, NICU. 24/7 ER.</div>
      </Card>
      <Card style={{ borderLeft: "3px solid #e74c3c" }}>
        <div style={{ color: "#fff", fontWeight: 700 }}>Stafford Hospital</div>
        <div style={{ color: "#5dade2", fontSize: 11 }}>Mary Washington Healthcare System</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 101 Hospital Center Blvd, Stafford, VA 22554 (~25 mi)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 741-9000</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 3 }}>Modern full-service hospital. 24/7 ER. Often shorter wait times than MWH.</div>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Riverside Tappahannock Hospital</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 618 Hospital Rd, Tappahannock, VA 22560 (~26 mi south)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (804) 443-6100</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 3 }}>Good option if traveling south. Riverside Health System. 24/7 ER.</div>
      </Card>
      <div style={{ color: "#f9ca24", fontSize: 11, fontWeight: 700, marginBottom: 6, marginTop: 10, letterSpacing: 1 }}>🩺 URGENT CARE</div>
      <Card style={{ borderLeft: "3px solid #6ab04c" }}>
        <div style={{ color: "#fff", fontWeight: 700 }}>Centercare Urgent Care &amp; Family Practice</div>
        <div style={{ color: "#6ab04c", fontSize: 11 }}>Closest urgent care to Colonial Beach</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 15521 Real Estate Ave, Suite 206, King George, VA 22485 (~20 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 289-2273</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Mon–Fri 9am–7pm · Sat–Sun 9am–5pm · Walk-ins welcome</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 3 }}>Also serves as primary care / family practice. On-site lab and X-ray.</div>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Mary Washington Urgent Care — King George</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 11131 Journal Parkway, King George, VA 22485 (~20 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 741-1100</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Call for hours · Same-day appointments · Accepts most insurance</div>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>MinuteClinic at CVS — King George</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 11458 Kings Highway, King George, VA 22485 (~20 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 775-2400</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Walk-in or book online · Minor illness, vaccines, physicals · Board-certified providers</div>
      </Card>
      <div style={{ color: "#f9ca24", fontSize: 11, fontWeight: 700, marginBottom: 6, marginTop: 10, letterSpacing: 1 }}>👨‍⚕️ PRIMARY CARE &amp; PHYSICIAN OFFICES</div>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Westmoreland County Health Department</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 Colonial Beach &amp; Montross offices</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (804) 493-8374</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Mon–Fri · Public health, immunizations, WIC, family planning, STI testing</div>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Centercare Family Practice — King George</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 7967 Kings Highway, King George, VA 22485 (~20 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 414-6120</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Call for hours · Primary care and family medicine</div>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Mary Washington Healthcare — Find a Provider</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Specialists, cardiology, orthopedics, OB/GYN and more in Fredericksburg (~35 min)</div>
        <a href="https://www.marywashingtonhealthcare.com/locations" target="_blank" rel="noopener noreferrer"
          style={{ color: "#5dade2", fontSize: 12, display: "inline-block", marginTop: 6 }}>🔗 marywashingtonhealthcare.com</a>
      </Card>
    </div>
  );
}

function VetsPanel() {
  return (
    <div>
      <div style={{ background: "rgba(231,76,60,0.2)", border: "2px solid #e74c3c", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ color: "#e74c3c", fontWeight: 900, fontSize: 14, marginBottom: 4 }}>🚨 24-HOUR PET EMERGENCY</div>
        <div style={{ color: "#fff", fontWeight: 700 }}>Virginia Veterinary Centers — Fredericksburg</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>📍 1301 Central Park Blvd, Fredericksburg, VA 22401 (~35 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 16, fontWeight: 700 }}>📞 (540) 372-3470</div>
        <div style={{ color: "#6ab04c", fontSize: 12, fontWeight: 700 }}>Open 24 hours · 7 days · All holidays</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>Emergency and specialty hospital for dogs and cats. Board-certified surgeon, advanced diagnostics, surgery, and critical care. Urgent Care service also available for after-hours non-emergencies.</div>
        <a href="https://www.virginiaveterinarycenters.com/locations/fredericksburg" target="_blank" rel="noopener noreferrer"
          style={{ color: "#5dade2", fontSize: 12, display: "inline-block", marginTop: 6 }}>🔗 virginiaveterinarycenters.com</a>
      </div>
      <div style={{ color: "#f9ca24", fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>🐾 LOCAL VETERINARIANS</div>
      <Card style={{ borderLeft: "3px solid #f9ca24" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ color: "#fff", fontWeight: 700 }}>Eagle's Nest Animal Hospital</div>
          <span style={{ background: "rgba(249,202,36,0.2)", border: "1px solid #f9ca24", color: "#f9ca24", fontSize: 10, borderRadius: 8, padding: "2px 7px", marginLeft: 8 }}>⭐ Highly Rated</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>📍 9687 Barbara's Way, King George, VA 22485 (~20 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 775-6800</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Mon–Fri 7:30am–6:30pm · Sat–Sun closed</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>Full-service hospital since 2007. Digital X-ray, doppler ultrasound, in-house lab. Specialties: oncology, acupuncture, canine reproduction (AI, c-sections, semen evaluation, OFA radiographs). Emergencies seen during business hours.</div>
        <div style={{ background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.4)", borderRadius: 8, padding: "6px 10px", marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
          After-hours emergencies: Virginia Veterinary Centers (540) 372-3470
        </div>
        <a href="https://eaglesnestanimalhospital.com" target="_blank" rel="noopener noreferrer"
          style={{ color: "#5dade2", fontSize: 12, display: "inline-block", marginTop: 6 }}>🔗 eaglesnestanimalhospital.com</a>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>King George Veterinary Clinic</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>📍 12378 Kings Hwy, King George, VA 22485 (~20 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 775-9439</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Call for current hours · General veterinary services</div>
        <a href="https://www.kinggeorgeveterinaryclinic.com" target="_blank" rel="noopener noreferrer"
          style={{ color: "#5dade2", fontSize: 12, display: "inline-block", marginTop: 4 }}>🔗 Website</a>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Animal Emergency Clinic of Fredericksburg</div>
        <div style={{ color: "#e74c3c", fontSize: 11, fontWeight: 700 }}>Emergency / After-Hours Alternative</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 1210 Snowden St, Fredericksburg, VA 22401 (~35 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 371-0554</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Emergency care since 1992 · No appointment needed</div>
      </Card>
      <Card>
        <div style={{ color: "#fff", fontWeight: 700 }}>Petco — King George</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📍 16417 Merchants Lane, King George, VA 22485 (~20 min)</div>
        <div style={{ color: "#f9ca24", fontSize: 13 }}>📞 (540) 663-3876</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Vetco vaccination clinics held regularly · Grooming · Pet food &amp; supplies</div>
      </Card>
    </div>
  );
}

function ResidentsPanel() {
  const [resTab, setResTab] = useState("grocery");

  return (
    <div>
      <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 14 }}>🏠 Residents Guide</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {RESIDENT_TABS.map(t => (
          <button key={t.id} onClick={() => setResTab(t.id)} style={{
            background: resTab === t.id ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
            border: `1px solid ${resTab === t.id ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}`,
            color: "#fff", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif"
          }}>{t.label}</button>
        ))}
      </div>

      {resTab === "grocery" && (
        <div>
          {GROCERY.map((g, i) => (
            <Card key={i} accent={g.highlight ? "#ff6b9d" : undefined}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{g.name}</div>
                {g.highlight && <span style={{ background: "rgba(255,107,157,0.2)", border: "1px solid #ff6b9d", color: "#ff6b9d", fontSize: 10, borderRadius: 8, padding: "2px 7px", marginLeft: 8, whiteSpace: "nowrap" }}>⭐ Local Fave</span>}
              </div>
              <Addr address={g.address} />
              {g.phone && <Ph phone={g.phone} />}
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>🕐 {g.hours}</div>
              {g.highlight && (
                <div style={{ background: "rgba(255,107,157,0.15)", border: "1px solid rgba(255,107,157,0.4)", borderRadius: 8, padding: "7px 10px", marginTop: 8, fontSize: 13, color: "#fff" }}>
                  {g.highlight}
                </div>
              )}
              {g.notes && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 5, fontStyle: "italic" }}>{g.notes}</div>}
            </Card>
          ))}
        </div>
      )}

      {resTab === "pharmacy" && <PharmacyPanel />}
      {resTab === "medical" && <MedicalPanel />}
      {resTab === "vets" && <VetsPanel />}
      {resTab === "police" && (
        <Card>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>🚔 Colonial Beach Police Department</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginBottom: 6 }}>📍 1 Washington Ave, Colonial Beach, VA 22443</div>
          <div style={{ color: "#f9ca24", fontSize: 14, marginBottom: 6 }}>📞 Non-Emergency: (804) 224-7116</div>
          <div style={{ color: "#e74c3c", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🚨 Emergency: 911</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>🕐 Dispatch: 24/7</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: 12, paddingTop: 10 }}>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}>Westmoreland County Sheriff</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>📞 (804) 493-8066</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>County-wide coverage including surrounding areas</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: 12, paddingTop: 10 }}>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}>Virginia State Police — Area 4</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>📞 (804) 493-8000</div>
          </div>
        </Card>
      )}

      {resTab === "contractors" && (
        <div>
          {CONTRACTORS.map((c, i) => (
            <Card key={i} accent={c.featured ? "#f9ca24" : undefined}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: c.featured ? 15 : 14 }}>{c.name}</div>
                {c.featured && <span style={{ background: "rgba(249,202,36,0.2)", border: "1px solid #f9ca24", color: "#f9ca24", fontSize: 10, borderRadius: 8, padding: "2px 8px", marginLeft: 8, whiteSpace: "nowrap" }}>⭐ Featured</span>}
              </div>
              {c.phone && <Ph phone={c.phone} />}
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>🔧 {c.services}</div>
              {c.facebook && <a href={c.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "#5dade2", fontSize: 12, textDecoration: "none", display: "inline-block", marginTop: 6 }}>👍 Follow on Facebook</a>}
            </Card>
          ))}
        </div>
      )}

      {resTab === "isp" && (
        <div>
          {ISP_LINKS.map((isp, i) => (
            <Card key={i}>
              <div style={{ color: "#fff", fontWeight: 700 }}>{isp.name}</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 6 }}>{isp.notes}</div>
              <a href={isp.url} target="_blank" rel="noopener noreferrer"
                style={{ color: "#5dade2", fontSize: 13 }}>🔗 Visit Website</a>
            </Card>
          ))}
        </div>
      )}

      {resTab === "realestate" && (
        <div>
          {REALESTATE_AGENTS.map((a, i) => (
            <Card key={i} style={{ borderLeft: i === 0 ? "3px solid #d4af37" : undefined }}>
              {i === 0 && <div style={{ color: "#d4af37", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>⭐ FEATURED AGENT</div>}
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{a.name}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{a.company}</div>
              <div style={{ color: "#f9ca24", fontSize: 13, marginTop: 4 }}>📞 {a.phone}</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>✉️ {a.email}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>{a.specialties}</div>
              <a href={a.link} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", marginTop: 8, color: "#5dade2", fontSize: 13 }}>🔗 Website</a>
            </Card>
          ))}
        </div>
      )}

      {resTab === "dump" && (
        <div>
          <Card accent="#6ab04c">
            <div style={{ color: "#6ab04c", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>📍 CLOSEST TO TOWN</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🗑 CB Convenience Site — Near Monroe Birthplace</div>
            <a href="https://maps.google.com?q=38.2385227,-76.9897893" target="_blank" rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, textDecoration: "none", display: "block", marginBottom: 8 }}>
              📍 Near James Monroe Hwy, Colonial Beach, VA ↗
            </a>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 8 }}>
              Convenient drop-off site located near the Monroe Birthplace on James Monroe Highway — much closer to town than the main transfer station.
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 10 }}>
              <div style={{ color: "#f9ca24", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>⚠️ Call Public Works to confirm hours &amp; accepted materials</div>
              <a href="tel:+18042247260" style={{ color: "#f9ca24", fontSize: 13, textDecoration: "none", display: "block" }}>📞 (804) 224-7260 — CB Public Works</a>
            </div>
          </Card>

          <Card>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>🗑 Westmoreland County Transfer Station</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>📍 Rt. 3 / Oak Grove area, Westmoreland County, VA</div>
            <Ph phone="(804) 493-8073" />
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 8 }}>
              🕐 Tue, Thu, Sat · 7am–3pm<br />
              Closed Sun, Mon, Wed, Fri
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 10 }}>
              <div style={{ color: "#6ab04c", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>What's Accepted:</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.7 }}>
                ✅ Household waste · ✅ Recyclables · ✅ Yard waste<br />
                ✅ Large appliances (fee may apply) · ✅ Electronics (fee)<br />
                ❌ Hazardous materials · ❌ Tires (separate program)
              </div>
            </div>
          </Card>
        </div>
      )}

      {resTab === "trash" && (
        <Card>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>🚛 Trash &amp; Refuse Collection</div>
          <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ color: "#f9ca24", fontWeight: 700, marginBottom: 6 }}>📅 Collection Schedule</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.9 }}>
              🗑 <strong>Trash:</strong> Once weekly — day depends on your zone (Mon–Fri)<br />
              🌿 <strong>Yard Debris:</strong> Seasonal schedule — see town website<br />
            </div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
            ⚠️ Place bins at the curb by <strong>7am</strong> on your collection day. Holidays may shift your pickup — check the town's holiday schedule below.
          </div>
          <div style={{ color: "#f9ca24", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>🗺 Find Your Pickup Day</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>
            The Town of Colonial Beach publishes an official <strong>Collection Zone Map</strong> showing which streets are picked up on which day (Monday through Friday routes). Tap below to view it:
          </div>
          <a href="https://www.colonialbeachva.gov/337/Refuse-Collection" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "rgba(249,202,36,0.15)", border: "1px solid #f9ca24", color: "#fff", borderRadius: 10, padding: "12px 16px", textDecoration: "none", marginBottom: 10, fontSize: 14, fontWeight: 700 }}>
            🗺 View Collection Zone Map &amp; Holiday Schedule
          </a>
          <a href="https://www.colonialbeachva.gov/337/Refuse-Collection" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "rgba(93,173,226,0.2)", border: "1px solid #5dade2", color: "#fff", borderRadius: 10, padding: "10px 16px", textDecoration: "none", marginBottom: 10, fontSize: 13 }}>
            📅 2026 Holiday Collection Schedule
          </a>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "10px 12px", marginTop: 4 }}>
            <div style={{ color: "#f9ca24", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>📞 Public Works</div>
            <Ph phone="(804) 224-7260" />
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>2301 McKinney Boulevard, Colonial Beach · Mon–Fri business hours</div>
          </div>
        </Card>
      )}


      {resTab === "autorepair" && (
        <div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>
            Local auto repair, used cars, and parts in and around Colonial Beach.
          </div>
          <Card accent="#f9ca24">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Bill Britt Motors</div>
              <span style={{ background:"rgba(249,202,36,0.2)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 8px" }}>⭐ Local Favorite</span>
            </div>
            <Addr address="903 Colonial Ave, Colonial Beach, VA 22443"/>
            <Ph phone="(804) 880-2886"/>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginBottom:8 }}>🕐 Mon–Fri 8am–5pm · Sat 8am–2pm · Sun closed</div>
            <div style={{ color:"rgba(255,255,255,0.82)", fontSize:13, lineHeight:1.6, marginBottom:8 }}>
              Colonial Beach's go-to auto repair shop and used car dealer. Family business with over 66 years of the Britt name in the car business. Rated 4.8 stars across 45 reviews — Bill and his family are known for integrity, fair dealing, and genuine care for the Colonial Beach community. NAPA Auto Care certified. Also sells quality pre-owned vehicles.
            </div>
            <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"8px 10px", marginBottom:8 }}>
              <div style={{ color:"#f9ca24", fontSize:11, fontWeight:700, marginBottom:3 }}>🔧 Services:</div>
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>Engine repair · Tune-ups · Tires · Brakes & rotors · General maintenance · Pre-owned vehicle sales · NAPA Auto Care certified</div>
            </div>
            <div style={{ background:"rgba(249,202,36,0.1)", border:"1px solid rgba(249,202,36,0.25)", borderRadius:8, padding:"8px 10px", marginBottom:6 }}>
              <div style={{ color:"#f9ca24", fontSize:11, fontWeight:700, marginBottom:2 }}>💬 What locals say:</div>
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, fontStyle:"italic" }}>"Bill and his family have a proven track record of integrity… He truly cares about CB, his business' reputation and giving back."</div>
            </div>
            <a href="https://www.billbrittmtrs.com" target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>🔗 billbrittmtrs.com</a>
          </Card>

          <div style={{ color:"#f9ca24", fontSize:11, fontWeight:700, marginBottom:6, marginTop:14, letterSpacing:1 }}>🚗 PARTS & SUPPLIES</div>
          <Card>
            <div style={{ color:"#fff", fontWeight:700 }}>C&B Auto Parts (NAPA)</div>
            <Addr address="Colonial Beach, VA"/>
            <Ph phone="(804) 224-0080"/>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>Auto parts, supplies, and accessories. NAPA dealer — full inventory for most makes and models.</div>
          </Card>
          <Card>
            <div style={{ color:"#fff", fontWeight:700 }}>Costello's Ace Hardware</div>
            <Addr address="535 Euclid Ave, Colonial Beach, VA 22443"/>
            <Ph phone="(804) 224-8996"/>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>Hardware, tools, and basic automotive supplies. Great for quick fixes and supplies.</div>
          </Card>

          <div style={{ color:"#f9ca24", fontSize:11, fontWeight:700, marginBottom:6, marginTop:14, letterSpacing:1 }}>🔧 NEARBY REPAIR SHOPS (~20 MIN)</div>
          <Card>
            <div style={{ color:"#fff", fontWeight:700 }}>King George Auto Repair (multiple shops)</div>
            <Addr address="Kings Hwy corridor, King George, VA"/>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>Several independent and franchise auto repair shops along the Kings Highway corridor in King George for specialized work or second opinions.</div>
          </Card>
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
            <div style={{ color:"#f9ca24", fontSize:11, fontWeight:700, marginBottom:3 }}>💡 Breakdown on Rte 205?</div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>Colonial Beach does not have 24-hour roadside assistance locally. Keep AAA or your insurance's roadside number handy. Nearest towing typically dispatched from King George or Fredericksburg.</div>
          </div>
        </div>
      )}

      {resTab === "airbnbrules" && (
        <Card>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>📋 Short-Term Rental / Airbnb Rules</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 10 }}>
            Colonial Beach has adopted short-term rental (STR) regulations. Key requirements as of recent ordinances:
          </div>
          {[
            ["📜 Business License", "Required annually from the Town of Colonial Beach. Apply at Town Hall: (804) 224-7181"],
            ["🏠 Owner Occupancy", "Some zones require owner to reside on property or nearby. Verify with zoning office."],
            ["🔒 Safety Requirements", "Smoke detectors, carbon monoxide detectors, and fire extinguishers required in all units."],
            ["👥 Occupancy Limits", "Maximum occupancy based on bedroom count — typically 2 guests per bedroom."],
            ["🚗 Parking", "Adequate off-street parking required. Cannot block neighboring driveways or streets."],
            ["📞 Local Contact", "A 24/7 emergency contact must be reachable and able to respond within 1 hour."],
            ["💰 Transient Occupancy Tax", "Hosts must collect and remit Virginia lodging/transient occupancy tax (~5%)."],
            ["🚫 Noise / Nuisance", "Town noise ordinance applies. Violation can result in license revocation."],
          ].map(([title, detail], i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 8, marginBottom: 8 }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{title}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{detail}</div>
            </div>
          ))}
          <div style={{ background: "rgba(231,76,60,0.2)", border: "1px solid #e74c3c", borderRadius: 10, padding: 10, marginTop: 6 }}>
            <div style={{ color: "#e74c3c", fontWeight: 700, fontSize: 13 }}>⚠️ Always Verify Current Regulations</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 }}>
              STR regulations can change. Contact Colonial Beach Town Hall at (804) 224-7181 or visit colonialbeachva.net for the most current rules before listing your property.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────

function HistoryTab() {
  const [expanded, setExpanded] = useState(null);
  const catColors = { "In Town":"#f9ca24", "Near Town":"#6ab04c", "~15 min drive":"#5dade2", "~20 min drive":"#5dade2", "~25 min drive":"#5dade2", "Local History":"#b39ddb" };
  return (
    <div>
      <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>🏛 History & Historical Sites</h2>
      <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, lineHeight:1.5 }}>
        Colonial Beach sits at the heart of one of the most historically rich regions in America — birthplace of three of the first five U.S. Presidents.
      </div>
      {HISTORY_SITES.map((site, i) => {
        const accentColor = catColors[site.category] || "#f9ca24";
        return (
          <Card key={i} accent={accentColor}>
            <div onClick={() => setExpanded(expanded===i?null:i)} role="button" aria-expanded={expanded===i}
              style={{ cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, fontFamily:"Georgia,serif" }}>{site.name}</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, marginTop:2 }}>{site.era}</div>
                <div style={{ display:"flex", gap:6, marginTop:4, flexWrap:"wrap" }}>
                  <span style={{ background:`${accentColor}22`, border:`1px solid ${accentColor}`, color:accentColor, fontSize:10, borderRadius:8, padding:"2px 7px" }}>{site.category}</span>
                </div>
              </div>
              <span style={{ color:"rgba(255,255,255,0.4)", fontSize:16, marginLeft:8 }}>{expanded===i?"▲":"▼"}</span>
            </div>
            {expanded===i && (
              <div style={{ marginTop:10, borderTop:"1px solid rgba(255,255,255,0.12)", paddingTop:10 }}>
                <Addr address={site.address}/>
                {site.phone && <Ph phone={site.phone}/>}
                {site.hours && <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginBottom:8 }}>🕐 {site.hours}</div>}
                <div style={{ color:"rgba(255,255,255,0.85)", fontSize:13, lineHeight:1.6, marginBottom:10 }}>{site.desc}</div>
                {site.fun && (
                  <div style={{ background:"rgba(249,202,36,0.1)", border:"1px solid rgba(249,202,36,0.3)", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                    <div style={{ color:"#f9ca24", fontSize:12, fontWeight:700, marginBottom:3 }}>💡 Did You Know?</div>
                    <div style={{ color:"rgba(255,255,255,0.82)", fontSize:12, lineHeight:1.6 }}>{site.fun}</div>
                  </div>
                )}
                {site.link && <a href={site.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>🔗 Learn More</a>}
              </div>
            )}
          </Card>
        );
      })}
      <Card style={{ marginTop:8 }}>
        <div style={{ color:"#fff", fontWeight:700, marginBottom:8 }}>📜 Quick History Timeline</div>
        {[
          ["500 B.C.", "Native Americans settle the area"],
          ["1608", "Captain John Smith explores the Potomac River"],
          ["1650", "Monroe's great-great grandfather settles the region"],
          ["1657", "Washington family acquires land at Popes Creek"],
          ["1732", "George Washington born at Popes Creek"],
          ["1758", "James Monroe born near Colonial Beach"],
          ["1807", "Robert E. Lee born at Stratford Hall"],
          ["1878", "Colonial Beach development begins as a resort town"],
          ["1883", "Bell House built; steamboats bring DC visitors weekly"],
          ["1886", "Alexander Melville Bell purchases the Bell House"],
          ["1906", "Steamers transporting thousands of visitors from DC"],
          ["1940s–50s", "Casino era: gambling piers built over Maryland water"],
          ["1958", "Casino era ends under pressure from civic groups"],
          ["1987", "Bell House listed on National Register of Historic Places"],
        ].map(([year, event]) => (
          <div key={year} style={{ display:"flex", gap:10, paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ color:"#f9ca24", fontSize:11, fontWeight:700, whiteSpace:"nowrap", minWidth:60 }}>{year}</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>{event}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function RelaxTab() {
  return (
    <div>
      <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>💆 Relax & Spa</h2>
      <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, lineHeight:1.5 }}>
        You're at the beach — you deserve it. Massage, bodywork, and wellness options in and around Colonial Beach.
      </div>
      {RELAX_SPOTS.map((spot, i) => (
        <Card key={i} accent={spot.highlight==="In Town"?"#a8d5d5":spot.highlight==="Free"?"#6ab04c":spot.highlight&&spot.highlight.includes("Infrared")?"#b39ddb":"rgba(255,255,255,0.3)"}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15, flex:1 }}>{spot.name}</div>
            {spot.highlight && (
              <span style={{
                background: spot.highlight==="In Town"?"rgba(168,213,213,0.2)":spot.highlight==="Free"?"rgba(106,176,76,0.2)":"rgba(255,255,255,0.1)",
                border:`1px solid ${spot.highlight==="In Town"?"#a8d5d5":spot.highlight==="Free"?"#6ab04c":"rgba(255,255,255,0.3)"}`,
                color: spot.highlight==="In Town"?"#a8d5d5":spot.highlight==="Free"?"#6ab04c":"rgba(255,255,255,0.7)",
                fontSize:10, borderRadius:8, padding:"2px 8px", marginLeft:8, whiteSpace:"nowrap"
              }}>{spot.highlight}</span>
            )}
          </div>
          <Addr address={spot.address}/>
          {spot.phone && spot.phone !== "Check website" && spot.phone !== "Check Facebook" && <Ph phone={spot.phone}/>}
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, marginBottom:8 }}>🕐 {spot.hours}</div>
          <div style={{ color:"rgba(255,255,255,0.82)", fontSize:13, lineHeight:1.6, marginBottom:8 }}>{spot.desc}</div>
          <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"8px 10px", marginBottom:8 }}>
            <div style={{ color:"#a8d5d5", fontSize:11, fontWeight:700, marginBottom:3 }}>✨ Services:</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>{spot.services.join(" · ")}</div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {spot.link && <a href={spot.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>🔗 Book Online</a>}
            {spot.facebook && <a href={spot.facebook} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>👍 Facebook</a>}
          </div>
        </Card>
      ))}
      <Card>
        <div style={{ color:"#fff", fontWeight:700, marginBottom:8 }}>🌅 More Ways to Unwind</div>
        {[
          ["🌊", "Sunrise beach walk", "The Town Beach at 6am is nearly empty and breathtaking. Watch osprey dive for fish in the calm morning light."],
          ["🚣", "Kayak Monroe Bay", "Flat-calm bay makes for peaceful paddling. Rentals at the boat ramp. Early morning is magical."],
          ["🧘", "Yoga on the beach", "Colonial Beach Brewing and local practitioners offer seasonal outdoor yoga sessions. Check their Facebook pages."],
          ["🎣", "Fishing therapy", "Ask any local — there's nothing more relaxing than dropping a line off the pier at Monroe Bay at dusk."],
          ["🌅", "Boardwalk at sunset", "Grab a drink from the Black Pearl Tiki Bar and watch the sun go down over the Potomac. Pure bliss."],
          ["🦅", "Eagle watching at Caledon", "Sitting quietly in the forest watching bald eagles is one of the most peaceful experiences the region offers."],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ display:"flex", gap:10, borderBottom:"1px solid rgba(255,255,255,0.07)", paddingBottom:10, marginBottom:10 }}>
            <span style={{ fontSize:20, lineHeight:1.3 }}>{icon}</span>
            <div>
              <div style={{ color:"#a8d5d5", fontWeight:700, fontSize:13 }}>{title}</div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, lineHeight:1.5, marginTop:2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

const BAIT_TACKLE = [
  {
    name: "Kimmie Ann Bait and Tackle",
    address: "3030 Kings Highway, Colonial Beach, VA 22443",
    phone: "(804) 224-5606",
    email: "kafishing@yahoo.com",
    hours: "Thu–Fri 9am–5pm · Check Facebook for current hours",
    desc: "The go-to local bait and tackle shop. 10+ years making handmade custom rockfish lures right here in the Northern Neck. Full line of live bait — shiners, bloodworms, night crawlers, peelers, and eels. Fresh and saltwater tackle, crabbing supplies, boating, camping, and hunting items. Also carries Calcutta & Brackish Life apparel.",
    featured: true,
    facebook: "https://www.facebook.com/KimmieAnnBaitandTackle/",
  },
];

const POTOMAC_SPECIES = [
  { name: "Striped Bass (Rockfish)", emoji: "🐟", season: "Spring & Fall", best: "Apr–Jun, Sep–Nov", size: "18\" minimum (check current regs)", method: "Trolling, jigging, live-lining, chumming", notes: "The Potomac's most prized catch. Huge runs in spring. Trophy fish available. CB's signature species — Reel M N and other charters specialize in these." },
  { name: "White Perch", emoji: "🐟", season: "Year-Round", best: "Spring & summer peak", size: "No size limit", method: "Light tackle, bottom fishing, small jigs", notes: "Abundant and delicious. Perfect panfish — great for beginners and kids. Often caught from the beach and docks." },
  { name: "Yellow Perch", emoji: "🐟", season: "Winter–Spring", best: "Jan–Apr", size: "No size limit", method: "Small jigs, live bait", notes: "Excellent eating. Peak action in late winter around the Monroe Bay area." },
  { name: "Largemouth Bass", emoji: "🐟", season: "Spring–Fall", best: "Apr–Oct", size: "12\" minimum", method: "Soft plastics, topwater lures, spinnerbaits", notes: "Good populations in Monroe Bay and tidal creeks. Excellent light tackle fishing." },
  { name: "Blue Catfish", emoji: "🐟", season: "Year-Round", best: "Summer", size: "No size limit (check regs — invasive)", method: "Cut bait, chicken liver, bottom rigs", notes: "Enormous population in the Potomac. Large fish common. Great night fishing from the beach or piers. Invasive species — no bag limit in many areas." },
  { name: "Channel Catfish", emoji: "🐟", season: "Spring–Fall", best: "May–Sep", size: "No size limit", method: "Cut bait, nightcrawlers, stink bait", notes: "Widely distributed throughout the Potomac. Great table fare. Can be caught from shore." },
  { name: "Spot", emoji: "🐟", season: "Summer–Fall", best: "Jul–Oct", size: "No size limit", method: "Bottom fishing, bloodworms, cut bait", notes: "Classic Potomac summer fish. Run in huge numbers. Easy to catch and excellent eating — a local favorite." },
  { name: "Croaker", emoji: "🐟", season: "Summer", best: "Jun–Sep", size: "No size limit", method: "Bottom fishing, bloodworms, cut shrimp", notes: "Named for the croaking sound it makes. Great fun on light tackle. Often caught alongside spot." },
  { name: "Bluefish", emoji: "🐟", season: "Summer–Fall", best: "Jun–Oct", size: "No size limit", method: "Trolling, surface poppers, metal lures", notes: "Aggressive fighters — great for kids. Run in schools. Watch your fingers — sharp teeth!" },
  { name: "American Shad", emoji: "🐟", season: "Spring", best: "Mar–May", size: "Check VMRC regs (tidal waters)", method: "Small darts, shad rigs", notes: "Historic Potomac run. Exciting light tackle fishing. Check current VMRC regulations for tidal Potomac rules." },
  { name: "Cobia", emoji: "🐟", season: "Summer", best: "Jun–Aug", size: "37\" minimum", method: "Live eels, large jigs, sight fishing", notes: "Trophy fish that can exceed 50 lbs. Found near channel markers and structure. Highly prized game fish." },
  { name: "Blue Crab", emoji: "🦀", season: "Spring–Fall", best: "May–Oct", size: "5\" point to point minimum", method: "Crab pots, trotlines, chicken necks", notes: "The Chesapeake Bay's most iconic catch! Monroe Bay and the docks are excellent. Kids love crabbing off the beach. Blue crab license required." },
];

function FishingTab() {
  const [section, setSection] = useState("charters");
  const [openSpecies, setOpenSpecies] = useState(null);

  const sections = [
    { id: "charters", label: "🚢 Charters" },
    { id: "bait", label: "🪝 Bait & Tackle" },
    { id: "species", label: "🐟 Species" },
    { id: "regs", label: "📋 Regs" },
    { id: "license", label: "🪪 License" },
  ];

  return (
    <div>
      <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:10 }}>🎣 Fishing the Potomac</h2>

      {/* Section selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }} role="tablist" aria-label="Fishing sections">
        {sections.map(s => (
          <button key={s.id} role="tab" aria-selected={section===s.id} onClick={() => setSection(s.id)}
            style={{ background:section===s.id?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.07)", border:`1px solid ${section===s.id?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.15)"}`, color:"#fff", borderRadius:16, padding:"7px 12px", cursor:"pointer", fontSize:12, whiteSpace:"nowrap", fontWeight:section===s.id?700:400, transition:"all 0.15s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── CHARTERS ── */}
      {section === "charters" && (
        <div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>The Potomac River is world-class for rockfish, perch, catfish, and more.</div>
          {CHARTER_BOATS.map((item, i) => (
            <Card key={i} accent={item.featured ? "#f9ca24" : undefined}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:item.featured?15:14, flex:1 }}>{item.name}</div>
                {item.featured && <span style={{ background:"rgba(249,202,36,0.2)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px", marginLeft:8, whiteSpace:"nowrap" }}>⭐ Top Pick</span>}
              </div>
              {item.captain && <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:4 }}>👨‍✈️ {item.captain}</div>}
              <Addr address={item.address}/>
              {item.phone && item.phone !== "Call for booking info" && <Ph phone={item.phone}/>}
              <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"6px 10px", margin:"8px 0" }}>
                <div style={{ color:"#5dade2", fontSize:11, fontWeight:700, marginBottom:2 }}>🐟 Target Species:</div>
                <div style={{ color:"rgba(255,255,255,0.78)", fontSize:12 }}>{item.species.join(" · ")}</div>
              </div>
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, lineHeight:1.5 }}>{item.desc}</div>
              {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none", display:"inline-block", marginTop:6 }}>👍 Facebook</a>}
            </Card>
          ))}
        </div>
      )}

      {/* ── BAIT & TACKLE ── */}
      {section === "bait" && (
        <div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>Local knowledge makes all the difference — stop in and ask what's biting.</div>
          {BAIT_TACKLE.map((item, i) => (
            <Card key={i} accent={item.featured ? "#f9ca24" : undefined}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, flex:1 }}>{item.name}</div>
                {item.featured && <span style={{ background:"rgba(249,202,36,0.2)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px", marginLeft:8, whiteSpace:"nowrap" }}>⭐ Local Fave</span>}
              </div>
              <Addr address={item.address}/>
              <Ph phone={item.phone}/>
              <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginBottom:8 }}>🕐 {item.hours}</div>
              <div style={{ color:"rgba(255,255,255,0.82)", fontSize:13, lineHeight:1.6, marginBottom:8 }}>{item.desc}</div>
              {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>👍 Facebook</a>}
            </Card>
          ))}
          <Card>
            <div style={{ color:"#fff", fontWeight:700, marginBottom:6 }}>🪝 Live Bait Available At:</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.8 }}>
              • Kimmie Ann Bait & Tackle — live shiners, eels, peelers, bloodworms<br/>
              • 7-Eleven — Colonial Beach (in town) — live bait<br/>
              • Monroe Bay Campground Camp Store — basic bait supplies<br/>
              • Walmart King George (~20 min) — frozen bait and basic tackle
            </div>
          </Card>
        </div>
      )}

      {/* ── SPECIES GUIDE ── */}
      {section === "species" && (
        <div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>Tap any species to see season, size limits, and how to catch them.</div>
          {POTOMAC_SPECIES.map((fish, i) => (
            <div key={i} onClick={() => setOpenSpecies(openSpecies===i?null:i)}
              role="button" aria-expanded={openSpecies===i} tabIndex={0}
              onKeyDown={e => e.key==="Enter" && setOpenSpecies(openSpecies===i?null:i)}
              style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"11px 13px", marginBottom:7, cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:20 }}>{fish.emoji}</span>
                  <div>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{fish.name}</div>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>Best: {fish.best}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ background:"rgba(93,173,226,0.2)", border:"1px solid #5dade2", color:"#5dade2", fontSize:10, borderRadius:8, padding:"2px 7px", whiteSpace:"nowrap" }}>{fish.season}</span>
                  <span style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>{openSpecies===i?"▲":"▼"}</span>
                </div>
              </div>
              {openSpecies===i && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                    <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"6px 9px" }}>
                      <div style={{ color:"#f9ca24", fontSize:10, fontWeight:700 }}>📏 SIZE LIMIT</div>
                      <div style={{ color:"rgba(255,255,255,0.85)", fontSize:12, marginTop:2 }}>{fish.size}</div>
                    </div>
                    <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"6px 9px" }}>
                      <div style={{ color:"#6ab04c", fontSize:10, fontWeight:700 }}>🎣 METHOD</div>
                      <div style={{ color:"rgba(255,255,255,0.85)", fontSize:12, marginTop:2 }}>{fish.method}</div>
                    </div>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.78)", fontSize:13, lineHeight:1.6 }}>{fish.notes}</div>
                </div>
              )}
            </div>
          ))}
          <div style={{ background:"rgba(249,202,36,0.1)", border:"1px solid rgba(249,202,36,0.3)", borderRadius:10, padding:"10px 13px", marginTop:4 }}>
            <div style={{ color:"#f9ca24", fontSize:12, fontWeight:700, marginBottom:3 }}>⚠️ Always Verify Current Regulations</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, lineHeight:1.5 }}>Size and creel limits change seasonally. Always check current Virginia DWR and VMRC rules before fishing.</div>
          </div>
        </div>
      )}

      {/* ── REGS ── */}
      {section === "regs" && (
        <div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, lineHeight:1.6 }}>
            The Potomac River at Colonial Beach has both freshwater and saltwater fishing zones. Rules are set by two agencies depending on where and what you're fishing.
          </div>
          <Card accent="#5dade2">
            <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:4 }}>🌊 Saltwater / Tidal Potomac</div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, lineHeight:1.6, marginBottom:10 }}>
              Regulated by the <strong>Virginia Marine Resources Commission (VMRC)</strong>. Covers striped bass (rockfish), bluefish, cobia, shad, and blue crab in tidal waters.
            </div>
            <a href="https://mrc.virginia.gov/recreational.shtm" target="_blank" rel="noopener noreferrer"
              style={{ display:"block", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(93,173,226,0.4)", borderRadius:8, padding:"10px 12px", textDecoration:"none", marginBottom:8 }}>
              <div style={{ color:"#5dade2", fontWeight:700, fontSize:13 }}>📋 VMRC Recreational Fishing Regulations</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2 }}>mrc.virginia.gov — Striped bass, blue crab, shad, bluefish rules</div>
            </a>
            <a href="https://mrc.virginia.gov/regulations/index.shtm" target="_blank" rel="noopener noreferrer"
              style={{ display:"block", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(93,173,226,0.4)", borderRadius:8, padding:"10px 12px", textDecoration:"none" }}>
              <div style={{ color:"#5dade2", fontWeight:700, fontSize:13 }}>📘 VMRC Fishing Regulations Guide (PDF)</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2 }}>Size limits, bag limits, seasons — full regulations</div>
            </a>
          </Card>
          <Card accent="#6ab04c">
            <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:4 }}>🏞 Freshwater / Inland Waters</div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, lineHeight:1.6, marginBottom:10 }}>
              Regulated by <strong>Virginia Department of Wildlife Resources (DWR)</strong>. Covers bass, catfish, perch, and freshwater species in inland/non-tidal waters.
            </div>
            <a href="https://www.dgif.virginia.gov/fishing/regulations/" target="_blank" rel="noopener noreferrer"
              style={{ display:"block", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(106,176,76,0.4)", borderRadius:8, padding:"10px 12px", textDecoration:"none", marginBottom:8 }}>
              <div style={{ color:"#6ab04c", fontWeight:700, fontSize:13 }}>📋 Virginia DWR Freshwater Fishing Regulations</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2 }}>dgif.virginia.gov — Bass, catfish, perch, panfish rules</div>
            </a>
            <a href="https://www.dgif.virginia.gov/fishing/regulations/game/" target="_blank" rel="noopener noreferrer"
              style={{ display:"block", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(106,176,76,0.4)", borderRadius:8, padding:"10px 12px", textDecoration:"none" }}>
              <div style={{ color:"#6ab04c", fontWeight:700, fontSize:13 }}>📘 General Freshwater Regulations</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2 }}>Creel limits, size limits, gear rules</div>
            </a>
          </Card>
          <Card>
            <div style={{ color:"#f9ca24", fontWeight:700, marginBottom:8 }}>💡 Key Rules to Know</div>
            {[
              ["📏","Size & creel limits","Always check current limits for your target species — rockfish limits change seasonally."],
              ["🦀","Blue crab license","A separate VMRC crabbing license is required. Available online or at license agents."],
              ["📵","No SCUBA fishing","It is illegal to use SCUBA gear to take fish in Virginia."],
              ["🪝","Trotlines & setlines","Must be removed from public waters when not in use."],
              ["🪪","License required","All anglers 16+ must carry a valid license. See the License tab."],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{ display:"flex", gap:10, paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <div>
                  <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{title}</div>
                  <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginTop:2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── LICENSE ── */}
      {section === "license" && (
        <div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, lineHeight:1.6 }}>
            All anglers age 16 and older must have a valid license. Virginia requires <strong>separate licenses</strong> for freshwater and saltwater fishing.
          </div>
          <a href="https://gooutdoorsvirginia.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block", marginBottom:10 }}>
            <Card accent="#f9ca24" style={{ margin:0 }}>
              <div style={{ color:"#f9ca24", fontWeight:900, fontSize:16, marginBottom:4 }}>🪪 Buy Your License Online</div>
              <div style={{ color:"rgba(255,255,255,0.85)", fontSize:14, fontWeight:600, marginBottom:4 }}>GoOutdoorsVirginia.com</div>
              <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12, lineHeight:1.6 }}>Virginia's official licensing portal. Buy freshwater, saltwater, or combination licenses. Instant digital license — fish the same day. Also available by phone: 1-866-721-6911.</div>
              <div style={{ color:"#f9ca24", fontSize:13, fontWeight:700, marginTop:8 }}>Tap to buy → gooutdoorsvirginia.com ↗</div>
            </Card>
          </a>
          <Card>
            <div style={{ color:"#fff", fontWeight:700, marginBottom:10 }}>💰 Common License Fees (approximate)</div>
            {[
              ["Resident Freshwater — Annual","$23"],
              ["Resident Saltwater — Annual","$18"],
              ["Resident Combo Fresh + Salt — Annual","$34"],
              ["Non-Resident Freshwater — Annual","$47"],
              ["Non-Resident Saltwater — Annual","$45"],
              ["Non-Resident Freshwater — 5-Day Trip","$28"],
              ["Blue Crab Recreational License","Free (VMRC registration required)"],
              ["Under age 16","FREE — no license required"],
              ["Virginia resident age 65+","Reduced fee available"],
            ].map(([type, fee]) => (
              <div key={type} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:7, marginBottom:7, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12, flex:1 }}>{type}</div>
                <div style={{ color:"#f9ca24", fontWeight:700, fontSize:13, marginLeft:10 }}>{fee}</div>
              </div>
            ))}
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:4 }}>* Fees subject to change. Verify current fees at gooutdoorsvirginia.com</div>
          </Card>
          <Card>
            <div style={{ color:"#fff", fontWeight:700, marginBottom:8 }}>🏪 Buy In Person Locally</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.8 }}>
              • <strong>Kimmie Ann Bait & Tackle</strong> — 3030 Kings Hwy, Colonial Beach<br/>
              • <strong>Walmart — King George</strong> (~20 min)<br/>
              • <strong>Walmart — Fredericksburg</strong> (~35 min)
            </div>
          </Card>
          <Card>
            <div style={{ color:"#fff", fontWeight:700, marginBottom:6 }}>🦀 Blue Crab License</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.6 }}>Recreational crabbing requires VMRC registration — free for Virginia residents. Register online or by phone.</div>
            <a href="https://mrc.virginia.gov/recreational.shtm" target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none", display:"block", marginTop:6 }}>🔗 VMRC Crab Registration</a>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── FAVORITES SYSTEM ─────────────────────────────────────────────────────────
// Persists saved places across sessions via window.storage

async function getFavorites() {
  try {
    const r = await window.storage.get("cb_favorites");
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

async function toggleFavorite(id, name) {
  const favs = await getFavorites();
  const idx = favs.findIndex(f => f.id === id);
  let next;
  if (idx > -1) { next = favs.filter(f => f.id !== id); }
  else { next = [...favs, { id, name, savedAt: Date.now() }]; }
  try { await window.storage.set("cb_favorites", JSON.stringify(next)); } catch {}
  return next;
}

function HeartBtn({ id, name, favs, setFavs }) {
  const isSaved = favs.some(f => f.id === id);
  const [busy, setBusy] = useState(false);
  const handle = async (e) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = await toggleFavorite(id, name);
    setFavs(next);
    setBusy(false);
  };
  return (
    <button onClick={handle} aria-label={isSaved ? "Remove from saved" : "Save this place"}
      style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, lineHeight:1, padding:"2px 4px", color: isSaved ? "#ff6b9d" : "rgba(255,255,255,0.3)", transition:"all 0.15s" }}>
      {isSaved ? "❤️" : "🤍"}
    </button>
  );
}

// ─── OPEN NOW HELPER ──────────────────────────────────────────────────────────

function parseOpenNow(hours) {
  if (!hours || hours.includes("Check") || hours.includes("Seasonal") || hours.includes("Call") || hours.includes("Closed")) return null;
  try {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const mins = now.getHours() * 60 + now.getMinutes();
    const dayNames = ["sun","mon","tue","wed","thu","fri","sat"];
    const today = dayNames[day];
    const h = hours.toLowerCase();

    // Try to find if today is mentioned as closed
    const closedDays = { mon: /mon(?:day)?\s+closed/.test(h), tue: /tue(?:sday)?\s+closed/.test(h), wed: /wed(?:nesday)?\s+closed/.test(h), thu: /thu(?:rsday)?\s+closed/.test(h), fri: /fri(?:day)?\s+closed/.test(h), sat: /sat(?:urday)?\s+closed/.test(h), sun: /sun(?:day)?\s+closed/.test(h) };
    if (closedDays[today]) return { open: false, label: "Closed today" };

    // Simple time range extraction — look for patterns like "8am–2pm"
    const timeRanges = [...h.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–\-to]+\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/g)];
    if (!timeRanges.length) return null;

    for (const m of timeRanges) {
      let openH = parseInt(m[1]), openM = parseInt(m[2]||0), openAmPm = m[3];
      let closeH = parseInt(m[4]), closeM = parseInt(m[5]||0), closeAmPm = m[6];
      if (openAmPm === "pm" && openH !== 12) openH += 12;
      if (openAmPm === "am" && openH === 12) openH = 0;
      if (closeAmPm === "pm" && closeH !== 12) closeH += 12;
      if (closeAmPm === "am" && closeH === 12) closeH = 0;
      const openMins = openH * 60 + openM;
      const closeMins = closeH * 60 + closeM;
      if (mins >= openMins && mins < closeMins) {
        const closeStr = `${closeH > 12 ? closeH-12 : closeH}:${String(closeM).padStart(2,"0")}${closeH >= 12 ? "pm":"am"}`;
        return { open: true, label: `Open · closes ${closeStr}` };
      }
      if (mins < openMins) {
        const openStr = `${openH > 12 ? openH-12 : openH}${openM?":"+String(openM).padStart(2,"0"):""}${openH >= 12 ? "pm":"am"}`;
        return { open: false, label: `Opens at ${openStr}` };
      }
    }
    return { open: false, label: "Closed now" };
  } catch { return null; }
}

function OpenNowBadge({ hours }) {
  const status = parseOpenNow(hours);
  if (!status) return null;
  return (
    <span style={{
      display:"inline-block", fontSize:10, borderRadius:8, padding:"2px 7px", marginLeft:6,
      background: status.open ? "rgba(106,176,76,0.2)" : "rgba(231,76,60,0.2)",
      border: `1px solid ${status.open ? "#6ab04c" : "#e74c3c"}`,
      color: status.open ? "#6ab04c" : "#e74c3c",
      whiteSpace:"nowrap",
    }}>{status.open ? "🟢" : "🔴"} {status.label}</span>
  );
}

// ─── EVENTS TAB (date-aware upcoming events) ──────────────────────────────────

function EventsTab({ onNavigate }) {
  const [filter, setFilter] = useState("upcoming"); // upcoming | all | weekend

  const now = new Date();
  const todayM = now.getMonth() + 1;
  const todayD = now.getDate();
  const dayOfWeek = now.getDay();
  // Days to next Friday/Sunday (for weekend)
  const daysToFri = (5 - dayOfWeek + 7) % 7;
  const daysToSun = (7 - dayOfWeek) % 7 || 7;
  const fridayM = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToFri).getMonth() + 1;
  const fridayD = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToFri).getDate();
  const sundayM = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSun).getMonth() + 1;
  const sundayD = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSun).getDate();

  // Check 2nd Friday
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const firstFriday = 1 + ((5 - firstDay + 7) % 7);
  const secondFriday = firstFriday + 7;
  const isArtWalkWeek = (todayD >= secondFriday - 2 && todayD <= secondFriday);

  function eventScore(f) {
    if (!f.month) return isArtWalkWeek ? 0 : 999;
    const fDate = f.month * 100 + f.day;
    const todayDate = todayM * 100 + todayD;
    return fDate >= todayDate ? fDate - todayDate : 10000 + (todayDate - fDate);
  }

  function isThisWeekend(f) {
    if (!f.month) return isArtWalkWeek;
    const start = f.month * 100 + f.day;
    const end = f.month * 100 + (f.endDay || f.day);
    const fri = fridayM * 100 + fridayD;
    const sun = sundayM * 100 + sundayD;
    return start <= sun && end >= fri;
  }

  function isToday(f) {
    if (!f.month) return dayOfWeek === 5 && todayD === secondFriday;
    const start = f.month * 100 + f.day;
    const end = f.month * 100 + (f.endDay || f.day);
    const today = todayM * 100 + todayD;
    return start <= today && end >= today;
  }

  const sorted = [...FESTIVALS].sort((a,b) => eventScore(a) - eventScore(b));
  const displayed = filter === "weekend" ? sorted.filter(isThisWeekend) : filter === "upcoming" ? sorted.slice(0, 8) : sorted;

  const MONTH_NAMES = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div>
      <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:10 }}>📅 Events & Festivals</h2>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {[["upcoming","🗓 Upcoming"],["weekend","🏖 This Weekend"],["all","📋 All Events"]].map(([id,label]) => (
          <button key={id} onClick={() => setFilter(id)}
            style={{ background:filter===id?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.07)", border:`1px solid ${filter===id?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.15)"}`, color:"#fff", borderRadius:16, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:filter===id?700:400, transition:"all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      {displayed.length === 0 && (
        <Card><div style={{ color:"rgba(255,255,255,0.65)", textAlign:"center", padding:"20px 0" }}>No events match this filter right now.</div></Card>
      )}

      {displayed.map((f, i) => {
        const today = isToday(f);
        const weekend = isThisWeekend(f);
        return (
          <Card key={i} accent={today ? "#f9ca24" : weekend ? "#5dade2" : undefined}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, flex:1, lineHeight:1.3 }}>{f.name}</div>
              <div style={{ display:"flex", gap:4, flexShrink:0, marginLeft:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
                {today && <span style={{ background:"rgba(249,202,36,0.25)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px", whiteSpace:"nowrap" }}>⚡ TODAY</span>}
                {!today && weekend && <span style={{ background:"rgba(93,173,226,0.2)", border:"1px solid #5dade2", color:"#5dade2", fontSize:10, borderRadius:8, padding:"2px 7px", whiteSpace:"nowrap" }}>This Weekend</span>}
                {f.month && <span style={{ background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", fontSize:10, borderRadius:8, padding:"2px 7px", whiteSpace:"nowrap" }}>{MONTH_NAMES[f.month]} {f.day}{f.endDay && f.endDay!==f.day?`–${f.endDay}`:""}</span>}
              </div>
            </div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginBottom:4 }}>📍 {f.location}</div>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, marginBottom:6, fontStyle:"italic" }}>📆 {f.date}</div>
            <div style={{ color:"rgba(255,255,255,0.78)", fontSize:12, lineHeight:1.5 }}>{f.desc}</div>
            {f.link && <a href={f.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none", display:"inline-block", marginTop:6 }}>🔗 More info</a>}
          </Card>
        );
      })}

      <Card>
        <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, lineHeight:1.6 }}>
          📌 For the full CB events calendar, visit <a href="https://colonialbeach.org/events" target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", textDecoration:"none" }}>colonialbeach.org/events</a>
        </div>
      </Card>
    </div>
  );
}

// ─── MAP TAB ──────────────────────────────────────────────────────────────────

const MAP_PLACES = [
  // Eat & Drink
  { name:"High Tides on the Potomac",      cat:"eat",      lat:38.2523, lng:-76.9678, address:"205 Taylor St, Colonial Beach, VA" },
  { name:"Dockside Restaurant & Tiki Bar", cat:"eat",      lat:38.2476, lng:-76.9714, address:"1787 Castlewood Dr, Colonial Beach, VA" },
  { name:"Wilkerson's Seafood",            cat:"eat",      lat:38.2612, lng:-76.9724, address:"McKinney Blvd, Colonial Beach, VA" },
  { name:"Lenny's Restaurant",            cat:"eat",      lat:38.2537, lng:-76.9713, address:"301 Colonial Ave, Colonial Beach, VA" },
  { name:"Drift Seafood + Bar",           cat:"eat",      lat:38.2521, lng:-76.9683, address:"101 Taylor St, Colonial Beach, VA" },
  { name:"Ice House Brewery",             cat:"eat",      lat:38.2498, lng:-76.9716, address:"119 Monroe Bay Ave, Colonial Beach, VA" },
  { name:"Colonial Beach Brewing",        cat:"eat",      lat:38.2533, lng:-76.9708, address:"215C Washington Ave, Colonial Beach, VA" },
  { name:"Ola's Country Kitchen",         cat:"eat",      lat:38.2601, lng:-76.9742, address:"1010 McKinney Blvd, Colonial Beach, VA" },
  { name:"Raven's Point Café",            cat:"eat",      lat:38.2538, lng:-76.9705, address:"322 Washington Ave, Colonial Beach, VA" },
  // Cafés
  { name:"Love Bites Coffee & Pastries",  cat:"cafe",     lat:38.2536, lng:-76.9710, address:"234 Colonial Ave, Colonial Beach, VA" },
  { name:"Colonial Buzz Espresso Bar",    cat:"cafe",     lat:38.2533, lng:-76.9708, address:"215 Washington Ave, Colonial Beach, VA" },
  // Lodging
  { name:"Riverview Inn",                 cat:"stay",     lat:38.2528, lng:-76.9682, address:"24 Hawthorne St, Colonial Beach, VA" },
  { name:"River Edge Inn",                cat:"stay",     lat:38.2540, lng:-76.9693, address:"30 Colonial Ave, Colonial Beach, VA" },
  { name:"Wakefield Motel",               cat:"stay",     lat:38.2556, lng:-76.9725, address:"1513 Irving Ave, Colonial Beach, VA" },
  { name:"Monroe Bay Campground",         cat:"stay",     lat:38.2487, lng:-76.9740, address:"1412 Monroe Bay Circle, Colonial Beach, VA" },
  { name:"Thousand Trails Harbor View",   cat:"stay",     lat:38.2442, lng:-76.9718, address:"15 Harbor View Circle, Colonial Beach, VA" },
  // Wineries
  { name:"Monroe Bay Winery",             cat:"wine",     lat:38.2369, lng:-76.9882, address:"4786 James Monroe Hwy, Colonial Beach, VA" },
  { name:"Ingleside Vineyards",           cat:"wine",     lat:38.2010, lng:-76.9620, address:"5872 Leedstown Rd, Oak Grove, VA" },
  // Parks / Beach
  { name:"Colonial Beach Town Beach",     cat:"outdoors", lat:38.2526, lng:-76.9663, address:"Beach Terrace, Colonial Beach, VA" },
  { name:"Monroe Bay Town Park",          cat:"outdoors", lat:38.2487, lng:-76.9728, address:"Monroe Bay Ave, Colonial Beach, VA" },
  { name:"Westmoreland State Park",       cat:"outdoors", lat:38.1540, lng:-76.8651, address:"1650 State Park Rd, Montross, VA" },
  { name:"Caledon State Park",            cat:"outdoors", lat:38.3620, lng:-77.0710, address:"11617 Caledon Rd, King George, VA" },
  // Shopping
  { name:"Magnolia Hall",                 cat:"shop",     lat:38.2541, lng:-76.9711, address:"823 Colonial Ave, Colonial Beach, VA" },
  { name:"Hawthorn Mercantile",           cat:"shop",     lat:38.2524, lng:-76.9688, address:"100 Hawthorn St, Colonial Beach, VA" },
  { name:"Everything's Beachy",           cat:"shop",     lat:38.2520, lng:-76.9675, address:"Boardwalk, Colonial Beach, VA" },
  // Fishing
  { name:"Kimmie Ann Bait & Tackle",      cat:"fishing",  lat:38.2648, lng:-76.9747, address:"3030 Kings Hwy, Colonial Beach, VA" },
  { name:"Monroe Bay Boat Ramp",          cat:"fishing",  lat:38.2490, lng:-76.9730, address:"Monroe Bay Ave, Colonial Beach, VA" },
  // Golf carts
  { name:"T and T Cart Rentals",          cat:"golf",     lat:38.2539, lng:-76.9710, address:"500 Colonial Ave, Colonial Beach, VA" },
  { name:"Custom Cartz LLC",              cat:"golf",     lat:38.2535, lng:-76.9708, address:"614 Colonial Ave, Colonial Beach, VA" },
];

const MAP_COLORS = { eat:"#e74c3c", cafe:"#f7a8c4", stay:"#5dade2", wine:"#b39ddb", outdoors:"#6ab04c", shop:"#f9ca24", fishing:"#00c9b1", golf:"#ff8c42" };
const MAP_LABELS = { eat:"🍽", cafe:"☕", stay:"🏡", wine:"🍷", outdoors:"🌴", shop:"🛍", fishing:"🎣", golf:"🛺" };


function MapTab() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const filters = [
    { id:"all",      label:"🗺 All" },
    { id:"eat",      label:"🍽 Eat" },
    { id:"cafe",     label:"☕ Cafés" },
    { id:"stay",     label:"🏡 Stay" },
    { id:"wine",     label:"🍷 Wineries" },
    { id:"outdoors", label:"🌴 Outdoors" },
    { id:"shop",     label:"🛍 Shop" },
    { id:"fishing",  label:"🎣 Fishing" },
  ];

  const visible = MAP_PLACES.filter(p => activeFilter === "all" || p.cat === activeFilter);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inject Leaflet CSS if not already present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS if not already loaded
    const initMap = () => {
      if (!mapRef.current || leafletMapRef.current) return;
      const L = window.L;
      if (!L) return;

      const map = L.map(mapRef.current, {
        center: [38.2525, -76.9700],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;

      // Fix map size after mount
      setTimeout(() => map.invalidateSize(), 200);
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update markers when filter or selected changes
  useEffect(() => {
    const L = window.L;
    const map = leafletMapRef.current;
    if (!L || !map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add markers for visible places
    visible.forEach(p => {
      const color = MAP_COLORS[p.cat] || "#fff";
      const emoji = MAP_LABELS[p.cat] || "📍";
      const isSelected = selected?.name === p.name;

      const icon = L.divIcon({
        html: `<div style="
          background:${color};
          border:${isSelected ? "3px solid white" : "2px solid rgba(255,255,255,0.7)"};
          border-radius:50%;
          width:${isSelected ? 38 : 30}px;
          height:${isSelected ? 38 : 30}px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:${isSelected ? 18 : 14}px;
          box-shadow:0 2px 8px rgba(0,0,0,0.5);
          transition:all 0.2s;
          cursor:pointer;
        ">${emoji}</div>`,
        className: "",
        iconSize: [isSelected ? 38 : 30, isSelected ? 38 : 30],
        iconAnchor: [isSelected ? 19 : 15, isSelected ? 19 : 15],
      });

      const marker = L.marker([p.lat, p.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Georgia,serif;min-width:160px">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">${p.name}</div>
            ${p.address ? `<div style="font-size:12px;color:#555;margin-bottom:6px">${p.address}</div>` : ""}
            <a href="https://maps.google.com?q=${encodeURIComponent(p.name + " Colonial Beach VA")}" 
               target="_blank" 
               style="color:#0d4f6e;font-size:12px;font-weight:700;text-decoration:none">
              🗺 Get Directions ↗
            </a>
          </div>
        `, { maxWidth: 220 });

      marker.on("click", () => setSelected(p));
      markersRef.current.push(marker);
    });

    // Pan to selected
    if (selected && map) {
      map.flyTo([selected.lat, selected.lng], 16, { duration: 0.8 });
      // Open its popup
      const m = markersRef.current.find((_, i) => visible[i]?.name === selected.name);
      if (m) setTimeout(() => m.openPopup(), 900);
    }
  }, [visible, selected]);

  // Reset to CB overview when filter changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (map && !selected) {
      map.flyTo([38.2525, -76.9700], 14, { duration: 0.6 });
    }
  }, [activeFilter]);

  return (
    <div>
      <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:6 }}>📍 Map</h2>
      <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginBottom:10 }}>
        Tap a place in the list to zoom in · tap map pins for details & directions
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:5, marginBottom:10, overflowX:"auto", scrollbarWidth:"none", msOverflowStyle:"none" }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => { setActiveFilter(f.id); setSelected(null); }}
            style={{ flexShrink:0, background:activeFilter===f.id?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.07)", border:`1px solid ${activeFilter===f.id?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.15)"}`, color:"#fff", borderRadius:16, padding:"6px 12px", cursor:"pointer", fontSize:11, fontWeight:activeFilter===f.id?700:400, whiteSpace:"nowrap" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Leaflet Map container */}
      <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.15)", marginBottom:12, height:300, position:"relative", zIndex:0 }}>
        <div ref={mapRef} style={{ width:"100%", height:"100%" }} />
      </div>

      {/* Selected place detail */}
      {selected && (
        <Card accent={MAP_COLORS[selected.cat]}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{MAP_LABELS[selected.cat]} {selected.name}</div>
            <button onClick={() => setSelected(null)}
              style={{ background:"none", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.6)", borderRadius:6, padding:"2px 8px", cursor:"pointer", fontSize:11 }}>✕</button>
          </div>
          {selected.address && <Addr address={selected.address}/>}
          <a href={`https://maps.google.com?q=${encodeURIComponent(selected.name + " Colonial Beach VA")}`}
            target="_blank" rel="noopener noreferrer"
            style={{ color:"#5dade2", fontSize:13, textDecoration:"none", display:"inline-block", marginTop:8, fontWeight:700 }}>
            🗺 Get Directions in Google Maps ↗
          </a>
        </Card>
      )}

      {/* Place grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:16 }}>
        {visible.map((p, i) => {
          const color = MAP_COLORS[p.cat] || "#fff";
          const isSelected = selected?.name === p.name;
          return (
            <div key={i} onClick={() => setSelected(isSelected ? null : p)}
              style={{ background:isSelected ? `${color}22` : "rgba(255,255,255,0.06)", border:`1px solid ${isSelected ? color : "rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"10px 12px", cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ fontSize:20, marginBottom:3 }}>{MAP_LABELS[p.cat]}</div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:11, lineHeight:1.3 }}>{p.name}</div>
              {isSelected && <div style={{ color:color, fontSize:10, marginTop:3, fontWeight:700 }}>📍 On map</div>}
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ─── SUNRISE / SUNSET ─────────────────────────────────────────────────────────

function SunriseSunset() {
  // Approximate sunrise/sunset for Colonial Beach, VA (lat 38.25)
  // Uses a simple solar calculation
  const [times, setTimes] = useState(null);
  useEffect(() => {
    try {
      const now = new Date();
      const lat = 38.25 * Math.PI / 180;
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
      const B = (360/365) * (dayOfYear - 81) * Math.PI / 180;
      const eqTime = 9.87 * Math.sin(2*B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
      const declination = 23.45 * Math.sin(B) * Math.PI / 180;
      const hourAngle = Math.acos(-Math.tan(lat) * Math.tan(declination)) * 180 / Math.PI;
      const noon = 12 - (75 - -76.97) / 15 - eqTime / 60; // longitude correction
      const rise = noon - hourAngle / 15;
      const set = noon + hourAngle / 15;
      const fmt = (h) => {
        const hrs = Math.floor(h);
        const mins = Math.round((h - hrs) * 60);
        const ampm = hrs >= 12 ? "pm" : "am";
        return `${hrs > 12 ? hrs-12 : hrs === 0 ? 12 : hrs}:${String(mins).padStart(2,"0")} ${ampm}`;
      };
      setTimes({ rise: fmt(rise), set: fmt(set) });
    } catch { setTimes(null); }
  }, []);

  if (!times) return null;
  return (
    <div style={{ display:"flex", gap:8, marginBottom:8 }}>
      <div style={{ flex:1, background:"rgba(255,180,50,0.15)", border:"1px solid rgba(255,180,50,0.3)", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
        <div style={{ fontSize:18 }}>🌅</div>
        <div style={{ color:"rgba(255,180,50,0.9)", fontSize:11, fontWeight:700 }}>Sunrise</div>
        <div style={{ color:"#fff", fontSize:14, fontWeight:700 }}>{times.rise}</div>
      </div>
      <div style={{ flex:1, background:"rgba(255,120,50,0.15)", border:"1px solid rgba(255,120,50,0.3)", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
        <div style={{ fontSize:18 }}>🌇</div>
        <div style={{ color:"rgba(255,150,80,0.9)", fontSize:11, fontWeight:700 }}>Sunset</div>
        <div style={{ color:"#fff", fontSize:14, fontWeight:700 }}>{times.set}</div>
      </div>
    </div>
  );
}

function ContactTab({ favs, setFavs }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10, marginBottom: 12,
    background: "rgba(255,255,255,0.1)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)", fontSize: 14,
    outline: "none", boxSizing: "border-box", fontFamily: "Georgia, serif",
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const subject = encodeURIComponent("Colonial Beach App Feedback");
    const body = encodeURIComponent(
      `Name: ${name || "Not provided"}\nEmail: ${email || "Not provided"}\n\nMessage:\n${message}`
    );
    window.open(`mailto:colonialbeachapp@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:52, marginBottom:8 }}>🌊</div>
        <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, margin:"0 0 6px" }}>
          Colonial Beach App
        </h2>
        <div style={{ color:"rgba(255,255,255,0.65)", fontSize:13, lineHeight:1.6 }}>
          Your guide to the Playground of the Potomac
        </div>
      </div>

      {/* Contact form */}
      <Card>
        <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:14 }}>✉️ Send Us a Message</div>
        <div style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginBottom:14, lineHeight:1.6 }}>
          Have a correction, suggestion, or know a great local business we missed? We'd love to hear from you!
        </div>

        {sent && (
          <div style={{ background:"rgba(106,176,76,0.25)", border:"1px solid #6ab04c", borderRadius:10, padding:"10px 14px", marginBottom:12, color:"#fff", fontSize:13 }}>
            ✅ Opening your email app… Thank you for reaching out!
          </div>
        )}

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          aria-label="Your name"
          style={inputStyle}
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email (optional — for a reply)"
          aria-label="Your email"
          type="email"
          style={inputStyle}
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Your message, suggestion, or correction…"
          aria-label="Your message"
          rows={5}
          style={{ ...inputStyle, resize:"vertical", marginBottom:14 }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          style={{
            width:"100%", padding:"13px", borderRadius:10, fontSize:15, fontWeight:700,
            fontFamily:"Georgia, serif", cursor:message.trim()?"pointer":"not-allowed",
            background:message.trim()?"rgba(93,173,226,0.35)":"rgba(255,255,255,0.08)",
            border:`1px solid ${message.trim()?"#5dade2":"rgba(255,255,255,0.2)"}`,
            color:message.trim()?"#fff":"rgba(255,255,255,0.4)",
            transition:"all 0.2s ease",
          }}
        >
          📧 Send Message
        </button>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, textAlign:"center", marginTop:10 }}>
          Tapping Send opens your email app with your message pre-filled.
        </div>
      </Card>

      {/* Direct email */}
      <Card>
        <div style={{ color:"#fff", fontWeight:700, marginBottom:6 }}>📬 Email Us Directly</div>
        <a href="mailto:colonialbeachapp@gmail.com" style={{ color:"#5dade2", fontSize:15, textDecoration:"none", fontWeight:600 }}>
          colonialbeachapp@gmail.com
        </a>
        <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginTop:5 }}>
          We read every message and aim to respond within a few days.
        </div>
      </Card>

      {/* What to contact about */}
      <Card>
        <div style={{ color:"#fff", fontWeight:700, marginBottom:10 }}>💡 Ways You Can Help</div>
        {[
          ["🏪", "Business corrections", "Hours changed, business closed, or info needs updating?"],
          ["➕", "Missing a local gem?", "Know a great restaurant, shop, or service we missed?"],
          ["📸", "Local knowledge", "Insider tips, seasonal info, or hidden spots to share?"],
          ["🐛", "App issues", "Something not working right? Let us know!"],
          ["💬", "General feedback", "Any ideas to make this app more useful for visitors and residents?"],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ display:"flex", gap:10, borderBottom:"1px solid rgba(255,255,255,0.07)", paddingBottom:9, marginBottom:9 }}>
            <span style={{ fontSize:20, lineHeight:1.3 }}>{icon}</span>
            <div>
              <div style={{ color:"#5dade2", fontWeight:700, fontSize:13 }}>{title}</div>
              <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginTop:2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Saved Places */}
      <Card>
        <div style={{ color:"#fff", fontWeight:700, marginBottom:8 }}>❤️ Your Saved Places</div>
        {(!favs || favs.length === 0) ? (
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.6 }}>
            Tap the 🤍 heart on any restaurant, brewery, or winery to save it here for quick access.
          </div>
        ) : (
          <div>
            {favs.map((f) => (
              <div key={f.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:7, marginBottom:7, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ color:"rgba(255,255,255,0.85)", fontSize:13 }}>❤️ {f.name}</div>
                <button onClick={async () => { const next = await toggleFavorite(f.id, f.name); setFavs(next); }}
                  style={{ background:"none", border:"1px solid rgba(231,76,60,0.4)", color:"rgba(231,76,60,0.7)", borderRadius:6, padding:"2px 8px", fontSize:11, cursor:"pointer" }}>Remove</button>
              </div>
            ))}
            <button onClick={async () => { try { await window.storage.set("cb_favorites", JSON.stringify([])); setFavs([]); } catch {} }}
              style={{ background:"rgba(231,76,60,0.15)", border:"1px solid rgba(231,76,60,0.3)", color:"rgba(231,76,60,0.8)", borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", marginTop:4 }}>
              Clear All Saved Places
            </button>
          </div>
        )}
      </Card>

      {/* About */}
      <Card>
        <div style={{ color:"#fff", fontWeight:700, marginBottom:8 }}>🌴 About This App</div>
        <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.7 }}>
          The Colonial Beach App is a community guide built with love for one of Virginia's most unique little towns — the Playground of the Potomac. Whether you're a first-time visitor or a long-time resident, we hope it makes your time in CB a little easier and a lot more fun.
        </div>
      </Card>
    </div>
  );
}

export default function ColonialBeachApp() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [activeCat, setActiveCat] = useState("eat");
  const [showAnim, setShowAnim] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userBirdPins, setUserBirdPins] = useState([]);
  const [favs, setFavs] = useState([]);

  // Load favorites on mount
  useEffect(() => { getFavorites().then(setFavs); }, []);

  // Animation fires only on category switch (not within-category tab switches)
  const navigate = useCallback((tabId, fromCatSwitch = false) => {
    const tab = MAIN_TABS.find(t => t.id === tabId);
    if (tab) setActiveCat(tab.cat);
    setActiveTab(tabId);
    if (fromCatSwitch) {
      setShowAnim(true);
      setTimeout(() => setShowAnim(false), 4400);
    }
  }, []);

  const catTabs = MAIN_TABS.filter(t => t.cat === activeCat);
  const bg = TAB_BACKGROUNDS[activeTab] || TAB_BACKGROUNDS.restaurants;

  const renderContent = () => {
    switch (activeTab) {
      case "restaurants": return <RestaurantsTab favs={favs} setFavs={setFavs} />;
      case "events": return <EventsTab onNavigate={navigate} />;
      case "map": return <MapTab />;
      case "cafes": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>☕ Cafés</h2>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>
            Sip, snack, and slow down — CB's café scene
          </div>
          {CAFES.map((item, i) => (
            <Card key={i} accent={item.featured ? "#f7a8c4" : undefined}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{item.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {item.featured && <span style={{ background:"rgba(247,168,196,0.2)", border:"1px solid #f7a8c4", color:"#f7a8c4", fontSize:10, borderRadius:8, padding:"2px 8px", whiteSpace:"nowrap" }}>✨ Local Fave</span>}
                  <HeartBtn id={`cafe-${i}`} name={item.name} favs={favs} setFavs={setFavs}/>
                </div>
              </div>
              <Addr address={item.address}/>
              <Ph phone={item.phone}/>
              <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginBottom:8 }}>
                🕐 {item.hours}<OpenNowBadge hours={item.hours}/>
              </div>
              <div style={{ color:"rgba(255,255,255,0.82)", fontSize:13, lineHeight:1.6, marginBottom:8 }}>{item.desc}</div>
              <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"8px 10px", marginBottom:8 }}>
                <div style={{ color:"#f7a8c4", fontSize:11, fontWeight:700, marginBottom:4 }}>⭐ Must Try:</div>
                <div style={{ color:"rgba(255,255,255,0.78)", fontSize:12, lineHeight:1.7 }}>{item.best.join(" · ")}</div>
              </div>
              {item.notes && (
                <div style={{ background:"rgba(247,168,196,0.1)", border:"1px solid rgba(247,168,196,0.3)", borderRadius:8, padding:"7px 10px", marginBottom:8, color:"rgba(255,255,255,0.75)", fontSize:12, lineHeight:1.5 }}>
                  💡 {item.notes}
                </div>
              )}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>🔗 Website</a>}
                {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>👍 Facebook</a>}
              </div>
            </Card>
          ))}
          <Card>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, lineHeight:1.6, fontStyle:"italic" }}>
              Know a café we're missing? Tap <strong>Contact</strong> and let us know!
            </div>
          </Card>
        </div>
      );
      case "shopping": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>🛍 Shopping</h2>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>
            ⭐ highlighted shops are local community favorites
          </div>
          {SHOPPING.map((item, i) => (
            <Card key={i} accent={item.featured ? "#f9ca24" : undefined}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:item.featured?15:14 }}>{item.name}</div>
                {item.featured && <span style={{ background:"rgba(249,202,36,0.2)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px", marginLeft:8, whiteSpace:"nowrap" }}>⭐ Local Fave</span>}
              </div>
              <Addr address={item.address}/>
              {item.phone && <Ph phone={item.phone}/>}
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginTop:4, lineHeight:1.5 }}>{item.desc}</div>
              {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none", display:"block", marginTop:5 }}>👍 Follow on Facebook</a>}
            </Card>
          ))}
        </div>
      );
      case "golfcarts": return (
        <SimpleListTab title="🛺 Golf Cart Rentals" items={GOLF_CARTS} renderItem={(item) => (
          <><div style={{ color:"#fff", fontWeight:700 }}>{item.name}</div><Addr address={item.address}/><Ph phone={item.phone}/><div style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>🕐 {item.hours}</div><div style={{ color:"#6ab04c", fontSize:12 }}>💰 {item.rates}</div><div style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginTop:4, lineHeight:1.5 }}>{item.notes}</div><div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>{item.website&&<a href={item.website} target="_blank" rel="noopener noreferrer" style={{color:"#5dade2",fontSize:12,textDecoration:"none"}}>🔗 Website</a>}{item.facebook&&<a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{color:"#5dade2",fontSize:12,textDecoration:"none"}}>👍 Facebook</a>}</div></>
        )} />
      );
      case "thrift": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>♻️ Thrift Stores</h2>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>✝️ Church thrift shops are volunteer-run — always call ahead!</div>
          {THRIFT.map((item, i) => (
            <Card key={i} style={item.church ? { borderLeft:"3px solid #d4af37" } : {}}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ color:"#fff", fontWeight:700, flex:1 }}>{item.name}</div>
                {item.church && <span style={{ background:"rgba(212,175,55,0.25)", border:"1px solid #d4af37", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px", marginLeft:8, whiteSpace:"nowrap" }}>✝️ Church Shop</span>}
              </div>
              <Addr address={item.address}/>
              {item.phone && <Ph phone={item.phone}/>}
              <div style={{ color:"#6ab04c", fontSize:12 }}>🕐 {item.hours}</div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:5, lineHeight:1.5 }}>{item.notes}</div>
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, display:"inline-block", marginTop:6 }}>🔗 More Info</a>}
            </Card>
          ))}
        </div>
      );
      case "parking": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>🅿️ Parking</h2>
          <div style={{ background:"rgba(231,76,60,0.2)", border:"1px solid #e74c3c", borderRadius:12, padding:"10px 14px", marginBottom:14 }}>
            <div style={{ color:"#e74c3c", fontWeight:700, fontSize:13, marginBottom:4 }}>⚠️ Paid Parking is in Effect</div>
            <div style={{ color:"rgba(255,255,255,0.85)", fontSize:13, lineHeight:1.6 }}>
              Colonial Beach uses the <strong>Flowbird</strong> parking system 7 days a week. Pay at Pay Stations (cash or credit card) or download the <strong>Flowbird app</strong> (iOS & Android). Enter your license plate to pay. Rates vary by zone.
            </div>
          </div>

          {/* Zone cards */}
          {PARKING.map((item, i) => {
            const zoneColors = {"1":"#f9ca24","2":"#5dade2","3":"#ff8c42"};
            const zColor = item.zone ? zoneColors[item.zone] : "rgba(255,255,255,0.4)";
            return (
              <Card key={i} accent={zColor}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{item.name}</div>
                  {item.zone && <span style={{ background:`${zColor}22`, border:`1px solid ${zColor}`, color:zColor, fontSize:10, borderRadius:8, padding:"2px 8px", marginLeft:8, whiteSpace:"nowrap" }}>Zone {item.zone}</span>}
                </div>
                <Addr address={item.address}/>
                <div style={{ color:"#f9ca24", fontWeight:700, fontSize:15, marginTop:6, marginBottom:4 }}>💰 {item.price}</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, lineHeight:1.6 }}>{item.rules}</div>
                {item.free && <div style={{ background:"rgba(106,176,76,0.15)", border:"1px solid rgba(106,176,76,0.4)", borderRadius:8, padding:"6px 10px", marginTop:8, color:"#6ab04c", fontSize:12 }}>✅ {item.free}</div>}
              </Card>
            );
          })}

          {/* Exemptions */}
          <div style={{ color:"#f9ca24", fontSize:11, fontWeight:700, marginBottom:8, marginTop:4, letterSpacing:1 }}>🆓 FREE PARKING EXEMPTIONS</div>
          {PARKING_EXEMPTIONS.map((ex, i) => (
            <Card key={i} accent="#6ab04c">
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:20 }}>{ex.icon}</span>
                <div>
                  <div style={{ color:"#6ab04c", fontWeight:700, fontSize:13 }}>{ex.title}</div>
                  <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginTop:3, lineHeight:1.5 }}>{ex.desc}</div>
                </div>
              </div>
            </Card>
          ))}

          {/* Flowbird info */}
          <Card>
            <div style={{ color:"#fff", fontWeight:700, marginBottom:6 }}>📱 How to Pay</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.7 }}>
              1. <strong>Pay Station</strong> — cash or credit card, enter license plate number<br/>
              2. <strong>Flowbird App</strong> — iOS &amp; Android, $0.35 per transaction<br/>
              3. <strong>Pay by Text</strong> — follow signage instructions (standard text rates apply)
            </div>
            <a href="https://www.colonialbeachva.gov/273/Parking-Enforcement" target="_blank" rel="noopener noreferrer"
              style={{ color:"#5dade2", fontSize:12, textDecoration:"none", display:"inline-block", marginTop:8 }}>
              🔗 Official Town Parking Info
            </a>
          </Card>
        </div>
      );
      case "lodging": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:14 }}>🏡 Lodging</h2>
          {LODGING.map((item, i) => {
            const isCamping = item.type.includes("Campground") || item.type.includes("RV");
            const isBnB = item.type === "B&B";
            const isVR = item.type === "Vacation Rental";
            const accentColor = item.featured ? "#f9ca24" : isCamping ? "#6ab04c" : undefined;
            const typeColor = isCamping ? "#6ab04c" : isBnB ? "#b39ddb" : isVR ? "#ff8c42" : "#5dade2";
            return (
              <Card key={i} accent={accentColor}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:item.featured?15:14, flex:1 }}>{item.name}</div>
                  <div style={{ display:"flex", gap:5, flexShrink:0, marginLeft:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
                    {item.featured && <span style={{ background:"rgba(249,202,36,0.2)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px", whiteSpace:"nowrap" }}>⭐ Top Pick</span>}
                    <span style={{ background:`${typeColor}22`, border:`1px solid ${typeColor}`, color:typeColor, fontSize:10, borderRadius:8, padding:"2px 7px", whiteSpace:"nowrap" }}>{item.type}</span>
                  </div>
                </div>
                <Addr address={item.address}/>
                {item.phone && <Ph phone={item.phone}/>}
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginTop:5, lineHeight:1.6 }}>{item.notes}</div>
                {item.link && item.link !== "#" && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none", display:"inline-block", marginTop:6 }}>🔗 {isCamping ? "Book / More Info" : "Book Now"}</a>}
              </Card>
            );
          })}
        </div>
      );
      case "parks": return (
        <SimpleListTab title="🌿 Parks & Nature" items={PARKS} renderItem={(item) => (
          <><div style={{ color:"#fff", fontWeight:700 }}>{item.name}</div><div style={{ color:"#6ab04c", fontSize:12 }}>{item.type}</div><Addr address={item.address}/>{item.phone && <Ph phone={item.phone}/>}<div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginTop:4 }}>{item.desc}</div>{item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, display:"block", marginTop:5 }}>🔗 Park Website</a>}</>
        )} />
      );
      case "wineries": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:14 }}>🍷 Local Wineries</h2>
          {WINERIES.map((item, i) => (
            <Card key={i} accent={item.featured ? "#b39ddb" : undefined}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:item.featured?15:14, flex:1 }}>{item.name}</div>
                {item.featured && <span style={{ background:"rgba(179,157,219,0.25)", border:"1px solid #b39ddb", color:"#b39ddb", fontSize:10, borderRadius:8, padding:"2px 8px", marginLeft:8, whiteSpace:"nowrap" }}>⭐ Local Favorite</span>}
              </div>
              <Addr address={item.address}/>
              {item.phone && <Ph phone={item.phone}/>}
              {item.hours && <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginBottom:4 }}>🕐 {item.hours}</div>}
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginTop:4, lineHeight:1.5 }}>{item.desc}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>🔗 Website</a>}
                {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>👍 Facebook</a>}
              </div>
            </Card>
          ))}
        </div>
      );
      case "breweries": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>🍺 Breweries</h2>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:14, fontStyle:"italic" }}>Two great breweries right in town — no car needed!</div>
          {BREWERIES.map((b, i) => (
            <Card key={b.name} style={b.distance==="In Town" ? { borderLeft:"3px solid #f9ca24" } : {}}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, flex:1 }}>{b.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ background:b.distance==="In Town"?"rgba(249,202,36,0.2)":"rgba(255,255,255,0.1)", border:`1px solid ${b.distance==="In Town"?"#f9ca24":"rgba(255,255,255,0.2)"}`, color:b.distance==="In Town"?"#f9ca24":"rgba(255,255,255,0.6)", fontSize:10, borderRadius:8, padding:"2px 8px", whiteSpace:"nowrap" }}>
                    {b.distance==="🏖 In Town" || b.distance==="In Town" ? "🏖 In Town" : `🚗 ${b.distance}`}
                  </span>
                  <HeartBtn id={`brew-${i}`} name={b.name} favs={favs} setFavs={setFavs}/>
                </div>
              </div>
              <Addr address={b.address}/>
              {b.phone && b.phone !== "Check Facebook" && <Ph phone={b.phone}/>}
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginBottom:6 }}>
                🕐 {b.hours}<OpenNowBadge hours={b.hours}/>
              </div>
              <div style={{ color:"rgba(255,255,255,0.82)", fontSize:13, lineHeight:1.5, marginBottom:8 }}>{b.desc}</div>
              <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"7px 10px", marginBottom:6 }}>
                <div style={{ color:"#6ab04c", fontSize:11, fontWeight:700, marginBottom:3 }}>🍺 Notable Beers:</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>{b.beers.join(" · ")}</div>
              </div>
              {b.liveMusicNote && <div style={{ color:"#f9ca24", fontSize:12, marginBottom:6 }}>{b.liveMusicNote}</div>}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>🔗 Website</a>}
                {b.facebook && <a href={b.facebook} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, textDecoration:"none" }}>👍 Facebook</a>}
              </div>
            </Card>
          ))}
        </div>
      );
      case "festivals": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:14 }}>🎉 Festivals &amp; Events</h2>
          {FESTIVALS.map((item, i) => (
            <Card key={i} style={item.recurring ? { borderLeft:"3px solid #b39ddb" } : {}}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:14, flex:1 }}>{item.name}</div>
                {item.recurring && <span style={{ background:"rgba(179,157,219,0.25)", border:"1px solid #b39ddb", color:"#b39ddb", fontSize:10, borderRadius:8, padding:"2px 7px", marginLeft:8 }}>Monthly</span>}
              </div>
              <div style={{ color:"#f9ca24", fontSize:13, marginBottom:3 }}>📅 {item.date}</div>
              <div style={{ color:"#5dade2", fontSize:12, marginBottom:6 }}>📍 {item.location}</div>
              <div style={{ color:"rgba(255,255,255,0.78)", fontSize:13, lineHeight:1.5 }}>{item.desc}</div>
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, display:"inline-block", marginTop:6 }}>🔗 More Info</a>}
            </Card>
          ))}
        </div>
      );
      case "artists": return (
        <div>
          <h2 style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:14 }}>🎨 Local Artists</h2>
          {ARTISTS.map((item, i) => (
            <Card key={i} accent={item.featured ? "#b39ddb" : undefined}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:item.featured?15:14, flex:1 }}>{item.name}</div>
                {item.featured && <span style={{ background:"rgba(179,157,219,0.25)", border:"1px solid #b39ddb", color:"#b39ddb", fontSize:10, borderRadius:8, padding:"2px 7px", marginLeft:8, whiteSpace:"nowrap" }}>⭐ Featured</span>}
              </div>
              {item.medium && <div style={{ color:"#b39ddb", fontSize:12, marginBottom:4 }}>🖼 {item.medium}</div>}
              <Addr address={item.address}/>
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginTop:4, lineHeight:1.5 }}>{item.desc}</div>
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color:"#5dade2", fontSize:12, display:"block", marginTop:6, textDecoration:"none" }}>🔗 View Work</a>}
            </Card>
          ))}
        </div>
      );
      case "history": return <HistoryTab />;
      case "relax": return <RelaxTab />;
      case "weather": return <WeatherTab />;
      case "tides": return <TidesTab />;
      case "fishing": return <FishingTab />;
      case "kids": return (
        <SimpleListTab title="👦 Kid-Friendly Activities" items={KID_ACTIVITIES} renderItem={(item) => (
          <><div style={{ color:"#fff", fontWeight:700 }}>{item.name}</div><span style={{ background:"rgba(249,202,36,0.2)", border:"1px solid #f9ca24", color:"#f9ca24", fontSize:10, borderRadius:8, padding:"2px 7px" }}>Age: {item.ageRange}</span>{item.address && <Addr address={item.address}/>}<div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginTop:4 }}>{item.desc}</div></>
        )} />
      );
      case "birds": return <BirdsTab userBirdPins={userBirdPins} setUserBirdPins={setUserBirdPins} />;
      case "residents": return <ResidentsPanel />;
      case "contact": return <ContactTab favs={favs} setFavs={setFavs} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:bg, transition:"background 0.8s ease", fontFamily:"Georgia,'Times New Roman',serif", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }
        @keyframes content-drop { 0% { opacity:0; transform:translateY(-22px) scale(0.97); } 100% { opacity:1; transform:none; } }
        .content-animate { animation: content-drop 0.45s cubic-bezier(0.23,1,0.32,1) forwards; }
        .tab-btn { transition: all 0.15s ease; } .tab-btn:hover { background: rgba(255,255,255,0.2) !important; transform: translateY(-1px); }
        .nav-cat { transition: opacity 0.15s ease; } .nav-cat:hover { opacity: 0.8; }
      `}</style>

      {/* Background texture */}
      <div aria-hidden="true" style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />


      {/* Osprey — non-blocking overlay (content shows immediately underneath) */}
      <SeasonalAnimation show={showAnim} />

      {/* Search overlay */}
      {showSearch && <GlobalSearch onNavigate={navigate} onClose={() => setShowSearch(false)} />}

      {/* ── HEADER ── */}
      <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.15)", padding:"10px 14px 8px" }}>
        {/* Title row + search */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:900, color:"#fff", letterSpacing:2, textShadow:"0 2px 20px rgba(0,0,0,0.5)", lineHeight:1 }}>🌊 COLONIAL BEACH</div>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:10, letterSpacing:3, textTransform:"uppercase" }}>Virginia · On the Potomac</div>
          </div>
          <button onClick={() => setShowSearch(true)} aria-label="Search all tabs"
            style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", borderRadius:10, padding:"8px 12px", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", gap:5 }}>
            🔍 <span style={{ fontSize:12 }}>Search</span>
          </button>
        </div>

        {/* ── CATEGORY NAV (top, horizontal scroll pill bar) ── */}
        <div style={{ display:"flex", overflowX:"auto", gap:6, paddingBottom:2, scrollbarWidth:"none", msOverflowStyle:"none" }} role="tablist" aria-label="Categories">
          {NAV_CATS.map(cat => {
            const isActive = activeCat === cat.id;
            return (
              <button key={cat.id} role="tab" aria-selected={isActive}
                onClick={() => { setActiveCat(cat.id); navigate(cat.tabs[0], true); }}
                style={{
                  flexShrink:0, display:"flex", alignItems:"center", gap:5,
                  background: isActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)"}`,
                  color:"#fff", borderRadius:20, padding:"6px 13px",
                  cursor:"pointer", fontSize:12, whiteSpace:"nowrap",
                  fontWeight: isActive ? 700 : 400, transition:"all 0.15s ease",
                }}>
                <span style={{ fontSize:15 }}>{cat.icon}</span>
                <span>{cat.label}</span>
                {isActive && <div style={{ width:5, height:5, borderRadius:"50%", background:"#f9ca24", marginLeft:2 }} />}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── BODY: sidebar + content side by side ── */}
      <div style={{ display:"flex", position:"relative", zIndex:1 }}>

        {/* ── LEFT SIDEBAR TAB BAR ── */}
        {catTabs.length > 1 && (
          <nav aria-label="Section tabs" style={{
            position:"sticky", top:0, alignSelf:"flex-start",
            width:56, minHeight:"calc(100dvh - 120px)",
            background:"rgba(0,0,0,0.5)", backdropFilter:"blur(16px)",
            borderRight:"1px solid rgba(255,255,255,0.1)",
            display:"flex", flexDirection:"column",
            paddingTop:10, paddingBottom:20, flexShrink:0,
            zIndex:50,
          }}>
            {catTabs.map(tab => {
              const isActive = activeTab === tab.id;
              // Extract just the emoji from the label
              const emoji = tab.label.match(/^\S+/)?.[0] || "•";
              return (
                <button key={tab.id} role="tab" aria-selected={isActive}
                  aria-label={tab.label.replace(/^\S+\s*/, "")}
                  onClick={() => navigate(tab.id)}
                  style={{
                    width:"100%", padding:"12px 0",
                    background: isActive ? "rgba(249,202,36,0.18)" : "none",
                    border:"none",
                    borderLeft: isActive ? "3px solid #f9ca24" : "3px solid transparent",
                    cursor:"pointer", transition:"all 0.15s ease",
                    display:"flex", flexDirection:"column",
                    alignItems:"center", gap:3,
                  }}>
                  <span style={{ fontSize:20, lineHeight:1 }}>{emoji}</span>
                  <span style={{
                    color: isActive ? "#f9ca24" : "rgba(255,255,255,0.45)",
                    fontSize:8, fontFamily:"Georgia,serif",
                    fontWeight: isActive ? 700 : 400,
                    textAlign:"center", lineHeight:1.2,
                    maxWidth:48, wordBreak:"break-word",
                    transition:"color 0.15s",
                  }}>
                    {tab.label.replace(/^\S+\s*/, "").slice(0, 8)}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex:1, padding:"18px 14px 40px", minWidth:0 }}>
          <div key={activeTab} className="content-animate">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
}
