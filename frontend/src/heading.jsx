import Paper from '@mui/material/Paper';
import './shared_helpers.css'
import {Grid} from "@mui/material";

function Heading() {

    return (
        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Paper elevation={12} sx={{p: 2, m: 2}}>
              <h1 style={{ textAlign: "center" }}>
                Unused
              </h1>
            </Paper>
          </Grid>
        </Grid>
    );
}

export default Heading
