// === App.jsx ===
import React, { useState, useEffect } from "react";
import "./App.css";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Paper,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
} from "@mui/material";
import Bar from "./bar.jsx";
import API from "./api";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#90caf9" },
        secondary: { main: "#f48fb1" },
        background: {
            default: "#121212" },
        paper: "#1d1d1d",
    },
    typography: {
        fontFamily: "Roboto, system-ui, sans-serif",
    },
});

export default function App() {
    const [selectedStructure, setSelectedStructure] = useState("hashtable");
    const [labelId, setLabelId] = useState("");
    const [imageId, setImageId] = useState("");
    const [labelSearch, setLabelSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [allData, setAllData] = useState([]);
    const [labelMap, setLabelMap] = useState([]);
    const [labelLoading, setLabelLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);

    //Switches the data structure being used
    useEffect(() => {
        const switchStructure = async () => {
            try {
                await API.post(`/images/set_structure/${selectedStructure}`);
                fetchLabelMap();
                console.log("Structure set:", selectedStructure);
            } catch (err) {
                console.error("Failed to set structure", err);
            }
        };
        switchStructure();
    }, [selectedStructure]);

    //Image ID by Label ID
    const searchByLabel = async () => {
        try {
            const res = await API.get(`/images/search/${labelId}`);
            setSearchResults(res.data.image_ids);
        } catch (err) {
            console.error("Search failed", err);
        }
    };

    //Image ID by Label Name
    const searchByLabelName = async () => {
        try {
            const res = await API.get(`/images/search_by_name/${labelSearch}`);
            setSearchResults(res.data.image_ids);
        } catch (err) {
            console.error("Label name search failed", err);
        }
    };

    //Image by Image Id
    const getImageById = async () => {
        try {
            const res = await API.get(`/images/image/${imageId}`);
            setImageUrl(res.data.url);
        } catch (err) {
            console.error("Image fetch failed", err);
        }
    };

    //gets example data
    const getAllData = async () => {
        try {
            setDataLoading(true);
            const res = await API.get(`/images/all`);
            setAllData(res.data);
        } catch (err) {
            console.error("All data fetch failed", err);
        } finally {
            setDataLoading(false);
        }
    };

    //gets the labelMap
    const fetchLabelMap = async () => {
        try {
            setLabelLoading(true);
            const res = await API.get("/images/labels");
            setLabelMap(res.data);
        } catch (err) {
            console.error("Label map fetch failed", err);
        } finally {
            setLabelLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/*imported bar component*/}
            <Bar selectedStructure={selectedStructure} setSelectedStructure={setSelectedStructure} />

            {/*Containers for all main content*/}
            <Box sx={{ pt: 10, display: "flex", justifyContent: "center" }}>
                <Container maxWidth="md">
                    <Paper sx={{ p: 4 }} elevation={12}>
                        <Typography variant="h4" gutterBottom textAlign="center">
                            {selectedStructure === "hashtable" ? "Hashtable" : "Sorted List"} Mode
                        </Typography>

                        {/*Label ID Button and search bar*/}

                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <TextField
                                label="Label ID"
                                value={labelId}
                                onChange={(e) => setLabelId(e.target.value)}
                                fullWidth
                                sx={{ flex: 4 }}
                            />

                            <Button
                                variant="contained"
                                onClick={searchByLabel}
                                fullWidth
                                sx={{ flex: 1 }}
                            >
                                Search by ID
                            </Button>
                        </Box>

                        {/*Label Name Button and search bar*/}

                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <TextField
                                label="Label Name"
                                value={labelSearch}
                                onChange={(e) => setLabelSearch(e.target.value)}
                                fullWidth
                                sx={{ flex: 4 }}
                            />
                            <Button
                                variant="contained"
                                onClick={searchByLabelName}
                                fullWidth
                                sx={{ flex: 1 }}
                            >
                                Search by Name
                            </Button>
                        </Box>

                        {/*Image ID Button and search bar*/}

                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <TextField
                                label="Image ID"
                                value={imageId}
                                onChange={(e) => setImageId(e.target.value)}
                                fullWidth
                                sx={{ flex: 4 }}
                            />
                            <Button
                                variant="contained"
                                onClick={getImageById}
                                sx={{ flex: 1 }}
                            >
                                Get Image URL
                            </Button>
                        </Box>

                        {/*search results popup*/}

                        {searchResults.length > 0 && (
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <Typography>Found {searchResults.length} images:</Typography>
                                <ul>{searchResults.map((id) => <li key={id}>{id}</li>)}</ul>
                            </Paper>
                        )}

                        {/*Image Url popup*/}

                        {imageUrl && (
                            <Box sx={{ mb: 2 }}>
                                <Typography>Image URL:</Typography>
                                <a href={imageUrl} target="_blank" rel="noreferrer">
                                    {imageUrl}
                                </a>
                                <Box mt={1}><img src={imageUrl} alt="preview" width="200" /></Box>
                            </Box>
                        )}

                        {/*Example Data Button*/}

                        <Button variant="outlined" onClick={getAllData} sx={{ mb: 2 }}>
                            Show Example Data
                        </Button>

                        {/*Example Data popup*/}

                        {dataLoading ? (
                            <Grid item xs={12}>
                                <Typography variant="h6">Loading...</Typography>
                            </Grid>
                        ) : (
                            allData.length > 0 && (
                                <Box>
                                    <Typography>{allData.length} total items</Typography>
                                    <Paper sx={{ maxHeight: 300, overflowY: "scroll", mt: 1, p: 2 }}>
                                        <pre>{JSON.stringify(allData.slice(0, 10), null, 2)}</pre>
                                    </Paper>
                                </Box>
                            )
                        )}

                        {/*Label Reference Table*/}

                        <Paper sx={{ maxHeight: 200, overflowY: "scroll", mt: 4, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Label Reference Table
                            </Typography>
                            <Grid container spacing={1}>
                                {labelLoading ? (
                                    <Grid item xs={12}>
                                        <Typography variant="h6">Loading...</Typography>
                                    </Grid>
                                ) : (
                                    labelMap.map((item) => (
                                        <React.Fragment key={item.labelId}>
                                            <Grid item xs={3}><Typography>{item.labelId}</Typography></Grid>
                                            <Grid item xs={9}><Typography>{item.labelName}</Typography></Grid>
                                        </React.Fragment>
                                    ))
                                )}
                            </Grid>
                        </Paper>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
