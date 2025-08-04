import * as React from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";

function Bar({ selectedStructure, setSelectedStructure }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    {/* Replace MenuIcon with Dropdown */}
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 150,
                            borderRadius: 1,
                            mr: 2,
                        }}
                    >
                        <InputLabel id="select-label">Structure</InputLabel>
                        <Select
                            labelId="select-label"
                            value={selectedStructure}
                            label="Structure"
                            onChange={(e) => setSelectedStructure(e.target.value)}
                            variant="standard"
                        >
                            <MenuItem value="hashtable">Hashtable</MenuItem>
                            <MenuItem value="sortedlist">Sorted List</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Data Viewer
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Bar;
