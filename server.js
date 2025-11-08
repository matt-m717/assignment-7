const express = require("express");
const { db, Track } = require("./database/setup");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test database connection
async function testConnection() {
    try {
        await db.authenticate();
        console.log("Connection to database established successfully.");
    } catch (e) {
        console.error("Unable to connect to the database:", e);
    }
}

testConnection();

app.listen(PORT, () => {
    console.log(`Track server running on port http://localhost:${PORT}`);
});

app.get("/api/tracks", async (req, res) => {
    try {
        const tracks = await Track.findAll();
        res.json(tracks);
    } catch (e) {
        console.error("Error fetching tracks:", e);
        res.status(500).json({ error: "Failed to fetch tracks" });
    }
});

app.get("/api/tracks/:id", async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);

        if (!track) {
            return res.status(404).json({ error: "Track not found" });
        }

        res.json(track);
    } catch (e) {
        console.error("Error fetching track:", e);
        res.status(500).json({ error: "Failed to fetch track" });
    }
});

app.post("/api/tracks", async (req, res) => {
    try {
        const {
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        } = req.body;

        const newTrack = await Track.create({
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });

        res.status(201).json(newTrack);
    } catch (e) {
        console.error("Error creating track:", e);
        res.status(500).json({ error: "Failed to create track" });
    }
});

app.put("/api/tracks/:id", async (req, res) => {
    try {
        const {
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        } = req.body;

        const [updatedRowsCount] = await Track.update(
            { songTitle, artistName, albumName, genre, duration, releaseYear },
            { where: { trackId: req.params.id } }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: "Track not found" });
        }

        const updatedTrack = await Track.findByPk(req.params.id);
        res.json(updatedTrack);
    } catch (e) {
        console.error("Error updating track:", e);
        res.status(500).json({ error: "Failed to update track" });
    }
});

app.delete("/api/tracks/:id", async (req, res) => {
    try {
        const deletedRowsCount = await Track.destroy({
            where: { trackId: req.params.id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ error: "Track not found" });
        }

        res.json({ message: "Track deleted successfully" });
    } catch (e) {
        console.error("Error deleting track:", e);
        res.status(500).json({ error: "Failed to delete track" });
    }
});
