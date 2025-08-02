import React, { useState } from "react";
import "./App.css"; // <-- external styles
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    Box,
    Container,
    Divider,
    Grid,
    Paper,
    Button,
    useMediaQuery,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import Bar from './bar.jsx'
import Heading from './heading.jsx'

const drawerWidth = 240;

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        background: { default: "#290080" },
    },
    typography: {
        fontFamily: "Roboto, system-ui, sans-serif",
    },
});

export default function App() {
    const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#90caf9" },
        secondary: { main: "#f48fb1" },
        background: {
            default: "#121212",
            paper: "#1d1d1d"
        },
    },
    typography: {
        fontFamily: "Roboto, system-ui, sans-serif",
    },
});

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Top bar */}
            <Bar/>
            <Box className="app-root">
                {/* Body */}
                    <Paper>
                        <Box component="main" className="main-content">
                            <Container maxWidth="lg">
                                <Typography variant="h4" gutterBottom className="welcome-text">
                                    Welcome back!
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    This layout blends Material UI structure with additional CSS for fine-grained control. Resize to
                                    observe responsive behavior.
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <Paper className="card" elevation={2}>
                                            <Typography variant="h6" gutterBottom>
                                                Main Panel
                                            </Typography>
                                            <Typography variant="body2">
                                                Primary content goes here: charts, inputs, live data from your Python backend, etc.
                                            </Typography>
                                        </Paper>
                                        <Paper className="card" elevation={2}>
                                            <Typography variant="h6" gutterBottom>
                                                Secondary Section
                                            </Typography>
                                            <Typography variant="body2">
                                                Supplementary summaries, recent activity, or anything dynamic.
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Paper className="card" elevation={2}>
                                            <Typography variant="h6" gutterBottom>
                                                Sidebar Widget
                                            </Typography>
                                            <Typography variant="body2">
                                                Quick stats or actions can be placed here.
                                            </Typography>
                                        </Paper>
                                        <Paper className="card" elevation={2}>
                                            <Typography variant="h6" gutterBottom>
                                                Another Widget
                                            </Typography>
                                            <Typography variant="body2">
                                                Additional modular components live in side panels.
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Box>
                    </Paper>

                {/* Footer */}
                <Box component="footer" className="app-footer">
                    <Typography variant="body2" color="inherit">
                        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
