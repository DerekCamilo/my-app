import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import './shared_helpers.css'
import {AppBar, Button, IconButton, Toolbar, Typography, Box, Grid, ThemeProvider} from "@mui/material";

function Bar() {
    return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            News
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
    );
}

export default Bar
