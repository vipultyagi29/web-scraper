const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Event = require("./models/Event");
require("dotenv").config();

const EVENT_URL = "https://www.timeout.com/sydney/events";

async function scrapeEvents() {
  try {
    console.log("Scraping events");

    const { data } = await axios.get(EVENT_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(data);
    let events = [];

    $(".card-content").each((index, element) => {
      const title = $(element).find("._preTitle_16qav_131").text().trim() || "No Title";
      const date = $(element).find(".date").text().trim() || "No Date";
      const venue = $(element).find(".._p_ej8vw_1").text().trim() || "No Venue";
      const link = "https://www.timeout.com" + $(element).find("a").attr("href");

      events.push({ title, date, venue, link });
    });

    if (events.length > 0) {
      await Event.deleteMany({});
      await Event.insertMany(events);
      console.log(`Scraped & stored ${events.length} events.`);
    } else {
      console.log("No events found");
    }

  } catch (error) {
    console.error("Error scraping events:", error.message);
  }
}

module.exports = scrapeEvents;
