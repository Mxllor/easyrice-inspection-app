import { AppBar, Toolbar, Typography } from "@mui/material";

function Navbar() {
    return (
        <AppBar position="relative" elevation={0} sx={{ bgcolor: "#EAEAEA" }}>
            <Toolbar sx={{ height: "64px" }}>
                <Typography fontSize={24} fontWeight={400} color="#000000" >
                    EASYRICE TEST
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar